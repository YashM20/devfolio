"use client";

import { AppProgressProvider } from "@bprogress/next";
import { Provider as JotaiProvider } from "jotai";
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
            <PostHogProvider>{children}</PostHogProvider>
          </AppProgressProvider>

          <Toaster />
        </ThemeProvider>
      </JotaiProvider>
    </NuqsAdapter>
  );
}
