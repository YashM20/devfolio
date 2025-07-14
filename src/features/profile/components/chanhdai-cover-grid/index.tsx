import { cn } from "@/lib/utils";

import { LogoResizeAnimation } from "./logo-resize-animation";

export function ChanhDaiCoverGrid() {
  return (
    <div
      className={cn(
        "aspect-2/1 border-edge w-full select-none border-x",
        "screen-line-before screen-line-after after:-bottom-px",
        "bg-zinc-950/0.75 bg-size-[10px_10px] [--pattern-foreground:var(--color-zinc-950)]/5 dark:bg-white/0.75 dark:[--pattern-foreground:var(--color-white)]/5 bg-[radial-gradient(var(--pattern-foreground)_1px,transparent_0)]"
      )}
    >
      <div className="flex size-full justify-center">
        <div className="border-edge absolute top-1/2 box-content h-16 w-full -translate-y-1/2 border-y sm:h-20" />

        <div className="flex items-center justify-center text-black dark:text-white">
          <div className="border-edge h-full border-r"></div>

          <div className="h-16 w-32 sm:hidden">
            <LogoResizeAnimation minWidth={104} maxWidth={128} />
          </div>

          <div className="hidden h-20 w-40 sm:block">
            <LogoResizeAnimation minWidth={128} maxWidth={160} />
          </div>

          <div className="border-edge h-full border-r"></div>
        </div>
      </div>
    </div>
  );
}
