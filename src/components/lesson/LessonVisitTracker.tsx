"use client";

import { useEffect } from "react";
import { useProgress } from "@/lib/progress/use-progress";

/** Records the lesson as the learner's "current lesson" when it is opened. */
export function LessonVisitTracker({ progressKey }: { progressKey: string }) {
  const { setCurrentLesson } = useProgress();
  useEffect(() => {
    setCurrentLesson(progressKey);
  }, [progressKey, setCurrentLesson]);
  return null;
}
