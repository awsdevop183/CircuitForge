import { EMPTY_PROGRESS, type ProgressState, type ProgressStore } from "./types";

const STORAGE_KEY = "circuitforge.progress.v1";

function isProgressState(value: unknown): value is ProgressState {
  if (typeof value !== "object" || value === null) return false;
  const completed = (value as { completedLessons?: unknown }).completedLessons;
  return typeof completed === "object" && completed !== null;
}

/** Progress persisted in the browser. Safe to import on the server (no-ops there). */
export function createLocalProgressStore(): ProgressStore {
  let state: ProgressState = EMPTY_PROGRESS;
  let loaded = false;
  const listeners = new Set<() => void>();

  const load = () => {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isProgressState(parsed)) state = parsed;
      }
    } catch {
      // Storage unavailable (private mode, blocked cookies) — progress stays in memory.
    }
  };

  const commit = (next: ProgressState) => {
    state = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore write failures; in-memory state still updates the UI.
    }
    listeners.forEach((listener) => listener());
  };

  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    loaded = false;
    state = EMPTY_PROGRESS;
    load();
    listeners.forEach((listener) => listener());
  };

  return {
    getSnapshot() {
      load();
      return state;
    },
    getServerSnapshot() {
      return EMPTY_PROGRESS;
    },
    subscribe(listener) {
      listeners.add(listener);
      if (listeners.size === 1 && typeof window !== "undefined") {
        window.addEventListener("storage", onStorage);
      }
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0 && typeof window !== "undefined") {
          window.removeEventListener("storage", onStorage);
        }
      };
    },
    markLessonComplete(key) {
      load();
      if (state.completedLessons[key]) return;
      commit({ completedLessons: { ...state.completedLessons, [key]: new Date().toISOString() } });
    },
    markLessonIncomplete(key) {
      load();
      if (!state.completedLessons[key]) return;
      const { [key]: _removed, ...rest } = state.completedLessons;
      void _removed;
      commit({ completedLessons: rest });
    },
    reset() {
      commit(EMPTY_PROGRESS);
    },
  };
}
