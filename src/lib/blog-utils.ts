/**
 * Blog utility functions for reading time calculation and content analysis
 */

/**
 * Calculate estimated reading time for blog content
 * Based on average reading speed of 200 words per minute
 */
export function calculateReadingTime(content: string): {
  minutes: number;
  words: number;
  text: string;
} {
  // Remove markdown syntax and HTML tags for accurate word count
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .replace(/`[^`]*`/g, "") // Remove inline code
    .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
    .replace(/\[.*?\]\(.*?\)/g, "") // Remove links
    .replace(/#+\s/g, "") // Remove headers
    .replace(/[*_~]/g, "") // Remove emphasis markers
    .replace(/<!--[\s\S]*?-->/g, "") // Remove HTML comments
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/\n+/g, " ") // Replace newlines with spaces
    .trim();

  const words = cleanContent
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const minutes = Math.ceil(words / 200);

  return {
    minutes,
    words,
    text: `${minutes} min read`,
  };
}

/**
 * Extract headings from content for table of contents
 */
export function extractHeadings(content: string): Array<{
  id: string;
  text: string;
  level: number;
}> {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Array<{ id: string; text: string; level: number }> = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    headings.push({ id, text, level });
  }

  return headings;
}

/**
 * Get current reading progress based on scroll position
 */
export function getReadingProgress(element: HTMLElement | null): number {
  if (!element) return 0;

  const { scrollTop, scrollHeight, clientHeight } = element;
  const progress = scrollTop / (scrollHeight - clientHeight);

  return Math.min(Math.max(progress, 0), 1);
}

/**
 * Format social sharing URLs
 */
export function getSocialShareUrls(
  url: string,
  title: string,
  description?: string
) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || title);

  return {
    twitter: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
    copy: url,
  };
}
