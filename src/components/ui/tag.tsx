import React from "react";

import { cn } from "@/lib/utils";

/**
 * Renders a styled tag using a `span` element with customizable class names and additional props.
 *
 * Combines predefined styling with any extra classes provided via `className`, and forwards all other props to the underlying `span`.
 */
function Tag({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "text-muted-foreground inline-flex items-center rounded-lg border bg-zinc-50 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-900",
        className
      )}
      {...props}
    />
  );
}

export { Tag };
