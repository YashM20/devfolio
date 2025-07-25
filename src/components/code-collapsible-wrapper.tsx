import { ChevronsDownUpIcon, ChevronsUpDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function CodeCollapsibleWrapper({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Collapsible>) {
  return (
    <Collapsible
      className={cn("group/collapsible not-prose relative my-6", className)}
      {...props}
    >
      <CollapsibleTrigger asChild>
        <div className="absolute right-10 top-2 z-10 flex items-center gap-2">
          <Button className="size-6 rounded-md" variant="secondary" size="icon">
            <ChevronsDownUpIcon className="hidden group-data-[state=open]/collapsible:block" />
            <ChevronsUpDownIcon className="hidden group-data-[state=closed]/collapsible:block" />
          </Button>

          <Separator
            className="data-[orientation=vertical]:h-4"
            orientation="vertical"
          />
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent
        className="overflow-hidden data-[state=closed]:max-h-80 data-[state=closed]:rounded-b-lg [&>figure]:my-0"
        forceMount
      >
        {children}
      </CollapsibleContent>

      <CollapsibleTrigger className="from-code text-muted-foreground absolute inset-x-0 bottom-0 flex h-24 items-end justify-center rounded-b-lg bg-gradient-to-t from-25% to-transparent pb-4 text-sm font-medium group-data-[state=open]/collapsible:hidden">
        Expand
      </CollapsibleTrigger>
    </Collapsible>
  );
}
