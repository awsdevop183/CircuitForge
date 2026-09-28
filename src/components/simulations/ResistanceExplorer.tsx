"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";
import { CircuitCanvas, CurrentFlow } from "@/components/circuit";
import { OhmsLawCircuit } from "@/components/lab/OhmsLawCircuit";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { Readout } from "@/components/ui/Readout";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { currentFrom, powerFrom } from "@/lib/electronics";
import { formatAmps, formatFixed, formatOhms } from "@/lib/format";
import { clamp } from "@/lib/math";
import { cn } from "@/lib/cn";

const R_MIN = 10;
const R_MAX = 10_000;
const V_MAX = 12;
const I_MAX = V_MAX / R_MIN;

type Change = { variable: "voltage" | "resistance"; direction: "up" | "down" } | null;

/** 0–1 position of a value on a log scale between min and max. */
function logPosition(value: number, min: number, max: number) {
  if (value <= 0) return 0;
  return clamp((Math.log10(value) - Math.log10(min)) / (Math.log10(max) - Math.log10(min)), 0, 1);
}

/**
 * Resistance opposes current. Change the resistance and voltage and watch the
 * passage narrow, the charge slow down, and the current bar respond.
 */
export function ResistanceExplorer() {
  const [voltage, setVoltage] = useState(6);
  const [resistance, setResistance] = useState(220);
  const [change, setChange] = useState<Change>(null);

  const current = currentFrom(voltage, resistance);
  const rPos = logPosition(resistance, R_MIN, R_MAX);
  const iPos = logPosition(current, 0.0005, I_MAX);

  const update = (variable: "voltage" | "resistance", next: number, previous: number) => {
    if (next !== previous) setChange({ variable, direction: next > previous ? "up" : "down" });
    if (variable === "voltage") setVoltage(next);
    else setResistance(next);
  };

  const rules = [
    { id: "r-up", cause: "Resistance", causeDir: "up", effectDir: "down", active: change?.variable === "resistance" && change.direction === "up" },
    { id: "r-down", cause: "Resistance", causeDir: "down", effectDir: "up", active: change?.variable === "resistance" && change.direction === "down" },
    { id: "v-up", cause: "Voltage", causeDir: "up", effectDir: "up", active: change?.variable === "voltage" && change.direction === "up" },
    { id: "v-down", cause: "Voltage", causeDir: "down", effectDir: "down", active: change?.variable === "voltage" && change.direction === "down" },
  ] as const;

  return (
    <div>
      <div className="grid gap-px bg-line lg:grid-cols-[1.3fr_1fr]">
        <div className="bg-breadboard px-2 py-4 sm:px-5">
          <ResistancePassage resistancePosition={rPos} current={current} />
          <OhmsLawCircuit voltage={voltage} resistance={resistance} current={current} power={powerFrom(voltage, current)} maxCurrent={I_MAX} />
        </div>
        <div className="space-y-6 bg-surface-raised p-5">
          <InteractiveSlider
            label="Resistance"
            value={resistance}
            min={R_MIN}
            max={R_MAX}
            scale="log"
            onChange={(r) => update("resistance", r, resistance)}
            format={(r) => formatOhms(r)}
            color="var(--color-electric)"
            minLabel="10 Ω"
            maxLabel="10 kΩ"
          />
          <InteractiveSlider
            label="Voltage"
            value={voltage}
            min={0}
            max={V_MAX}
            step={0.5}
            onChange={(v) => update("voltage", v, voltage)}
            format={(v) => `${formatFixed(v, 1)} V`}
            color="var(--color-amber)"
            minLabel="0 V"
            maxLabel="12 V"
          />
          <div className="space-y-3" aria-label="Resistance compared with current">
            <MeterBar label="Resistance" value={formatOhms(resistance)} fraction={rPos} color="bg-electric" />
            <MeterBar label="Current" value={formatAmps(current, 2)} fraction={iPos} color="bg-cyan" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Readout label="V" value={formatFixed(voltage, 1)} unit="V" tone="amber" size="sm" />
            <Readout label="R" value={formatOhms(resistance)} size="sm" />
            <Readout label="I" value={formatAmps(current, 2)} tone="cyan" size="sm" />
          </div>
        </div>
      </div>

      <div className="grid gap-2 border-t border-line p-4 sm:grid-cols-2 sm:p-5" aria-live="polite">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl border px-3 py-3 font-mono text-sm transition-colors sm:text-base",
              rule.active ? "border-cyan/60 bg-cyan/10 text-ink shadow-[0_0_24px_-10px_rgb(34_211_238/0.9)]" : "border-line-strong bg-void/30 text-ink-muted",
            )}
          >
            <span>{rule.cause}</span>
            <TrendIcon direction={rule.causeDir} />
            <ArrowRight className="size-4 text-ink-subtle" aria-hidden="true" />
            <span>Current</span>
            <TrendIcon direction={rule.effectDir} />
            <span className="sr-only">
              {`${rule.cause} ${rule.causeDir === "up" ? "increases" : "decreases"}, current ${rule.effectDir === "up" ? "increases" : "decreases"}${rule.active ? " — just observed" : ""}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendIcon({ direction }: { direction: "up" | "down" }) {
  return direction === "up" ? (
    <ArrowUp className="size-4 text-positive" aria-hidden="true" />
  ) : (
    <ArrowDown className="size-4 text-orange" aria-hidden="true" />
  );
}

function MeterBar({ label, value, fraction, color }: { label: string; value: string; fraction: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs">
        <span className="text-ink-subtle">{label}</span>
        <span className="font-mono text-ink">{value}</span>
      </div>
      <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
        <motion.div className={cn("h-full rounded-full", color)} initial={false} animate={{ width: `${Math.max(3, fraction * 100)}%` }} transition={{ type: "spring", stiffness: 160, damping: 24 }} />
      </div>
    </div>
  );
}

const LANES = [-20, 0, 20];

/** A conductor with a narrowing "resistor" section: more resistance → narrower → slower flow. */
function ResistancePassage({ resistancePosition, current }: { resistancePosition: number; current: number }) {
  const gap = 64 - resistancePosition * 56; // passage height inside the resistor
  const squeeze = gap / 64;
  const centreY = 70;
  const speed = current > 0 ? 8 + Math.sqrt(current / I_MAX) * 170 : 0;

  return (
    <CircuitCanvas
      viewBox="0 0 480 140"
      title="Resistance as a narrow passage"
      description={`Charge flows through a conductor that narrows inside the resistor. The narrower the passage, the slower the flow. Current is ${formatAmps(current)}.`}
      className="mx-auto mb-2 max-w-2xl"
    >
      <rect x={16} y={centreY - 36} width={448} height={72} rx={12} fill="#d08a4f" fillOpacity={0.1} stroke="#d08a4f" strokeOpacity={0.35} />
      {/* Resistor body squeezing the passage */}
      <motion.rect x={180} width={120} y={centreY - 36} rx={6} initial={false} animate={{ height: 36 - gap / 2 }} fill="#f5a524" fillOpacity={0.35} />
      <motion.rect x={180} width={120} rx={6} initial={false} animate={{ y: centreY + gap / 2, height: 36 - gap / 2 }} fill="#f5a524" fillOpacity={0.35} />
      {LANES.map((offset) => {
        const inner = offset * squeeze;
        const d = `M 20 ${centreY + offset} L 160 ${centreY + offset} L 186 ${centreY + inner} L 294 ${centreY + inner} L 320 ${centreY + offset} L 460 ${centreY + offset}`;
        return <CurrentFlow key={offset} d={d} active={current > 0} speed={speed} spacing={22} size={6} />;
      })}
      <text x={240} y={centreY - 44} textAnchor="middle" fontSize={11} fill="#f5a524" fontFamily="var(--font-mono)">
        RESISTOR
      </text>
      <text x={240} y={centreY + 58} textAnchor="middle" fontSize={10} fill="#94a3b8" fontFamily="var(--font-mono)">
        {resistancePosition > 0.66 ? "narrow passage → little current" : resistancePosition > 0.33 ? "moderate passage" : "wide passage → lots of current"}
      </text>
    </CircuitCanvas>
  );
}

const THICKNESS_OPTIONS = [
  { value: 0.5, label: "Thin" },
  { value: 1, label: "Medium" },
  { value: 2, label: "Thick" },
] as const;

/**
 * What makes something resistant? Length and thickness of a conductor — shown
 * as a wire that visibly changes, with relative resistance.
 */
export function WireResistanceFactors() {
  const [length, setLength] = useState(2);
  const [thickness, setThickness] = useState<number>(1);
  // R ∝ length / area; area ∝ thickness²
  const relative = length / (thickness * thickness);
  const baseline = 2; // 2 m medium wire = 1×

  return (
    <div className="grid gap-6 p-5 sm:p-8 md:grid-cols-[1.4fr_1fr] md:items-center">
      <svg viewBox="0 0 420 120" className="h-auto w-full" role="img" aria-label={`A ${length} metre ${THICKNESS_OPTIONS.find((t) => t.value === thickness)?.label.toLowerCase()} wire with ${(relative / baseline).toFixed(2)} times the resistance of the reference wire.`}>
        <motion.rect
          x={20}
          y={60}
          rx={4}
          initial={false}
          animate={{ width: 40 + length * 36, height: thickness * 12, y: 60 - thickness * 6 }}
          fill="#d08a4f"
        />
        <circle cx={20} cy={60} r={5} fill="#f87171" />
        <motion.circle initial={false} animate={{ cx: 60 + length * 36 }} cy={60} r={5} fill="#60a5fa" />
        <text x={20} y={104} fontSize={11} fill="#94a3b8" fontFamily="var(--font-mono)">
          copper wire · {length} m · {THICKNESS_OPTIONS.find((t) => t.value === thickness)?.label.toLowerCase()}
        </text>
      </svg>
      <div className="space-y-5">
        <InteractiveSlider label="Length" value={length} min={1} max={9} step={1} onChange={setLength} format={(v) => `${v} m`} color="var(--color-copper)" />
        <SegmentedControl
          label="Thickness"
          options={THICKNESS_OPTIONS.map((option) => ({ value: option.value, label: option.label }))}
          value={thickness}
          onChange={setThickness}
          size="sm"
        />
        <Readout label="Resistance vs a 2 m medium wire" value={`${(relative / baseline).toFixed(2)}×`} tone="cyan" size="sm" />
        <p className="text-sm text-ink-muted">Longer wire → more resistance. Thicker wire → less resistance (more room for charge to flow).</p>
      </div>
    </div>
  );
}
