"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck, CircleX, RotateCcw } from "lucide-react";
import type { QuizQuestion } from "@/content/lessons/types";
import { cn } from "@/lib/cn";

interface QuickCheckProps {
  questions: readonly QuizQuestion[];
  /** Called once when every question has been answered correctly. */
  onAllCorrect?: () => void;
}

/** A short self-check. Answers are revealed with an explanation; learners can retry. */
export function QuickCheck({ questions, onAllCorrect }: QuickCheckProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const countCorrect = (candidate: Record<string, string>) =>
    questions.filter((q) => candidate[q.id] === q.correctOptionId).length;
  const correctCount = countCorrect(answers);
  const allCorrect = correctCount === questions.length;

  const select = (questionId: string, optionId: string) => {
    const next = { ...answers, [questionId]: optionId };
    setAnswers(next);
    if (countCorrect(next) === questions.length) onAllCorrect?.();
  };

  return (
    <div className="space-y-5">
      {questions.map((question, index) => (
        <QuestionCard
          key={question.id}
          index={index}
          question={question}
          selected={answers[question.id]}
          onSelect={(optionId) => select(question.id, optionId)}
          onRetry={() =>
            setAnswers((previous) => {
              const { [question.id]: _removed, ...rest } = previous;
              void _removed;
              return rest;
            })
          }
        />
      ))}
      <p className="font-mono text-sm text-ink-subtle" aria-live="polite">
        Score: <span className={allCorrect ? "text-positive" : "text-ink"}>{correctCount}</span> / {questions.length}
        {allCorrect ? " — all correct!" : ""}
      </p>
    </div>
  );
}

interface QuestionCardProps {
  index: number;
  question: QuizQuestion;
  selected?: string;
  onSelect: (optionId: string) => void;
  onRetry: () => void;
}

function QuestionCard({ index, question, selected, onSelect, onRetry }: QuestionCardProps) {
  const answered = selected !== undefined;
  const correct = selected === question.correctOptionId;
  const promptId = `${question.id}-prompt`;

  return (
    <fieldset className="panel rounded-2xl p-5 sm:p-6" aria-describedby={answered ? `${question.id}-feedback` : undefined}>
      <legend id={promptId} className="sr-only">
        Question {index + 1}: {question.prompt}
      </legend>
      <p className="flex gap-3 font-medium text-ink" aria-hidden="true">
        <span className="font-mono text-sm text-cyan">Q{index + 1}</span>
        {question.prompt}
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {question.options.map((option) => {
          const isSelected = selected === option.id;
          const isCorrect = option.id === question.correctOptionId;
          const reveal = answered && (isSelected || (isCorrect && correct));
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
                answered && !reveal && "border-line bg-void/20 text-ink-subtle",
                reveal && isCorrect && "border-positive/60 bg-positive/10 text-ink",
                reveal && !isCorrect && "border-negative/60 bg-negative/10 text-ink",
              )}
            >
              <span>{option.label}</span>
              {reveal ? (
                isCorrect ? (
                  <CircleCheck className="size-5 shrink-0 text-positive" aria-label="Correct" />
                ) : (
                  <CircleX className="size-5 shrink-0 text-negative" aria-label="Incorrect" />
                )
              ) : null}
            </button>
          );
        })}
      </div>
      <AnimatePresence>
        {answered ? (
          <motion.div
            id={`${question.id}-feedback`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-start sm:justify-between">
              <p className="text-sm text-ink-muted" role="status">
                <strong className={correct ? "text-positive" : "text-negative"}>{correct ? "Correct. " : "Not quite. "}</strong>
                {correct ? question.explanation : "Have another look at the visual above, then try again."}
              </p>
              {!correct ? (
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-line-strong px-3 text-sm font-medium text-ink hover:border-cyan/60"
                >
                  <RotateCcw className="size-4" aria-hidden="true" />
                  Try again
                </button>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </fieldset>
  );
}
