"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GitMerge, Minus, Unplug } from "lucide-react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Slider } from "@/components/ui/Slider";
import { Readout } from "@/components/ui/Readout";
import { powerFrom, solveParallel, solveSeries } from "@/lib/electronics";
import { formatAmps, formatOhms, formatVolts, formatWatts } from "@/lib/format";
import { clamp } from "@/lib/math";
import { cn } from "@/lib/cn";
import { ChallengeList } from "./ChallengeList";
import { ExperimentPanel } from "./ExperimentPanel";
import { SeriesParallelCircuit, type CircuitMode } from "./SeriesParallelCircuit";

/** Bulbs are modelled as fixed resistors rated for full brightness at 6 V. */
const BULB_RATED_VOLTS = 6;
const SUPPLY_OPTIONS = [3, 6, 9].map((v) => ({ value: v, label: `${v} V` }));
const MODE_OPTIONS = [
  { value: "series" as const, label: "Series" },
  { value: "parallel" as const, label: "Parallel" },
];

const INSIGHTS: Record<CircuitMode, { title: string; points: string[] }> = {
  series: {
    title: "Series: one path",
    points: [
      "The same current flows through every bulb.",
      "The supply voltage is shared — each bulb gets a part of it.",
      "Adding bulbs adds resistance, so current drops and all bulbs dim.",
      "Break the path anywhere and everything goes dark.",
    ],
  },
  parallel: {
    title: "Parallel: separate paths",
    points: [
      "Every bulb gets the full supply voltage.",
      "Current splits between branches — lower resistance takes more.",
      "Total current is the sum of the branch currents.",
      "Remove one bulb and the others stay lit.",
    ],
  },
};

