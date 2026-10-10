import dayjs from "dayjs";
import type { Metadata } from "next";
import { FileTextIcon, PenToolIcon } from "lucide-react";

import { PostItem } from "@/components/post-item";
import { getAllPosts } from "@/data/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "A collection of articles on development, design, and ideas.",
  alternates: {
    canonical: "/blog",
  },
};

function BlogPlaceholder() {
  return (
    <div className="relative">
      <div className="absolute inset-0 grid grid-cols-1 gap-4 border-edge max-sm:hidden sm:grid-cols-2">
        <div className="border-r border-edge"></div>
        <div className="border-l border-edge"></div>
      </div>

      <div className="flex min-h-[40vh] flex-col items-center justify-center p-8 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 blur-2xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-edge bg-background/50 backdrop-blur-sm">
            <PenToolIcon className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>

        <h3 className="mb-2 text-xl font-medium text-foreground">
          No Blog Posts Yet
        </h3>
        <p className="mb-4 max-w-md text-sm text-balance text-muted-foreground">
          This space is ready for insightful articles on development, design,
          and innovative ideas. Check back soon for fresh content!
        </p>

        <div className="flex items-center gap-2 rounded-md border border-edge bg-muted/30 px-3 py-2">
          <FileTextIcon className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-xs text-muted-foreground">
            Coming Soon
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const allPosts = getAllPosts();

  return (
    <>
      <div className="screen-line-after px-4">
        <h1 className="text-3xl font-semibold">Blog</h1>
      </div>

      <div className="screen-line-after p-4">
        <p className="font-mono text-sm text-balance text-muted-foreground">
          {metadata.description}
        </p>
      </div>

      <div className="relative pt-4">
        {allPosts.length > 0 ? (
          <>
            <div className="absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
              <div className="border-r border-edge"></div>
              <div className="border-l border-edge"></div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {allPosts
                .slice()
                .sort((a, b) =>
                  dayjs(b.metadata.createdAt).diff(dayjs(a.metadata.createdAt))
                )
                .map((post, index) => (
                  <PostItem
                    key={post.slug}
                    post={post}
                    shouldPreloadImage={index <= 4}
                  />
                ))}
            </div>
          </>
        ) : (
          <BlogPlaceholder />
        )}
      </div>

      <div className="h-4" />
    </>
  );
}
