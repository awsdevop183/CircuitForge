/**
 * Learner progress.
 *
 * The UI only talks to the `ProgressStore` interface. Today it is backed by
 * localStorage; later an account-backed store (API + database) can implement
 * the same interface without touching any component.
 */
export interface ProgressState {
  /** Lesson key (`module/lesson`) → ISO timestamp of completion. */
  completedLessons: Readonly<Record<string, string>>;
}

export interface ProgressStore {
  getSnapshot(): ProgressState;
  getServerSnapshot(): ProgressState;
  subscribe(listener: () => void): () => void;
  markLessonComplete(key: string): void;
  markLessonIncomplete(key: string): void;
  reset(): void;
}

export const EMPTY_PROGRESS: ProgressState = { completedLessons: {} };
