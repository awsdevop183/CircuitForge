"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, FlipHorizontal2, Play, RotateCcw, Trophy } from "lucide-react";
import { Battery, Capacitor, CircuitCanvas, CircuitLabel, CurrentFlow, Led, Resistor, Switch, Wire, rectLoop } from "@/components/circuit";
import { PANEL_BACKGROUND } from "@/components/circuit/constants";
import { LED_MAX_CURRENT, RED_LED_FORWARD_VOLTAGE, ledBrightness, solveLoop, type LoopElement } from "@/lib/circuit-sim";
import { formatAmps } from "@/lib/format";
import { lessonKey } from "@/content/curriculum";
import { useProgress } from "@/lib/progress/use-progress";
import { cn } from "@/lib/cn";
import { StatusBanner } from "./StatusBanner";

type PartKind = "battery" | "switch" | "resistor" | "led" | "wire" | "capacitor";
type SlotId = "left" | "top" | "right" | "bottom";

interface Placed {
  kind: PartKind;
  /** Battery / LED turned around relative to clockwise. */
  flipped: boolean;
}

type Board = Record<SlotId, Placed | null>;

export const CHALLENGE_ID = "components/component-challenge";

const SUPPLY = 9;
const RESISTOR_OHMS = 470;

const PARTS: Record<PartKind, { label: string; detail: string; reusable?: boolean }> = {
  battery: { label: "Battery", detail: "9 V" },
  switch: { label: "Switch", detail: "on/off" },
  resistor: { label: "Resistor", detail: "470 Ω" },
  led: { label: "LED", detail: "red" },
  wire: { label: "Wire", detail: "plain link", reusable: true },
  capacitor: { label: "Capacitor", detail: "100 µF" },
};

const TRAY: PartKind[] = ["battery", "switch", "resistor", "led", "wire", "capacitor"];

// Loop order is clockwise: left (upwards), top (rightwards), right (downwards), bottom (leftwards).
const SLOT_ORDER: SlotId[] = ["left", "top", "right", "bottom"];
const LEFT = 80;
const RIGHT = 400;
const TOP = 70;
const BOTTOM = 230;
const MID_X = (LEFT + RIGHT) / 2;
const MID_Y = (TOP + BOTTOM) / 2;
const LOOP = rectLoop(LEFT, TOP, RIGHT, BOTTOM, 14);
const SLOTS: Record<SlotId, { x: number; y: number; rotation: number; label: string }> = {
  left: { x: LEFT, y: MID_Y, rotation: -90, label: "Left side" },
  top: { x: MID_X, y: TOP, rotation: 0, label: "Top" },
  right: { x: RIGHT, y: MID_Y, rotation: 90, label: "Right side" },
  bottom: { x: MID_X, y: BOTTOM, rotation: 180, label: "Bottom" },
};

const EMPTY: Board = { left: null, top: null, right: null, bottom: null };
const SOLUTION: Board = {
  left: { kind: "battery", flipped: false },
  top: { kind: "switch", flipped: false },
  right: { kind: "resistor", flipped: false },
  bottom: { kind: "led", flipped: false },
};

type Verdict =
  | { ok: true; current: number }
  | { ok: false; title: string; detail: string; burnt?: boolean; current?: number };

interface Simulation {
  lit: boolean;
  current: number;
  burnt: boolean;
}

/** Solve the board for one switch position. */
function simulate(board: Board, switchClosed: boolean): Simulation {
  const slots = SLOT_ORDER.map((id) => ({ id, part: board[id] }));
  const batteryIndex = slots.findIndex((s) => s.part?.kind === "battery");
  if (batteryIndex === -1) return { lit: false, current: 0, burnt: false };
  const battery = slots[batteryIndex]!.part!;
  // Walk the loop starting after the battery, in the direction its + terminal pushes.
  const rotated = [...slots.slice(batteryIndex + 1), ...slots.slice(0, batteryIndex)];
  const walk = battery.flipped ? [...rotated].reverse() : rotated;
  const elements: LoopElement[] = walk.map(({ id, part }): LoopElement => {
    if (!part) return { kind: "wire", id, broken: true };
    switch (part.kind) {
      case "switch":
        return { kind: "switch", id, closed: switchClosed };
      case "resistor":
        return { kind: "resistor", id, ohms: RESISTOR_OHMS };
      case "led":
        return { kind: "led", id, forwardVoltage: RED_LED_FORWARD_VOLTAGE, reversed: part.flipped !== battery.flipped };
      case "capacitor":
        // In steady DC a charged capacitor passes no current: effectively a gap.
        return { kind: "wire", id, broken: true };
      default:
        return { kind: "wire", id };
    }
  });
  const hasLed = elements.some((e) => e.kind === "led");
  const solution = solveLoop({ voltage: SUPPLY, internalResistance: 0.5 }, elements);
  const current = solution.status === "flowing" ? solution.current : 0;
  return { lit: hasLed && current > 0, current, burnt: hasLed && current > LED_MAX_CURRENT };
}

