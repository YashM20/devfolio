"use client";

import { AppProgressProvider } from "@bprogress/next";
import { Provider as JotaiProvider } from "jotai";
import { LazyMotion, domMax, MotionConfig } from "motion/react";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Toaster } from "@/components/ui/sonner";

import { PostHogProvider } from "./posthog-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NuqsAdapter>
      <JotaiProvider>
        <ThemeProvider
          enableSystem
          disableTransitionOnChange
          enableColorScheme
          storageKey="theme"
          defaultTheme="system"
          attribute="class"
        >
          <AppProgressProvider
            color="var(--color-info)"
            height="2px"
            delay={500}
            options={{ showSpinner: false }}
          >
            <LazyMotion features={domMax}>
              <MotionConfig reducedMotion="user">
                <PostHogProvider>{children}</PostHogProvider>
              </MotionConfig>
            </LazyMotion>
          </AppProgressProvider>

          <Toaster />
        </ThemeProvider>
      </JotaiProvider>
    </NuqsAdapter>
  );
}
