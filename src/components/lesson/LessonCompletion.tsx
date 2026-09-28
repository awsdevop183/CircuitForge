"use client";

import { CircleCheck, RotateCcw } from "lucide-react";
import type { QuizQuestion } from "@/content/lessons/types";
import { useProgress } from "@/lib/progress/use-progress";
import { Button } from "@/components/ui/Button";
import { QuickCheck } from "./QuickCheck";

interface LessonCompletionProps {
  progressKey: string;
  questions: readonly QuizQuestion[];
}

/** Quick check plus completion state. Answering everything correctly completes the lesson. */
export function LessonCompletion({ progressKey, questions }: LessonCompletionProps) {
  const { isComplete, markLessonComplete, markLessonIncomplete } = useProgress();
  const complete = isComplete(progressKey);

  return (
    <div className="space-y-6">
      <QuickCheck questions={questions} onAllCorrect={() => markLessonComplete(progressKey)} />
      <div
        className={
          complete
            ? "flex flex-col gap-4 rounded-2xl border border-positive/40 bg-positive/5 p-5 sm:flex-row sm:items-center sm:justify-between"
            : "flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"
        }
        role="status"
      >
        <p className="flex items-center gap-3 text-sm text-ink-muted">
          <CircleCheck className={complete ? "size-5 shrink-0 text-positive" : "size-5 shrink-0 text-ink-subtle"} aria-hidden="true" />
          {complete
            ? "Lesson complete — your progress is saved on this device."
            : "Answer every question correctly to complete this lesson, or mark it done yourself."}
        </p>
        {complete ? (
          <Button variant="ghost" size="sm" onClick={() => markLessonIncomplete(progressKey)}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Mark as not done
          </Button>
        ) : (
          <Button variant="secondary" size="sm" onClick={() => markLessonComplete(progressKey)}>
            Mark complete
          </Button>
        )}
      </div>
    </div>
  );
}
