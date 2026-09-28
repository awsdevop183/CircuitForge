"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Target } from "lucide-react";
import { cn } from "@/lib/cn";

export interface Challenge {
  id: string;
  prompt: string;
  /** Whether the current experiment state satisfies the challenge. */
  satisfied: boolean;
}

/**
 * Goals for an experiment. A challenge completes the first time its condition
 * is met and stays completed.
 */
export function ChallengeList({ challenges }: { challenges: readonly Challenge[] }) {
  const [completed, setCompleted] = useState<ReadonlySet<string>>(new Set());

  // Record newly met goals during render (React's "adjust state on prop change" pattern).
  const newlySatisfied = challenges.filter((c) => c.satisfied && !completed.has(c.id)).map((c) => c.id);
  if (newlySatisfied.length > 0) {
    setCompleted(new Set([...completed, ...newlySatisfied]));
  }

  const doneCount = challenges.filter((c) => completed.has(c.id)).length;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-semibold text-ink">
          <Target className="size-4 text-amber" aria-hidden="true" />
          Challenges
        </p>
        <p className="font-mono text-xs text-ink-subtle" aria-live="polite">
          {doneCount}/{challenges.length} complete
        </p>
      </div>
      <ul className="space-y-2">
        {challenges.map((challenge) => {
          const done = completed.has(challenge.id);
          return (
            <li
              key={challenge.id}
              className={cn(
                "flex items-start gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors",
                done ? "border-positive/35 bg-positive/5 text-ink" : "border-line bg-void/40 text-ink-muted",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border",
                  done ? "border-positive bg-positive text-void" : "border-line-strong",
                )}
                aria-hidden="true"
              >
                <AnimatePresence>
                  {done ? (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Check className="size-3.5" strokeWidth={3} />
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </span>
              <span>
                {challenge.prompt}
                <span className="sr-only">{done ? " (completed)" : " (not yet completed)"}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
