"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck, CircleX } from "lucide-react";
import { GATE_INFO, evaluateGate, gateInputCount, invert, rowIndex, truthTable, type Bit, type GateType } from "@/lib/logic";
import { cn } from "@/lib/cn";
import { GateInput } from "./GateInput";
import { GateOutput } from "./GateOutput";
import { LogicCircuitView } from "./LogicCircuitView";
import { TruthTable } from "./TruthTable";

const LABELS = ["A", "B", "C"] as const;

interface GateDemoProps {
  type: GateType;
  /** Show the plain-English rule. Default true. */
  showRule?: boolean;
}

/**
 * Everything about one gate in one place: its symbol in a live circuit, input
 * switches, the output, and the truth table with the current row highlighted.
 */
export function GateDemo({ type, showRule = true }: GateDemoProps) {
  const count = gateInputCount(type);
  const [inputs, setInputs] = useState<Bit[]>(Array.from({ length: count }, () => 0 as Bit));
  const output = evaluateGate(type, inputs);
  const labels = LABELS.slice(0, count);
  const values: Record<string, Bit> = Object.fromEntries([...labels.map((l, i) => [l, inputs[i]!]), ["gate", output]]);
  const toggle = (i: number) => setInputs((prev) => prev.map((v, j) => (j === i ? invert(v) : v)));
  const ys = count === 1 ? [80] : [48, 112];

  return (
    <div>
      <div className="grid grid-cols-1 gap-px bg-line lg:grid-cols-[1.4fr_1fr]">
        <div className="bg-logic-grid p-3 sm:p-5">
          <LogicCircuitView
            inputs={labels.map((l, i) => ({ id: l, label: l, x: 60, y: ys[i]! }))}
            gates={[{ id: "gate", type, x: 210, y: 80, inputs: [...labels] }]}
            outputs={[{ id: "out", label: "OUT", x: 340, y: 80, source: "gate" }]}
            values={values}
            onToggleInput={(id) => toggle(labels.indexOf(id as (typeof LABELS)[number]))}
            width={400}
            height={160}
            title={`${GATE_INFO[type].name} circuit`}
            description={`Inputs ${labels.map((l, i) => `${l} = ${inputs[i]}`).join(", ")}. Output = ${output}.`}
            className="mx-auto max-w-xl"
          />
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
            {labels.map((l, i) => (
              <GateInput key={l} label={l} value={inputs[i]!} onToggle={() => toggle(i)} />
            ))}
            <GateOutput label="Output" value={output} />
          </div>
        </div>
        <div className="bg-surface-raised p-4 sm:p-5">
          <p className="eyebrow text-ink-subtle">Truth table</p>
          <TruthTable
            inputLabels={labels}
            outputLabels={["OUT"]}
            rows={truthTable(count, (bits) => evaluateGate(type, bits))}
            activeRow={rowIndex(inputs)}
            onSelectRow={setInputs}
            caption={`${GATE_INFO[type].name} truth table`}
            className="mt-2"
          />
          {showRule ? (
            <p className="mt-4 rounded-lg border border-logic/30 bg-logic/5 p-3 text-sm text-ink">
              <span className="font-semibold text-logic">{type}: </span>
              {GATE_INFO[type].rule}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/**
 * Predict-then-check practice: shows an input combination, the learner
 * predicts the output, then sees whether they were right.
 */
export function GatePredict({ type }: { type: GateType }) {
  const count = gateInputCount(type);
  const rows = truthTable(count, (bits) => evaluateGate(type, bits));
  // Visit the rows in a fixed, non-obvious order.
  const order = count === 1 ? [1, 0] : [3, 0, 2, 1];
  const [step, setStep] = useState(0);
  const [guess, setGuess] = useState<Bit | null>(null);
  const [score, setScore] = useState(0);
  const done = step >= order.length;
  const row = rows[order[Math.min(step, order.length - 1)]!]!;
  const correct = guess !== null && guess === row.outputs[0];

  const choose = (value: Bit) => {
    if (guess !== null) return;
    setGuess(value);
    if (value === row.outputs[0]) setScore((s) => s + 1);
  };

  return (
    <div className="p-4 sm:p-5">
      {done ? (
        <div className="flex flex-col items-start gap-3">
          <p className="text-lg font-semibold text-ink" role="status">
            You predicted {score} of {order.length} correctly.
          </p>
          <button
            type="button"
            onClick={() => {
              setStep(0);
              setGuess(null);
              setScore(0);
            }}
            className="min-h-11 rounded-lg border border-line-strong px-4 text-sm font-medium text-ink hover:border-logic/60"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="flex items-center gap-3 font-mono text-2xl">
            {row.inputs.map((v, i) => (
              <span key={i} className="flex flex-col items-center">
                <span className="text-xs text-ink-subtle">{LABELS[i]}</span>
                <span className={cn("flex size-12 items-center justify-center rounded-lg border-2 font-bold", v ? "border-logic text-logic" : "border-line-strong text-ink-subtle")}>{v}</span>
              </span>
            ))}
            <span className="text-ink-subtle" aria-hidden="true">→</span>
            <span className="flex flex-col items-center">
              <span className="text-xs text-ink-subtle">{type}</span>
              <span className="flex size-12 items-center justify-center rounded-lg border-2 border-dashed border-clock font-bold text-clock">{guess === null ? "?" : row.outputs[0]}</span>
            </span>
          </div>
          <div>
            <p className="text-sm text-ink" id={`predict-${type}`}>
              Prediction {step + 1} of {order.length}: what does the {type} gate output?
            </p>
            <div className="mt-2 flex gap-2" role="group" aria-labelledby={`predict-${type}`}>
              {([0, 1] as Bit[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  disabled={guess !== null}
                  onClick={() => choose(v)}
                  className={cn(
                    "min-h-12 min-w-16 rounded-lg border-2 font-mono text-xl font-bold transition-colors disabled:cursor-default",
                    guess === v ? (correct ? "border-positive bg-positive/10 text-positive" : "border-negative bg-negative/10 text-negative") : "border-line-strong text-ink hover:border-logic/60",
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
            <AnimatePresence>
              {guess !== null ? (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-3 flex flex-wrap items-center gap-3">
                  <p className="flex items-center gap-2 text-sm text-ink-muted" role="status">
                    {correct ? <CircleCheck className="size-4 text-positive" aria-hidden="true" /> : <CircleX className="size-4 text-negative" aria-hidden="true" />}
                    {correct ? "Correct" : "Not quite"} — {row.inputs.join(" ")} gives {row.outputs[0]}. {GATE_INFO[type].rule}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStep((s) => s + 1);
                      setGuess(null);
                    }}
                    className="min-h-10 rounded-lg bg-logic px-3 text-sm font-semibold text-void hover:bg-logic-soft"
                  >
                    {step === order.length - 1 ? "Finish" : "Next"}
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
