import { CollapsibleList } from "@/components/collapsible-list";

import { CERTIFICATIONS } from "../../data/certifications";
import { Panel, PanelHeader, PanelTitle } from "../panel";
import { CertificationItem } from "./certification-item";

const CertificationListItem = ({
  item,
}: {
  item: (typeof CERTIFICATIONS)[number];
}) => <CertificationItem certification={item} />;

export function Certifications() {
  return (
    <Panel id="certs">
      <PanelHeader>
        <PanelTitle>
          Certifications
          <sup className="text-muted-foreground ml-1 select-none font-mono text-sm font-medium">
            ({CERTIFICATIONS.length})
          </sup>
        </PanelTitle>
      </PanelHeader>

      <CollapsibleList
        items={CERTIFICATIONS}
        max={8}
        renderItem={CertificationListItem}
      />
    </Panel>
  );
}
