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

export function LocalTOC({ className, ...props }: React.ComponentProps<typeof Collapsible>) {
  const [items, setItems] = useState<TOCItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Find the closest ancestor that represents the active tab panel (or the prose container)
    const parent = containerRef.current.closest('[role="tabpanel"], .prose') || document.body;
    
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
        className={cn("bg-code rounded-lg font-sans border border-edge/30", className)}
        {...props}
      >
        <CollapsibleTrigger className="group/toc inline-flex w-full items-center justify-between px-4 py-3 text-sm font-medium">
          Table of Contents
          <div
            className="text-muted-foreground shrink-0 [&_svg]:size-4"
            aria-hidden
          >
            <ChevronsDownUpIcon className="hidden group-data-[state=open]/toc:block" />
            <ChevronsUpDownIcon className="hidden group-data-[state=closed]/toc:block" />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden duration-300">
          <ul className="text-muted-foreground flex flex-col px-4 pb-3 text-sm">
            {items.map((item) => (
              <li
                key={item.url}
                className="flex py-1"
                style={{
                  paddingInlineStart: 16 * Math.max(item.depth - 2, 0),
                }}
              >
                <a
                  className="hover:text-accent-foreground underline-offset-4 transition-colors hover:underline"
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
