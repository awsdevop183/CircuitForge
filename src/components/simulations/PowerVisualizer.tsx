"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Drill, Heater, Laptop, Lightbulb, Smartphone, type LucideIcon } from "lucide-react";
import { Battery, CircuitCanvas, CurrentFlow, Lamp, Wire, rectLoop } from "@/components/circuit";
import { flowSpeedForCurrent } from "@/components/lab/flow-speed";
import { FormulaDisplay } from "@/components/lab/FormulaDisplay";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { powerFrom } from "@/lib/electronics";
import { formatAmps, formatFixed, formatWatts } from "@/lib/format";
import { clamp } from "@/lib/math";
import { cn } from "@/lib/cn";

const V_MAX = 24;
const I_MAX = 5;
const BLOCKS = 16;
/** Log scale for the power meter and device chart. */
const P_MIN = 0.01;
const P_MAX = 3000;

type PowerLevel = "none" | "low" | "medium" | "high";

const LEVELS: { level: Exclude<PowerLevel, "none">; label: string; range: string; blocks: number }[] = [
  { level: "low", label: "Low power", range: "under 1 W", blocks: 4 },
  { level: "medium", label: "Medium power", range: "1 – 20 W", blocks: 8 },
  { level: "high", label: "High power", range: "over 20 W", blocks: 16 },
];

interface Device {
  name: string;
  watts: number;
  how: string;
  icon: LucideIcon;
  mains?: boolean;
}

const DEVICES: readonly Device[] = [
  { name: "Indicator LED", watts: 0.06, how: "3 V × 0.02 A", icon: Lightbulb },
  { name: "Phone charger", watts: 20, how: "9 V × 2.2 A", icon: Smartphone },
  { name: "Laptop", watts: 65, how: "20 V × 3.25 A", icon: Laptop },
  { name: "Cordless drill motor", watts: 500, how: "18 V × 28 A", icon: Drill },
  { name: "Electric heater", watts: 2000, how: "230 V × 8.7 A (mains)", icon: Heater, mains: true },
];

function levelOf(power: number): PowerLevel {
  if (power <= 0) return "none";
  if (power < 1) return "low";
  if (power <= 20) return "medium";
  return "high";
}

function logPosition(power: number) {
  if (power <= 0) return 0;
  return clamp((Math.log10(power) - Math.log10(P_MIN)) / (Math.log10(P_MAX) - Math.log10(P_MIN)), 0, 1);
}

const LEFT = 60;
const RIGHT = 300;
const TOP = 50;
const BOTTOM = 190;
const LOOP = rectLoop(LEFT, TOP, RIGHT, BOTTOM, 12);

/**
 * Power is how fast energy is delivered: P = V × I. Change voltage and current,
 * watch the load glow and the power meter fill, and compare with real devices.
 */
