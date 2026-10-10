"use client";

import React, { useEffect, useState, useRef } from "react";
import { ChevronsDownUpIcon, ChevronsUpDownIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface TOCItem {
  url: string;
  title: string;
  depth: number;
}

export function LocalTOC({
  className,
  ...props
}: React.ComponentProps<typeof Collapsible>) {
  const [items, setItems] = useState<TOCItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Find the closest ancestor that represents the active tab panel (or the prose container)
    const parent =
      containerRef.current.closest('[role="tabpanel"], .prose') ||
      document.body;

    // Find h2 and h3 elements under that parent
    const headingElements = parent.querySelectorAll("h2, h3");

    const parsedItems: TOCItem[] = [];
    headingElements.forEach((el) => {
      const title = el.textContent || "";
      const id = el.id;
      if (title && id) {
        parsedItems.push({
          url: `#${id}`,
          title,
          depth: el.tagName.toLowerCase() === "h2" ? 2 : 3,
        });
      }
    });

    // eslint-disable-next-line react-doctor/no-initialize-state
    setItems(parsedItems);
  }, []);

  if (items.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className="not-prose my-6">
      <Collapsible
        className={cn(
          "rounded-lg border border-edge/30 bg-code font-sans",
          className
        )}
        {...props}
      >
        <CollapsibleTrigger className="group/toc inline-flex w-full items-center justify-between px-4 py-3 text-sm font-medium">
          Table of Contents
          <div
            className="shrink-0 text-muted-foreground [&_svg]:size-4"
            aria-hidden
          >
            <ChevronsDownUpIcon className="hidden group-data-[state=open]/toc:block" />
            <ChevronsUpDownIcon className="hidden group-data-[state=closed]/toc:block" />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="overflow-hidden duration-300 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <ul className="flex flex-col px-4 pb-3 text-sm text-muted-foreground">
            {items.map((item) => (
              <li
                key={item.url}
                className="flex py-1"
                style={{
                  paddingInlineStart: 16 * Math.max(item.depth - 2, 0),
                }}
              >
                <a
                  className="underline-offset-4 transition-colors hover:text-accent-foreground hover:underline"
                  href={item.url}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
