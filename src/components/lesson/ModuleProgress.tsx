"use client";

import { availableLessons, lessonKey } from "@/content/curriculum";
import type { LearningModule } from "@/content/types";
import { useProgress } from "@/lib/progress/use-progress";
import { cn } from "@/lib/cn";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface ModuleProgressProps {
  module: LearningModule;
  className?: string;
  /** "compact" = thin bar with count; "full" = title, big percentage and bar. */
  variant?: "compact" | "full";
}

/** Completion across the lessons currently available in a module. */
export function ModuleProgress({ module, className, variant = "compact" }: ModuleProgressProps) {
  const { countComplete, isComplete } = useProgress();
  const lessons = availableLessons(module);
  const done = countComplete(lessons.map((lesson) => lessonKey(module.slug, lesson.slug)));
  const percent = lessons.length > 0 ? Math.round((done / lessons.length) * 100) : 0;

  return (
    <div className={cn("w-full", className)}>
      {variant === "full" ? (
        <div className="mb-2 flex items-end justify-between gap-3">
          <p className="font-display text-lg font-semibold text-ink">{module.title}</p>
          <p className="font-mono text-2xl font-semibold text-cyan tabular-nums">{percent}%</p>
        </div>
      ) : null}
      <ProgressBar
        label={`${module.title} progress`}
        valueText={`${done} of ${lessons.length} lessons completed`}
        value={done}
        max={lessons.length}
        segments={lessons.map((lesson) => isComplete(lessonKey(module.slug, lesson.slug)))}
        size={variant === "full" ? "md" : "sm"}
      />
      <p className="mt-2 flex justify-between text-xs text-ink-subtle">
        <span>
          <span className="font-mono text-ink-muted">
            {done} / {lessons.length}
          </span>{" "}
          lessons completed
        </span>
        {variant === "compact" ? <span className="font-mono">{percent}%</span> : null}
      </p>
    </div>
  );
}
