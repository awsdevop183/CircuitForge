"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck, Lock, Play, Trophy } from "lucide-react";
import { StatusBanner } from "@/components/component-lab/StatusBanner";
import { GATE_INFO, GATE_TYPES, evaluateGate, halfAdder, invert, truthTable, type Bit, type GateType } from "@/lib/logic";
import { useProgress } from "@/lib/progress/use-progress";
import { cn } from "@/lib/cn";
import { GateInput } from "./GateInput";
import { LogicCircuitView } from "./LogicCircuitView";
import { TruthTable } from "./TruthTable";

export const BUILD_THE_LOGIC_ID = "digital/build-the-logic";
export const levelId = (n: number) => `${BUILD_THE_LOGIC_ID}/level-${n}`;

interface Level {
  title: string;
  goal: string;
  inputs: string[];
  outputs: string[];
  /** Target outputs for each input combination. */
  target: (bits: Bit[]) => Bit[];
  explanation: string;
}

export const LEVELS: readonly Level[] = [
  { title: "A AND B", goal: "The output is ON only when A and B are both ON.", inputs: ["A", "B"], outputs: ["OUT"], target: ([a, b]) => [evaluateGate("AND", [a!, b!])], explanation: "AND outputs 1 only when every input is 1." },
  { title: "A OR B", goal: "The output is ON when A is ON, B is ON, or both.", inputs: ["A", "B"], outputs: ["OUT"], target: ([a, b]) => [evaluateGate("OR", [a!, b!])], explanation: "OR outputs 1 when at least one input is 1." },
  { title: "NOT A", goal: "The output is ON only when A is OFF.", inputs: ["A"], outputs: ["OUT"], target: ([a]) => [invert(a!)], explanation: "NOT flips its input. (With both inputs tied to A, NAND and NOR also act as NOT — that's part of why they're called universal gates.)" },
  { title: "A XOR B", goal: "The output is ON when exactly one of A and B is ON.", inputs: ["A", "B"], outputs: ["OUT"], target: ([a, b]) => [evaluateGate("XOR", [a!, b!])], explanation: "XOR outputs 1 when its inputs are different." },
  {
    title: "Build a half adder",
    goal: "Add A + B: SUM is the 1s bit and CARRY is the 2s bit. Pick one gate for each output.",
    inputs: ["A", "B"],
    outputs: ["SUM", "CARRY"],
    target: ([a, b]) => {
      const r = halfAdder(a!, b!);
      return [r.sum, r.carry];
    },
    explanation: "SUM = XOR (1 + 0 = 1, but 1 + 1 = 10 has a 0 in the 1s place) and CARRY = AND (only 1 + 1 carries).",
  },
];

/** Output of the learner's chosen gate. A single-input level ties both pins of a 2-input gate to A. */
function run(gate: GateType, bits: Bit[]): Bit {
  return bits.length === 1 && gate !== "NOT" ? evaluateGate(gate, [bits[0]!, bits[0]!]) : evaluateGate(gate, bits);
}

/**
 * "Build the Logic": five progressively harder targets. Pick gates, try the
 * inputs, then test against every row of the target truth table.
 */
