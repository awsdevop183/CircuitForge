"use client";

import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
import { MODULES, availableLessons, lessonHref, lessonKey } from "@/content/curriculum";
import { useProgress } from "@/lib/progress/use-progress";
import { ProgressBar } from "@/components/ui/ProgressBar";

/** Overall progress plus a jump-back-in link to the next unfinished lesson. */
export function ContinueLearning() {
  const { isComplete, countComplete } = useProgress();
  const all = MODULES.flatMap((module) => availableLessons(module).map((lesson) => ({ module, lesson })));
  const done = countComplete(all.map(({ module, lesson }) => lessonKey(module.slug, lesson.slug)));
  const next = all.find(({ module, lesson }) => !isComplete(lessonKey(module.slug, lesson.slug)));

  return (
    <div className="panel-raised grid gap-6 rounded-2xl p-5 sm:p-6 md:grid-cols-[1fr_1.3fr] md:items-center">
      <ProgressBar value={done} max={all.length} label="Lessons completed" />
      {next ? (
        <Link
          href={lessonHref(next.module.slug, next.lesson.slug)}
          className="group flex items-center justify-between gap-4 rounded-xl border border-cyan/35 bg-cyan/5 p-4 transition-colors hover:border-cyan/70"
        >
          <span>
            <span className="eyebrow block text-cyan">{done === 0 ? "Start here" : "Up next"}</span>
            <span className="mt-1 block font-semibold text-ink">
              {next.module.number} · {next.lesson.title}
            </span>
            <span className="text-xs text-ink-subtle">{next.lesson.estimatedMinutes} min · {next.lesson.summary}</span>
          </span>
          <ArrowRight className="size-5 shrink-0 text-cyan transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      ) : (
        <p className="flex items-center gap-3 rounded-xl border border-positive/40 bg-positive/5 p-4 text-sm text-ink">
          <Trophy className="size-5 text-amber" aria-hidden="true" />
          You&apos;ve completed every available lesson. New lessons are on the way — try the lab in the meantime.
        </p>
      )}
    </div>
  );
}
