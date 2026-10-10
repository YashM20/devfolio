import type { Metadata } from "next";
import Link from "next/link";
import { ComponentIcon, PuzzleIcon } from "lucide-react";

import { Icons } from "@/components/icons";
import { getPostsByCategory } from "@/data/blog";

export const metadata: Metadata = {
  title: "Components",
  description: "A collection of reusable components.",
  alternates: {
    canonical: "/components",
  },
};

function ComponentsPlaceholder() {
  return (
    <div className="flex min-h-fit flex-col items-center justify-center p-8 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[--color-react]/10 to-[--color-react]/5 blur-2xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-edge bg-background/50 backdrop-blur-sm">
          <PuzzleIcon className="h-8 w-8 text-muted-foreground" />
        </div>
      </div>

      <h3 className="mb-2 text-xl font-medium text-foreground">
        No Components Yet
      </h3>
      <p className="mb-4 max-w-md text-sm text-balance text-muted-foreground">
        This collection will feature reusable React components, UI elements, and
        interactive demos. Stay tuned for useful building blocks!
      </p>

      <div className="flex items-center gap-2 rounded-md border border-edge bg-muted/30 px-3 py-2">
        <ComponentIcon className="h-4 w-4 text-muted-foreground" />
        <span className="font-mono text-xs text-muted-foreground">
          In Development
        </span>
      </div>
    </div>
  );
}

export default function Page() {
  const posts = getPostsByCategory("components");

  return (
    <div className="min-h-fit [--color-react:#087EA4] dark:[--color-react:#58C4DC]">
      <div className="screen-line-after px-4">
        <h1 className="text-3xl font-semibold">Components</h1>
      </div>

      <div className="screen-line-after p-4">
        <p className="font-mono text-sm text-balance text-muted-foreground">
          {metadata.description}
        </p>
      </div>

      {posts.length > 0 ? (
        posts.map((post) => (
          <Link
            key={post.slug}
            href={`/components/${post.slug}`}
            className="group/post flex items-center border-b border-edge pr-4"
          >
            <Icons.react
              className="mx-4 size-5 shrink-0 text-(--color-react)"
              aria-hidden
            />

            <div className="border-l border-dashed border-edge p-4">
              <h2
                className="leading-snug font-medium text-balance underline-offset-4 group-hover/post:underline"
                style={{ viewTransitionName: `component-title-${post.slug}` }}
              >
                {post.metadata.title}
              </h2>
            </div>

            {post.metadata.new && (
              <span
                className="shrink-0 rounded-md bg-info px-1.5 font-mono text-sm font-medium text-white text-shadow-xs"
                aria-hidden
              >
                New
              </span>
            )}
          </Link>
        ))
      ) : (
        <ComponentsPlaceholder />
      )}

      <div className="h-4" />
    </div>
  );
}
