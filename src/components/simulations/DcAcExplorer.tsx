"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { AcSource, Battery, CircuitCanvas, CurrentFlow, Lamp, Wire, rectLoop } from "@/components/circuit";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { formatFixed } from "@/lib/format";
import { cn } from "@/lib/cn";
import { useSimulationClock } from "./use-simulation-clock";
import { WaveformVisualizer, waveformValue, type WaveformKind } from "./WaveformVisualizer";

const DC_VOLTS = 9;
const AC_PEAK = 12;
const LEFT = 60;
const RIGHT = 320;
const TOP = 50;
const BOTTOM = 190;
const LOOP = rectLoop(LEFT, TOP, RIGHT, BOTTOM, 12);

const COMPARISON: { aspect: string; dc: string; ac: string }[] = [
  { aspect: "Direction", dc: "Always the same way round the circuit", ac: "Reverses back and forth, over and over" },
  { aspect: "Voltage", dc: "Steady — one terminal stays positive", ac: "Rises, falls, swaps polarity, repeats" },
  { aspect: "Frequency", dc: "None (0 Hz) — it never alternates", ac: "50 or 60 times per second (50/60 Hz) for mains" },
  { aspect: "Where you find it", dc: "Batteries, USB, power banks, inside every electronic device", ac: "Household sockets and the power grid" },
];

/**
 * Toggle between direct and alternating current and watch the waveform,
 * the charges and the lamp respond.
 */
export function DcAcExplorer() {
  const [kind, setKind] = useState<WaveformKind>("dc");
  const [frequency, setFrequency] = useState(0.5);
  const [playing, setPlaying] = useState(true);
  const [clock, containerRef] = useSimulationClock<HTMLDivElement>(playing);
  // With reduced motion the clock stands still; show the AC wave at a positive peak instead of at 0 V.
  const reduceMotion = useReducedMotion();
  const time = reduceMotion ? 1 / (4 * frequency) : clock;

  const amplitude = kind === "dc" ? DC_VOLTS : AC_PEAK;
  const volts = waveformValue(kind, amplitude, frequency, time);
  const direction = Math.abs(volts) < 0.4 ? "none" : volts > 0 ? "forward" : "reverse";
  const brightness = Math.min(1, Math.abs(volts) / AC_PEAK);

  return (
    <div ref={containerRef}>
      <div className="grid grid-cols-1 gap-px bg-line lg:grid-cols-[1fr_1.25fr]">
        <div className="bg-breadboard flex items-center px-2 py-4 sm:px-5">
          <CircuitCanvas
            viewBox="0 0 380 240"
            interactive
            title={kind === "dc" ? "DC circuit" : "AC circuit"}
            description={
              kind === "dc"
                ? "A battery drives current steadily one way around the loop; the lamp glows steadily."
                : "An AC source pushes charge one way, then the other; the charges swing back and forth and the lamp brightens and dims."
            }
            className="mx-auto max-w-md"
          >
            <Wire d={LOOP} energized />
            {kind === "dc" ? (
              <CurrentFlow d={LOOP} active speed={45} />
            ) : (
              <CurrentFlow d={LOOP} active alternating={{ frequency, amplitude: 26 }} color="#67e8f9" />
            )}
            {kind === "dc" ? (
              <Battery x={LEFT} y={(TOP + BOTTOM) / 2} rotation={-90} detail={`${DC_VOLTS} V DC`} energized labelPlacement="right" labelOffset={26} />
            ) : (
              <AcSource x={LEFT} y={(TOP + BOTTOM) / 2} rotation={-90} detail={`${AC_PEAK} V peak`} energized labelPlacement="right" labelOffset={26} />
            )}
            <Lamp x={RIGHT} y={(TOP + BOTTOM) / 2} rotation={90} brightness={kind === "dc" ? 0.8 : brightness} labelPlacement="left" labelOffset={36} />
            <text x={(LEFT + RIGHT) / 2} y={(TOP + BOTTOM) / 2 - 8} textAnchor="middle" fontSize={20} fontWeight={600} fill={volts >= 0 ? "#fca5a5" : "#93c5fd"} fontFamily="var(--font-mono)">
              {volts >= 0 ? "+" : "−"}
              {formatFixed(Math.abs(volts), 1)} V
            </text>
            <text x={(LEFT + RIGHT) / 2} y={(TOP + BOTTOM) / 2 + 16} textAnchor="middle" fontSize={10} fill="#94a3b8" fontFamily="var(--font-mono)">
              {direction === "forward" ? "FLOWING CLOCKWISE" : direction === "reverse" ? "FLOWING ANTICLOCKWISE" : "MOMENTARILY ZERO"}
            </text>
          </CircuitCanvas>
        </div>
        <div className="space-y-4 bg-surface-raised p-4 sm:p-5">
          <WaveformVisualizer kind={kind} amplitude={amplitude} frequency={frequency} time={time} />
          <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-void/40 px-4 py-3" aria-live="polite">
            <span className="text-sm text-ink-muted">Current direction</span>
            <span className={cn("flex items-center gap-2 font-mono text-sm font-semibold", direction === "reverse" ? "text-electric" : "text-amber")}>
              {direction === "reverse" ? <ArrowLeft className="size-4" aria-hidden="true" /> : null}
              {direction === "forward" ? "Forward" : direction === "reverse" ? "Reverse" : "Changing over"}
              {direction === "forward" ? <ArrowRight className="size-4" aria-hidden="true" /> : null}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 border-t border-line p-4 sm:p-5 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <SegmentedControl
          label="Type of current"
          options={[
            { value: "dc" as const, label: "DC — direct" },
            { value: "ac" as const, label: "AC — alternating" },
          ]}
          value={kind}
          onChange={setKind}
        />
        <InteractiveSlider
          label="AC frequency (slowed down)"
          value={frequency}
          min={0.25}
          max={2}
          step={0.25}
          onChange={setFrequency}
          format={(f) => `${f} Hz`}
          disabled={kind === "dc"}
          hint="Real mains alternates 50–60 times a second — far too fast to see."
        />
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-pressed={!playing}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line-strong px-4 text-sm font-semibold text-ink hover:border-cyan/60"
        >
          {playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
          {playing ? "Pause" : "Play"}
        </button>
      </div>

      <div className="overflow-x-auto border-t border-line p-4 sm:p-5">
        <table className="w-full min-w-[34rem] text-left text-sm">
          <caption className="sr-only">Comparison of DC and AC</caption>
          <thead>
            <tr className="border-b border-line text-xs text-ink-subtle">
              <th scope="col" className="py-2 pr-3 font-medium">
                <span className="sr-only">Aspect</span>
              </th>
              <th scope="col" className={cn("py-2 pr-3 font-semibold", kind === "dc" ? "text-amber" : "")}>
                DC
              </th>
              <th scope="col" className={cn("py-2 font-semibold", kind === "ac" ? "text-cyan" : "")}>
                AC
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON.map((row) => (
              <tr key={row.aspect} className="border-b border-line/60 align-top last:border-0">
                <th scope="row" className="py-2.5 pr-3 font-medium text-ink">
                  {row.aspect}
                </th>
                <td className={cn("py-2.5 pr-3", kind === "dc" ? "text-ink" : "text-ink-subtle")}>{row.dc}</td>
                <td className={cn("py-2.5", kind === "ac" ? "text-ink" : "text-ink-subtle")}>{row.ac}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
