import dynamic from "next/dynamic";
import { ScrollTop } from "@/components/scroll-top";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CookieConsent } from "@/components/cookie-consent";
// import { AiAssistant } from "@/components/ai/ai-assistant";
import { Suspense } from "react";

const AiAssistant = dynamic(() => import("@/components/ai/ai-assistant").then((mod) => mod.AiAssistant), {
  ssr: true,
});

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="group/layout relative isolate">
      <SiteHeader />
      <main className="max-w-screen overflow-x-hidden px-2">{children}</main>
      <SiteFooter />
      <div
        className="pointer-events-none fixed isolate inset-x-0 bottom-0 z-50"
        aria-hidden
      >
        <div className="h-[var(--fade-bottom-height)] bg-linear-to-b from-transparent to-background [mask-image:linear-gradient(to_top,var(--background)_25%,transparent)] backdrop-blur-[1px]" />
        <div className="bg-background pb-[env(safe-area-inset-bottom,0)]" />
      </div>
      <ScrollTop />
      <Suspense fallback={null}>
        <AiAssistant />
      </Suspense>
      <CookieConsent />
    </div>
  );
}
