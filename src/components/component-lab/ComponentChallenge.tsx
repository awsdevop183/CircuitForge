"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, Play, RotateCcw, Trophy } from "lucide-react";
import { SeriesCircuit } from "@/components/circuit";
import { CircuitBoardEditor, type TrayItem } from "@/components/lab/CircuitBoardEditor";
import { ModelNote } from "@/components/ui/InteractivePanel";
import { LED_MAX_CURRENT } from "@/lib/circuit-sim";
import { solveBoard, type Board, type BoardPartKind } from "@/lib/series-board";
import { formatAmps } from "@/lib/format";
import { lessonKey } from "@/content/curriculum";
import { useProgress } from "@/lib/progress/use-progress";
import { StatusBanner } from "./StatusBanner";

export const CHALLENGE_ID = "components/component-challenge";

const TRAY: TrayItem[] = [
  { kind: "battery", detail: "9 V" },
  { kind: "switch", detail: "on/off" },
  { kind: "resistor", detail: "470 Ω" },
  { kind: "led", detail: "red" },
  { kind: "wire", detail: "plain link", reusable: true },
  { kind: "capacitor", detail: "100 µF" },
];

const EMPTY: Board = [null, null, null, null];
const SOLUTION: Board = [{ kind: "battery" }, { kind: "switch", closed: false }, { kind: "resistor" }, { kind: "led" }];

type Verdict =
  | { ok: true; current: number }
  | { ok: false; title: string; detail: string; burnt?: boolean; current?: number };

/** Solve the board with every switch set to one position. */
function simulate(board: Board, switchClosed: boolean) {
  const solution = solveBoard(board.map((p) => (p?.kind === "switch" ? { ...p, closed: switchClosed } : p)));
  const led = board.findIndex((p) => p?.kind === "led");
  const state = led >= 0 ? solution.parts[led] : null;
  return { solution, current: solution.current, lit: Boolean(state && state.brightness > 0), burnt: Boolean(state?.burnt) };
}

function judge(board: Board): Verdict {
  const has = (kind: BoardPartKind) => board.some((p) => p?.kind === kind);
  if (board.some((p) => p === null)) {
    return { ok: false, title: "There's a gap in the loop.", detail: "Every slot needs something in it — current needs a complete path. Use a wire if a slot doesn't need a component." };
  }
  if (!has("battery")) return { ok: false, title: "Nothing is pushing the current.", detail: "A circuit needs a source of energy. Place the battery." };
  if (!has("led")) return { ok: false, title: "Where's the LED?", detail: "The goal is to light an LED — place it in the loop." };
  if (has("capacitor")) {
    return { ok: false, title: "The capacitor blocks steady DC.", detail: "A capacitor charges up for a moment, then no more current flows through it. The LED might blink once, then stay dark. Swap it for a wire or a component that conducts." };
  }
  const closed = simulate(board, true);
  if (closed.burnt) {
    return { ok: false, burnt: true, current: closed.current, title: "The LED burnt out!", detail: `Without a resistor, about ${formatAmps(closed.current)} would try to rush through the LED — far more than its ${formatAmps(LED_MAX_CURRENT)} limit. Add the resistor to limit the current.` };
  }
  if (!closed.lit) {
    return { ok: false, title: "The LED stays dark with the switch closed.", detail: "Check its direction: current must enter the anode (the flat side of the triangle) and leave through the cathode (the bar). Try flipping the LED — or the battery." };
  }
  if (!has("switch")) {
    return { ok: false, title: "It lights — but you can't turn it off.", detail: "The challenge says the LED should come on when the switch is closed. Put the switch in the loop so you can open it." };
  }
  const open = simulate(board, false);
  if (open.lit) return { ok: false, title: "The switch doesn't control the LED.", detail: "Make sure the switch is in the same loop as the LED." };
  return { ok: true, current: closed.current };
}

/**
 * Build-it challenge: place a battery, switch, resistor and LED into a loop so
 * the LED lights only when the switch is closed.
 */
