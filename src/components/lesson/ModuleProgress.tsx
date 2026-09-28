"use client";

import { availableLessons, lessonKey } from "@/content/curriculum";
import type { LearningModule } from "@/content/types";
import { useProgress } from "@/lib/progress/use-progress";
import { cn } from "@/lib/cn";

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
      <div
        role="progressbar"
        aria-label={`${module.title} progress`}
        aria-valuemin={0}
        aria-valuemax={lessons.length}
        aria-valuenow={done}
        aria-valuetext={`${done} of ${lessons.length} lessons completed`}
        className={cn("flex gap-[3px]", variant === "full" ? "h-3" : "h-1.5")}
      >
        {/* One segment per lesson, like a row of LEDs lighting up */}
        {lessons.map((lesson) => (
          <span
            key={lesson.slug}
            className={cn(
              "flex-1 rounded-sm transition-colors duration-500",
              isComplete(lessonKey(module.slug, lesson.slug)) ? "bg-cyan shadow-[0_0_8px_rgb(34_211_238/0.7)]" : "bg-line",
            )}
          />
        ))}
      </div>
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