export function PowerVisualizer() {
  const [voltage, setVoltage] = useState(6);
  const [current, setCurrent] = useState(0.5);
  const power = powerFrom(voltage, current);
  const level = levelOf(power);
  const litBlocks = Math.round(logPosition(power) * BLOCKS);
  const flowing = power > 0;
  const closest = DEVICES.reduce((best, device) =>
    Math.abs(Math.log10(device.watts) - Math.log10(Math.max(power, P_MIN))) <
    Math.abs(Math.log10(best.watts) - Math.log10(Math.max(power, P_MIN)))
      ? device
      : best,
  );

  return (
    <div>
      <div className="grid grid-cols-1 gap-px bg-line lg:grid-cols-[1fr_1.2fr]">
        <div className="bg-breadboard flex items-center px-2 py-4 sm:px-6">
          <CircuitCanvas
            viewBox="0 0 360 240"
            interactive
            title="Power delivered to a load"
            description={`${formatFixed(voltage, 1)} volts and ${formatAmps(current)} deliver ${formatWatts(power)} to the load.`}
            className="mx-auto max-w-md"
          >
            <Wire d={LOOP} energized={flowing} />
            <CurrentFlow d={LOOP} active={flowing} speed={flowSpeedForCurrent(current, I_MAX)} />
            <Battery x={LEFT} y={(TOP + BOTTOM) / 2} rotation={-90} detail={`${formatFixed(voltage, 1)} V`} energized={flowing} labelPlacement="right" labelOffset={26} />
            <Lamp x={RIGHT} y={(TOP + BOTTOM) / 2} rotation={90} brightness={logPosition(power) * 1.1} name="Load" detail={formatWatts(power, 3)} labelPlacement="left" labelOffset={36} />
            <text x={(LEFT + RIGHT) / 2} y={(TOP + BOTTOM) / 2} textAnchor="middle" dominantBaseline="central" fontSize={22} fontWeight={600} fill="#fcd34d" fontFamily="var(--font-mono)">
              {formatWatts(power, 3)}
            </text>
            <text x={(LEFT + RIGHT) / 2} y={(TOP + BOTTOM) / 2 + 24} textAnchor="middle" fontSize={10} fill="#94a3b8" fontFamily="var(--font-mono)">
              ENERGY PER SECOND
            </text>
          </CircuitCanvas>
        </div>
        <div className="space-y-5 bg-surface-raised p-5">
          <FormulaDisplay
            label="Power"
            result={{ symbol: "P", value: formatWatts(power, 3), tone: "amber" }}
            expression={[{ symbol: "V", value: `${formatFixed(voltage, 1)} V`, tone: "amber" }, "×", { symbol: "I", value: formatAmps(current, 3), tone: "cyan" }]}
          />
          <InteractiveSlider label="Voltage" value={voltage} min={0} max={V_MAX} step={0.5} onChange={setVoltage} format={(v) => `${formatFixed(v, 1)} V`} color="var(--color-amber)" />
          <InteractiveSlider label="Current" value={current} min={0} max={I_MAX} step={0.05} onChange={setCurrent} format={(i) => formatAmps(i, 3)} color="var(--color-cyan)" />
          <div>
            <p className="mb-2 flex items-baseline justify-between text-sm">
              <span className="font-medium text-ink">Power meter</span>
              <span className="font-mono text-amber" aria-live="polite">
                {level === "none" ? "No power" : LEVELS.find((l) => l.level === level)!.label}
              </span>
            </p>
            <div className="flex gap-1" aria-hidden="true">
              {Array.from({ length: BLOCKS }, (_, i) => (
                <motion.span
                  key={i}
                  className="h-6 flex-1 rounded-sm"
                  initial={false}
                  animate={{ backgroundColor: i < litBlocks ? (i < 5 ? "#34d399" : i < 11 ? "#f5a524" : "#fb923c") : "#1a2432" }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reference levels */}
      <div className="grid gap-2 border-t border-line p-4 sm:p-5">
        {LEVELS.map((row) => (
          <div
            key={row.level}
            className={cn(
              "grid grid-cols-[8rem_1fr] items-center gap-3 rounded-lg border px-3 py-2 sm:grid-cols-[10rem_1fr_6rem]",
              level === row.level ? "border-amber/60 bg-amber/10" : "border-line bg-void/30",
            )}
          >
            <span className={cn("text-sm font-medium", level === row.level ? "text-ink" : "text-ink-muted")}>
              {row.label}
              {level === row.level ? <span className="sr-only"> (your circuit)</span> : null}
            </span>
            <span className="font-mono text-sm tracking-tight text-amber" aria-hidden="true">
              {"█".repeat(row.blocks)}
            </span>
            <span className="hidden font-mono text-xs text-ink-subtle sm:block">{row.range}</span>
          </div>
        ))}
      </div>

      {/* Devices on the same log scale, with a marker for this circuit */}
      <div className="border-t border-line p-4 sm:p-5">
        <p className="mb-3 text-sm font-medium text-ink">How does your circuit compare?</p>
        <ul className="space-y-3" aria-label="Typical power of everyday devices">
          {DEVICES.map((device) => (
            <li key={device.name} className="grid grid-cols-[1.5rem_1fr] items-center gap-3">
              <device.icon className={cn("size-5", device === closest ? "text-amber" : "text-ink-subtle")} aria-hidden="true" />
              <div>
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <span className={device === closest ? "font-semibold text-ink" : "text-ink-muted"}>
                    {device.name}
                    {device.mains ? <span className="ml-2 rounded bg-orange/15 px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase text-orange">Mains — never experiment</span> : null}
                  </span>
                  <span className="font-mono text-xs text-ink-subtle">
                    {formatWatts(device.watts)} · {device.how}
                  </span>
                </div>
                <div className="relative mt-1 h-2 rounded-full bg-line" aria-hidden="true">
                  <div className="h-full rounded-full bg-amber/70" style={{ width: `${logPosition(device.watts) * 100}%` }} />
                  <motion.span
                    className="absolute -top-1 h-4 w-0.5 bg-cyan shadow-[0_0_6px_#22d3ee]"
                    initial={false}
                    animate={{ left: `${logPosition(power) * 100}%` }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-ink-muted" aria-live="polite">
          <span className="mr-2 inline-block h-3 w-0.5 bg-cyan align-middle" aria-hidden="true" />
          Your circuit ({formatWatts(power, 3)}) is closest to: <strong className="text-ink">{closest.name}</strong> ({formatWatts(closest.watts)}). The scale is logarithmic — each step is about ten times more power.
        </p>
      </div>
    </div>
  );
}