function judge(board: Board): Verdict {
  const parts = SLOT_ORDER.map((id) => board[id]);
  const has = (kind: PartKind) => parts.some((p) => p?.kind === kind);
  if (parts.some((p) => p === null)) {
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
  const [selected, setSelected] = useState<PartKind | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [switchClosed, setSwitchClosed] = useState(false);

  const used = (kind: PartKind) => SLOT_ORDER.some((id) => board[id]?.kind === kind);
  const tested = verdict !== null;
  const solved = verdict?.ok === true;
  const live = solved ? simulate(board, switchClosed) : null;
  const canReveal = attempts > 0 || Boolean(saved?.attempts);

  const change = (next: Board) => {
    setBoard(next);
    setVerdict(null);
    setSwitchClosed(false);
  };

  const place = (slot: SlotId) => {
    if (!selected) {
      if (board[slot]) change({ ...board, [slot]: null });
      return;
    }
    const next = { ...board };
    if (!PARTS[selected].reusable) {
      // Moving a single part: take it out of wherever it was.
      for (const id of SLOT_ORDER) if (next[id]?.kind === selected) next[id] = null;
    }
    next[slot] = { kind: selected, flipped: false };
    change(next);
    if (!PARTS[selected].reusable) setSelected(null);
  };

  const flip = (slot: SlotId) => {
    const part = board[slot];
    if (part) change({ ...board, [slot]: { ...part, flipped: !part.flipped } });
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

  const litNow = live?.lit ?? false;
  const burntNow = verdict?.ok === false && verdict.burnt === true;
  const flowing = litNow || burntNow;

  return (
    <div>
      <div className="border-b border-line p-4 sm:p-5">
        <p className="text-sm text-ink">
          <strong>Your mission:</strong> you have a battery, an LED, a resistor and a switch. Build a circuit that turns the LED{" "}
          <em>on when the switch is closed</em>.
        </p>
        <p className="mt-1 text-sm text-ink-muted">Pick a part from the box, then choose a slot in the loop. There&apos;s one part you don&apos;t need.</p>
      </div>

      {/* Parts tray */}
      <div role="group" aria-label="Parts box" className="flex flex-wrap gap-2 border-b border-line p-4 sm:p-5">
        {TRAY.map((kind) => {
          const inUse = !PARTS[kind].reusable && used(kind);
          return (
            <button
              key={kind}
              type="button"
              aria-pressed={selected === kind}
              onClick={() => setSelected((s) => (s === kind ? null : kind))}
              className={cn(
                "flex min-h-11 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors",
                selected === kind ? "border-cyan bg-cyan/15 text-cyan" : "border-line-strong bg-surface text-ink hover:border-cyan/50",
                inUse && selected !== kind && "opacity-60",
              )}
            >
              {PARTS[kind].label}
              <span className="font-mono text-xs text-ink-subtle">{inUse ? "placed" : PARTS[kind].detail}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-breadboard px-2 py-4 sm:px-6">
        <CircuitCanvas
          viewBox="0 0 480 290"
          interactive
          title="Challenge circuit"
          description={SLOT_ORDER.map((id) => `${SLOTS[id].label}: ${board[id] ? PARTS[board[id]!.kind].label : "empty"}`).join(". ")}
          className="mx-auto max-w-2xl"
        >
          <Wire d={LOOP} energized={flowing} />
          <CurrentFlow
            d={LOOP}
            active={flowing}
            speed={burntNow ? 140 : 50}
            direction={SLOT_ORDER.some((id) => board[id]?.kind === "battery" && board[id]!.flipped) ? "electron" : "conventional"}
            color="#f5a524"
          />
          {SLOT_ORDER.map((id) => (
            <SlotPart
              key={id}
              slot={id}
              part={board[id]}
              litBrightness={live ? ledBrightness(live.current) : 0}
              burnt={Boolean(burntNow)}
              switchClosed={switchClosed}
              onToggleSwitch={solved ? () => setSwitchClosed((c) => !c) : undefined}
            />
          ))}
          {solved ? (
            <CircuitLabel x={MID_X} y={BOTTOM + 44} text={switchClosed ? "SWITCH CLOSED → LED ON" : "SWITCH OPEN → LED OFF"} tone={switchClosed ? "cyan" : "amber"} size={13} decorative />
          ) : null}
        </CircuitCanvas>
      </div>

      {/* Slot controls (the accessible way to build) */}
      <ul className="grid gap-2 border-t border-line p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
        {SLOT_ORDER.map((id) => {
          const part = board[id];
          return (
            <li key={id} className="flex items-stretch gap-2">
              <button
                type="button"
                onClick={() => place(id)}
                className={cn(
                  "flex min-h-12 flex-1 flex-col items-start justify-center rounded-lg border px-3 py-1.5 text-left text-sm transition-colors",
                  part ? "border-line-strong bg-surface-raised" : "border-dashed border-line-strong bg-void/40",
                  selected && "hover:border-cyan/60",
                )}
              >
                <span className="text-xs text-ink-subtle">{SLOTS[id].label}</span>
                <span className="font-medium text-ink">
                  {part ? PARTS[part.kind].label : "Empty"}
                  <span className="sr-only">
                    {selected ? ` — place ${PARTS[selected].label} here` : part ? " — remove it" : ""}
                  </span>
                </span>
              </button>
              {part && (part.kind === "led" || part.kind === "battery") ? (
                <button
                  type="button"
                  onClick={() => flip(id)}
                  aria-pressed={part.flipped}
                  className="flex min-h-12 w-12 items-center justify-center rounded-lg border border-line-strong text-ink-muted hover:text-cyan"
                >
                  <FlipHorizontal2 className="size-4" aria-hidden="true" />
                  <span className="sr-only">Turn the {PARTS[part.kind].label.toLowerCase()} around</span>
                </button>
              ) : null}
            </li>
          );
        })}
      </ul>

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

function SlotPart({
  slot,
  part,
  litBrightness,
  burnt,
  switchClosed,
  onToggleSwitch,
}: {
  slot: SlotId;
  part: Placed | null;
  litBrightness: number;
  burnt: boolean;
  switchClosed: boolean;
  onToggleSwitch?: () => void;
}) {
  const { x, y, rotation: base } = SLOTS[slot];
  const rotation = base + (part?.flipped ? 180 : 0);
  const vertical = slot === "left" || slot === "right";
  const labelPlacement = slot === "left" ? "right" : slot === "right" ? "left" : slot === "top" ? "top" : "bottom";
  if (!part) {
    return (
      <g aria-hidden="true">
        <rect x={vertical ? x - 22 : x - 44} y={vertical ? y - 44 : y - 22} width={vertical ? 44 : 88} height={vertical ? 88 : 44} rx={8} fill={PANEL_BACKGROUND} stroke="#475569" strokeDasharray="5 5" />
        <text x={x} y={y + 5} textAnchor="middle" fontSize={16} fill="#94a3b8" fontFamily="var(--font-mono)">?</text>
      </g>
    );
  }
  const common = { x, y, rotation, labelPlacement, labelOffset: vertical ? 30 : 26 } as const;
  switch (part.kind) {
    case "battery":
      return <Battery {...common} detail={`${SUPPLY} V`} energized={litBrightness > 0} />;
    case "switch":
      return <Switch {...common} closed={switchClosed} onToggle={onToggleSwitch} />;
    case "resistor":
      return <Resistor {...common} detail={`${RESISTOR_OHMS} Ω`} energized={litBrightness > 0} />;
    case "led":
      return <Led {...common} brightness={burnt ? 0 : litBrightness} color="#fb7185" detail={burnt ? "burnt out" : undefined} />;
    case "capacitor":
      return <Capacitor {...common} />;
    default:
      return (
        <g aria-hidden="true">
          <rect x={vertical ? x - 10 : x - 40} y={vertical ? y - 40 : y - 10} width={vertical ? 20 : 80} height={vertical ? 80 : 20} fill="transparent" />
          <text x={vertical ? x + (slot === "left" ? 14 : -14) : x} y={vertical ? y + 4 : y + (slot === "top" ? -10 : 20)} textAnchor={vertical ? (slot === "left" ? "start" : "end") : "middle"} fontSize={10} fill="#94a3b8" fontFamily="var(--font-mono)">
            wire
          </text>
        </g>
      );
  }
}
