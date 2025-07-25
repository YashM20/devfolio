import dayjs from "dayjs";
import type { Metadata } from "next";
import { FileTextIcon, PenToolIcon } from "lucide-react";

import { PostItem } from "@/components/post-item";
import { getAllPosts } from "@/data/blog";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description: "A collection of articles on development, design, and ideas.",
};

function BlogPlaceholder() {
  return (
    <div className="relative">
      <div className="border-edge absolute inset-0 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
        <div className="border-edge border-r"></div>
        <div className="border-edge border-l"></div>
      </div>

      <div className="flex min-h-[40vh] flex-col items-center justify-center p-8 text-center">
        <div className="relative mb-6">
          <div className="from-primary/10 to-primary/5 absolute inset-0 rounded-full bg-gradient-to-r blur-2xl" />
          <div className="border-edge bg-background/50 relative flex h-20 w-20 items-center justify-center rounded-full border backdrop-blur-sm">
            <PenToolIcon className="text-muted-foreground h-8 w-8" />
          </div>
        </div>

        <h3 className="text-foreground mb-2 text-xl font-medium">
          No Blog Posts Yet
        </h3>
        <p className="text-muted-foreground mb-4 max-w-md text-balance text-sm">
          This space is ready for insightful articles on development, design,
          and innovative ideas. Check back soon for fresh content!
        </p>

        <div className="border-edge bg-muted/30 flex items-center gap-2 rounded-md border px-3 py-2">
          <FileTextIcon className="text-muted-foreground h-4 w-4" />
          <span className="text-muted-foreground font-mono text-xs">
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
        <p className="text-muted-foreground text-balance font-mono text-sm">
          {metadata.description}
        </p>
      </div>

      <div className="relative pt-4">
        {allPosts.length > 0 ? (
          <>
            <div className="-z-1 absolute inset-0 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
              <div className="border-edge border-r"></div>
              <div className="border-edge border-l"></div>
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
