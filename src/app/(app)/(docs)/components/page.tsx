import type { Metadata } from "next";
import Link from "next/link";

import { Icons } from "@/components/icons";
import { getPostsByCategory } from "@/data/blog";

export const metadata: Metadata = {
  title: "Components",
  description: "A collection of reusable components.",
};

/**
 * Renders a page displaying a list of blog posts categorized under "components."
 *
 * Each post is shown as a styled link with its title, a React icon, and an optional "New" badge if applicable.
 */
export default function Page() {
  const posts = getPostsByCategory("components");

  return (
    <div className="min-h-svh [--color-react:#087EA4] dark:[--color-react:#58C4DC]">
      <div className="screen-line-after px-4">
        <h1 className="text-3xl font-semibold">Components</h1>
      </div>

      <div className="screen-line-after p-4">
        <p className="text-muted-foreground text-balance font-mono text-sm">
          {metadata.description}
        </p>
      </div>

      {posts.map((post) => (
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
      ))}

      <div className="h-4" />
    </div>
  );
}
