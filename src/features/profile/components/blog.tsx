import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

import { PostItem } from "@/components/post-item";
import { Button } from "@/components/ui/button";
import { getAllPosts } from "@/data/blog";

import { Panel, PanelHeader, PanelTitle } from "./panel";

export function Blog() {
  const allPosts = getAllPosts();

  if (allPosts.length === 0) {
    return <></>;
  }

  return (
    <Panel id="blog">
      <PanelHeader>
        <PanelTitle>Blog</PanelTitle>
      </PanelHeader>

      <div className="relative py-4">
        <div className="-z-1 pointer-events-none absolute inset-0 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
          <div className="border-edge border-r"></div>
          <div className="border-edge border-l"></div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {allPosts.slice(0, 4).map((post) => (
            <PostItem key={post.slug} post={post} />
          ))}
        </div>
      </div>

      <div className="screen-line-before flex justify-center py-2">
        <Button variant="default" asChild>
          <Link href="/blog">
            All Posts
            <ArrowRightIcon />
          </Link>
        </Button>
      </div>
    </Panel>
  );
}
