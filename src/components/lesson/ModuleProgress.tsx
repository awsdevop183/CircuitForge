"use client";

import { ProgressBar } from "@/components/ui/ProgressBar";
import { availableLessons, lessonKey } from "@/content/curriculum";
import type { LearningModule } from "@/content/types";
import { useProgress } from "@/lib/progress/use-progress";

/** Completion across the lessons currently available in a module. */
export function ModuleProgress({ module, className }: { module: LearningModule; className?: string }) {
  const { countComplete } = useProgress();
  const lessons = availableLessons(module);
  const done = countComplete(lessons.map((lesson) => lessonKey(module.slug, lesson.slug)));
  return <ProgressBar value={done} max={lessons.length} label={`${module.title} progress`} className={className} />;
}
