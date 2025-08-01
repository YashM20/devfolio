import React from "react";

import { cn } from "@/lib/utils";

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
