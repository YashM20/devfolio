import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";

import type { SocialLink } from "@/features/profile/types/social-links";
import { cn } from "@/lib/utils";

/**
 * Renders a styled external social link with an icon, title, optional description, and an external link indicator.
 *
 * Displays the provided icon and title, optionally followed by a description, and opens the link in a new browser tab.
 */
export function SocialLinkItem({ icon, title, description, href }: SocialLink) {
  return (
    <a
      className={cn(
        "group/link flex cursor-pointer select-none items-center gap-4 rounded-2xl p-4 pr-2 transition-colors",
        "max-sm:screen-line-before max-sm:screen-line-after",
        "sm:nth-[2n+1]:screen-line-before sm:nth-[2n+1]:screen-line-after"
      )}
      href={href}
      target="_blank"
      rel="noopener"
    >
      <div className="relative size-12 shrink-0">
        <Image
          className="rounded-xl"
          src={icon}
          alt={title}
          width={48}
          height={48}
          quality={100}
          unoptimized
        />
        <div className="ring-black/8 dark:ring-white/8 pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset" />
      </div>

      <div className="flex-1">
        <h3 className="flex items-center font-medium underline-offset-4 group-hover/link:underline">
          {title}
        </h3>

        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>

      <ArrowUpRightIcon className="text-muted-foreground size-4" />
    </a>
  );
}
