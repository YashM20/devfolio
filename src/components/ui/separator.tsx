"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/lib/utils";

/**
 * Renders a styled separator line, supporting horizontal or vertical orientation.
 *
 * Combines Radix UI's separator primitive with custom styling and optional class names.
 *
 * @param orientation - The direction of the separator, either "horizontal" or "vertical". Defaults to "horizontal".
 * @param decorative - Whether the separator is decorative for accessibility purposes. Defaults to true.
 */
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  );
}

export { Separator };
