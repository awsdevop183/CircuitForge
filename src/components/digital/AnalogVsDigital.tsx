"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSimulationClock } from "@/components/simulations/use-simulation-clock";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { formatFixed } from "@/lib/format";
import { cn } from "@/lib/cn";
import { LOGIC_COLORS } from "./constants";
import { DigitalIndicator } from "./DigitalIndicator";

type Mode = "analog" | "digital";

const W = 640;
const H = 220;
const TOP = 30;
const BOTTOM = 180;
const WINDOW = 4; // seconds shown
const BITS = "1011001110100101";
const BIT_TIME = 0.4;
const V_MAX = 5;

const analogVolts = (t: number) => 2.5 + 1.3 * Math.sin(2 * Math.PI * 0.35 * t) + 0.6 * Math.sin(2 * Math.PI * 1.1 * t + 1) + 0.25 * Math.sin(2 * Math.PI * 2.7 * t);
const bitAt = (t: number) => (BITS[((Math.floor(t / BIT_TIME) % BITS.length) + BITS.length) % BITS.length] === "1" ? 1 : 0);
const y = (v: number) => BOTTOM - (v / V_MAX) * (BOTTOM - TOP);

const EXAMPLES: Record<Mode, { title: string; detail: string }[]> = {
  analog: [
    { title: "Microphone signal", detail: "The voltage follows the sound wave smoothly." },
    { title: "Temperature", detail: "It can be 21.4 °C, 21.45 °C… any value in between." },
    { title: "Light intensity", detail: "Brightness fades smoothly from dark to bright." },
  ],
  digital: [
    { title: "Computer data", detail: "Every file, photo and program is stored as 0s and 1s." },
    { title: "USB data", detail: "Bits travel down the cable as fast changes between two states." },
    { title: "Digital sensors", detail: "Send their reading as a stream of bits." },
    { title: "Microcontroller signals", detail: "Pins are driven HIGH or LOW to switch things on and off." },
  ],
};

/** The same screen, two kinds of signal: continuously varying vs discrete states. */
export function AnalogVsDigital() {
  const [mode, setMode] = useState<Mode>("analog");
  const [time, ref] = useSimulationClock<HTMLDivElement>();
  const now = time + WINDOW;

  const d = Array.from({ length: 321 }, (_, i) => {
    const t = time + (i / 320) * WINDOW;
    const v = mode === "analog" ? analogVolts(t) : bitAt(t) ? V_MAX * 0.9 : 0.2;
    return `${i === 0 ? "M" : "L"} ${((i / 320) * W).toFixed(1)} ${y(v).toFixed(1)}`;
  }).join(" ");
  const current = mode === "analog" ? analogVolts(now) : bitAt(now) ? V_MAX * 0.9 : 0.2;
  const currentBit = bitAt(now) as 0 | 1;

  // Bit labels for the digital view, positioned at each bit's centre.
  const firstBit = Math.floor(time / BIT_TIME);
  const bitLabels = Array.from({ length: Math.ceil(WINDOW / BIT_TIME) + 1 }, (_, k) => {
    const index = firstBit + k;
    const x = ((index * BIT_TIME + BIT_TIME / 2 - time) / WINDOW) * W;
    return { x, value: bitAt(index * BIT_TIME + 0.001), key: index };
  }).filter((b) => b.x > 8 && b.x < W - 8);

  return (
    <div ref={ref}>
      <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <SegmentedControl
          label="Signal type"
          options={[
            { value: "analog" as const, label: "Analog" },
            { value: "digital" as const, label: "Digital" },
          ]}
          value={mode}
          onChange={setMode}
        />
        <p className="text-sm text-ink-muted">{mode === "analog" ? "Continuously varying: any value is possible." : "Discrete states: only LOW (0) or HIGH (1)."}</p>
      </div>
      <div className="grid gap-px bg-line md:grid-cols-[1fr_auto]">
        <div className={cn("p-3 sm:p-5", mode === "digital" ? "bg-logic-grid" : "bg-breadboard")}>
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={mode === "analog" ? "Analog waveform: a smooth, continuously changing voltage." : "Digital waveform: a voltage that jumps between two levels, carrying bits."}>
            {[0, 1, 2, 3, 4, 5].map((v) => (
              <g key={v}>
                <line x1={0} x2={W} y1={y(v)} y2={y(v)} stroke="#1f2a3a" />
                <text x={4} y={y(v) - 3} fontSize={10} fill="#7f8ea4" fontFamily="var(--font-mono)">
                  {v} V
                </text>
              </g>
            ))}
            {mode === "digital" ? (
              <>
                <text x={W - 4} y={y(V_MAX * 0.9) - 6} textAnchor="end" fontSize={11} fontWeight={700} fill={LOGIC_COLORS.high} fontFamily="var(--font-mono)">
                  HIGH = 1
                </text>
                <text x={W - 4} y={y(0.2) - 6} textAnchor="end" fontSize={11} fontWeight={700} fill={LOGIC_COLORS.lowText} fontFamily="var(--font-mono)">
                  LOW = 0
                </text>
                {bitLabels.map((b) => (
                  <text key={b.key} x={b.x} y={H - 8} textAnchor="middle" fontSize={14} fontWeight={700} fill={b.value ? LOGIC_COLORS.high : LOGIC_COLORS.lowText} fontFamily="var(--font-mono)">
                    {b.value}
                  </text>
                ))}
              </>
            ) : null}
            <path d={d} fill="none" stroke={mode === "analog" ? "#f5a524" : LOGIC_COLORS.high} strokeWidth={3} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 4px ${mode === "analog" ? "#f5a52499" : "#a3e63599"})` }} />
            <circle cx={W} cy={y(current)} r={6} fill={mode === "analog" ? "#f5a524" : LOGIC_COLORS.high} />
          </svg>
        </div>
        <div className="flex flex-row items-center justify-center gap-4 bg-surface-raised p-5 md:flex-col md:justify-center">
          <p className="eyebrow text-ink-subtle">Right now</p>
          {mode === "analog" ? (
            <p className="font-mono text-3xl text-amber tabular-nums">
              {formatFixed(current, 2)} <span className="text-lg">V</span>
            </p>
          ) : (
            <DigitalIndicator value={currentBit} size="lg" />
          )}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.ul key={mode} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid gap-2 border-t border-line p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
          {EXAMPLES[mode].map((example) => (
            <li key={example.title} className={cn("rounded-xl border p-3", mode === "analog" ? "border-amber/30 bg-amber/5" : "border-logic/30 bg-logic/5")}>
              <p className="font-semibold text-ink">{example.title}</p>
              <p className="mt-1 text-sm text-ink-muted">{example.detail}</p>
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </div>
  );
}
