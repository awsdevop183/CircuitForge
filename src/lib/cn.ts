import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Compose conditional class names. Later Tailwind classes override earlier
 * conflicting ones, so components can accept `className` overrides safely
 * (e.g. `max-w-3xl` replacing a default `max-w-7xl`).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
