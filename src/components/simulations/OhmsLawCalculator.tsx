"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck, Flame, FlaskConical, TriangleAlert } from "lucide-react";
import { InteractivePanel } from "@/components/ui/InteractivePanel";
import { FormulaDisplay, type FormulaTerm } from "@/components/lab/FormulaDisplay";
import { OhmsLawCircuit } from "@/components/lab/OhmsLawCircuit";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { currentFrom, powerFrom, resistanceFrom, voltageFrom } from "@/lib/electronics";
import { formatAmps, formatOhms, formatVolts, formatWatts } from "@/lib/format";
import { clamp } from "@/lib/math";
import { cn } from "@/lib/cn";

export type Quantity = "V" | "I" | "R";

const LIMITS = {
  V: { min: 0, max: 24 },
  I: { min: 0.0001, max: 5 },
  R: { min: 1, max: 100_000 },
} as const;

/** Thresholds for beginner-circuit safety messages. */
const TYPICAL_MAX_CURRENT = 0.1;
const UNREALISTIC_CURRENT = 1;
const QUARTER_WATT = 0.25;
const SAFE_BEGINNER_VOLTAGE = 12;

const QUANTITY_INFO: Record<Quantity, { name: string; unit: string; color: string; tone: FormulaTerm["tone"] }> = {
  V: { name: "Voltage", unit: "V", color: "#f5a524", tone: "amber" },
  I: { name: "Current", unit: "A", color: "#22d3ee", tone: "cyan" },
  R: { name: "Resistance", unit: "Ω", color: "#38bdf8", tone: "electric" },
};

export interface OhmsPreset {
  id: string;
  label: string;
  voltage: number;
  resistance: number;
  explanation: string;
}

export const OHMS_PRESETS: readonly OhmsPreset[] = [
  {
    id: "A",
    label: "5 V + 100 Ω",
    voltage: 5,
    resistance: 100,
    explanation:
      "50 mA flows — a sensible current for a small circuit. The resistor turns 0.25 W into heat, right at the limit of a common ¼ W resistor, so it gets warm. A ½ W resistor would be the safer choice.",
  },
  {
    id: "B",
    label: "12 V + 1 kΩ",
    voltage: 12,
    resistance: 1000,
    explanation:
      "More voltage, but ten times the resistance: only 12 mA flows. That's the kind of gentle current used to light an LED. The resistor barely warms (0.14 W).",
  },
  {
    id: "C",
    label: "5 V + 10 Ω",
    voltage: 5,
    resistance: 10,
    explanation:
      "A tiny resistance lets a large current flow: 0.5 A, and 2.5 W of heat. A small resistor would scorch and a battery would drain fast. Low resistance means high current.",
  },
];

function formatQuantity(quantity: Quantity, value: number, precision = 3): string {
  if (quantity === "V") return formatVolts(value, precision);
  if (quantity === "I") return formatAmps(value, precision);
  return formatOhms(value, precision);
}

/**
 * Ohm's law calculator: pick the unknown, set the other two, and see the
 * answer, the working, the circuit and any safety concerns update together.
 */
