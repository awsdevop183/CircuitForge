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

  return {
    state,
    isComplete,
    countComplete,
    markLessonComplete: progressStore.markLessonComplete,
    markLessonIncomplete: progressStore.markLessonIncomplete,
    reset: progressStore.reset,
  };
}
