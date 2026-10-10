"use client";

import {
  ArrowUpRightIcon,
  ChevronsDownUpIcon,
  ChevronsUpDownIcon,
  InfinityIcon,
  CalendarIcon,
  CodeIcon,
  ExternalLinkIcon,
  TagIcon,
  LinkIcon,
  BrainIcon,
  LockIcon,
  WalletIcon,
  NewspaperIcon,
  ShoppingBagIcon,
  TvIcon,
  BookOpenIcon,
  LayoutDashboardIcon,
  CreditCardIcon,
  RefreshCwIcon,
  SmartphoneIcon,
  BoxIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { Markdown } from "@/components/markdown";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { Prose } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { UTM_PARAMS } from "@/config/site";
import { addQueryParams } from "@/utils/url";

import type { Project } from "../../types/projects";

const PROJECT_ICONS: Record<string, React.ComponentType<any>> = {
  dexai: BrainIcon,
  uam: LockIcon,
  "wally-consumer-app": WalletIcon,
  "legit-backend": NewspaperIcon,
  "pipli-retailer-portal": ShoppingBagIcon,
  "video-live-streaming-platform": TvIcon,
  "webstories-backend": BookOpenIcon,
  "admin-portal": LayoutDashboardIcon,
  "mpos-react-native": CreditCardIcon,
  "file-converter-application": RefreshCwIcon,
  "pwa-wrapper-for-android": SmartphoneIcon,
};

export function ProjectItem({
  className,
  project,
}: {
  className?: string;
  project: Project;
}) {
  const { start, end } = project.period;
  const isOngoing = !end;
  const IconComponent = PROJECT_ICONS[project.id] || BoxIcon;
  const isGenericLogo =
    !project.logo || project.logo.includes("quaricdotcom.svg");

  return (
    <Collapsible defaultOpen={project.isExpanded} asChild>
      <div className={className}>
        <div className="flex items-center">
          {!isGenericLogo ? (
            <Image
              src={project.logo!}
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
              className="mx-4 flex size-6 shrink-0 items-center justify-center text-muted-foreground"
              aria-hidden="true"
            >
              <IconComponent className="size-5" />
            </div>
          )}

          <div className="flex-1 border-l border-dashed border-edge">
            <CollapsibleTrigger className="group/project flex w-full items-center justify-between gap-4 p-4 pr-2 text-left select-none">
              <div className="flex-1">
                <h3
                  className="leading-snug font-medium text-balance"
                  style={{ viewTransitionName: `project-title-${project.id}` }}
                >
                  {project.title}
                </h3>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <div className="flex shrink-0 items-center gap-1 whitespace-nowrap">
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

                  <div className="flex shrink-0 items-center gap-1 whitespace-nowrap">
                    <CodeIcon className="size-3" />
                    <span>{project.skills.length} technologies</span>
                  </div>
                </div>
              </div>

              {/* Direct detail link or external link */}
              {project.hasCaseStudy ? (
                <SimpleTooltip content="Read Case Study">
                  <Link
                    className="relative flex size-6 shrink-0 items-center justify-center text-muted-foreground transition-[color,transform] duration-150 ease-out before:absolute before:-inset-2 before:content-[''] hover:text-foreground active:scale-[0.96]"
                    href={`/projects/${project.id}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <LinkIcon className="pointer-events-none size-4" />
                    <span className="sr-only">Read Case Study</span>
                  </Link>
                </SimpleTooltip>
              ) : project.link ? (
                <SimpleTooltip content="Open Project Link">
                  <a
                    className="relative flex size-6 shrink-0 items-center justify-center text-muted-foreground transition-[color,transform] duration-150 ease-out before:absolute before:-inset-2 before:content-[''] hover:text-foreground active:scale-[0.96]"
                    href={addQueryParams(project.link, UTM_PARAMS)}
                    target="_blank"
                    rel="noopener"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <LinkIcon className="pointer-events-none size-4" />
                    <span className="sr-only">Open Project Link</span>
                  </a>
                </SimpleTooltip>
              ) : null}

              <div
                className="shrink-0 text-muted-foreground [&_svg]:size-4"
                aria-hidden
              >
                <ChevronsDownUpIcon className="hidden group-data-[state=open]/project:block" />
                <ChevronsUpDownIcon className="hidden group-data-[state=closed]/project:block" />
              </div>
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent className="overflow-hidden duration-300 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <div className="space-y-6 border-t border-dashed border-edge p-4">
            {/* Project Description */}
            {project.description && (
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                  <IconComponent className="size-4" />
                  Project Overview
                </h4>
                <Prose className="prose-sm">
                  <Markdown>{project.description}</Markdown>
                </Prose>
              </div>
            )}

            {/* Technology Stack */}
            <div>
              <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                <TagIcon className="size-4" />
                Technology Stack
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {project.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Project Links */}
            {(project.link || project.hasCaseStudy) && (
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                  <ExternalLinkIcon className="size-4" />
                  Project Links
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.link && (
                    <a
                      href={addQueryParams(project.link, UTM_PARAMS)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-[background-color,transform] duration-150 ease-out hover:bg-primary/20 active:scale-[0.96]"
                    >
                      <ArrowUpRightIcon className="size-3" />
                      View Project
                    </a>
                  )}
                  {project.hasCaseStudy && (
                    <Link
                      href={`/projects/${project.id}`}
                      className="inline-flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm font-medium text-foreground transition-[background-color,transform] duration-150 ease-out hover:bg-muted/80 active:scale-[0.96]"
                    >
                      <ArrowUpRightIcon className="size-3" />
                      Read Case Study
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
