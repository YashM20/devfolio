"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";

import { Nav } from "@/components/nav";
import type { NavItem } from "@/types/nav";

function DesktopNavContent({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return <Nav className="max-sm:hidden" items={items} activeId={pathname} />;
}

function DesktopNavFallback({ items }: { items: NavItem[] }) {
  // Return nav without active state during loading
  return <Nav className="max-sm:hidden" items={items} activeId="" />;
}

export function DesktopNav({ items }: { items: NavItem[] }) {
  return (
    <Suspense fallback={<DesktopNavFallback items={items} />}>
      <DesktopNavContent items={items} />
    </Suspense>
  );
}
