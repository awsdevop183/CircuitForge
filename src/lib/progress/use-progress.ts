"use client";

import { useCallback, useSyncExternalStore } from "react";
import { createLocalProgressStore } from "./local-store";
import type { ProgressStore } from "./types";

/** The active progress backend. Swap this for an API-backed store when accounts exist. */
const progressStore: ProgressStore = createLocalProgressStore();

export function useProgress() {
  const state = useSyncExternalStore(
    progressStore.subscribe,
    progressStore.getSnapshot,
    progressStore.getServerSnapshot,
  );

  const isComplete = useCallback((key: string) => Boolean(state.completedLessons[key]), [state]);

  const countComplete = useCallback(
    (keys: readonly string[]) => keys.filter((key) => state.completedLessons[key]).length,
    [state],
  );

  const quizResult = useCallback((key: string) => state.quizResults[key], [state]);

  return {
    state,
    isComplete,
    countComplete,
    quizResult,
    currentLessonKey: state.currentLessonKey,
    markLessonComplete: progressStore.markLessonComplete,
    markLessonIncomplete: progressStore.markLessonIncomplete,
    recordQuizResult: progressStore.recordQuizResult,
    setCurrentLesson: progressStore.setCurrentLesson,
    reset: progressStore.reset,
  };
}
