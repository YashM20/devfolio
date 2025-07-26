import {
  ArrowUpRightIcon,
  ChevronsDownUpIcon,
  ChevronsUpDownIcon,
  InfinityIcon,
  CalendarIcon,
  CodeIcon,
  ExternalLinkIcon,
  TagIcon,
} from "lucide-react";
import Image from "next/image";
import React from "react";

import { Icons } from "@/components/icons";
import { Markdown } from "@/components/markdown";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { Prose } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UTM_PARAMS } from "@/config/site";
import { addQueryParams } from "@/utils/url";

import type { Project } from "../../types/projects";

export function ProjectItem({
  className,
  project,
}: {
  className?: string;
  project: Project;
}) {
  const { start, end } = project.period;
  const isOngoing = !end;

  return (
    <Collapsible defaultOpen={project.isExpanded} asChild>
      <div className={className}>
        <div className="flex items-center">
          {project.logo ? (
            <Image
              src={project.logo}
              alt={project.title}
              width={32}
              height={32}
              quality={100}
              className="mx-4 flex size-6 shrink-0"
              unoptimized
              aria-hidden="true"
            />
          ) : (
            <div
              className="text-muted-foreground mx-4 flex size-6 shrink-0 items-center justify-center"
              aria-hidden="true"
            >
              <Icons.project className="size-5" />
            </div>
          )}

          <div className="border-edge flex-1 border-l border-dashed">
            <CollapsibleTrigger className="group/project flex w-full select-none items-center justify-between gap-4 p-4 pr-2 text-left">
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-3">
                  <h3 className="text-balance font-medium leading-snug">
                    {project.title}
                  </h3>
                  {project.link && (
                    <SimpleTooltip content="View Project">
                      <a
                        className="text-muted-foreground hover:text-foreground flex shrink-0"
                        href={addQueryParams(project.link, UTM_PARAMS)}
                        target="_blank"
                        rel="noopener"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLinkIcon className="pointer-events-none size-4" />
                        <span className="sr-only">View Project</span>
                      </a>
                    </SimpleTooltip>
                  )}
                </div>

                <div className="text-muted-foreground flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="size-3" />
                    <span>{start}</span>
                    <span className="font-mono">—</span>
                    {isOngoing ? (
                      <>
                        <InfinityIcon
                          className="size-3.5 translate-y-[0.5px]"
                          aria-hidden
                        />
                        <span className="sr-only">Present</span>
                      </>
                    ) : (
                      <span>{end}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <CodeIcon className="size-3" />
                    <span>{project.skills.length} technologies</span>
                  </div>
                </div>
              </div>

              <div
                className="text-muted-foreground shrink-0 [&_svg]:size-4"
                aria-hidden
              >
                <ChevronsDownUpIcon className="hidden group-data-[state=open]/project:block" />
                <ChevronsUpDownIcon className="hidden group-data-[state=closed]/project:block" />
              </div>
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden duration-300">
          <div className="border-edge space-y-6 border-t border-dashed p-4">
            {/* Project Description */}
            {project.description && (
              <div>
                <h4 className="text-foreground mb-3 flex items-center gap-2 text-sm font-medium">
                  <Icons.project className="size-4" />
                  Project Overview
                </h4>
                <Prose className="prose-sm">
                  <Markdown>{project.description}</Markdown>
                </Prose>
              </div>
            )}

            {/* Technology Stack */}
            <div>
              <h4 className="text-foreground mb-3 flex items-center gap-2 text-sm font-medium">
                <TagIcon className="size-4" />
                Technology Stack
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {project.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Project Links */}
            {project.link && (
              <div>
                <h4 className="text-foreground mb-3 flex items-center gap-2 text-sm font-medium">
                  <ExternalLinkIcon className="size-4" />
                  Project Links
                </h4>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={addQueryParams(project.link, UTM_PARAMS)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary bg-primary/10 hover:bg-primary/20 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors"
                  >
                    <ArrowUpRightIcon className="size-3" />
                    View Project
                  </a>
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
