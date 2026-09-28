import type { ComponentType, ReactNode } from "react";
import type { SafetyTopic } from "@/components/ui/SafetyNotice";

/**
 * Every lesson follows the same learning loop:
 * Concept → Visual Explanation → Interactive Experiment → Real-World Example → Quick Check → Next Concept
 */
export type LessonStage = "concept" | "visual" | "experiment" | "real-world" | "quick-check" | "next";

export interface LessonSection {
  /** Anchor id, unique within the lesson. */
  id: string;
  stage: Exclude<LessonStage, "quick-check" | "next">;
  title: string;
  content: ReactNode;
}

/** A real-world analogy. Every analogy breaks down somewhere — say where. */
export interface LessonAnalogy {
  title: string;
  content: ReactNode;
  /** Where the analogy stops matching real electricity. */
  limits?: string[];
}

export type QuestionType = "multiple-choice" | "true-false" | "identify" | "predict";

export interface QuizOption {
  id: string;
  label: string;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  /** Optional diagram shown with the question (e.g. "identify this symbol"). */
  visual?: ReactNode;
  options: QuizOption[];
  correctOptionId: string;
  /** Shown after answering — explains *why* the answer is right. */
  explanation: string;
}

export interface NextConcept {
  title: string;
  description: string;
  href: string;
  cta: string;
}

/** A place the learner will meet this component in everyday life. */
export interface WhereFound {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" }>;
  place: string;
  detail: string;
}

export interface BeginnerMistake {
  mistake: string;
  /** What goes wrong. */
  consequence?: string;
  fix: string;
}

export interface LessonContent {
  moduleSlug: string;
  lessonSlug: string;
  /** The one thing the learner should be able to do after this lesson. */
  objective: string;
  /** Supporting goals (optional). */
  objectives?: string[];
  /** What the learner should already know — earlier lessons in the module. */
  buildsOn?: string[];
  sections: LessonSection[];
  analogy: LessonAnalogy;
  /** The single most important idea of the lesson. */
  keyTakeaway: string;
  /** A short recap list. */
  takeaways: string[];
  /** "Where you'll find it" — shown before the summary. */
  whereFound?: WhereFound[];
  /** "Common beginner mistakes" — shown prominently before the summary. */
  mistakes?: BeginnerMistake[];
  /** Safety reminders shown with the mistakes. */
  safety?: SafetyTopic[];
  quickCheck: QuizQuestion[];
  next: NextConcept;
}
