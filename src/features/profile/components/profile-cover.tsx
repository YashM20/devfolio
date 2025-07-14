import { BrandContextMenu } from "@/components/brand-context-menu";
import { ChanhDaiMark } from "@/components/chanhdai-mark";
import { cn } from "@/lib/utils";

export function ProfileCover() {
  return (
    <BrandContextMenu>
      <div
        className={cn(
          "aspect-2/1 border-edge sm:aspect-3/1 select-none border-x",
          "flex items-center justify-center text-black dark:text-white",
          "screen-line-before screen-line-after before:-top-px after:-bottom-px",
          "bg-black/0.75 bg-size-[10px_10px] [--pattern-foreground:var(--color-zinc-950)]/5 dark:bg-white/0.75 dark:[--pattern-foreground:var(--color-white)]/5 bg-[radial-gradient(var(--pattern-foreground)_1px,transparent_0)] bg-center"
        )}
      >
        <ChanhDaiMark id="js-cover-mark" className="h-1/4 w-auto" />
      </div>
    </BrandContextMenu>
  );
}
