"use client";
import {
  ChevronsDownUpIcon,
  ChevronsUpDownIcon,
  InfinityIcon,
} from "lucide-react";
import React from "react";

import { Markdown } from "@/components/markdown";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Tag } from "@/components/ui/tag";
import { Prose } from "@/components/ui/typography";

import type { ExperiencePosition } from "../../types/experiences";
import { ExperienceIcon } from "./experience-position-icon";

export function ExperiencePositionItem({
  position,
}: {
  position: ExperiencePosition;
}) {
  const { start, end } = position.employmentPeriod;
  const isOngoing = !end;

  const [isOpen, setIsOpen] = React.useState(position.isExpanded ?? false);
  const [prevPosition, setPrevPosition] = React.useState(position);

  if (position !== prevPosition) {
    setPrevPosition(position);
    setIsOpen(position.isExpanded ?? false);
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} asChild>
      <div className="last:before:bg-background relative last:before:absolute last:before:h-full last:before:w-4">
        <CollapsibleTrigger className="group/experience block w-full select-none text-left">
          <span className="z-1 bg-background relative mb-1 flex items-center gap-3">
            <span
              className="bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-lg"
              aria-hidden
            >
              <ExperienceIcon className="size-4" icon={position.icon} />
            </span>

            <span className="flex-1 text-balance font-medium">
              {position.title}
            </span>

            <span
              className="text-muted-foreground shrink-0 [&_svg]:size-4"
              aria-hidden
            >
              <ChevronsDownUpIcon className="hidden group-data-[state=open]/experience:block" />
              <ChevronsUpDownIcon className="hidden group-data-[state=closed]/experience:block" />
            </span>
          </span>

          <span className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 pl-9 text-sm">
            {position.employmentType && (
              <>
                <span className="whitespace-nowrap">
                  <span className="sr-only">Employment Type</span>
                  <span>{position.employmentType}</span>
                </span>

                <Separator
                  className="data-[orientation=vertical]:h-4"
                  orientation="vertical"
                />
              </>
            )}

            <span className="whitespace-nowrap">
              <span className="sr-only">Employment Period</span>
              <span className="flex items-center gap-0.5">
                <span>{start}</span>
                <span className="font-mono">—</span>
                {isOngoing ? (
                  <>
                    <InfinityIcon
                      className="size-4.5 translate-y-[0.5px]"
                      aria-hidden
                    />
                    <span className="sr-only">Present</span>
                  </>
                ) : (
                  <span>{end}</span>
                )}
              </span>
            </span>
          </span>
        </CollapsibleTrigger>

        <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden duration-300">
          {position.description && (
            <Prose className="pl-9 pt-2">
              <Markdown>{position.description}</Markdown>
            </Prose>
          )}

          {Array.isArray(position.skills) && position.skills.length > 0 && (
            <ul className="flex flex-wrap gap-1.5 pl-9 pt-2">
              {position.skills.map((skill) => (
                <li key={skill} className="flex">
                  <Tag>{skill}</Tag>
                </li>
              ))}
            </ul>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