export function ComponentChallenge() {
  const { challengeResult, recordChallengeAttempt, markLessonComplete } = useProgress();
  const saved = challengeResult(CHALLENGE_ID);
  const [board, setBoard] = useState<Board>(EMPTY);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [switchClosed, setSwitchClosed] = useState(false);

  const tested = verdict !== null;
  const solved = verdict?.ok === true;
  // Before a successful test, show the circuit as built but idle; after it, the switch is live.
  const view = simulate(board, solved ? switchClosed : false);
  const canReveal = attempts > 0 || Boolean(saved?.attempts);

  const change = (next: Board) => {
    setBoard(next);
    setVerdict(null);
    setSwitchClosed(false);
  };

  const test = () => {
    const result = judge(board);
    setVerdict(result);
    setAttempts((a) => a + 1);
    recordChallengeAttempt(CHALLENGE_ID, result.ok);
    if (result.ok) {
      markLessonComplete(lessonKey("components", "component-challenge"));
      setSwitchClosed(true);
    }
  };

  const reveal = () => {
    setShowSolution(true);
    change(SOLUTION);
  };

  const burntNow = verdict?.ok === false && verdict.burnt === true;
  const shown = burntNow ? simulate(board, true).solution : view.solution;

  return (
    <div>
      <div className="border-b border-line p-4 sm:p-5">
        <p className="text-sm text-ink">
          <strong>Your mission:</strong> you have a battery, an LED, a resistor and a switch. Build a circuit that turns the LED{" "}
          <em>on when the switch is closed</em>.
        </p>
        <p className="mt-1 text-sm text-ink-muted">Pick a part from the box, then choose a slot in the loop. There&apos;s one part you don&apos;t need.</p>
      </div>

      <CircuitBoardEditor board={board} onChange={change} tray={TRAY} />

      <div className="border-t border-line bg-breadboard px-2 py-4 sm:px-6">
        <SeriesCircuit
          board={board.map((p) => (p?.kind === "switch" ? { ...p, closed: solved ? switchClosed : burntNow } : p))}
          solution={shown}
          onToggleSwitch={solved ? () => setSwitchClosed((c) => !c) : undefined}
          title="Challenge circuit"
          caption={solved ? { text: switchClosed ? "SWITCH CLOSED → LED ON" : "SWITCH OPEN → LED OFF", tone: switchClosed ? "cyan" : "amber" } : undefined}
          className="mx-auto max-w-2xl"
        />
      </div>
      <ModelNote>Ideal wires, the LED as a fixed 2 V drop and the capacitor in its charged (DC) state. Real parts behave a little differently.</ModelNote>

      <div className="flex flex-wrap gap-2 border-t border-line p-4 sm:p-5">
        <button type="button" onClick={test} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-cyan px-4 text-sm font-semibold text-void hover:bg-cyan-soft">
          <Play className="size-4" aria-hidden="true" />
          Test my circuit
        </button>
        <button type="button" onClick={() => change(EMPTY)} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line-strong px-4 text-sm font-medium text-ink hover:border-cyan/50">
          <RotateCcw className="size-4" aria-hidden="true" />
          Clear the board
        </button>
        <button
          type="button"
          onClick={reveal}
          disabled={!canReveal}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line-strong px-4 text-sm font-medium text-ink enabled:hover:border-amber/60 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Eye className="size-4" aria-hidden="true" />
          {canReveal ? "Show the solution" : "Solution unlocks after your first test"}
        </button>
        {saved?.completedAt ? (
          <span className="inline-flex items-center gap-1.5 self-center text-sm text-positive">
            <Trophy className="size-4" aria-hidden="true" /> Challenge completed
          </span>
        ) : null}
      </div>

      <div className="border-t border-line p-4 sm:p-5" aria-live="polite">
        <AnimatePresence mode="wait">
          {verdict ? (
            <motion.div key={verdict.ok ? "ok" : verdict.title} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {verdict.ok ? (
                <StatusBanner level="ok" title={showSolution ? "This is a working solution." : "It works — challenge complete!"}>
                  {" "}Flip the switch in the diagram to check it. With the switch closed, {formatAmps(verdict.current)} flows: bright, and safely under the LED&apos;s limit.
                </StatusBanner>
              ) : (
                <StatusBanner level={verdict.burnt ? "danger" : "caution"} title={verdict.title}>
                  {" "}{verdict.detail}
                </StatusBanner>
              )}
            </motion.div>
          ) : tested ? null : (
            <p className="text-sm text-ink-muted">Build your circuit, then press “Test my circuit”.</p>
          )}
        </AnimatePresence>
        {verdict?.ok ? <WhyItWorks current={verdict.current} /> : null}
      </div>
    </div>
  );
}

function WhyItWorks({ current }: { current: number }) {
  return (
    <div className="mt-4 rounded-xl border border-cyan/30 bg-cyan/5 p-4">
      <h3 className="font-semibold text-ink">Why it works</h3>
      <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-ink-muted">
        <li><strong className="text-ink">Battery</strong> — provides the 9 V push. Current leaves its + terminal and returns to −.</li>
        <li><strong className="text-ink">Switch</strong> — closed, it completes the loop; open, it breaks the loop so no current flows anywhere.</li>
        <li><strong className="text-ink">Resistor</strong> — limits the current: (9 V − 2 V) ÷ 470 Ω ≈ {formatAmps(current)}. Without it the LED would burn out.</li>
        <li><strong className="text-ink">LED</strong> — lights when current enters its anode and leaves its cathode. Turned around, it blocks the current.</li>
      </ol>
      <p className="mt-2 text-sm text-ink-muted">
        In a single loop the order doesn&apos;t matter — the same current flows through every part. What matters is a complete loop, the LED&apos;s direction and a resistor to limit current.
      </p>
    </div>
  );
}
