import fs from "fs";
import matter from "gray-matter";
import path from "path";

import { calculateReadingTime } from "@/lib/blog-utils";

export type ProjectPostMetadata = {
  title: string;
  description: string;
  role: string;
  duration: string;
  industry: string;
  client: string;
  skills: string[];
  createdAt: string;
  updatedAt: string;
  image?: string;
  toc?: boolean;
  readingTime?: {
    minutes: number;
    words: number;
    text: string;
  };
};

export type ProjectPost = {
  metadata: ProjectPostMetadata;
  slug: string;
  content: string;
};

function parseFrontmatter(fileContent: string) {
  const file = matter(fileContent);

  return {
    metadata: file.data as ProjectPostMetadata,
    content: file.content,
  };
}

function getMDXFiles(dir: string) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter(
      (file) => path.extname(file) === ".mdx" || path.extname(file) === ".md"
    );
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);

  return mdxFiles.map<ProjectPost>((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file));

    const slug = path.basename(file, path.extname(file));
    const readingTime = calculateReadingTime(content);

    return {
      metadata: {
        ...metadata,
        readingTime,
      },
      slug,
      content,
    };
  });
}

export function getAllProjectPosts() {
  return getMDXData(
    path.join(process.cwd(), "src", "content", "projects")
  ).sort(
    (a, b) =>
      new Date(b.metadata.createdAt).getTime() -
      new Date(a.metadata.createdAt).getTime()
  );
}

export function getProjectPostBySlug(slug: string) {
  return getAllProjectPosts().find((post) => post.slug === slug);
}

export function findNeighbourProject(posts: ProjectPost[], slug: string) {
  const len = posts.length;

  for (let i = 0; i < len; ++i) {
    if (posts[i].slug === slug) {
      return {
        previous: i > 0 ? posts[i - 1] : null,
        next: i < len - 1 ? posts[i + 1] : null,
      };
    }
  }

  return { previous: null, next: null };
}
