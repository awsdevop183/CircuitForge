"use client";

import { useState } from "react";
import { Flame } from "lucide-react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Slider } from "@/components/ui/Slider";
import { Readout } from "@/components/ui/Readout";
import type { FlowDirection } from "@/components/circuit";
import { currentFrom, powerFrom } from "@/lib/electronics";
import { formatAmps, formatFixed, formatOhms, formatWatts } from "@/lib/format";
import { ChallengeList } from "./ChallengeList";
import { ExperimentPanel } from "./ExperimentPanel";
import { FormulaDisplay } from "./FormulaDisplay";
import { IVGraph } from "./IVGraph";
import { OhmsLawCircuit } from "./OhmsLawCircuit";

export const OHMS_LAW_LIMITS = {
  voltage: { min: 0, max: 24, step: 0.5 },
  resistance: { min: 10, max: 1000, step: 10 },
} as const;

/** Largest current the controls can produce — used to scale visuals. */
const MAX_CURRENT = OHMS_LAW_LIMITS.voltage.max / OHMS_LAW_LIMITS.resistance.min;
/** A typical small through-hole resistor is rated ¼ W. */
const QUARTER_WATT = 0.25;

const DIRECTION_OPTIONS = [
  { value: "conventional" as const, label: "Conventional" },
  { value: "electron" as const, label: "Electron flow" },
];

export function OhmsLawExperiment() {
  const [voltage, setVoltage] = useState(10);
  const [resistance, setResistance] = useState(100);
  const [direction, setDirection] = useState<FlowDirection>("conventional");

  const current = currentFrom(voltage, resistance);
  const power = powerFrom(voltage, current);
  const overRated = power > QUARTER_WATT;

  const challenges = [
    { id: "quarter-amp", prompt: "Make exactly 0.25 A flow.", satisfied: Math.abs(current - 0.25) < 1e-6 },
    { id: "over-one-amp", prompt: "Push more than 1 A through the resistor.", satisfied: current > 1 },
    {
      id: "tiny-current",
      prompt: "Keep current under 20 mA with at least 12 V applied.",
      satisfied: voltage >= 12 && current < 0.02,
    },
    { id: "zero", prompt: "Stop the current completely without touching resistance.", satisfied: voltage === 0 },
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
      <div className="space-y-5">
        <ExperimentPanel
          title="Circuit"
          aside={
            <span className="font-mono text-xs text-ink-subtle" aria-hidden="true">
              I = V / R
            </span>
          }
          bodyClassName="bg-breadboard px-2 sm:px-6"
        >
          <OhmsLawCircuit
            voltage={voltage}
            resistance={resistance}
            current={current}
            power={power}
            maxCurrent={MAX_CURRENT}
            direction={direction}
          />
        </ExperimentPanel>

        <ExperimentPanel title="Ohm's law, live">
          <FormulaDisplay
            label="Ohm's law"
            result={{ symbol: "I", value: formatAmps(current, 3), tone: "cyan" }}
            expression={[
              { symbol: "V", value: `${formatFixed(voltage, 1)} V`, tone: "amber" },
              "/",
              { symbol: "R", value: formatOhms(resistance), tone: "electric" },
            ]}
          />
          <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
            <Readout label="Voltage" value={formatFixed(voltage, 1)} unit="V" tone="amber" size="sm" />
            <Readout label="Resistance" value={formatFixed(resistance, 0)} unit="Ω" size="sm" />
            <Readout label="Current" value={formatFixed(current, current < 0.1 ? 3 : 2)} unit="A" tone="cyan" size="sm" />
          </div>
        </ExperimentPanel>
      </div>

      <div className="space-y-5">
        <ExperimentPanel title="Controls">
          <div className="space-y-6">
            <Slider
              label="Voltage"
              value={voltage}
              {...OHMS_LAW_LIMITS.voltage}
              onChange={setVoltage}
              format={(v) => `${formatFixed(v, 1)} V`}
              color="var(--color-amber)"
              minLabel="0 V"
              maxLabel="24 V"
            />
            <Slider
              label="Resistance"
              value={resistance}
              {...OHMS_LAW_LIMITS.resistance}
              onChange={setResistance}
              format={(r) => formatOhms(r)}
              color="var(--color-electric)"
              minLabel="10 Ω"
              maxLabel="1 kΩ"
            />
            <SegmentedControl
              label="Show charge movement as"
              options={DIRECTION_OPTIONS}
              value={direction}
              onChange={setDirection}
              size="sm"
            />
          </div>
        </ExperimentPanel>

        <ExperimentPanel title="Power & heat">
          <div className="flex items-center gap-4">
            <Readout label="Power (P = V × I)" value={formatWatts(power, 3)} tone={overRated ? "amber" : "neutral"} className="flex-1" />
          </div>
          <p className="mt-3 flex items-start gap-2 text-sm text-ink-muted" aria-live="polite">
            <Flame className={overRated ? "mt-0.5 size-4 shrink-0 text-orange" : "mt-0.5 size-4 shrink-0 text-ink-subtle"} aria-hidden="true" />
            {overRated
              ? `A typical ¼ W resistor would overheat here — it is dissipating ${formatWatts(power, 2)}. Watch the resistor glow.`
              : "Within a typical ¼ W resistor's rating."}
          </p>
        </ExperimentPanel>

        <ExperimentPanel title="I–V graph">
          <IVGraph voltage={voltage} resistance={resistance} maxVoltage={OHMS_LAW_LIMITS.voltage.max} maxCurrent={0.5} />
        </ExperimentPanel>

        <ExperimentPanel title="Your goals">
          <ChallengeList challenges={challenges} />
        </ExperimentPanel>
      </div>
    </div>
  );
}
