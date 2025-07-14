import { LinkIcon } from "lucide-react";
import { Slot as SlotPrimitive } from "radix-ui";
import React from "react";

import { cn } from "@/lib/utils";

const Slot = SlotPrimitive.Slot;

/**
 * Renders styled rich text content with consistent typography and formatting.
 *
 * Applies a set of prose-specific CSS classes for headings, links, code, and other elements. Can render as a custom component if `asChild` is true.
 */
function Prose({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      data-slot="prose"
      className={cn(
        "prose prose-sm text-foreground prose-zinc dark:prose-invert max-w-none font-mono",
        "prose-headings:font-sans prose-headings:font-semibold prose-headings:text-balance",
        "prose-h2:border-b prose-h2:border-edge prose-h2:pb-2 prose-h2:text-2xl",
        "prose-lead:text-base",
        "prose-a:font-medium prose-a:break-words prose-a:text-foreground prose-a:underline prose-a:underline-offset-4",
        "prose-code:rounded-md prose-code:border prose-code:bg-muted/50 prose-code:px-[0.3rem] prose-code:py-[0.2rem] prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none",
        "prose-hr:border-edge",
        className
      )}
      {...props}
    />
  );
}

/**
 * Renders a styled code element, distinguishing between inline code and code blocks.
 *
 * Applies specific styles for inline code and sets a `data-slot` attribute to indicate the code type.
 */
function Code({ className, ...props }: React.ComponentProps<"code">) {
  const isCodeBlock = "data-language" in props;

  return (
    <code
      data-slot={isCodeBlock ? "code-block" : "code-inline"}
      className={cn(
        !isCodeBlock &&
          "not-prose bg-muted/50 rounded-md border px-[0.3rem] py-[0.2rem] font-mono text-sm",
        className
      )}
      {...props}
    />
  );
}

type HeadingTypes = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type HeadingProps<T extends HeadingTypes> = React.ComponentProps<T> & {
  as?: T;
};

/**
 * Renders a heading element with optional anchor link functionality for section linking.
 *
 * If an `id` is provided, displays a linkable anchor and a link icon for easy section navigation.
 *
 * @param as - The heading tag to render (e.g., "h1", "h2"). Defaults to "h1".
 */
function Heading<T extends HeadingTypes = "h1">({
  as,
  className,
  ...props
}: HeadingProps<T>): React.ReactElement {
  const Comp = as ?? "h1";

  if (!props.id) {
    return <Comp className={className} {...props} />;
  }

  return (
    <Comp
      className={cn("flex flex-row items-center gap-2", className)}
      {...props}
    >
      <a href={`#${props.id}`} className="not-prose peer">
        {props.children}
      </a>

      <LinkIcon
        className="text-muted-foreground size-4 shrink-0 opacity-0 transition-opacity peer-hover:opacity-100"
        aria-label="Link to section"
      />
    </Comp>
  );
}

export { Code, Heading, Prose };
