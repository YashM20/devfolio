"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";

/**
 * Provides a popover container component that manages the open/close state and context for its children.
 *
 * Wraps the Radix UI Popover root element and adds a `data-slot="popover"` attribute for styling or querying.
 */
function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

/**
 * Renders a popover trigger element that opens or closes the popover when interacted with.
 *
 * Forwards all props to the underlying trigger primitive and adds a `data-slot="popover-trigger"` attribute for styling or identification.
 */
function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

/**
 * Renders the popover content inside a portal with customizable alignment, offset, and styling.
 *
 * @param className - Additional CSS classes to apply to the popover content
 * @param align - Alignment of the popover relative to its trigger; defaults to "center"
 * @param sideOffset - Offset distance from the trigger; defaults to 4
 * @returns The rendered popover content component
 */
function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin) outline-hidden z-50 w-72 rounded-md border p-4 shadow-md",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

/**
 * Renders an anchor element for positioning the popover relative to a specific target.
 *
 * Forwards all props to the underlying Radix UI Popover anchor component.
 */
function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
