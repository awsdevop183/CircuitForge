import { lessonKey } from "@/content/curriculum";
import { current } from "./current";
import type { LessonContent } from "./types";
import { voltage } from "./voltage";
import { whatIsElectricity } from "./what-is-electricity";

/** Full content for every available lesson, keyed by `module/lesson`. */
const LESSONS: Readonly<Record<string, LessonContent>> = Object.fromEntries(
  [whatIsElectricity, voltage, current].map((lesson) => [lessonKey(lesson.moduleSlug, lesson.lessonSlug), lesson]),
);

export function getLessonContent(moduleSlug: string, lessonSlug: string): LessonContent | undefined {
  return LESSONS[lessonKey(moduleSlug, lessonSlug)];
}
