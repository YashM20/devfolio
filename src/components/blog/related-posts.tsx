import { PostItem } from "@/components/post-item";
import { getAllPosts } from "@/data/blog";
import { cn } from "@/lib/utils";
import type { Post } from "@/types/blog";

interface RelatedPostsProps {
  currentPost: Post;
  limit?: number;
  className?: string;
}

export function RelatedPosts({
  currentPost,
  limit = 3,
  className,
}: RelatedPostsProps) {
  const allPosts = getAllPosts();

  // Filter out current post and get related posts
  const relatedPosts = allPosts
    .filter((post) => post.slug !== currentPost.slug)
    .slice(0, limit);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <>
      <div className="screen-line-after px-4">
        <h1 className="text-3xl font-semibold">Related Posts</h1>
      </div>

      <div className="screen-line-after p-4">
        <p className="text-muted-foreground text-balance font-mono text-sm">
          Continue reading with these related articles
        </p>
      </div>

      <div className="relative pt-4">
        <div className="-z-1 absolute inset-0 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
          <div className="border-edge border-r"></div>
          <div className="border-edge border-l"></div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {relatedPosts.map((post) => (
            <PostItem key={post.slug} post={post} />
          ))}
        </div>
      </div>

      <div className="h-4" />
    </>
  );
}
