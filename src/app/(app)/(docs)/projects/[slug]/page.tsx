import { getTableOfContents } from "fumadocs-core/content/toc";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { TechArticle as PageSchema, WithContext } from "schema-dts";
import dayjs from "dayjs";

import { InlineTOC } from "@/components/inline-toc";
import { MDX } from "@/components/mdx";
import { Button } from "@/components/ui/button";
import { Prose } from "@/components/ui/typography";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ReadingTime } from "@/components/blog";
import {
  getAllProjectPosts,
  getProjectPostBySlug,
  findNeighbourProject,
} from "@/data/projects";
import { PROJECTS } from "@/features/profile/data/projects";
import { SITE_INFO } from "@/config/site";
import { USER } from "@/data/user";
import { cn } from "@/lib/utils";
import { connection } from "next/server";

export async function generateStaticParams() {
  const posts = getAllProjectPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const post = getProjectPostBySlug(slug);

  if (!post) {
    return notFound();
  }

  const { title, description } = post.metadata;

  return {
    title: `${title} | Project Details`,
    description,
    openGraph: {
      title: `${title} | Project Case Study`,
      description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Project Case Study`,
      description,
    },
  };
}

import type { ProjectPost } from "@/data/projects";

async function getPageJsonLd(
  post: ProjectPost
): Promise<WithContext<PageSchema>> {
  await connection();
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: post.metadata.title,
    description: post.metadata.description,
    image:
      post.metadata.image ||
      `${SITE_INFO.url}/og/simple?title=${encodeURIComponent(post.metadata.title)}`,
    url: `${SITE_INFO.url}/projects/${post.slug}`,
    datePublished: dayjs(post.metadata.createdAt).toISOString(),
    dateModified: dayjs(post.metadata.updatedAt).toISOString(),
    author: {
      "@type": "Person",
      name: USER.displayName,
      identifier: USER.username,
      image: USER.avatar,
    },
  };
}

// Create a component for the dynamic project content
async function ProjectContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const post = getProjectPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const project = PROJECTS.find((p) => p.id === post.slug);

  const toc = getTableOfContents(post.content);
  const allPosts = getAllProjectPosts();
  const { previous, next } = findNeighbourProject(allPosts, slug);

  const jsonLd = await getPageJsonLd(post);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="flex items-center justify-between p-2 pl-4">
        <Button
          className="text-muted-foreground px-0 hover:no-underline active:scale-[0.98] transition-transform"
          variant="link"
          asChild
        >
          <Link href="/#projects" className="flex items-center gap-1">
            <ArrowLeftIcon className="size-4" />
            Projects
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          {previous && (
            <Button
              variant="secondary"
              size="icon"
              className="active:scale-[0.96] transition-transform"
              asChild
            >
              <Link href={`/projects/${previous.slug}`}>
                <ArrowLeftIcon className="size-4" />
                <span className="sr-only">Previous Project</span>
              </Link>
            </Button>
          )}

          {next && (
            <Button
              variant="secondary"
              size="icon"
              className="active:scale-[0.96] transition-transform"
              asChild
            >
              <Link href={`/projects/${next.slug}`}>
                <span className="sr-only">Next Project</span>
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      <Prose className="px-4">
        <div className="screen-line-before screen-line-after mb-4 flex items-center gap-3 py-2">
          {project?.logo && !project.logo.includes("quaricdotcom.svg") && (
            <Image
              src={project.logo}
              alt={`${project.title} logo`}
              width={36}
              height={36}
              className="m-0! size-9 rounded-lg border bg-muted/30 object-cover"
              unoptimized
            />
          )}
          <h1
            className="m-0! font-semibold text-balance text-2xl md:text-3xl border-none p-0 before:content-none after:content-none"
            style={{ viewTransitionName: `project-title-${post.slug}` }}
          >
            {post.metadata.title}
          </h1>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground text-sm font-mono uppercase tracking-wider">
            Case Study
          </p>

          <ReadingTime
            content={post.content}
            showWords={true}
            className="text-sm font-mono"
          />
        </div>

        <p className="lead mb-6 text-pretty">{post.metadata.description}</p>

        {/* Dynamic Project Metadata Grid */}
        <div className="not-prose my-6 grid grid-cols-2 gap-4 rounded-xl border border-edge border-dashed p-4 bg-muted/10 font-mono text-sm">
          <div>
            <span className="text-muted-foreground block text-xs uppercase mb-0.5">
              Role
            </span>
            <span className="font-medium text-foreground">
              {post.metadata.role}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs uppercase mb-0.5">
              Duration
            </span>
            <span className="font-medium text-foreground">
              {post.metadata.duration}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs uppercase mb-0.5">
              Client / Partner
            </span>
            <span className="font-medium text-foreground">
              {post.metadata.client}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs uppercase mb-0.5">
              Industry
            </span>
            <span className="font-medium text-foreground">
              {post.metadata.industry}
            </span>
          </div>
        </div>

        {/* Tech Stack Badges */}
        <div className="not-prose mb-6">
          <span className="text-muted-foreground block text-xs uppercase font-mono mb-2">
            Technologies & Stack
          </span>
          <div className="flex flex-wrap gap-1.5">
            {post.metadata.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {post.metadata.toc !== false && <InlineTOC items={toc} />}

        <div className="mt-8 text-pretty">
          <MDX code={post.content} />
        </div>
      </Prose>

      <div className="screen-line-after h-8 px-2" />
      <Separator className="screen-line-after" />
    </>
  );
}

// Fallback component for loading state
function ProjectContentSkeleton() {
  return (
    <>
      <div className="flex items-center justify-between p-2 pl-4">
        <Button className="text-muted-foreground px-0" variant="link" asChild>
          <Link href="/#projects" className="flex items-center gap-1">
            <ArrowLeftIcon className="size-4" />
            Projects
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>

      <Prose className="px-4">
        <Skeleton className="mb-4 h-10 w-3/4" />

        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>

        <Skeleton className="mb-6 h-6 w-full" />

        {/* Metadata Grid Skeleton */}
        <div className="my-6 grid grid-cols-2 gap-4 rounded-xl border border-edge border-dashed p-4 bg-muted/10">
          <div className="space-y-1">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>

        {/* Tech Stack Skeleton */}
        <div className="mb-6 space-y-2">
          <Skeleton className="h-3 w-28" />
          <div className="flex gap-1.5">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-14" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>

        <div className="space-y-4 mt-8">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-32 w-full" />
        </div>
      </Prose>

      <div className="screen-line-before h-4 w-full" />
    </>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  return (
    <Suspense fallback={<ProjectContentSkeleton />}>
      <ProjectContent params={params} />
    </Suspense>
  );
}

function Separator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "border-edge relative flex h-8 w-full border-x",
        "before:-z-1 before:absolute before:-left-[100vw] before:h-8 before:w-[200vw]",
        "before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56 before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)]",
        className
      )}
    />
  );
}
