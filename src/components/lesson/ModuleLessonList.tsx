"use client";

import Link from "next/link";
import { CircleCheck, Lock } from "lucide-react";
import type { LearningModule } from "@/content/types";
import { lessonHref, lessonKey } from "@/content/curriculum";
import { useProgress } from "@/lib/progress/use-progress";
import { cn } from "@/lib/cn";

/** Lesson navigation within a module, with completion state. */
export function ModuleLessonList({ module, currentLessonSlug }: { module: LearningModule; currentLessonSlug: string }) {
  const { isComplete } = useProgress();

  return (
    <nav aria-label={`${module.title} lessons`}>
      <p className="eyebrow mb-3 text-ink-subtle">
        Module {module.number} · {module.title}
      </p>
      <ol className="space-y-1">
        {module.lessons.map((lesson, index) => {
          const current = lesson.slug === currentLessonSlug;
          const done = isComplete(lessonKey(module.slug, lesson.slug));
          const content = (
            <>
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-[0.65rem]",
                  done ? "border-positive bg-positive/15 text-positive" : current ? "border-cyan text-cyan" : "border-line-strong text-ink-subtle",
                )}
              >
                {done ? <CircleCheck className="size-3.5" aria-label="Completed" /> : index + 1}
              </span>
              <span className="min-w-0 flex-1 truncate">{lesson.title}</span>
              {!lesson.available ? <Lock className="size-3.5 shrink-0 text-ink-subtle" aria-label="Coming soon" /> : null}
            </>
          );
          const classes = cn(
            "flex items-center gap-3 rounded-lg px-2 py-2 text-sm",
            current ? "bg-cyan/10 text-ink" : lesson.available ? "text-ink-muted hover:bg-surface-raised hover:text-ink" : "text-ink-subtle",
          );
          return (
            <li key={lesson.slug}>
              {lesson.available ? (
                <Link href={lessonHref(module.slug, lesson.slug)} aria-current={current ? "page" : undefined} className={classes}>
                  {content}
                </Link>
              ) : (
                <span className={classes}>{content}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
