import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRightIcon,
  BoxIcon,
  Brain,
  Lock,
  Wallet,
  Newspaper,
  ShoppingBag,
  Tv,
  BookOpen,
  LayoutDashboard,
  CreditCard,
  RefreshCw,
  Smartphone,
} from "lucide-react";

import { PROJECTS } from "@/features/profile/data/projects";
import { cn } from "@/lib/utils";
import { UTM_PARAMS } from "@/config/site";
import { addQueryParams } from "@/utils/url";

const PROJECT_ICONS: Record<string, React.ComponentType<any>> = {
  dexai: Brain,
  uam: Lock,
  "wally-consumer-app": Wallet,
  "legit-backend": Newspaper,
  "pipli-retailer-portal": ShoppingBag,
  "video-live-streaming-platform": Tv,
  "webstories-backend": BookOpen,
  "admin-portal": LayoutDashboard,
  "mpos-react-native": CreditCard,
  "file-converter-application": RefreshCw,
  "pwa-wrapper-for-android": Smartphone,
};

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A detailed showcase of case studies, systems, tools, and side projects I've developed.",
  alternates: {
    canonical: "/projects",
  },
};

export default function ProjectsPage() {
  return (
    <>
      <div className="screen-line-after px-4">
        <h1 className="text-3xl font-semibold">Projects</h1>
      </div>

      <div className="screen-line-after p-4">
        <p className="font-mono text-sm text-balance text-muted-foreground">
          {metadata.description}
        </p>
      </div>

      <div className="relative">
        {/* Background vertical dividing lines to match blog landing layout */}
        <div className="absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
          <div className="border-r border-edge"></div>
          <div className="border-l border-edge"></div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>

      <div className="h-4" />
    </>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof PROJECTS)[number];
  index: number;
}) {
  const { start, end } = project.period;
  const isOngoing = !end;
  const isSinglePeriod = end === start;

  // Direct details navigation prioritizes case studies, then external project links
  const href = project.hasCaseStudy
    ? `/projects/${project.id}`
    : project.link
      ? addQueryParams(project.link, UTM_PARAMS)
      : "#";

  const isExternal = !project.hasCaseStudy && !!project.link;
  const isClickable = href !== "#";

  const IconComponent = PROJECT_ICONS[project.id] || BoxIcon;
  const isGenericLogo =
    !project.logo || project.logo.includes("quaricdotcom.svg");

  const logoNode = !isGenericLogo ? (
    <div className="relative size-8 shrink-0 overflow-hidden rounded-lg border border-border bg-muted/30 transition-all duration-200">
      <Image
        src={project.logo!}
        alt={project.title}
        fill
        sizes="32px"
        className="object-cover grayscale transition-[filter] duration-300 select-none group-hover/project:grayscale-0"
        unoptimized
      />
      <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-black/10 ring-inset dark:ring-white/10" />
    </div>
  ) : (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/30 text-muted-foreground transition-all duration-200 select-none group-hover/project:border-foreground/10 group-hover/project:bg-muted group-hover/project:text-foreground">
      <IconComponent className="size-4.5" />
    </div>
  );

  const content = (
    <div className="flex h-full flex-col justify-between gap-4">
      <div className="space-y-3">
        {/* Header: Logo, Title & Timeline */}
        <div className="flex w-full min-w-0 items-start gap-3">
          {logoNode}
          <div className="mt-0.5 min-w-0 flex-1">
            <h3
              className="flex flex-wrap items-center gap-x-2 gap-y-1 leading-snug font-medium text-pretty text-foreground transition-colors"
              style={{ viewTransitionName: `project-title-${project.id}` }}
            >
              <span>{project.title}</span>
              {isClickable && (
                <ArrowUpRightIcon className="inline-block size-3.5 align-baseline text-muted-foreground/60 transition-all duration-150 ease-out group-hover/project:translate-x-0.5 group-hover/project:-translate-y-0.5 group-hover/project:text-foreground" />
              )}
            </h3>

            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className="font-mono text-xs text-muted-foreground">
                {start} {!isSinglePeriod && `— ${isOngoing ? "Present" : end}`}
              </p>
              {project.hasCaseStudy && (
                <span className="rounded border-border bg-muted/40 px-1.5 py-0.5 font-mono text-[9px] font-medium tracking-wider text-muted-foreground uppercase select-none">
                  Case Study
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description excerpt */}
        <p className="line-clamp-3 text-sm text-pretty text-muted-foreground">
          {project.description}
        </p>
      </div>

      {/* Tech Stack Footer */}
      <div className="flex flex-wrap items-center gap-1.5 pt-2">
        {project.skills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center rounded-full border border-border bg-muted/30 px-2 py-0.5 font-mono text-[10px] text-muted-foreground transition-colors duration-200 select-none group-hover/project:bg-muted group-hover/project:text-foreground"
          >
            {skill}
          </span>
        ))}
        {project.skills.length > 3 && (
          <span className="self-center pl-1 font-mono text-[10px] text-muted-foreground/60 select-none">
            +{project.skills.length - 3} more
          </span>
        )}
      </div>
    </div>
  );

  const containerClasses = cn(
    "group/project flex animate-fade-in-up flex-col justify-between p-4 opacity-0 transition-[background-color,border-color,transform] duration-200 ease-out",
    "max-sm:screen-line-before max-sm:screen-line-after",
    "sm:nth-[2n+1]:screen-line-before sm:nth-[2n+1]:screen-line-after",
    isClickable && "hover:bg-muted/20 active:scale-[0.99]"
  );

  const style = {
    animationDelay: `${index * 50}ms`,
  };

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={containerClasses}
        style={style}
      >
        {content}
      </a>
    );
  }

  if (href === "#") {
    return (
      <div className={containerClasses} style={style}>
        {content}
      </div>
    );
  }

  return (
    <Link href={href as any} className={containerClasses} style={style}>
      {content}
    </Link>
  );
}
