import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Renders a styled card container with customizable class names and div props.
 *
 * The card serves as a flexible UI element for grouping related content, applying consistent background, border, padding, and shadow styles.
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  );
}

/**
 * Renders the header section of a card with grid layout and responsive styling.
 *
 * Additional props are spread onto the underlying div element.
 */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6",
        className
      )}
      {...props}
    />
  );
}

/**
 * Renders the title section of a card with emphasized styling.
 *
 * Applies bold font weight and compact line height to visually distinguish the card's title.
 */
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("font-semibold leading-none", className)}
      {...props}
    />
  );
}

/**
 * Renders a card description section with muted text styling.
 *
 * Use within a card layout to display supplementary or descriptive text.
 */
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

/**
 * Renders a card action area positioned in the top-right of the card header grid.
 *
 * Use this component to display actions such as buttons or menus within a card header.
 */
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

/**
 * Renders the content section of a card with horizontal padding.
 *
 * Spreads additional div props onto the rendered element.
 */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}

/**
 * Renders the footer section of a card with appropriate spacing and layout.
 *
 * Applies conditional top padding when a top border is present, horizontal padding, and flex alignment for its children.
 */
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("[.border-t]:pt-6 flex items-center px-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
