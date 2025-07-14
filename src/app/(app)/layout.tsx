import dynamic from "next/dynamic";
import { ScrollTop } from "@/components/scroll-top";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CookieConsent } from "@/components/cookie-consent";

const AiAssistant = dynamic(() =>
  import("@/components/ai-assistant").then((mod) => mod.AiAssistant)
);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="max-w-screen overflow-x-hidden px-2">{children}</main>
      <SiteFooter />
      <ScrollTop />
      <AiAssistant />
      <CookieConsent />
    </>
  );
}
