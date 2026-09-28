/**
 * Learner progress.
 *
 * The UI only talks to the `ProgressStore` interface. Today it is backed by
 * localStorage; later an account-backed store (API + database) can implement
 * the same interface without touching any component.
 */
export interface QuizResult {
  correct: number;
  total: number;
  completedAt: string;
}

export interface ProgressState {
  /** Lesson key (`module/lesson`) → ISO timestamp of completion. */
  completedLessons: Readonly<Record<string, string>>;
  /** Lesson key → most recent knowledge-check result. */
  quizResults: Readonly<Record<string, QuizResult>>;
  /** The lesson the learner opened most recently ("current lesson"). */
  currentLessonKey: string | null;
}

export interface ProgressStore {
  getSnapshot(): ProgressState;
  getServerSnapshot(): ProgressState;
  subscribe(listener: () => void): () => void;
  markLessonComplete(key: string): void;
  markLessonIncomplete(key: string): void;
  recordQuizResult(key: string, correct: number, total: number): void;
  setCurrentLesson(key: string): void;
  reset(): void;
}

export const EMPTY_PROGRESS: ProgressState = {
  completedLessons: {},
  quizResults: {},
  currentLessonKey: null,
};
