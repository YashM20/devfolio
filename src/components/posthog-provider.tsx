"use client";

import posthog from "posthog-js";
import { PostHogProvider as Provider } from "posthog-js/react";
import React, { useEffect, useState } from "react";

import { getCookiePreferences } from "./cookie-consent";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const POSTHOG_UI_HOST = process.env.NEXT_PUBLIC_POSTHOG_UI_HOST;

const shouldLoad =
  !!(POSTHOG_KEY && POSTHOG_HOST) && process.env.NODE_ENV === "production";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [consentGiven, setConsentGiven] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!shouldLoad) return;

    // Check initial consent
    const checkConsent = () => {
      const preferences = getCookiePreferences();
      const analyticsAllowed = preferences?.analytics || false;
      setConsentGiven(analyticsAllowed);

      // Initialize PostHog if consent is given and not already initialized
      if (analyticsAllowed && !isInitialized) {
        posthog.init(POSTHOG_KEY, {
          api_host: POSTHOG_HOST,
          ui_host: POSTHOG_UI_HOST || "https://us.posthog.com",
          person_profiles: "identified_only",
          // Respect user privacy preferences
          opt_out_capturing_by_default: false,
          capture_pageview: true,
          capture_pageleave: true,
        });
        setIsInitialized(true);
      } else if (!analyticsAllowed && isInitialized) {
        // If consent is withdrawn, opt out
        posthog.opt_out_capturing();
      } else if (analyticsAllowed && isInitialized) {
        // If consent is given and already initialized, opt back in
        posthog.opt_in_capturing();
      }
    };

    // Check consent on mount
    checkConsent();

    // Listen for consent changes
    const handleConsentChange = (event: CustomEvent) => {
      const preferences = event.detail;
      const analyticsAllowed = preferences?.analytics || false;
      setConsentGiven(analyticsAllowed);

      if (analyticsAllowed && !isInitialized) {
        // Initialize if not already done
        posthog.init(POSTHOG_KEY, {
          api_host: POSTHOG_HOST,
          ui_host: POSTHOG_UI_HOST || "https://us.posthog.com",
          person_profiles: "identified_only",
        });
        setIsInitialized(true);
      } else if (analyticsAllowed && isInitialized) {
        // Re-enable if disabled
        posthog.opt_in_capturing();
      } else if (!analyticsAllowed && isInitialized) {
        // Disable if consent withdrawn
        posthog.opt_out_capturing();
      }
    };

    window.addEventListener(
      "cookieConsentChanged",
      handleConsentChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "cookieConsentChanged",
        handleConsentChange as EventListener
      );
    };
  }, [isInitialized]);

  if (!shouldLoad) {
    return <>{children}</>;
  }

  // Only provide PostHog context if consent is given and initialized
  if (consentGiven && isInitialized) {
    return <Provider client={posthog}>{children}</Provider>;
  }

  // Return children without PostHog context if no consent
  return <>{children}</>;
}
