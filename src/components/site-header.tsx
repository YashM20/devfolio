import Link from "next/link";

import { CommandMenu } from "@/components/command-menu";
import { DesktopNav } from "@/components/desktop-nav";
import { MobileNav } from "@/components/mobile-nav";
import { NavItemGitHub } from "@/components/nav-item-github";
import { ToggleTheme } from "@/components/toggle-theme";
import { MAIN_NAV } from "@/config/site";
import { getAllPosts } from "@/data/blog";
import { cn } from "@/lib/utils";

import { BrandContextMenu } from "./brand-context-menu";
import { SiteHeaderMark } from "./site-header-mark";
import { SiteHeaderWrapper } from "./site-header-wrapper";

/**
 * Renders the main site header with branding, navigation, and utility controls for both desktop and mobile views.
 *
 * Includes the site logo, primary navigation, theme toggle, GitHub link, command menu with blog posts, and responsive layout adjustments.
 */
export function SiteHeader() {
  const posts = getAllPosts();

  return (
    <>
      <div className="xs:h-16 flex h-14" />

      <SiteHeaderWrapper
        className={cn(
          "bg-background fixed inset-x-0 top-0 z-50 px-2 pt-2",
          "data-[affix=true]:shadow-[0_0_16px_0_black]/8 dark:data-[affix=true]:shadow-[0_0_16px_0_black]/80",
          "not-dark:data-[affix=true]:**:data-header-container:after:bg-border",
          "transition-shadow duration-300"
        )}
      >
        <div
          className="screen-line-before screen-line-after border-edge after:z-1 mx-auto flex h-12 items-center justify-between gap-2 border-x px-2 after:transition-[background-color] sm:gap-4 md:max-w-3xl"
          data-header-container
        >
          <BrandContextMenu>
            <Link href="/" aria-label="Home" className="[&_svg]:h-8">
              <SiteHeaderMark />
            </Link>
          </BrandContextMenu>

          <div className="flex-1" />

          <DesktopNav items={MAIN_NAV} />

          <div className="flex items-center gap-2">
            <CommandMenu posts={posts} />
            <NavItemGitHub />
            <ToggleTheme />
            <MobileNav className="sm:hidden" items={MAIN_NAV} />
          </div>
        </div>
      </SiteHeaderWrapper>
    </>
  );
}
