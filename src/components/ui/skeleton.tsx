import { cn } from "@/lib/utils";

/**
 * Renders a skeleton loading placeholder as a div with customizable classes and props.
 *
 * Combines default skeleton styling with any additional classes provided via the `className` prop. All other div props are forwarded to the rendered element.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
