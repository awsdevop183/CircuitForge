"use client";

import { useEffect } from "react";
import { useProgress } from "@/lib/progress/use-progress";

/** Records that the learner has opened a lab experiment. */
export function ExperimentVisitTracker({ slug }: { slug: string }) {
  const { recordExperimentVisit } = useProgress();
  useEffect(() => {
    recordExperimentVisit(slug);
  }, [slug, recordExperimentVisit]);
  return null;
}
