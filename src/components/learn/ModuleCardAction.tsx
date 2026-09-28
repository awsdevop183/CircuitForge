"use client";

import { ArrowRight, Lock, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { availableLessons, lessonHref, lessonKey } from "@/content/curriculum";
import type { LearningModule } from "@/content/types";
import { useProgress } from "@/lib/progress/use-progress";

/** Start / Continue / Review / Explore button, depending on progress and status. */
export function ModuleCardAction({ module }: { module: LearningModule }) {
  const { isComplete, currentLessonKey } = useProgress();
  const lessons = availableLessons(module);

  if (lessons.length === 0) {
    if (module.status === "preview") {
      return (
        <ButtonLink href={`/learn/${module.slug}`} variant="secondary" size="sm" className="w-full">
          <Sparkles className="size-4 text-amber" aria-hidden="true" />
          Explore preview
        </ButtonLink>
      );
    }
    return (
      <span className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-line-strong text-sm text-ink-subtle">
        <Lock className="size-3.5" aria-hidden="true" />
        Coming soon
      </span>
    );
  }

  // Resume the lesson the learner last opened (if unfinished), otherwise the first unfinished one.
  const current = lessons.find((lesson) => lessonKey(module.slug, lesson.slug) === currentLessonKey && !isComplete(currentLessonKey));
  const nextLesson = current ?? lessons.find((lesson) => !isComplete(lessonKey(module.slug, lesson.slug)));
  const started = Boolean(current) || lessons.some((lesson) => isComplete(lessonKey(module.slug, lesson.slug)));
  const target = nextLesson ?? lessons[0]!;
  const label = !started ? "Start module" : nextLesson ? "Continue" : "Review";

  return (
    <ButtonLink href={lessonHref(module.slug, target.slug)} size="sm" className="w-full">
      {label}
      <ArrowRight className="size-4" aria-hidden="true" />
    </ButtonLink>
  );
}
