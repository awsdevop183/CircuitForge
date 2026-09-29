"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { QUESTION_TYPE_LABELS, QuizQuestionCard } from "@/components/quiz/QuizQuestionCard";
import type { QuizQuestion } from "@/content/lessons/types";

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
        <QuizQuestionCard
          key={question.id}
          question={question}
          eyebrow={`Q${index + 1} · ${QUESTION_TYPE_LABELS[question.type]}`}
          selected={answers[question.id]}
          onSelect={(optionId) => select(question.id, optionId)}
          className="panel rounded-2xl p-5 sm:p-6"
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
