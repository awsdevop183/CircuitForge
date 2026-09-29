"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ModuleProgress } from "@/components/lesson/ModuleProgress";
import { MODULES } from "@/content/curriculum";
import { EXPERIMENTS } from "@/content/experiments";
import { useProgress } from "@/lib/progress/use-progress";

/** Progress in every available module, plus lab experiments explored. Saved on this device. */
export function ProgressOverview() {
  const { state } = useProgress();
  const available = MODULES.filter((m) => m.status === "available");
  const explored = EXPERIMENTS.filter((e) => state.experiments[e.slug]).length;
  const quizzes = Object.keys(state.quizResults).length;
  const challenges = Object.values(state.challenges).filter((c) => c.completedAt).length;

  return (
    <div className="panel-raised rounded-2xl p-5 sm:p-6">
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {available.map((m) => (
          <li key={m.slug}>
            <p className="font-mono text-xs text-ink-subtle">Module {m.number}</p>
            <Link href={`/learn/${m.slug}`} className="group mt-1 flex items-center justify-between gap-2 font-semibold text-ink hover:text-cyan">
              {m.title}
              <ArrowRight className="size-4 shrink-0 text-ink-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-cyan" aria-hidden="true" />
            </Link>
            <ModuleProgress module={m} className="mt-3" />
          </li>
        ))}
      </ul>
      <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-4 text-center">
        {[
          { label: "lab experiments explored", value: `${explored}/${EXPERIMENTS.length}` },
          { label: "quizzes and checks taken", value: String(quizzes) },
          { label: "challenges completed", value: String(challenges) },
        ].map((item) => (
          <div key={item.label}>
            <dt className="text-xs text-ink-subtle">{item.label}</dt>
            <dd className="font-mono text-lg text-ink">{item.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-center text-xs text-ink-subtle">Progress is saved in this browser — no account needed.</p>
    </div>
  );
}
