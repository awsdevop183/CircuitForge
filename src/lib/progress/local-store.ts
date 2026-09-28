import { EMPTY_PROGRESS, type ProgressState, type ProgressStore } from "./types";

const STORAGE_KEY = "circuitforge.progress.v1";

/** Module slugs renamed since earlier releases, so old progress carries over. */
const RENAMED_MODULES: Readonly<Record<string, string>> = { electricity: "fundamentals" };

function migrateKey(key: string): string {
  const [moduleSlug, ...rest] = key.split("/");
  const renamed = moduleSlug ? RENAMED_MODULES[moduleSlug] : undefined;
  return renamed ? [renamed, ...rest].join("/") : key;
}

function migrateRecord<T>(record: unknown): Record<string, T> {
  if (typeof record !== "object" || record === null) return {};
  return Object.fromEntries(Object.entries(record as Record<string, T>).map(([k, v]) => [migrateKey(k), v]));
}

/** Accept any older/partial shape and return a complete, current ProgressState. */
function normalize(value: unknown): ProgressState {
  if (typeof value !== "object" || value === null) return EMPTY_PROGRESS;
  const raw = value as Partial<Record<keyof ProgressState, unknown>>;
  return {
    completedLessons: migrateRecord<string>(raw.completedLessons),
    quizResults: migrateRecord(raw.quizResults),
    currentLessonKey: typeof raw.currentLessonKey === "string" ? migrateKey(raw.currentLessonKey) : null,
    challenges: migrateRecord(raw.challenges),
  };
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
      if (raw) state = normalize(JSON.parse(raw));
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

  const update = (change: (current: ProgressState) => ProgressState | null) => {
    load();
    const next = change(state);
    if (next) commit(next);
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
      update((s) =>
        s.completedLessons[key] ? null : { ...s, completedLessons: { ...s.completedLessons, [key]: new Date().toISOString() } },
      );
    },
    markLessonIncomplete(key) {
      update((s) => {
        if (!s.completedLessons[key]) return null;
        const completedLessons = { ...s.completedLessons };
        delete completedLessons[key];
        return { ...s, completedLessons };
      });
    },
    recordQuizResult(key, correct, total) {
      update((s) => ({
        ...s,
        quizResults: { ...s.quizResults, [key]: { correct, total, completedAt: new Date().toISOString() } },
      }));
    },
    recordChallengeAttempt(id, solved) {
      update((s) => {
        const previous = s.challenges[id] ?? { attempts: 0, completedAt: null };
        return {
          ...s,
          challenges: {
            ...s.challenges,
            [id]: {
              attempts: previous.attempts + 1,
              completedAt: previous.completedAt ?? (solved ? new Date().toISOString() : null),
            },
          },
        };
      });
    },
    setCurrentLesson(key) {
      update((s) => (s.currentLessonKey === key ? null : { ...s, currentLessonKey: key }));
    },
    reset() {
      commit(EMPTY_PROGRESS);
    },
  };
}
