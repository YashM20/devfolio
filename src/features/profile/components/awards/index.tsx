import dayjs from "dayjs";

import { CollapsibleList } from "@/components/collapsible-list";

import { AWARDS } from "../../data/awards";
import { Panel, PanelHeader, PanelTitle } from "../panel";
import { AwardItem } from "./award-item";

const SORTED_AWARDS = AWARDS.toSorted((a, b) => {
  return dayjs(b.date).diff(dayjs(a.date));
});

const AwardListItem = ({ item }: { item: (typeof AWARDS)[number] }) => (
  <AwardItem award={item} />
);

export function Awards() {
  return (
    <Panel id="awards">
      <PanelHeader>
        <PanelTitle>
          Honors & Awards
          <sup className="text-muted-foreground ml-1 select-none font-mono text-sm font-medium">
            ({AWARDS.length})
          </sup>
        </PanelTitle>
      </PanelHeader>

      <CollapsibleList
        items={SORTED_AWARDS}
        max={8}
        keyExtractor={(item) => item.id}
        renderItem={AwardListItem}
      />
    </Panel>
  );
}
