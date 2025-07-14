"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Renders a responsive table with customizable styling, wrapped in a horizontally scrollable container.
 *
 * Additional props are spread onto the underlying `<table>` element.
 */
function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

/**
 * Renders a table header (`<thead>`) element with a bottom border applied to all row (`<tr>`) children.
 *
 * Additional props are spread onto the `<thead>` element for further customization.
 */
function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  );
}

/**
 * Renders a `<tbody>` element for a table with styling that removes the bottom border from the last row.
 *
 * Additional props are spread onto the `<tbody>` element for further customization.
 */
function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

/**
 * Renders a styled table footer (`<tfoot>`) with a muted background, top border, medium font weight, and no bottom border on the last row.
 *
 * Spreads additional props onto the `<tfoot>` element for further customization.
 */
function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  );
}

/**
 * Renders a table row with hover and selected state background styling, a bottom border, and color transition effects.
 *
 * Additional class names and props can be provided for further customization.
 */
function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      )}
      {...props}
    />
  );
}

/**
 * Renders a styled table header cell (`<th>`) with customizable classes and support for special checkbox alignment.
 *
 * Applies foreground text color, fixed height, no wrapping, padding, left alignment, vertical centering, and medium font weight. Adjusts padding and translation if a checkbox is present.
 */
function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 whitespace-nowrap px-2 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

/**
 * Renders a styled table cell (`<td>`) element with customizable classes and support for special checkbox alignment.
 *
 * Spreads additional props onto the `<td>` element.
 */
function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "whitespace-nowrap p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

/**
 * Renders a styled table caption with muted text color, top margin, and small font size.
 *
 * Spreads additional props onto the underlying `<caption>` element for further customization.
 */
function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
