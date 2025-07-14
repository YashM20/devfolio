import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class name values into a single string, resolving Tailwind CSS class conflicts.
 *
 * Accepts any number of class name inputs, merges them using `clsx`, and then applies `twMerge` to ensure Tailwind CSS classes are properly deduplicated and merged.
 *
 * @returns The merged class name string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
