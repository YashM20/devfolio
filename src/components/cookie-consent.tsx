"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cookie, X, Check, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const CONSENT_KEY = "cookie-consent-preferences";
const BANNER_SHOWN_KEY = "cookie-banner-shown";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const defaultPreferences: CookiePreferences = {
  necessary: true, // Always required
  analytics: false,
  marketing: false,
};

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] =
    useState<CookiePreferences>(defaultPreferences);

  // Check if we need to show the banner
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasShownBanner = localStorage.getItem(BANNER_SHOWN_KEY);
    const hasConsent = localStorage.getItem(CONSENT_KEY);

    // Show banner if we haven't shown it before or don't have consent
    if (!hasShownBanner || !hasConsent) {
      setShowBanner(true);
    } else {
      // Load existing preferences
      try {
        const savedPreferences = JSON.parse(hasConsent);
        setPreferences(savedPreferences);
      } catch (error) {
        console.warn("Failed to parse cookie preferences:", error);
        setShowBanner(true);
      }
    }

    // Listen for manual banner show events
    const handleShowBanner = () => {
      setShowBanner(true);
      setShowSettings(false);
    };

    window.addEventListener("showCookieBanner", handleShowBanner);

    return () => {
      window.removeEventListener("showCookieBanner", handleShowBanner);
    };
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(prefs));
      localStorage.setItem(BANNER_SHOWN_KEY, "true");
      setPreferences(prefs);

      // Dispatch custom event for analytics integration
      window.dispatchEvent(
        new CustomEvent("cookieConsentChanged", {
          detail: prefs,
        })
      );
    } catch (error) {
      console.warn("Failed to save cookie preferences:", error);
    }
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allAccepted);
    setShowBanner(false);
  };

  const handleAcceptNecessary = () => {
    savePreferences(defaultPreferences);
    setShowBanner(false);
  };

  const handleSaveSettings = () => {
    savePreferences(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handlePreferenceChange = (
    key: keyof CookiePreferences,
    value: boolean
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: key === "necessary" ? true : value, // Necessary cookies can't be disabled
    }));
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md"
      >
        <Card className="border-border bg-background/95 p-4 shadow-lg backdrop-blur-md">
          {!showSettings ? (
            <>
              {/* Banner Content */}
              <div className="flex items-start gap-3">
                <Cookie className="text-foreground mt-1 h-5 w-5 shrink-0" />
                <div className="flex-1">
                  <h3 className="text-foreground mb-2 font-semibold">
                    Cookie Preferences
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    We use cookies to enhance your experience and analyze site
                    usage. You can manage your preferences below.{" "}
                    <a
                      href="#"
                      className="text-muted-foreground hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Learn more
                    </a>
                  </p>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      onClick={handleAcceptAll}
                      className="flex-1"
                      size="sm"
                    >
                      <Check className="mr-1 h-4 w-4" />
                      Accept All
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleAcceptNecessary}
                      className="flex-1"
                      size="sm"
                    >
                      Necessary Only
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setShowSettings(true)}
                      size="sm"
                    >
                      <Settings className="mr-1 h-4 w-4" />
                      Settings
                    </Button>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBanner(false)}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Settings Content */}
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-foreground font-semibold">
                  Cookie Settings
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Necessary Cookies */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label htmlFor="necessary" className="font-medium">
                      Necessary Cookies
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Required for basic site functionality
                    </p>
                  </div>
                  <Switch
                    id="necessary"
                    checked={preferences.necessary}
                    disabled
                    className="shrink-0"
                  />
                </div>

                <Separator />

                {/* Analytics Cookies */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label htmlFor="analytics" className="font-medium">
                      Analytics Cookies
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Help us understand site usage and performance
                    </p>
                  </div>
                  <Switch
                    id="analytics"
                    checked={preferences.analytics}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange("analytics", checked)
                    }
                    className="shrink-0"
                  />
                </div>

                <Separator />

                {/* Marketing Cookies */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label htmlFor="marketing" className="font-medium">
                      Marketing Cookies
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Used for personalized advertising and content
                    </p>
                  </div>
                  <Switch
                    id="marketing"
                    checked={preferences.marketing}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange("marketing", checked)
                    }
                    className="shrink-0"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Button onClick={handleSaveSettings} className="flex-1">
                  Save Preferences
                </Button>
                <Button
                  variant="outline"
                  onClick={handleAcceptAll}
                  className="flex-1"
                >
                  Accept All
                </Button>
              </div>
            </>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

// Helper function to check if specific cookie types are allowed
export function isCookieAllowed(type: keyof CookiePreferences): boolean {
  if (typeof window === "undefined") return false;

  try {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) return false;

    const preferences: CookiePreferences = JSON.parse(consent);
    return preferences[type] || false;
  } catch {
    return false;
  }
}

// Helper function to get all cookie preferences
export function getCookiePreferences(): CookiePreferences | null {
  if (typeof window === "undefined") return null;

  try {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) return null;

    return JSON.parse(consent);
  } catch {
    return null;
  }
}

// Helper function to re-show the cookie banner
export function showCookiePreferences(): void {
  if (typeof window === "undefined") return;

  // Remove the banner shown flag to trigger the banner to show again
  localStorage.removeItem(BANNER_SHOWN_KEY);

  // Dispatch event to trigger banner re-render
  window.dispatchEvent(new CustomEvent("showCookieBanner"));
}

// Make the function available globally for easy access
if (typeof window !== "undefined") {
  (window as any).showCookiePreferences = showCookiePreferences;
}
