"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Play, RotateCcw, Trophy } from "lucide-react";
import { QuizQuestionCard } from "./QuizQuestionCard";
import type { QuizQuestion } from "@/content/lessons/types";
import { useProgress } from "@/lib/progress/use-progress";
import { cn } from "@/lib/cn";

interface QuizProps {
  /** Shown on the start screen. */
  title: string;
  intro: string;
  questions: readonly QuizQuestion[];
  /** Progress key for the best score, e.g. "games/symbol-trainer". */
  progressKey: string;
  /** How many questions per round (default: all). */
  roundLength?: number;
  /** Offer a choice of round lengths on the start screen, e.g. [15, 32]. Overrides roundLength. */
  roundOptions?: readonly number[];
  /** Accent for the start button, default cyan. */
  accent?: "cyan" | "logic";
}

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

/**
 * A one-question-at-a-time game. Questions and options are shuffled when a
 * round starts (on click, so server and client render the same start screen),
 * and every answer is explained before moving on.
 */
export function Quiz({ title, intro, questions, progressKey, roundLength, roundOptions, accent = "cyan" }: QuizProps) {
  const { quizResult, recordQuizResult } = useProgress();
  const best = quizResult(progressKey);
  const [round, setRound] = useState<QuizQuestion[] | null>(null);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const [length, setLength] = useState(roundOptions?.[0] ?? roundLength ?? questions.length);
  const primary = accent === "logic" ? "bg-logic text-void hover:bg-logic-soft" : "bg-cyan text-void hover:bg-cyan-soft";

  const start = () => {
    const chosen = shuffle(questions).slice(0, length);
    setRound(chosen.map((q) => ({ ...q, options: q.type === "true-false" ? q.options : shuffle(q.options) })));
    setIndex(0);
    setPicked(null);
    setScore(0);
    setFinished(false);
  };

  if (!round) {
    return (
      <div className="flex flex-col items-start gap-4 p-5 sm:p-8">
        <h2 className="text-2xl font-semibold text-ink">{title}</h2>
        <p className="max-w-xl text-ink-muted">{intro}</p>
        {roundOptions ? (
          <div role="radiogroup" aria-label="Round length" className="flex flex-wrap gap-2">
            {roundOptions.map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={length === n}
                onClick={() => setLength(n)}
                className={cn("min-h-11 rounded-lg border px-4 text-sm font-medium", length === n ? "border-cyan/60 bg-cyan/10 text-ink" : "border-line-strong text-ink-muted hover:text-ink")}
              >
                {n === questions.length ? `All ${n} questions` : `${n} random questions`}
              </button>
            ))}
          </div>
        ) : null}
        <p className="font-mono text-sm text-ink-subtle">
          {length} questions · random order
          {best ? ` · last score ${best.correct}/${best.total}` : ""}
        </p>
        <button type="button" onClick={start} className={cn("inline-flex min-h-11 items-center gap-2 rounded-lg px-5 text-sm font-semibold", primary)}>
          <Play className="size-4" aria-hidden="true" />
          Start
        </button>
      </div>
    );
  }

  if (finished) {
    const perfect = score === round.length;
    return (
      <div className="flex flex-col items-center gap-4 p-8 text-center">
        <Trophy className={cn("size-12", perfect ? "text-amber" : "text-ink-subtle")} aria-hidden="true" />
        <h2 className="text-2xl font-semibold text-ink" role="status">
          You scored {score} / {round.length}
        </h2>
        <p className="max-w-md text-ink-muted">
          {perfect
            ? "Perfect round! You can recognise these without thinking."
            : score >= round.length * 0.7
              ? "Great work. Play again to lock in the ones you missed."
              : "Every round makes these more familiar. Read the explanations and try again."}
        </p>
        <button type="button" onClick={start} className={cn("inline-flex min-h-11 items-center gap-2 rounded-lg px-5 text-sm font-semibold", primary)}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Play again
        </button>
      </div>
    );
  }

  const question = round[index]!;
  const answered = picked !== null;
  const last = index === round.length - 1;

  const choose = (optionId: string) => {
    if (answered) return;
    setPicked(optionId);
    const nextScore = score + (optionId === question.correctOptionId ? 1 : 0);
    setScore(nextScore);
    if (last) recordQuizResult(progressKey, nextScore, round.length);
  };

  const advance = () => {
    if (last) {
      setFinished(true);
      return;
    }
    setIndex(index + 1);
    setPicked(null);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-xs text-ink-subtle">
          Question {index + 1} / {round.length}
          {question.topic ? <span className="text-clock"> · {question.topic}</span> : null}
        </p>
        <p className="font-mono text-xs text-ink-subtle">Score {score}</p>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
        <motion.div className={cn("h-full origin-left rounded-full", accent === "logic" ? "bg-logic" : "bg-cyan")} initial={false} animate={{ scaleX: (index + (answered ? 1 : 0)) / round.length }} />
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={question.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }} className="mt-5">
          <QuizQuestionCard
            question={question}
            selected={picked}
            onSelect={choose}
            footer={
              <button type="button" onClick={advance} autoFocus className={cn("inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-lg px-4 text-sm font-semibold", primary)}>
                {last ? "See your score" : "Next question"}
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            }
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
