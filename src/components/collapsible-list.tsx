import { ChevronDownIcon } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

function ListItem<T>({
  renderItem,
  item,
}: {
  renderItem: (item: T) => React.ReactNode;
  item: T;
}) {
  return <>{renderItem(item)}</>;
}

export function CollapsibleList<T>({
  items,
  max = 3,

  keyExtractor,
  renderItem,
}: {
  items: T[];
  max?: number;

  keyExtractor?: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
}) {
  return (
    <Collapsible>
      {items.slice(0, max).map((award, index) => (
        <div
          key={typeof keyExtractor === "function" ? keyExtractor(award) : index}
          className="border-edge border-b"
        >
          <ListItem renderItem={renderItem} item={award} />
        </div>
      ))}

      <CollapsibleContent>
        {items.slice(max).map((award, index) => (
          <div
            key={
              typeof keyExtractor === "function"
                ? keyExtractor(award)
                : max + index
            }
            className="border-edge border-b"
          >
            <ListItem renderItem={renderItem} item={award} />
          </div>
        ))}
      </CollapsibleContent>

      {items.length > max && (
        <div className="flex h-12 items-center justify-center pb-px">
          <CollapsibleTrigger asChild>
            <Button
              className="group/collapsible-trigger flex"
              variant="default"
            >
              <span className="hidden group-data-[state=closed]/collapsible-trigger:block">
                Show More
              </span>

              <span className="hidden group-data-[state=open]/collapsible-trigger:block">
                Show Less
              </span>

              <ChevronDownIcon
                className="group-data-[state=open]/collapsible-trigger:rotate-180"
                aria-hidden
              />
            </Button>
          </CollapsibleTrigger>
        </div>
      )}
    </Collapsible>
  );
}
