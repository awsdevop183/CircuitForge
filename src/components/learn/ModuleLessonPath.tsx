"use client";

import Link from "next/link";
import { ArrowRight, CircleCheck, Lock, Play } from "lucide-react";
import { ComingSoonBadge, DurationBadge } from "@/components/ui/Badge";
import { lessonHref, lessonKey } from "@/content/curriculum";
import type { LearningModule } from "@/content/types";
import { useProgress } from "@/lib/progress/use-progress";
import { cn } from "@/lib/cn";

/**
 * The module's lessons as one connected path, each showing whether it's
 * complete, current, and its latest knowledge-check score.
 */
export function ModuleLessonPath({ module }: { module: LearningModule }) {
  const { isComplete, quizResult, currentLessonKey } = useProgress();

  return (
    <ol className="relative space-y-3 before:absolute before:bottom-6 before:left-[19px] before:top-6 before:w-0.5 before:bg-line-strong">
      {module.lessons.map((lesson, index) => {
        const key = lessonKey(module.slug, lesson.slug);
        const done = isComplete(key);
        const current = currentLessonKey === key && !done;
        const result = quizResult(key);

        const body = (
          <>
            <span
              className={cn(
                "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 bg-page font-mono text-sm",
                done ? "border-positive text-positive" : current ? "border-cyan text-cyan shadow-[0_0_16px_-2px_rgb(34_211_238/0.8)]" : "border-line-strong text-ink-subtle",
              )}
            >
              {done ? <CircleCheck className="size-5" aria-hidden="true" /> : String(index + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-ink">{lesson.title}</span>
                {current ? <span className="rounded bg-cyan/15 px-1.5 py-0.5 font-mono text-[0.65rem] uppercase text-cyan">Current lesson</span> : null}
              </span>
              <span className="mt-0.5 block text-sm text-ink-muted">{lesson.summary}</span>
              {result ? (
                <span className="mt-1 block font-mono text-xs text-ink-subtle">
                  Knowledge check: {result.correct}/{result.total}
                </span>
              ) : null}
            </span>
            <span className="hidden shrink-0 items-center gap-2 sm:flex">
              <DurationBadge minutes={lesson.estimatedMinutes} />
              {lesson.available ? (
                current ? (
                  <Play className="size-5 text-cyan" aria-hidden="true" />
                ) : (
                  <ArrowRight className="size-5 text-ink-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-cyan" aria-hidden="true" />
                )
              ) : (
                <ComingSoonBadge />
              )}
            </span>
            {!lesson.available ? <Lock className="size-4 shrink-0 text-ink-subtle sm:hidden" aria-label="Coming soon" /> : null}
            <span className="sr-only">{done ? "(completed)" : current ? "(current lesson)" : ""}</span>
          </>
        );

        return (
          <li key={lesson.slug}>
            {lesson.available ? (
              <Link
                href={lessonHref(module.slug, lesson.slug)}
                aria-current={current ? "step" : undefined}
                className={cn(
                  "panel group flex items-center gap-4 rounded-xl p-3 pr-4 transition-colors hover:border-cyan/45",
                  current && "border-cyan/40",
                )}
              >
                {body}
              </Link>
            ) : (
              <div className="panel flex items-center gap-4 rounded-xl p-3 pr-4 opacity-65">{body}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
