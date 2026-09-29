import type { QuizQuestion } from "./lessons/types";
import { DIGITAL_QUIZ } from "./digital-quiz";

export interface ModuleQuiz {
  moduleSlug: string;
  title: string;
  intro: string;
  questions: readonly QuizQuestion[];
  /** Round lengths offered on the start screen. */
  roundOptions: readonly number[];
}

/** End-of-module quizzes, served at /quiz/[moduleSlug]. Scores are saved as quiz/[moduleSlug]. */
export const MODULE_QUIZZES: Readonly<Record<string, ModuleQuiz>> = {
  "digital-electronics": {
    moduleSlug: "digital-electronics",
    title: "Digital Electronics quiz",
    intro:
      "Analog vs digital, binary, logic levels, gates, truth tables, XOR/XNOR, adders, flip-flops and registers. Some questions have circuits you can toggle. Every answer is explained.",
    questions: DIGITAL_QUIZ,
    roundOptions: [15, DIGITAL_QUIZ.length],
  },
};
