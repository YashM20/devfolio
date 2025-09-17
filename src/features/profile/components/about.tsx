import ReactMarkdown from "react-markdown";
import { Prose } from "@/components/ui/typography";
import { USER } from "@/data/user";

import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel";

export function About() {
  return (
    <Panel id="about">
      <PanelHeader>
        <PanelTitle>About</PanelTitle>
      </PanelHeader>

      <PanelContent>
        <Prose>
          <div className="whitespace-pre-line">{USER.about}</div>
        </Prose>
      </PanelContent>
    </Panel>
  );
}
