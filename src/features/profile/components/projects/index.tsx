import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

import { CollapsibleList } from "@/components/collapsible-list";
import { Button } from "@/components/ui/button";

import { PROJECTS } from "../../data/projects";
import { Panel, PanelHeader, PanelTitle, PanelTitleSup } from "../panel";
import { ProjectItem } from "./project-item";

const ProjectListItem = ({ item }: { item: (typeof PROJECTS)[number] }) => (
  <ProjectItem project={item} />
);

export function Projects() {
  return (
    <Panel id="projects">
      <PanelHeader className="flex items-center justify-between">
        <PanelTitle>
          <Link href="/projects" className="hover:underline">
            Projects
          </Link>
          <PanelTitleSup>({PROJECTS.length})</PanelTitleSup>
        </PanelTitle>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground active:scale-[0.96] transition-transform"
          asChild
        >
          <Link href="/projects" className="flex items-center gap-1 font-mono text-xs">
            view all <ArrowRightIcon className="size-3" />
          </Link>
        </Button>
      </PanelHeader>

      <CollapsibleList
        items={PROJECTS}
        max={4}
        renderItem={ProjectListItem}
      />
    </Panel>
  );
}