export function SeriesParallelExperiment() {
  const [mode, setMode] = useState<CircuitMode>("series");
  const [supply, setSupply] = useState(6);
  const [resistances, setResistances] = useState<[number, number]>([20, 20]);
  const [connected, setConnected] = useState<[boolean, boolean]>([true, true]);
  const [visitedModes, setVisitedModes] = useState<ReadonlySet<CircuitMode>>(new Set(["series"]));

  const loads = resistances.map((resistance, i) => ({ resistance, connected: connected[i]! }));
  const result = mode === "series" ? solveSeries(supply, loads) : solveParallel(supply, loads);

  // Brightness relative to each bulb's own rated power at 6 V.
  const brightness = result.branches.map((branch) => {
    const ratedPower = (BULB_RATED_VOLTS * BULB_RATED_VOLTS) / branch.resistance;
    return clamp(Math.pow(branch.power / ratedPower, 0.6), 0, 1);
  }) as [number, number];
  const overdriven = result.branches.some((b) => b.voltage > BULB_RATED_VOLTS + 1e-9);

  // Reference current for animation speed: both bulbs at minimum resistance in parallel at max supply.
  const referenceCurrent = 9 / 10 + 9 / 10;

  const changeMode = (next: CircuitMode) => {
    setMode(next);
    setVisitedModes((previous) => new Set([...previous, next]));
  };

  const setResistance = (index: 0 | 1, value: number) =>
    setResistances((previous) => (index === 0 ? [value, previous[1]] : [previous[0], value]));

  const toggleBulb2 = () => setConnected(([first, second]) => [first, !second]);

  const challenges = [
    { id: "both-modes", prompt: "Compare both modes with the same bulbs.", satisfied: visitedModes.size === 2 },
    {
      id: "series-break",
      prompt: "In series, remove bulb 2 and see what happens to bulb 1.",
      satisfied: mode === "series" && !connected[1],
    },
    {
      id: "parallel-survives",
      prompt: "In parallel, remove bulb 2 — does bulb 1 stay lit?",
      satisfied: mode === "parallel" && !connected[1],
    },
    {
      id: "unequal-split",
      prompt: "In parallel, make one branch carry twice the current of the other.",
      satisfied:
        mode === "parallel" &&
        connected[0] &&
        connected[1] &&
        Math.abs(Math.max(resistances[0], resistances[1]) / Math.min(resistances[0], resistances[1]) - 2) < 1e-9,
    },
  ];

  const insight = INSIGHTS[mode];

  return (
    <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
      <div className="space-y-5">
        <ExperimentPanel
          title="Circuit"
          aside={
            <span className={cn("eyebrow", mode === "series" ? "text-amber" : "text-cyan")}>
              {mode === "series" ? "Series" : "Parallel"}
            </span>
          }
          bodyClassName="bg-breadboard px-2 sm:px-6"
        >
          <SeriesParallelCircuit
            mode={mode}
            sourceVoltage={supply}
            result={result}
            brightness={brightness}
            lampConnected={connected}
            referenceCurrent={referenceCurrent}
          />
        </ExperimentPanel>

        <ExperimentPanel title="Measurements">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            <Readout label="Total R" value={formatOhms(result.totalResistance)} size="sm" />
            <Readout label="Total I" value={formatAmps(result.totalCurrent, 3)} tone="cyan" size="sm" />
            <Readout label="Total P" value={formatWatts(powerFrom(supply, result.totalCurrent), 3)} size="sm" />
            <Readout label="Supply" value={formatVolts(supply)} tone="amber" size="sm" />
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[20rem] text-left text-sm">
              <caption className="sr-only">Voltage, current and power for each bulb</caption>
              <thead>
                <tr className="border-b border-line text-xs text-ink-subtle">
                  <th scope="col" className="py-2 font-medium">Bulb</th>
                  <th scope="col" className="py-2 font-medium">Resistance</th>
                  <th scope="col" className="py-2 font-medium">Voltage</th>
                  <th scope="col" className="py-2 font-medium">Current</th>
                  <th scope="col" className="py-2 font-medium">Brightness</th>
                </tr>
              </thead>
              <tbody className="font-mono tabular-nums">
                {result.branches.map((branch, index) => (
                  <tr key={index} className="border-b border-line/60 last:border-0">
                    <th scope="row" className="py-2.5 font-sans font-medium text-ink">
                      Bulb {index + 1}
                    </th>
                    <td className="py-2.5 text-ink-muted">{formatOhms(branch.resistance)}</td>
                    <td className="py-2.5 text-amber">{connected[index] ? formatVolts(branch.voltage, 3) : "—"}</td>
                    <td className="py-2.5 text-cyan">{connected[index] ? formatAmps(branch.current, 3) : "—"}</td>
                    <td className="py-2.5">
                      <BrightnessMeter value={connected[index] ? (brightness[index] ?? 0) : 0} removed={!connected[index]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AnimatePresence>
            {overdriven ? (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 text-sm text-orange"
                role="status"
              >
                These are 6 V bulbs — at {formatVolts(supply)} each bulb is overdriven and would burn out quickly.
              </motion.p>
            ) : null}
          </AnimatePresence>
        </ExperimentPanel>
      </div>

      <div className="space-y-5">
        <ExperimentPanel title="Controls">
          <div className="space-y-6">
            <SegmentedControl label="Wiring" options={MODE_OPTIONS} value={mode} onChange={changeMode} />
            <SegmentedControl label="Supply voltage" options={SUPPLY_OPTIONS} value={supply} onChange={setSupply} size="sm" />
            <Slider
              label="Bulb 1 resistance"
              value={resistances[0]}
              min={10}
              max={60}
              step={5}
              onChange={(v) => setResistance(0, v)}
              format={(v) => formatOhms(v)}
              color="var(--color-electric)"
            />
            <Slider
              label="Bulb 2 resistance"
              value={resistances[1]}
              min={10}
              max={60}
              step={5}
              onChange={(v) => setResistance(1, v)}
              format={(v) => formatOhms(v)}
              color="var(--color-electric)"
            />
            <button
              type="button"
              onClick={toggleBulb2}
              aria-pressed={!connected[1]}
              className={cn(
                "flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors",
                connected[1]
                  ? "border-line-strong bg-surface-high text-ink hover:border-amber/60"
                  : "border-amber/60 bg-amber/10 text-amber",
              )}
            >
              <Unplug className="size-4" aria-hidden="true" />
              {connected[1] ? "Remove bulb 2" : "Put bulb 2 back"}
            </button>
          </div>
        </ExperimentPanel>

        <ExperimentPanel
          title="What you're seeing"
          aside={<GitMerge className="size-4 text-ink-subtle" aria-hidden="true" />}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <p className="font-display text-lg font-semibold text-ink">{insight.title}</p>
              <ul className="mt-3 space-y-2">
                {insight.points.map((point) => (
                  <li key={point} className="flex gap-2 text-sm text-ink-muted">
                    <Minus className="mt-1 size-3.5 shrink-0 text-cyan" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </ExperimentPanel>

        <ExperimentPanel title="Your goals">
          <ChallengeList challenges={challenges} />
        </ExperimentPanel>
      </div>
    </div>
  );
}

function BrightnessMeter({ value, removed }: { value: number; removed: boolean }) {
  const percent = Math.round(value * 100);
  return (
    <span className="flex items-center gap-2">
      <span className="h-1.5 w-12 overflow-hidden rounded-full bg-line sm:w-16" aria-hidden="true">
        <span className="block h-full rounded-full bg-amber transition-[width] duration-300" style={{ width: `${percent}%` }} />
      </span>
      <span className="text-xs text-ink-muted">{removed ? "off" : `${percent}%`}</span>
    </span>
  );
}
