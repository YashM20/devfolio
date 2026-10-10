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
