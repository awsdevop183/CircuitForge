"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck, CircleX, RotateCcw } from "lucide-react";
import type { QuestionType, QuizQuestion } from "@/content/lessons/types";
import { cn } from "@/lib/cn";

const TYPE_LABELS: Record<QuestionType, string> = {
  "multiple-choice": "Multiple choice",
  "true-false": "True or false",
  identify: "Identify it",
  predict: "Predict what happens",
};

interface KnowledgeCheckProps {
  questions: readonly QuizQuestion[];
  /** Called once every question has an answer, with the score. */
  onComplete?: (correct: number, total: number) => void;
}

/**
 * End-of-lesson questions. After each answer the correct option is revealed
 * and explained — right or wrong, the learner always sees *why*.
 */
export function KnowledgeCheck({ questions, onComplete }: KnowledgeCheckProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const score = (candidate: Record<string, string>) =>
    questions.filter((q) => candidate[q.id] === q.correctOptionId).length;
  const answeredCount = questions.filter((q) => answers[q.id] !== undefined).length;
  const finished = answeredCount === questions.length;

  const select = (questionId: string, optionId: string) => {
    if (answers[questionId] !== undefined) return;
    const next = { ...answers, [questionId]: optionId };
    setAnswers(next);
    if (Object.keys(next).length === questions.length) onComplete?.(score(next), questions.length);
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
        />
      ))}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-sm text-ink-subtle" aria-live="polite">
          {finished ? (
            <>
              Score: <span className="text-ink">{score(answers)}</span> / {questions.length}
              {score(answers) === questions.length ? " — perfect!" : " — read the explanations, then try again."}
            </>
          ) : (
            `${answeredCount} of ${questions.length} answered`
          )}
        </p>
        {answeredCount > 0 ? (
          <button
            type="button"
            onClick={() => setAnswers({})}
            className="inline-flex min-h-10 items-center gap-2 self-start rounded-lg border border-line-strong px-3 text-sm font-medium text-ink hover:border-cyan/60"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Retake questions
          </button>
        ) : null}
      </div>
    </div>
  );
}

interface QuestionCardProps {
  index: number;
  question: QuizQuestion;
  selected?: string;
  onSelect: (optionId: string) => void;
}

function QuestionCard({ index, question, selected, onSelect }: QuestionCardProps) {
  const answered = selected !== undefined;
  const correct = selected === question.correctOptionId;
  const correctLabel = question.options.find((o) => o.id === question.correctOptionId)?.label;
  const feedbackId = `${question.id}-feedback`;

  return (
    <fieldset className="panel rounded-2xl p-5 sm:p-6" aria-describedby={answered ? feedbackId : undefined}>
      <legend className="sr-only">
        Question {index + 1}, {TYPE_LABELS[question.type]}: {question.prompt}
      </legend>
      <p className="eyebrow text-amber" aria-hidden="true">
        Q{index + 1} · {TYPE_LABELS[question.type]}
      </p>
      <p className="mt-2 text-lg font-medium text-ink" aria-hidden="true">
        {question.prompt}
      </p>
      {question.visual ? <div className="mt-4 flex justify-center rounded-xl border border-line bg-void/40 p-4">{question.visual}</div> : null}
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
          <motion.div
            id={feedbackId}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <p className="mt-4 border-t border-line pt-4 text-sm leading-relaxed text-ink-muted" role="status">
              <strong className={correct ? "text-positive" : "text-negative"}>
                {correct ? "Correct. " : `Not quite — the answer is “${correctLabel}”. `}
              </strong>
              {question.explanation}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </fieldset>
  );
}