export function BuildTheLogic() {
  const { challengeResult, recordChallengeAttempt } = useProgress();
  const [levelIndex, setLevelIndex] = useState(0);
  const [choice, setChoice] = useState<(GateType | null)[]>([null, null]);
  const [inputs, setInputs] = useState<Bit[]>([0, 0]);
  const [result, setResult] = useState<{ ok: boolean; mismatched: number[] } | null>(null);

  const solved = (n: number) => Boolean(challengeResult(levelId(n))?.completedAt);
  const unlocked = (n: number) => n === 0 || solved(n - 1);
  const level = LEVELS[levelIndex]!;
  const outputsCount = level.outputs.length;
  const chosen = choice.slice(0, outputsCount);
  const bits = inputs.slice(0, level.inputs.length);
  const complete = chosen.every((g) => g !== null);
  const allDone = LEVELS.every((_, i) => solved(i));

  const selectLevel = (n: number) => {
    setLevelIndex(n);
    setChoice([null, null]);
    setInputs([0, 0]);
    setResult(null);
  };
  const pick = (slot: number, gate: GateType) => {
    setChoice((c) => c.map((g, i) => (i === slot ? gate : g)));
    setResult(null);
  };

  const yours = truthTable(level.inputs.length, (b) => chosen.map((g) => (g ? run(g, b) : 0)));
  const target = truthTable(level.inputs.length, level.target);

  const test = () => {
    if (!complete) return;
    const mismatched = yours.map((row, i) => (row.outputs.some((v, j) => v !== target[i]!.outputs[j]) ? i : -1)).filter((i) => i >= 0);
    const ok = mismatched.length === 0;
    setResult({ ok, mismatched });
    recordChallengeAttempt(levelId(levelIndex), ok);
    if (ok && LEVELS.every((_, i) => i === levelIndex || solved(i))) recordChallengeAttempt(BUILD_THE_LOGIC_ID, true);
  };

  const values: Record<string, Bit> = { ...Object.fromEntries(level.inputs.map((id, i) => [id, bits[i]!])) };
  chosen.forEach((g, i) => (values[`g${i}`] = g ? run(g, bits) : 0));
  const single = level.inputs.length === 1;

  return (
    <div>
      {/* Level picker */}
      <ol className="flex flex-wrap gap-2 border-b border-line p-4 sm:p-5" aria-label="Levels">
        {LEVELS.map((l, i) => (
          <li key={l.title}>
            <button
              type="button"
              disabled={!unlocked(i)}
              aria-current={i === levelIndex ? "step" : undefined}
              onClick={() => selectLevel(i)}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                i === levelIndex ? "border-logic/70 bg-logic/10 text-logic" : "border-line-strong text-ink-muted hover:text-ink",
              )}
            >
              {solved(i) ? <CircleCheck className="size-4 text-positive" aria-hidden="true" /> : !unlocked(i) ? <Lock className="size-3.5" aria-hidden="true" /> : null}
              {i + 1}. {l.title}
              {solved(i) ? <span className="sr-only">(solved)</span> : !unlocked(i) ? <span className="sr-only">(locked)</span> : null}
            </button>
          </li>
        ))}
      </ol>

      <div className="border-b border-line p-4 sm:p-5">
        <p className="eyebrow text-clock">Challenge {levelIndex + 1}</p>
        <p className="mt-1 text-lg font-semibold text-ink">{level.goal}</p>
      </div>

      <div className="grid grid-cols-1 gap-px bg-line lg:grid-cols-[1.4fr_1fr]">
        <div className="bg-logic-grid p-3 sm:p-5">
          <LogicCircuitView
            inputs={level.inputs.map((id, i) => ({ id, label: id, x: 60, y: single ? 90 : outputsCount === 2 ? [50, 150][i]! : [60, 120][i]! }))}
            gates={chosen.map((g, i) => ({ id: `g${i}`, type: g ?? "AND", x: 230, y: outputsCount === 2 ? [60, 150][i]! : 90, inputs: single ? ["A", "A"] : level.inputs, hidden: g === null }))}
            outputs={level.outputs.map((id, i) => ({ id, label: id, x: 380, y: outputsCount === 2 ? [60, 150][i]! : 90, source: `g${i}` }))}
            values={values}
            onToggleInput={(id) => setInputs((prev) => prev.map((v, i) => (level.inputs[i] === id ? invert(v) : v)))}
            width={480}
            height={outputsCount === 2 ? 200 : 180}
            minWidth={400}
            title={`Challenge ${levelIndex + 1} circuit`}
            description={`Chosen: ${chosen.map((g, i) => `${level.outputs[i]} ← ${g ?? "no gate yet"}`).join(", ")}.`}
          />
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            {level.inputs.map((id, i) => (
              <GateInput key={id} label={id} value={bits[i]!} onToggle={() => setInputs((prev) => prev.map((v, j) => (j === i ? invert(v) : v)))} />
            ))}
          </div>
          {level.outputs.map((out, slot) => (
            <div key={out} className="mt-4" role="group" aria-label={`Choose the gate for ${out}`}>
              <p className="text-sm font-medium text-ink-muted">
                Gate for <span className="font-mono font-bold text-ink">{out}</span>:
              </p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {GATE_TYPES.map((g) => (
                  <button
                    key={g}
                    type="button"
                    aria-pressed={chosen[slot] === g}
                    aria-label={GATE_INFO[g].name}
                    onClick={() => pick(slot, g)}
                    className={cn("min-h-11 min-w-16 rounded-lg border-2 px-2 font-mono text-sm font-bold transition-colors", chosen[slot] === g ? "border-logic bg-logic/15 text-logic" : "border-line-strong text-ink hover:border-logic/50")}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={test}
            disabled={!complete}
            className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-xl bg-logic px-5 font-semibold text-void hover:bg-logic-soft disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Play className="size-4" aria-hidden="true" />
            {complete ? "Test every combination" : "Pick a gate first"}
          </button>
        </div>
        <div className="space-y-4 bg-surface-raised p-4 sm:p-5">
          <div>
            <p className="eyebrow text-ink-subtle">Target behaviour</p>
            <TruthTable inputLabels={level.inputs} outputLabels={level.outputs} rows={target} caption="Target truth table" className="mt-2" />
          </div>
          {complete ? (
            <div>
              <p className="eyebrow text-ink-subtle">Your circuit</p>
              <TruthTable inputLabels={level.inputs} outputLabels={level.outputs} rows={yours} mismatched={result?.mismatched} caption="Your circuit's truth table" className="mt-2" />
            </div>
          ) : null}
        </div>
      </div>

      <div className="border-t border-line p-4 sm:p-5" aria-live="polite">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div key={`${levelIndex}-${result.ok}-${chosen.join()}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {result.ok ? (
                <StatusBanner level="ok" title={`Challenge ${levelIndex + 1} solved!`}>
                  {" "}
                  {level.explanation}
                  {levelIndex < LEVELS.length - 1 ? (
                    <button type="button" onClick={() => selectLevel(levelIndex + 1)} className="ml-2 font-semibold text-logic underline">
                      Next challenge →
                    </button>
                  ) : null}
                </StatusBanner>
              ) : (
                <StatusBanner level="caution" title={`Not yet: ${result.mismatched.length} of ${target.length} rows don't match.`}>
                  {" "}The red rows in your table differ from the target. Compare them, then try a different gate.
                </StatusBanner>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
        {allDone ? (
          <p className="mt-4 flex items-center gap-2 font-semibold text-amber">
            <Trophy className="size-5" aria-hidden="true" /> All five challenges complete — you built an adder from logic gates.
          </p>
        ) : null}
      </div>
    </div>
  );
}
