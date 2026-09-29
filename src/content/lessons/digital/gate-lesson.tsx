import type { ReactNode } from "react";
import { GateDemo, GatePredict } from "@/components/digital/GateDemo";
import { GateSymbolVisual } from "@/components/digital/QuizVisuals";
import { KeyIdea, Prose, VisualStage } from "@/components/lesson/LessonBlocks";
import { Callout } from "@/components/ui/Callout";
import { GATE_INFO, type GateType } from "@/lib/logic";
import type { LessonContent, LessonSection } from "../types";

interface GateLessonConfig extends Omit<LessonContent, "moduleSlug" | "sections" | "objective"> {
  type: GateType;
  objective?: string;
  /** What the gate is for, in a sentence or two. */
  intro: ReactNode;
  /** Prompt shown above the interactive gate. */
  tryIt: ReactNode;
  /** Extra sections inserted after the interactive (e.g. compositions). */
  extraSections?: LessonSection[];
}

/** One gate symbol + its rule, as a "meet the gate" card. */
function GateCard({ type }: { type: GateType }) {
  return (
    <div className="my-6 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-[auto_1fr]">
      <div className="flex items-center justify-center bg-logic-grid px-8 py-6">
        <GateSymbolVisual type={type} />
      </div>
      <div className="flex flex-col justify-center bg-surface-raised p-5">
        <p className="eyebrow text-ink-subtle">{GATE_INFO[type].name}</p>
        <p className="mt-1 font-display text-xl font-semibold text-logic">{GATE_INFO[type].rule}</p>
        <p className="mt-2 font-mono text-sm text-ink-muted">Written: {GATE_INFO[type].expression}</p>
      </div>
    </div>
  );
}

/**
 * Every gate lesson follows the same loop — meet the symbol, toggle it,
 * read its truth table, then predict — so learners can compare gates easily.
 */
export function gateLesson({ type, objective, intro, tryIt, extraSections = [], ...rest }: GateLessonConfig): LessonContent {
  return {
    moduleSlug: "digital-electronics",
    objective: objective ?? `Predict the output of a ${type} gate for any inputs, and read its truth table.`,
    ...rest,
    sections: [
      {
        id: "meet-the-gate",
        stage: "concept",
        title: `Meet the ${type} gate`,
        content: (
          <>
            <Prose>{intro}</Prose>
            <GateCard type={type} />
          </>
        ),
      },
      {
        id: "toggle-it",
        stage: "experiment",
        title: "Toggle the inputs",
        content: (
          <>
            <Callout kind="try">{tryIt}</Callout>
            <VisualStage>
              <GateDemo type={type} />
            </VisualStage>
            <KeyIdea>
              {type}: {GATE_INFO[type].rule}
            </KeyIdea>
          </>
        ),
      },
      ...extraSections,
      {
        id: "predict",
        stage: "visual",
        title: "Predict, then check",
        content: (
          <>
            <Prose>
              <p>No switches this time: look at the inputs and predict the output before you see it.</p>
            </Prose>
            <VisualStage>
              <GatePredict type={type} />
            </VisualStage>
          </>
        ),
      },
    ],
  };
}
