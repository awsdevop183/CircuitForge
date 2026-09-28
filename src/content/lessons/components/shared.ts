import { getComponent } from "@/content/component-library";
import type { BeginnerMistake } from "../types";

/** The component library's beginner mistakes for a slug, plus any lesson-specific ones. */
export function mistakesFor(slug: string, extra: BeginnerMistake[] = []): BeginnerMistake[] {
  return [...extra, ...(getComponent(slug)?.mistakes ?? [])];
}
