export { cn, type ClassValue } from "cnfast";

export function validateImageUrl(url: string | undefined): string {
  if (!url) return "";

  if (process.env.NODE_ENV === "development") {
    return url.replace("https://yash.reactopia.me", "http://localhost:3000");
  }

  return url;
}

// eslint-disable-next-line deslop/unused-export
export function validateHref(href: string | undefined): string {
  if (!href) return "#";

  if (process.env.NODE_ENV === "development") {
    return href.replace("https://yash.reactopia.me", "http://localhost:3000");
  }

  return href;
}
