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
    <>
      <SiteHeader />
      <main className="max-w-screen overflow-x-hidden px-2">{children}</main>
      <SiteFooter />
      <ScrollTop />
      <Suspense fallback={null}>
        <AiAssistant />
      </Suspense>
      <CookieConsent />
    </>
  );
}
