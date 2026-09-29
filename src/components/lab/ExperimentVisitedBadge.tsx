"use client";

import { CircleCheck } from "lucide-react";
import { useProgress } from "@/lib/progress/use-progress";

/** "Explored" marker for experiments the learner has opened. */
export function ExperimentVisitedBadge({ slug }: { slug: string }) {
  const { hasVisitedExperiment } = useProgress();
  if (!hasVisitedExperiment(slug)) return null;
  return (
    <span className="inline-flex items-center gap-1 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-positive">
      <CircleCheck className="size-3.5" aria-hidden="true" />
      Explored
    </span>
  );
}
