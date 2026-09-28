"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUp, Minus } from "lucide-react";
import { OhmsLawCircuit } from "@/components/lab/OhmsLawCircuit";
import { Slider } from "@/components/ui/Slider";
import { currentFrom, powerFrom } from "@/lib/electronics";
import { formatAmps, formatFixed, formatOhms } from "@/lib/format";
import { cn } from "@/lib/cn";

type Trend = "up" | "down" | "steady";
type Variable = "voltage" | "resistance";

const MAX_VOLTS = 12;
const MIN_OHMS = 10;
const MAX_CURRENT = MAX_VOLTS / MIN_OHMS;

/**
 * Change voltage or resistance and see which way current moves:
 * Voltage → Current ← Resistance.
 */
export function OhmsRelationship() {
  const [voltage, setVoltage] = useState(6);
  const [resistance, setResistance] = useState(30);
  const [lastChange, setLastChange] = useState<{ variable: Variable; trend: Trend } | null>(null);

  const current = currentFrom(voltage, resistance);

  const change = (variable: Variable, next: number, previous: number) => {
    setLastChange({ variable, trend: next > previous ? "up" : next < previous ? "down" : "steady" });
  };

  const voltageTrend: Trend = lastChange?.variable === "voltage" ? lastChange.trend : "steady";
  const resistanceTrend: Trend = lastChange?.variable === "resistance" ? lastChange.trend : "steady";
  const currentTrend: Trend = !lastChange
    ? "steady"
    : lastChange.variable === "voltage"
      ? lastChange.trend
      : lastChange.trend === "up"
        ? "down"
        : lastChange.trend === "down"
          ? "up"
          : "steady";

  return (
    <div>
      <div className="grid gap-px bg-line lg:grid-cols-[1.4fr_1fr]">
        <div className="bg-breadboard px-2 py-4 sm:px-6">
          <OhmsLawCircuit voltage={voltage} resistance={resistance} current={current} power={powerFrom(voltage, current)} maxCurrent={MAX_CURRENT} />
        </div>
        <div className="space-y-6 bg-surface-raised p-5">
          <Slider
            label="Voltage (push)"
            value={voltage}
            min={0}
            max={MAX_VOLTS}
            step={0.5}
            onChange={(v) => {
              change("voltage", v, voltage);
              setVoltage(v);
            }}
            format={(v) => `${formatFixed(v, 1)} V`}
            color="var(--color-amber)"
          />
          <Slider
            label="Resistance (opposition)"
            value={resistance}
            min={MIN_OHMS}
            max={100}
            step={5}
            onChange={(r) => {
              change("resistance", r, resistance);
              setResistance(r);
            }}
            format={(r) => formatOhms(r)}
            color="var(--color-electric)"
          />
        </div>
      </div>

      {/* Voltage → Current ← Resistance */}
      <div className="border-t border-line p-4 sm:p-6">
        <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 sm:gap-4">
          <FlowNode label="Voltage" value={`${formatFixed(voltage, 1)} V`} trend={voltageTrend} tone="amber" />
          <ArrowRight className="size-5 text-ink-subtle" aria-hidden="true" />
          <FlowNode label="Current" value={formatAmps(current, 2)} trend={currentTrend} tone="cyan" emphasis />
          <ArrowRight className="size-5 rotate-180 text-ink-subtle" aria-hidden="true" />
          <FlowNode label="Resistance" value={formatOhms(resistance)} trend={resistanceTrend} tone="electric" />
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={lastChange ? `${lastChange.variable}-${lastChange.trend}` : "start"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-5 text-center text-sm text-ink-muted"
            aria-live="polite"
          >
            {describe(lastChange)}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

function describe(change: { variable: Variable; trend: Trend } | null): string {
  if (!change || change.trend === "steady") return "Move either slider and watch which way the current goes.";
  if (change.variable === "voltage") {
    return change.trend === "up"
      ? "More push → more current. Voltage and current rise together."
      : "Less push → less current.";
  }
  return change.trend === "up"
    ? "More opposition → less current. Resistance works against the flow."
    : "Less opposition → more current flows for the same push.";
}

const TONES = {
  amber: "text-amber border-amber/40",
  cyan: "text-cyan border-cyan/50",
  electric: "text-electric border-electric/40",
} as const;

function FlowNode({
  label,
  value,
  trend,
  tone,
  emphasis = false,
}: {
  label: string;
  value: string;
  trend: Trend;
  tone: keyof typeof TONES;
  emphasis?: boolean;
}) {
  const TrendIcon = trend === "up" ? ArrowUp : trend === "down" ? ArrowDown : Minus;
  return (
    <div className={cn("rounded-xl border bg-void/50 px-2 py-3 text-center sm:px-4", TONES[tone], emphasis && "shadow-[0_0_24px_-8px_rgb(34_211_238/0.7)]")}>
      <p className="eyebrow text-[0.6rem] text-ink-subtle sm:text-xs">{label}</p>
      <p className="mt-1 font-mono text-sm font-semibold tabular-nums sm:text-lg">{value}</p>
      <p className="mt-1 flex items-center justify-center gap-1 text-[0.7rem] text-ink-muted">
        <TrendIcon className="size-3.5" aria-hidden="true" />
        {trend === "steady" ? "steady" : trend === "up" ? "rising" : "falling"}
      </p>
    </div>
  );
}
