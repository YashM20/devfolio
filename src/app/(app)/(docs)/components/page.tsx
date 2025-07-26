import type { Metadata } from "next";
import Link from "next/link";
import { ComponentIcon, PuzzleIcon } from "lucide-react";

import { Icons } from "@/components/icons";
import { getPostsByCategory } from "@/data/blog";

export const metadata: Metadata = {
  title: "Components",
  description: "A collection of reusable components.",
};

function ComponentsPlaceholder() {
  return (
    <div className="flex min-h-fit flex-col items-center justify-center p-8 text-center">
      <div className="relative mb-6">
        <div className="from-[--color-react]/10 to-[--color-react]/5 absolute inset-0 rounded-full bg-gradient-to-r blur-2xl" />
        <div className="border-edge bg-background/50 relative flex h-20 w-20 items-center justify-center rounded-full border backdrop-blur-sm">
          <PuzzleIcon className="text-muted-foreground h-8 w-8" />
        </div>
      </div>

      <h3 className="text-foreground mb-2 text-xl font-medium">
        No Components Yet
      </h3>
      <p className="text-muted-foreground mb-4 max-w-md text-balance text-sm">
        This collection will feature reusable React components, UI elements, and
        interactive demos. Stay tuned for useful building blocks!
      </p>

      <div className="border-edge bg-muted/30 flex items-center gap-2 rounded-md border px-3 py-2">
        <ComponentIcon className="text-muted-foreground h-4 w-4" />
        <span className="text-muted-foreground font-mono text-xs">
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
        <p className="text-muted-foreground text-balance font-mono text-sm">
          {metadata.description}
        </p>
      </div>

      {posts.length > 0 ? (
        posts.map((post) => (
          <Link
            key={post.slug}
            href={`/components/${post.slug}`}
            className="group/post border-edge flex items-center border-b pr-4"
          >
            <Icons.react
              className="text-(--color-react) mx-4 size-5 shrink-0"
              aria-hidden
            />

            <div className="border-edge border-l border-dashed p-4">
              <h2 className="text-balance font-medium leading-snug underline-offset-4 group-hover/post:underline">
                {post.metadata.title}
              </h2>
            </div>

            {post.metadata.new && (
              <span
                className="bg-info text-shadow-xs shrink-0 rounded-md px-1.5 font-mono text-sm font-medium text-white"
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
