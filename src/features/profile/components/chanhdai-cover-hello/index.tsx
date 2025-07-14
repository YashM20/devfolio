import { cn } from "@/lib/utils";

import { Hello } from "./hello";

/**
 * Renders a styled container with a centered Hello component and adaptive background patterns.
 *
 * The container uses responsive aspect ratios, border styles, and background patterns that adjust for light and dark modes.
 */
export function ChanhDaiCoverHello() {
  return (
    <div
      className={cn(
        "aspect-2/1 border-edge md:aspect-3/1 select-none border-x",
        "screen-line-before screen-line-after before:-top-px after:-bottom-px",
        "bg-zinc-950/0.75 bg-size-[10px_10px] [--pattern-foreground:var(--color-zinc-950)]/5 dark:bg-white/0.75 dark:[--pattern-foreground:var(--color-white)]/5 bg-[radial-gradient(var(--pattern-foreground)_1px,transparent_0)] bg-center"
      )}
    >
      <div className="flex size-full justify-center">
        <Hello />
      </div>
    </div>
  );
}
