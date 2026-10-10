import dayjs from "dayjs";
import type { MetadataRoute } from "next";

import { SITE_INFO } from "@/config/site";
import { getAllPosts, getPostsByCategory } from "@/data/blog";
import { getAllProjectPosts } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
    .filter((post) => post.metadata.category !== "components")
    .map((post) => ({
      url: `${SITE_INFO.url}/blog/${post.slug}`,
      lastModified: dayjs(post.metadata.updatedAt).toISOString(),
    }));

  const components = getPostsByCategory("components").map((post) => ({
    url: `${SITE_INFO.url}/components/${post.slug}`,
    lastModified: dayjs(post.metadata.updatedAt).toISOString(),
  }));

  const projects = getAllProjectPosts().map((post) => ({
    url: `${SITE_INFO.url}/projects/${post.slug}`,
    lastModified: dayjs(post.metadata.updatedAt).toISOString(),
  }));

  const routes = ["", "/blog", "/components", "/projects"].map((route) => ({
    url: `${SITE_INFO.url}${route}`,
    lastModified: dayjs().toISOString(),
  }));

  return [...routes, ...posts, ...components, ...projects];
}
