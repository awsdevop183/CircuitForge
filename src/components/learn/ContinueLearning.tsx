"use client";

import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
import { MODULES, availableLessons, lessonHref, lessonKey } from "@/content/curriculum";
import { useProgress } from "@/lib/progress/use-progress";
import { ModuleProgress } from "@/components/lesson/ModuleProgress";

/** Overall progress plus a jump-back-in link to the next unfinished lesson. */
export function ContinueLearning() {
  const { isComplete, countComplete, currentLessonKey } = useProgress();
  const all = MODULES.flatMap((module) => availableLessons(module).map((lesson) => ({ module, lesson })));
  const done = countComplete(all.map(({ module, lesson }) => lessonKey(module.slug, lesson.slug)));
  const resume = all.find(({ module, lesson }) => {
    const key = lessonKey(module.slug, lesson.slug);
    return key === currentLessonKey && !isComplete(key);
  });
  const next = resume ?? all.find(({ module, lesson }) => !isComplete(lessonKey(module.slug, lesson.slug)));
  // Show progress for the module the learner is working through (or the last one, when everything is done).
  const focusModule = next?.module ?? all[all.length - 1]?.module ?? MODULES[0]!;

  return (
    <div className="panel-raised grid gap-6 rounded-2xl p-5 sm:p-6 md:grid-cols-[1fr_1.3fr] md:items-center">
      <div>
        <ModuleProgress module={focusModule} variant="full" />
        <p className="mt-3 font-mono text-xs text-ink-subtle">
          All modules: {done} / {all.length} lessons complete
        </p>
      </div>
      {next ? (
        <Link
          href={lessonHref(next.module.slug, next.lesson.slug)}
          className="group flex items-center justify-between gap-4 rounded-xl border border-cyan/35 bg-cyan/5 p-4 transition-colors hover:border-cyan/70"
        >
          <span>
            <span className="eyebrow block text-cyan">{resume ? "Resume your current lesson" : done === 0 ? "Start here" : "Up next"}</span>
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
