import { cn } from "@/lib/utils";

/**
 * Provides a styled layout container for documentation pages, applying decorative borders and a patterned background.
 *
 * Renders its `children` within a visually distinct section suitable for documentation content.
 *
 * @param children - The content to display within the documentation layout
 */
export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="border-edge mx-auto border-x md:max-w-3xl">
      <div
        className={cn(
          "h-8 px-2",
          "screen-line-after",
          "before:-z-1 before:absolute before:-left-[100vw] before:h-full before:w-[200vw]",
          "before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56 before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)]"
        )}
      />

      {children}
    </div>
  );
}