export function OhmsLawCalculator() {
  const [solveFor, setSolveFor] = useState<Quantity>("I");
  const [voltage, setVoltage] = useState(5);
  const [current, setCurrent] = useState(0.05);
  const [resistance, setResistance] = useState(100);
  const [presetId, setPresetId] = useState<string | null>("A");

  // Derive the unknown from the two knowns.
  const V = solveFor === "V" ? voltageFrom(current, resistance) : voltage;
  const I = solveFor === "I" ? currentFrom(voltage, resistance) : current;
  const R = solveFor === "R" ? resistanceFrom(voltage, current) : resistance;
  const P = powerFrom(V, I);
  const values: Record<Quantity, number> = { V, I, R };

  const chooseUnknown = (next: Quantity) => {
    // Keep the numbers continuous: the old unknown becomes a known.
    setVoltage(clamp(V, LIMITS.V.min, LIMITS.V.max));
    setCurrent(clamp(Number.isFinite(I) && I > 0 ? I : LIMITS.I.min, LIMITS.I.min, LIMITS.I.max));
    setResistance(clamp(Number.isFinite(R) ? R : LIMITS.R.max, LIMITS.R.min, LIMITS.R.max));
    setSolveFor(next);
  };

  const applyPreset = (preset: OhmsPreset) => {
    setSolveFor("I");
    setVoltage(preset.voltage);
    setResistance(preset.resistance);
    setPresetId(preset.id);
  };

  const setters: Record<Quantity, (value: number) => void> = {
    V: (v) => {
      setVoltage(v);
      setPresetId(null);
    },
    I: (i) => {
      setCurrent(i);
      setPresetId(null);
    },
    R: (r) => {
      setResistance(r);
      setPresetId(null);
    },
  };
  const knowns = (["V", "I", "R"] as const).filter((q) => q !== solveFor);

  const expression: Record<Quantity, (FormulaTerm | string)[]> = {
    V: [term("I", I), "×", term("R", R)],
    I: [term("V", V), "÷", term("R", R)],
    R: [term("V", V), "÷", term("I", I)],
  };

  const warnings = buildWarnings(V, I, P);
  const preset = OHMS_PRESETS.find((p) => p.id === presetId);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.25fr_1fr]">
        <InteractivePanel title="Live circuit" bodyClassName="p-0">
          <div className="bg-breadboard px-2 py-4 sm:px-6">
            <OhmsLawCircuit
              voltage={V}
              resistance={Number.isFinite(R) ? R : 1e9}
              current={Number.isFinite(I) ? I : 0}
              power={Number.isFinite(P) ? P : 0}
              maxCurrent={1}
            />
          </div>
          <div className="border-t border-line p-4 sm:p-5">
          <motion.div
            key={solveFor}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border bg-void/50 p-4 text-center"
            style={{ borderColor: `${QUANTITY_INFO[solveFor].color}66` }}
          >
            <p className="eyebrow text-ink-subtle">{QUANTITY_INFO[solveFor].name}</p>
            <p className="mt-1 font-mono text-4xl font-semibold tabular-nums" style={{ color: QUANTITY_INFO[solveFor].color }} aria-live="polite">
              {formatQuantity(solveFor, values[solveFor])}
            </p>
          </motion.div>

          <FormulaDisplay
            className="mt-5"
            label="Working"
            result={term(solveFor, values[solveFor])}
            expression={expression[solveFor]}
          />

          </div>
        </InteractivePanel>

        <InteractivePanel title="Solve Ohm's law">
          <div className="grid grid-cols-[7.5rem_1fr] items-center gap-4 sm:grid-cols-[9rem_1fr]">
            <OhmsTriangle unknown={solveFor} onSelect={chooseUnknown} />
            <SegmentedControl
              label="Find the…"
              options={(["V", "I", "R"] as const).map((q) => ({ value: q, label: q, ariaLabel: QUANTITY_INFO[q].name }))}
              value={solveFor}
              onChange={chooseUnknown}
            />
          </div>

          <p className="mt-5 text-sm text-ink-muted">
            Set the two values you know — drag or type:
          </p>
          <div className="mt-4 space-y-5">
            {knowns.map((quantity) => (
              <KnownInput key={quantity} quantity={quantity} value={quantity === "V" ? voltage : quantity === "I" ? current : resistance} onChange={setters[quantity]} />
            ))}
          </div>
        </InteractivePanel>
      </div>

      <AnimatePresence initial={false}>
        {warnings.length > 0 ? (
          <motion.ul initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-2 overflow-hidden" role="status">
            {warnings.map((warning) => (
              <li
                key={warning.id}
                className={cn(
                  "flex items-start gap-3 rounded-xl border p-4 text-sm",
                  warning.level === "danger" ? "border-negative/50 bg-negative/10" : "border-orange/45 bg-orange/[0.07]",
                )}
              >
                {warning.level === "danger" ? (
                  <TriangleAlert className="mt-0.5 size-5 shrink-0 text-negative" aria-hidden="true" />
                ) : (
                  <Flame className="mt-0.5 size-5 shrink-0 text-orange" aria-hidden="true" />
                )}
                <span className="text-ink-muted">
                  <strong className={warning.level === "danger" ? "text-negative" : "text-orange"}>{warning.title} </strong>
                  {warning.body}
                </span>
              </li>
            ))}
          </motion.ul>
        ) : (
          <p className="flex items-center gap-2 rounded-xl border border-positive/35 bg-positive/5 p-4 text-sm text-ink-muted" role="status">
            <CircleCheck className="size-5 shrink-0 text-positive" aria-hidden="true" />
            A realistic, safe beginner circuit: {formatAmps(I, 2)} and {formatWatts(P, 2)} of heat in the resistor.
          </p>
        )}
      </AnimatePresence>

      <InteractivePanel title="Preset experiments" aside={<FlaskConical className="size-4 text-amber" aria-hidden="true" />}>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {OHMS_PRESETS.map((p) => {
            const active = p.id === presetId;
            const presetCurrent = currentFrom(p.voltage, p.resistance);
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={active}
                onClick={() => applyPreset(p)}
                className={cn(
                  "rounded-xl border p-4 text-left transition-colors",
                  active ? "border-cyan/60 bg-cyan/10" : "border-line-strong bg-void/40 hover:border-cyan/40",
                )}
              >
                <span className="eyebrow block text-amber">Experiment {p.id}</span>
                <span className="mt-1 block font-mono text-lg font-semibold text-ink">{p.label}</span>
                <span className="mt-1 block font-mono text-sm text-cyan">→ {formatAmps(presetCurrent, 2)}</span>
              </button>
            );
          })}
        </div>
        <AnimatePresence mode="wait">
          {preset ? (
            <motion.p key={preset.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 text-sm leading-relaxed text-ink-muted" aria-live="polite">
              <strong className="text-ink">What happens in experiment {preset.id}: </strong>
              {preset.explanation}
            </motion.p>
          ) : (
            <motion.p key="custom" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 text-sm text-ink-subtle">
              You&apos;ve changed the values — pick a preset to compare with a worked example.
            </motion.p>
          )}
        </AnimatePresence>
      </InteractivePanel>
    </div>
  );
}

