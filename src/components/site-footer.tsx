import { RssIcon } from "lucide-react";

import { SITE_INFO, SOURCE_CODE_GITHUB_URL } from "@/config/site";
import { cn } from "@/lib/utils";

import { Icons } from "./icons";

/**
 * Renders the website footer with credits, resource links, and decorative styling.
 *
 * Displays inspiration and builder credits, links to llms.txt, RSS feed, and DMCA protection status, and includes visual separators and responsive layout.
 */
export function SiteFooter() {
  return (
    <footer className="max-w-screen overflow-x-hidden px-2">
      <div className="screen-line-before border-edge mx-auto border-x pt-4 md:max-w-3xl">
        <p className="text-muted-foreground mb-1 text-balance text-center font-mono text-sm">
          Inspired by tailwindcss.com && ui.shadcn.com &&{" "}
          <a
            className="link"
            href="https://chanhdai.com"
            target="_blank"
            rel="noopener"
          >
            chanhdai.com
          </a>
        </p>

        <p className="text-muted-foreground mb-4 text-balance text-center font-mono text-sm">
          Built by{" "}
          <a
            className="link"
            href="https://x.com/yash_mhj"
            target="_blank"
            rel="noopener"
          >
            yash
          </a>
          . The source code is available on{" "}
          <a
            className="link"
            href={SOURCE_CODE_GITHUB_URL}
            target="_blank"
            rel="noopener"
          >
            GitHub
          </a>
          .
        </p>

        <div
          className={cn(
            "screen-line-before screen-line-after before:z-1 after:z-1 flex w-full",
            "bg-size-[10px_10px] [--pattern-foreground:var(--color-edge)]/56 bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)]"
          )}
        >
          <div className="border-edge bg-background mx-auto flex items-center justify-center gap-3 border-x px-4">
            <a
              className="text-muted-foreground flex font-mono text-xs font-medium"
              href={`${SITE_INFO.url}/llms.txt`}
              target="_blank"
              rel="noopener noreferrer"
            >
              llms.txt
            </a>

            <Separator />

            <a
              className="text-muted-foreground hover:text-foreground flex items-center transition-colors"
              href={`${SITE_INFO.url}/rss`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <RssIcon className="size-4" />
              <span className="sr-only">RSS</span>
            </a>

            <Separator />

            <a
              className="text-muted-foreground hover:text-foreground flex transition-colors"
              href={
                process.env.NEXT_PUBLIC_DMCA_URL ||
                "https://www.dmca.com/ProtectionPro.aspx"
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icons.dmca className="h-5 w-auto" />
              <span className="sr-only">DMCA.com Protection Status</span>
            </a>
          </div>
        </div>
      </div>
      <div className="pb-[env(safe-area-inset-bottom,0px)]">
        <div className="flex h-2" />
      </div>
    </footer>
  );
}

/**
 * Renders a vertical separator line for visually dividing footer links.
 */
function Separator() {
  return <div className="bg-edge flex h-11 w-px" />;
}
