"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

/**
 * A wrapper component for Radix UI's Collapsible root that adds a `data-slot="collapsible"` attribute.
 *
 * Forwards all props to the underlying Radix Collapsible root component.
 */
function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

/**
 * A wrapper component for the Radix UI CollapsibleTrigger that adds a `data-slot="collapsible-trigger"` attribute.
 *
 * Forwards all props to the underlying Radix UI component.
 */
function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  );
}

/**
 * A wrapper component for Radix UI's CollapsibleContent that adds a `data-slot` attribute for identification.
 *
 * Forwards all props to the underlying Radix UI CollapsibleContent component.
 */
function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
