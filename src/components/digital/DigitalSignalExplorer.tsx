"use client";

import { useState } from "react";
import { useSimulationClock } from "@/components/simulations/use-simulation-clock";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { Readout } from "@/components/ui/Readout";
import { formatFixed } from "@/lib/format";
import { LOGIC_COLORS } from "./constants";
import { DigitalIndicator } from "./DigitalIndicator";

const W = 680;
const H = 300;
const LEFT = 44;
const RIGHT = W - 16;
const TOP = 56;
const BOTTOM = 230;
const WINDOW = 2; // seconds on screen
const V_SCALE = 5.5;

const xAt = (t: number) => LEFT + (t / WINDOW) * (RIGHT - LEFT);
const yAt = (v: number) => BOTTOM - (v / V_SCALE) * (BOTTOM - TOP);

/**
 * A square wave you can shape: frequency, duty cycle and the two voltage
 * levels. Edges, period and HIGH time are labelled on the first cycle.
 */
export function DigitalSignalExplorer() {
  const [frequency, setFrequency] = useState(1.5);
  const [duty, setDuty] = useState(50);
  const [vHigh, setVHigh] = useState(5);
  const [vLow, setVLow] = useState(0);
  const [time, ref] = useSimulationClock<HTMLDivElement>();

  const period = 1 / frequency;
  const highTime = (duty / 100) * period;
  const phase = period * 0.35; // first rising edge
  const isHigh = (t: number) => ((((t - phase) % period) + period) % period) < highTime;

  // Build the waveform from its edges.
  const edges: { t: number; rising: boolean }[] = [];
  for (let k = -1; phase + k * period < WINDOW; k++) {
    const rise = phase + k * period;
    const fall = rise + highTime;
    if (rise > 0 && rise < WINDOW) edges.push({ t: rise, rising: true });
    if (fall > 0 && fall < WINDOW) edges.push({ t: fall, rising: false });
  }
  edges.sort((a, b) => a.t - b.t);
  const points: string[] = [];
  let level = isHigh(0) ? vHigh : vLow;
  points.push(`M ${xAt(0)} ${yAt(level)}`);
  for (const edge of edges) {
    points.push(`L ${xAt(edge.t).toFixed(1)} ${yAt(level)}`);
    level = edge.rising ? vHigh : vLow;
    points.push(`L ${xAt(edge.t).toFixed(1)} ${yAt(level)}`);
  }
  points.push(`L ${xAt(WINDOW)} ${yAt(level)}`);

  const r0 = phase;
  const f0 = phase + highTime;
  const r1 = phase + period;
  const cursorT = time % WINDOW;
  const nowHigh = isHigh(cursorT);

  return (
    <div ref={ref}>
      <div className="bg-logic-grid p-3 sm:p-5">
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[34rem]" role="img" aria-label={`Digital signal: ${formatFixed(frequency, 1)} hertz, ${duty}% duty cycle, HIGH ${formatFixed(vHigh, 1)} volts, LOW ${formatFixed(vLow, 1)} volts.`}>
            {[0, 1, 2, 3, 4, 5].map((v) => (
              <g key={v}>
                <line x1={LEFT} x2={RIGHT} y1={yAt(v)} y2={yAt(v)} stroke="#1f2a3a" />
                <text x={LEFT - 6} y={yAt(v) + 4} textAnchor="end" fontSize={10} fill="#7f8ea4" fontFamily="var(--font-mono)">
                  {v}V
                </text>
              </g>
            ))}
            {/* Level labels */}
            <text x={RIGHT} y={yAt(vHigh) - 8} textAnchor="end" fontSize={12} fontWeight={700} fill={LOGIC_COLORS.high} fontFamily="var(--font-mono)">
              HIGH (1) · {formatFixed(vHigh, 1)} V
            </text>
            <text x={RIGHT} y={yAt(vLow) + 18} textAnchor="end" fontSize={12} fontWeight={700} fill={LOGIC_COLORS.lowText} fontFamily="var(--font-mono)">
              LOW (0) · {formatFixed(vLow, 1)} V
            </text>
            <path d={points.join(" ")} fill="none" stroke={LOGIC_COLORS.high} strokeWidth={3} strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 4px #a3e63599)" }} />

            {/* Annotations on the first full cycle */}
            {r1 < WINDOW ? (
              <g fontFamily="var(--font-mono)" fontSize={11} fontWeight={700}>
                <Arrow x={xAt(r0)} y1={yAt(vLow) + 4} y2={yAt(vHigh) - 4} color={LOGIC_COLORS.clock} up />
                <text x={xAt(r0) - 6} y={TOP - 30} textAnchor="end" fill={LOGIC_COLORS.clock}>
                  Rising edge ↑
                </text>
                <Arrow x={xAt(f0)} y1={yAt(vHigh) + 4} y2={yAt(vLow) - 4} color="#f5a524" />
                <text x={xAt(f0) + 6} y={TOP - 30} fill="#f5a524">
                  ↓ Falling edge
                </text>
                {/* HIGH time bracket */}
                <Bracket x1={xAt(r0)} x2={xAt(f0)} y={yAt(vHigh) - 14} label="HIGH time" color={LOGIC_COLORS.highSoft} />
                {/* Period bracket */}
                <Bracket x1={xAt(r0)} x2={xAt(r1)} y={BOTTOM + 34} label={`Period T = ${formatFixed(period * 1000, 0)} ms`} color="#38bdf8" below />
              </g>
            ) : null}
            {/* Moving "now" cursor */}
            <line x1={xAt(cursorT)} x2={xAt(cursorT)} y1={TOP - 10} y2={BOTTOM + 6} stroke="#e8eef6" strokeOpacity={0.35} strokeDasharray="3 4" />
          </svg>
        </div>
        <p className="mt-2 text-xs text-ink-subtle">Slowed right down so you can see it. Real digital signals switch thousands to billions of times per second.</p>
      </div>
      <div className="grid gap-5 border-t border-line p-4 sm:p-5 md:grid-cols-2">
        <div className="space-y-4">
          <InteractiveSlider label="Frequency" value={frequency} min={0.5} max={3} step={0.1} onChange={setFrequency} format={(v) => `${formatFixed(v, 1)} Hz`} color="var(--color-clock)" hint="Cycles per second" />
          <InteractiveSlider label="Duty cycle" value={duty} min={10} max={90} step={5} onChange={setDuty} format={(v) => `${v}%`} color="var(--color-logic)" hint="Percentage of each cycle spent HIGH" />
          <InteractiveSlider label="HIGH voltage" value={vHigh} min={1.8} max={5} step={0.1} onChange={setVHigh} format={(v) => `${formatFixed(v, 1)} V`} color="var(--color-logic)" />
          <InteractiveSlider label="LOW voltage" value={vLow} min={0} max={0.8} step={0.1} onChange={setVLow} format={(v) => `${formatFixed(v, 1)} V`} color="var(--color-electric)" />
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Readout label="Frequency f" value={formatFixed(frequency, 1)} unit="Hz" tone="cyan" size="sm" />
            <Readout label="Period T = 1 ÷ f" value={formatFixed(period * 1000, 0)} unit="ms" size="sm" />
            <Readout label="HIGH time" value={formatFixed(highTime * 1000, 0)} unit="ms" tone="positive" size="sm" />
            <Readout label="LOW time" value={formatFixed((period - highTime) * 1000, 0)} unit="ms" size="sm" />
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-line bg-void/40 p-3">
            <DigitalIndicator value={nowHigh ? 1 : 0} />
            <p className="text-sm text-ink-muted">
              At the cursor the signal is <strong className="text-ink">{nowHigh ? `HIGH (${formatFixed(vHigh, 1)} V)` : `LOW (${formatFixed(vLow, 1)} V)`}</strong>. Whatever the exact voltages, a digital circuit reads it as {nowHigh ? "1" : "0"}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Arrow({ x, y1, y2, color, up = false }: { x: number; y1: number; y2: number; color: string; up?: boolean }) {
  const tip = up ? Math.min(y1, y2) : Math.max(y1, y2);
  const dir = up ? 1 : -1;
  return (
    <g>
      <line x1={x} x2={x} y1={y1} y2={y2} stroke={color} strokeWidth={2} />
      <path d={`M ${x - 6} ${tip + 9 * dir} L ${x} ${tip} L ${x + 6} ${tip + 9 * dir}`} fill="none" stroke={color} strokeWidth={2} />
    </g>
  );
}

function Bracket({ x1, x2, y, label, color, below = false }: { x1: number; x2: number; y: number; label: string; color: string; below?: boolean }) {
  const tick = below ? -6 : 6;
  return (
    <g>
      <path d={`M ${x1} ${y + tick} V ${y} H ${x2} V ${y + tick}`} fill="none" stroke={color} strokeWidth={1.5} />
      <text x={(x1 + x2) / 2} y={below ? y + 16 : y - 6} textAnchor="middle" fill={color}>
        {label}
      </text>
    </g>
  );
}
