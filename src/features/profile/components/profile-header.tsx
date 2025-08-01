import Image from "next/image";

import { SimpleTooltip } from "@/components/ui/tooltip";
import { USER } from "@/data/user";
import { cn } from "@/lib/utils";
import { FlipSentences } from "@/registry/flip-sentences";

import { VerifiedIcon } from "./verified-icon";

export function ProfileHeader() {
  return (
    <div className="screen-line-after border-edge flex border-x">
      <div className="border-edge shrink-0 border-r">
        <div className="mx-[2px] my-[3px]">
          <Image
            className="ring-border ring-offset-background size-32 select-none rounded-full ring-1 ring-offset-2 sm:size-40"
            alt={`${USER.displayName}'s avatar`}
            src={USER.avatar}
            width={512}
            height={512}
            quality={100}
            priority
          />
        </div>
        {/* Flag of Viet Nam */}
        {/* <svg
            className="absolute top-0 -left-px h-8 sm:h-9"
            viewBox="0 0 30 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="30" height="20" fill="#F00" />
            <polygon
              points="15,4 11.47,14.85 20.71,8.15 9.29,8.15 18.53,14.85"
              fill="#FFEB00"
            />
          </svg> */}
      </div>

      <div className="flex flex-1 flex-col">
        <div
          className={cn(
            "flex grow items-end pb-1 pl-4",
            "bg-size-[10px_10px] [--pattern-foreground:var(--color-edge)]/56 sm:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)]"
          )}
        >
          <div className="line-clamp-1 select-none font-mono text-xs text-zinc-300 dark:text-zinc-800">
            {"text-3xl "}
            <span className="inline dark:hidden">text-zinc-950</span>
            <span className="hidden dark:inline">text-zinc-50</span>
            {" font-medium"}
          </div>
        </div>

        <div className="border-edge border-t">
          <h1 className="flex items-center pl-4 text-3xl font-semibold">
            {USER.displayName}
            &nbsp;
            <SimpleTooltip content="Verified">
              <VerifiedIcon className="text-info size-[0.6em]" />
            </SimpleTooltip>
          </h1>

          <div className="border-edge h-12 border-t py-1 pl-4 sm:h-auto">
            <FlipSentences sentences={[USER.bio, ...USER.flipSentences]} />
          </div>
        </div>
      </div>
    </div>
  );
}
