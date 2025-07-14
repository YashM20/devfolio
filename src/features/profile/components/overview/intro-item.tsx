import type { LucideProps } from "lucide-react";

/**
 * Renders an item with an icon and descriptive content, optionally as a link.
 *
 * Displays the provided icon alongside the content. If a `href` is given, the content is rendered as a link that opens in a new tab; otherwise, it is displayed as plain text.
 *
 * @param icon - The icon component to display
 * @param content - The content to display next to the icon
 * @param href - Optional URL to wrap the content as a link
 */
export function IntroItem({
  icon: Icon,
  content,
  href,
}: {
  icon: React.ComponentType<LucideProps>;
  content: React.ReactNode;
  href?: string;
}) {
  return (
    <div className="flex items-center gap-4 font-mono text-sm">
      <div
        className="bg-muted flex size-6 shrink-0 items-center justify-center rounded-lg"
        aria-hidden
      >
        <Icon className="text-muted-foreground pointer-events-none size-4" />
      </div>

      <p className="text-balance">
        {href ? (
          <a
            className="underline-offset-4 hover:underline"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {content}
          </a>
        ) : (
          content
        )}
      </p>
    </div>
  );
}
