"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";
import { CircleCheck } from "lucide-react";
import { ResistorIllustration } from "@/components/illustrations/ResistorIllustration";
import { OhmsLawCircuit } from "@/components/lab/OhmsLawCircuit";
import { Callout } from "@/components/ui/Callout";
import { Readout } from "@/components/ui/Readout";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { currentFrom, powerFrom } from "@/lib/electronics";
import { formatAmps, formatOhms } from "@/lib/format";
import { cn } from "@/lib/cn";
import {
  DIGIT_COLORS,
  MULTIPLIER_BANDS,
  TOLERANCE_BANDS,
  decodeResistor,
  type BandColor,
} from "./resistor-color-code";
import { DeepDiveSection } from "./DeepDiveSection";

const TARGET_OHMS = 220;

export function ResistorDeepDive() {
  return (
    <div className="space-y-16">
      <DeepDiveSection
        eyebrow="Interactive"
        title="Read the colour code"
        description="Resistors are too small to print numbers on, so their value is painted as coloured bands. Pick colours and watch the resistor — and its value — change."
      >
        <ResistorColorCodeReader />
      </DeepDiveSection>

      <ResistorInCircuit />
    </div>
  );
}

/** Pick four colour bands and read the resistor's value. */
export function ResistorColorCodeReader() {
  const [first, setFirst] = useState(1);
  const [second, setSecond] = useState(0);
  const [multiplier, setMultiplier] = useState(2);
  const [tolerance, setTolerance] = useState(2);

  const ohms = decodeResistor(first, second, multiplier);
  const tolerancePercent = TOLERANCE_BANDS[tolerance]!.percent;
  const bands = [DIGIT_COLORS[first]!, DIGIT_COLORS[second]!, MULTIPLIER_BANDS[multiplier]!, TOLERANCE_BANDS[tolerance]!];
  const foundTarget = ohms === TARGET_OHMS;

  return (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="panel-raised flex flex-col items-center justify-center rounded-2xl p-6">
            <ResistorIllustration
              bands={bands.map((band) => band.hex)}
              className="w-full max-w-sm"
              title={`Resistor with bands ${bands.map((b) => b.name).join(", ")}`}
            />
            <motion.p
              key={`${ohms}-${tolerancePercent}`}
              initial={{ opacity: 0.4, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 font-mono text-4xl font-semibold text-cyan"
              aria-live="polite"
            >
              {formatOhms(ohms)}
              <span className="ml-2 text-xl text-amber">±{tolerancePercent}%</span>
            </motion.p>
            <p className="mt-2 font-mono text-sm text-ink-subtle">
              Actual value: {formatOhms(ohms * (1 - tolerancePercent / 100))} – {formatOhms(ohms * (1 + tolerancePercent / 100))}
            </p>
            <p className="mt-4 text-center text-sm text-ink-muted">
              <span className="text-ink">{first}</span>
              <span className="text-ink">{second}</span> × {formatMultiplier(MULTIPLIER_BANDS[multiplier]!.factor)} ={" "}
              <span className="text-cyan">{formatOhms(ohms)}</span>
            </p>
          </div>

          <div className="space-y-5">
            <BandPicker label="Band 1 — first digit" colors={DIGIT_COLORS} value={first} onChange={setFirst} describe={(_, i) => `${i}`} />
            <BandPicker label="Band 2 — second digit" colors={DIGIT_COLORS} value={second} onChange={setSecond} describe={(_, i) => `${i}`} />
            <BandPicker
              label="Band 3 — multiplier"
              colors={MULTIPLIER_BANDS}
              value={multiplier}
              onChange={setMultiplier}
              describe={(_, i) => formatMultiplier(MULTIPLIER_BANDS[i]!.factor)}
            />
            <BandPicker
              label="Band 4 — tolerance"
              colors={TOLERANCE_BANDS}
              value={tolerance}
              onChange={setTolerance}
              describe={(_, i) => `±${TOLERANCE_BANDS[i]!.percent}%`}
            />
            <Callout kind="try" title={foundTarget ? "Challenge complete" : "Try it yourself"}>
              {foundTarget ? (
                <p className="flex items-center gap-2 text-positive">
                  <CircleCheck className="size-4 shrink-0" aria-hidden="true" />
                  Red, red, brown — that&apos;s 220 Ω, the classic LED resistor.
                </p>
              ) : (
                <p>
                  Set the bands for <strong>220 Ω</strong> — the resistor you&apos;ll use most with LEDs.
                </p>
              )}
            </Callout>
          </div>
        </div>
  );
}

function ResistorInCircuit() {
  const [resistance, setResistance] = useState(220);
  const voltage = 5;
  const current = currentFrom(voltage, resistance);

  return (
    <DeepDiveSection
      eyebrow="In a circuit"
      title="More resistance, less current"
      description="With a fixed 5 V supply, drag the resistance and watch the charge slow down. This is exactly how a resistor protects an LED."
    >
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="panel-raised bg-breadboard rounded-2xl px-2 py-4 sm:px-6">
          <OhmsLawCircuit voltage={voltage} resistance={resistance} current={current} power={powerFrom(voltage, current)} maxCurrent={voltage / 50} />
        </div>
        <div className="space-y-4">
          <InteractiveSlider label="Resistance" value={resistance} min={50} max={2000} step={10} onChange={setResistance} format={(r) => formatOhms(r)} color="var(--color-electric)" minLabel="50 Ω" maxLabel="2 kΩ" />
          <div className="grid grid-cols-2 gap-3">
            <Readout label="Supply" value="5.0" unit="V" tone="amber" />
            <Readout label="Current" value={formatAmps(current, 3)} tone="cyan" />
          </div>
          <p className="text-sm text-ink-muted">
            Doubling resistance halves the current. That inverse relationship is Ohm&apos;s law: <span className="font-mono text-ink">I = V / R</span>.
          </p>
        </div>
      </div>
    </DeepDiveSection>
  );
}

function formatMultiplier(factor: number): string {
  if (factor >= 1e6) return `${factor / 1e6}M`;
  if (factor >= 1e3) return `${factor / 1e3}k`;
  return `${factor}`;
}

interface BandPickerProps {
  label: string;
  colors: readonly BandColor[];
  value: number;
  onChange: (index: number) => void;
  describe: (color: BandColor, index: number) => string;
}

/** Colour swatches backed by native radio inputs (arrow-key navigation for free). */
function BandPicker({ label, colors, value, onChange, describe }: BandPickerProps) {
  const name = useId();
  return (
    <fieldset>
      <legend className="mb-2 flex w-full items-center justify-between text-sm font-medium text-ink">
        {label}
        <span className="font-mono text-xs text-ink-muted">
          {colors[value]?.name} · {describe(colors[value]!, value)}
        </span>
      </legend>
      <div className="flex flex-wrap gap-1.5">
        {colors.map((color, index) => (
          <label key={color.name} className="relative">
            <input
              type="radio"
              name={name}
              value={index}
              checked={value === index}
              onChange={() => onChange(index)}
              className="peer sr-only"
              aria-label={`${color.name}, ${describe(color, index)}`}
            />
            <span
              className={cn(
                "flex size-9 cursor-pointer items-center justify-center rounded-lg border-2 font-mono text-[0.65rem] font-bold transition-transform peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cyan",
                value === index ? "scale-110 border-ink shadow-[0_0_14px_-2px_rgba(255,255,255,0.45)]" : "border-transparent hover:scale-105",
              )}
              style={{ backgroundColor: color.hex, color: color.ink }}
              aria-hidden="true"
            >
              {describe(color, index)}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