function term(quantity: Quantity, value: number): FormulaTerm {
  return { symbol: quantity, value: formatQuantity(quantity, value), tone: QUANTITY_INFO[quantity].tone };
}

interface Warning {
  id: string;
  level: "caution" | "danger";
  title: string;
  body: string;
}

function buildWarnings(V: number, I: number, P: number): Warning[] {
  const warnings: Warning[] = [];
  if (I > UNREALISTIC_CURRENT) {
    warnings.push({
      id: "current-danger",
      level: "danger",
      title: `${formatAmps(I, 2)} is unrealistically high for a simple beginner circuit.`,
      body: "Thin wires, breadboards and small resistors would overheat, and batteries can get dangerously hot. Real beginner circuits use milliamps.",
    });
  } else if (I > TYPICAL_MAX_CURRENT) {
    warnings.push({
      id: "current-caution",
      level: "caution",
      title: `${formatAmps(I, 2)} is more than a typical beginner circuit needs.`,
      body: "Most small circuits run on a few milliamps up to about 100 mA.",
    });
  }
  if (Number.isFinite(P) && P > QUARTER_WATT) {
    warnings.push({
      id: "power",
      level: P > 2 ? "danger" : "caution",
      title: `The resistor must turn ${formatWatts(P, 2)} into heat.`,
      body: `A common ¼ W resistor would overheat — you'd need one rated for at least ${formatWatts(Math.ceil(P * 2) / 2, 2)}.`,
    });
  }
  if (V > SAFE_BEGINNER_VOLTAGE) {
    warnings.push({
      id: "voltage",
      level: V > 24 ? "danger" : "caution",
      title: `${formatVolts(V, 3)} is above the 12 V recommended for beginners.`,
      body: "Stick to batteries and low-voltage supplies while you learn.",
    });
  }
  return warnings;
}

