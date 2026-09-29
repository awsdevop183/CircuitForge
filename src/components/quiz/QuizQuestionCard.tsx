"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck, CircleX } from "lucide-react";
import type { QuestionType, QuizQuestion } from "@/content/lessons/types";
import { cn } from "@/lib/cn";

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  "multiple-choice": "Multiple choice",
  "true-false": "True or false",
  identify: "Identify it",
  predict: "Predict what happens",
};

interface QuizQuestionCardProps {
  question: QuizQuestion;
  /** The chosen option, once answered. */
  selected?: string | null;
  onSelect: (optionId: string) => void;
  /** Eyebrow shown above the prompt, e.g. "Q3 · Predict what happens". */
  eyebrow?: ReactNode;
  /** Extra content under the explanation (e.g. a "Next question" button). */
  footer?: ReactNode;
  className?: string;
}

/**
 * The one question renderer used everywhere — lesson knowledge checks, the
 * component games and module quizzes. After an answer it always shows whether
 * it was right, the correct answer, and *why*.
 */
export function QuizQuestionCard({ question, selected, onSelect, eyebrow, footer, className }: QuizQuestionCardProps) {
  const answered = selected !== undefined && selected !== null;
  const correct = selected === question.correctOptionId;
  const correctLabel = question.options.find((o) => o.id === question.correctOptionId)?.label;
  const feedbackId = `${question.id}-feedback`;

  return (
    <fieldset className={className} aria-describedby={answered ? feedbackId : undefined}>
      <legend className="w-full">
        <span className="eyebrow block text-amber">{eyebrow ?? QUESTION_TYPE_LABELS[question.type]}</span>
        <span className="mt-2 block text-lg font-medium text-ink">{question.prompt}</span>
      </legend>
      {question.visual ? <div className="mt-4 flex justify-center rounded-xl border border-line bg-void/40 p-4 sm:p-5">{question.visual}</div> : null}
      <div className={cn("mt-4 grid gap-2", question.type === "true-false" ? "grid-cols-2" : "sm:grid-cols-2")}>
        {question.options.map((option) => {
          const isSelected = selected === option.id;
          const isCorrect = option.id === question.correctOptionId;
          return (
            <button
              key={option.id}
              type="button"
              disabled={answered}
              aria-pressed={isSelected}
              onClick={() => onSelect(option.id)}
              className={cn(
                "flex min-h-12 items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors disabled:cursor-default",
                !answered && "border-line-strong bg-void/40 text-ink hover:border-cyan/60 hover:bg-cyan/5",
                answered && isCorrect && "border-positive/60 bg-positive/10 text-ink",
                answered && isSelected && !isCorrect && "border-negative/60 bg-negative/10 text-ink",
                answered && !isSelected && !isCorrect && "border-line bg-void/20 text-ink-subtle",
              )}
            >
              <span>{option.label}</span>
              {answered && isCorrect ? <CircleCheck className="size-5 shrink-0 text-positive" aria-label="Correct answer" /> : null}
              {answered && isSelected && !isCorrect ? <CircleX className="size-5 shrink-0 text-negative" aria-label="Your answer, incorrect" /> : null}
            </button>
          );
        })}
      </div>
      <AnimatePresence>
        {answered ? (
          <motion.div id={feedbackId} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="text-sm leading-relaxed text-ink-muted" role="status">
                <p className={cn("flex items-center gap-2 font-semibold", correct ? "text-positive" : "text-negative")}>
                  {correct ? <CircleCheck className="size-4" aria-hidden="true" /> : <CircleX className="size-4" aria-hidden="true" />}
                  {correct ? "Correct." : `Not quite — the answer is “${correctLabel}”.`}
                </p>
                <p className="mt-1">
                  <span className="font-semibold text-ink">Why: </span>
                  {question.explanation}
                </p>
              </div>
              {footer}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </fieldset>
  );
}
