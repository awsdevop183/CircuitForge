import type { ReactNode } from "react";

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

export interface QuizOption {
  id: string;
  label: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
  /** Shown after answering — explains why the answer is right. */
  explanation: string;
}

export interface NextConcept {
  title: string;
  description: string;
  href: string;
  cta: string;
}

export interface LessonContent {
  moduleSlug: string;
  lessonSlug: string;
  /** What the learner will be able to do. */
  objectives: string[];
  sections: LessonSection[];
  takeaways: string[];
  quickCheck: QuizQuestion[];
  next: NextConcept;
}