function KnownInput({ quantity, value, onChange }: { quantity: Quantity; value: number; onChange: (value: number) => void }) {
  const info = QUANTITY_INFO[quantity];
  const limits = LIMITS[quantity];
  const inputId = useId();
  // While the learner is typing, keep their raw text so partial entries like "0.0" aren't clamped.
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <div className="grid grid-cols-[1fr_7.5rem] items-end gap-3">
      <InteractiveSlider
        label={`${info.name} (${quantity})`}
        value={value}
        min={limits.min}
        max={limits.max}
        step={0.1}
        scale={quantity === "V" ? "linear" : "log"}
        onChange={onChange}
        format={(v) => formatQuantity(quantity, v)}
        color={info.color}
      />
      <div>
        <label htmlFor={inputId} className="sr-only">
          {info.name} in {quantity === "I" ? "amps" : info.unit}
        </label>
        <div className="flex items-center rounded-lg border border-line-strong bg-void/50 focus-within:border-cyan/60">
          <input
            id={inputId}
            type="number"
            inputMode="decimal"
            min={limits.min}
            max={limits.max}
            step="any"
            value={draft ?? String(Number(value.toPrecision(4)))}
            onChange={(event) => {
              setDraft(event.target.value);
              const parsed = Number(event.target.value);
              if (event.target.value !== "" && Number.isFinite(parsed) && parsed >= limits.min && parsed <= limits.max) onChange(parsed);
            }}
            onBlur={() => setDraft(null)}
            className="h-10 w-full min-w-0 bg-transparent px-2 text-right font-mono text-sm text-ink outline-none"
          />
          <span className="pr-2 font-mono text-xs text-ink-subtle" aria-hidden="true">
            {info.unit}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * The Ohm's-law triangle. Each region is a button: choose the quantity to
 * "cover" and the other two show how to calculate it.
 */
export function OhmsTriangle({ unknown, onSelect }: { unknown: Quantity; onSelect: (quantity: Quantity) => void }) {
  const regions: { quantity: Quantity; d: string; label: { x: number; y: number } }[] = [
    // One triangle (apex 60,6 · base 0–120 at y 112) cut into three regions.
    { quantity: "V", d: "M 60 6 L 96.2 70 L 23.8 70 Z", label: { x: 60, y: 50 } },
    { quantity: "I", d: "M 22.7 72 L 59 72 L 59 112 L 0 112 Z", label: { x: 36, y: 94 } },
    { quantity: "R", d: "M 61 72 L 97.3 72 L 120 112 L 61 112 Z", label: { x: 84, y: 94 } },
  ];
  const onKey = (event: KeyboardEvent<SVGGElement>, quantity: Quantity) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(quantity);
    }
  };
  return (
    <svg viewBox="0 0 120 118" className="h-auto w-full" role="group" aria-label="Ohm's law triangle: V over I times R. Select a quantity to solve for it.">
      {regions.map((region) => {
        const active = region.quantity === unknown;
        const info = QUANTITY_INFO[region.quantity];
        return (
          <g
            key={region.quantity}
            role="button"
            tabIndex={0}
            aria-pressed={active}
            aria-label={`Solve for ${info.name}`}
            onClick={() => onSelect(region.quantity)}
            onKeyDown={(event) => onKey(event, region.quantity)}
            className="cursor-pointer outline-none [&:focus-visible>path]:stroke-[3]"
          >
            <path d={region.d} fill={active ? info.color : "#0b1018"} fillOpacity={active ? 0.25 : 1} stroke={active ? info.color : "#34445a"} strokeWidth={1.5} strokeLinejoin="round" />
            <text x={region.label.x} y={region.label.y} textAnchor="middle" dominantBaseline="central" fontSize={20} fontWeight={700} fill={info.color} fontFamily="var(--font-mono)">
              {region.quantity}
            </text>
          </g>
        );
      })}
      <text x={60} y={92} textAnchor="middle" dominantBaseline="central" fontSize={11} fill="#e8eef6" aria-hidden="true">
        ×
      </text>
    </svg>
  );
}
