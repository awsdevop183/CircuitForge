"use client";

import Link from "next/link";
import { CircleCheck, CircleDashed, Trophy } from "lucide-react";
import type { ModuleActivity } from "@/content/types";
import { useProgress } from "@/lib/progress/use-progress";

/** Tracked challenges and games for a module, with the learner's results. */
export function ModuleActivities({ activities }: { activities: readonly ModuleActivity[] }) {
  const { challengeResult, quizResult } = useProgress();
  return (
    <ul className="grid gap-3 sm:grid-cols-3">
      {activities.map((activity) => {
        let done = false;
        let status = "Not tried yet";
        if (activity.kind === "challenge") {
          const result = challengeResult(activity.id);
          done = Boolean(result?.completedAt);
          if (result) status = done ? `Completed · ${result.attempts} ${result.attempts === 1 ? "attempt" : "attempts"}` : `${result.attempts} attempts so far`;
        } else {
          const result = quizResult(activity.id);
          if (result) {
            done = true;
            status = `Last score ${result.correct}/${result.total}`;
          }
        }
        return (
          <li key={activity.id}>
            <Link href={activity.href} className="panel group flex h-full items-center gap-3 rounded-xl p-4 transition-colors hover:border-cyan/45">
              {done ? (
                activity.kind === "challenge" ? <Trophy className="size-5 shrink-0 text-amber" aria-hidden="true" /> : <CircleCheck className="size-5 shrink-0 text-positive" aria-hidden="true" />
              ) : (
                <CircleDashed className="size-5 shrink-0 text-ink-subtle" aria-hidden="true" />
              )}
              <span>
                <span className="block font-medium text-ink group-hover:text-cyan">{activity.label}</span>
                <span className="block text-xs text-ink-muted">{status}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
