import type { TOCItemType } from "fumadocs-core/server";
import { ChevronsDownUpIcon, ChevronsUpDownIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

/**
 * Renders a collapsible inline table of contents (TOC) with hierarchical links.
 *
 * Displays a trigger that toggles the visibility of the TOC. Each TOC item is rendered as an indented link based on its depth. Returns `null` if no items are provided.
 *
 * @param items - The array of TOC items to display
 * @param className - Optional additional CSS classes for the root element
 * @param children - Optional custom trigger content replacing the default label
 * @returns A collapsible TOC component, or `null` if `items` is empty
 */
export function InlineTOC({
  items,
  className,
  children,
  ...props
}: React.ComponentProps<typeof Collapsible> & {
  items: TOCItemType[];
}) {
  if (!items.length) {
    return null;
  }

  return (
    <Collapsible
      className={cn("not-prose bg-code rounded-lg font-sans", className)}
      {...props}
    >
      <CollapsibleTrigger className="group/toc inline-flex w-full items-center justify-between px-4 py-3 text-sm font-medium">
        {children ?? "Table of Contents"}
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
  );
}
