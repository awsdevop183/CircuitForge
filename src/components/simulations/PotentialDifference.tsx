"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Cable } from "lucide-react";
import { CircuitCanvas, CurrentFlow, Resistor, VoltageIndicator } from "@/components/circuit";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { formatAmps, formatFixed } from "@/lib/format";
import { currentFrom } from "@/lib/electronics";
import { cn } from "@/lib/cn";

const MAX_VOLTS = 12;
const PATH_OHMS = 1000;
const A_X = 110;
const B_X = 370;
const BASE_Y = 250;
const SCALE = 14; // px per volt

const PRESETS = [
  { label: "A 5 V · B 0 V", a: 5, b: 0 },
  { label: "A 9 V · B 3 V", a: 9, b: 3 },
  { label: "Both at 12 V", a: 12, b: 12 },
  { label: "A 2 V · B 8 V", a: 2, b: 8 },
] as const;

/**
 * Voltage is a difference between two points. Each point has an electric
 * potential (drawn as height); the voltmeter reads the difference, and current
 * only flows through a path when that difference isn't zero.
 */
export function PotentialDifference() {
  const [a, setA] = useState(5);
  const [b, setB] = useState(0);
  const [connected, setConnected] = useState(true);

  const difference = a - b;
  const current = connected ? currentFrom(Math.abs(difference), PATH_OHMS) : 0;
  const flowing = current > 0;
  const yOf = (volts: number) => BASE_Y - volts * SCALE;
  const aY = yOf(a);
  const bY = yOf(b);
  // Draw the path from higher to lower potential so conventional current runs along it.
  const [from, to] = difference >= 0 ? ([[A_X, aY], [B_X, bY]] as const) : ([[B_X, bY], [A_X, aY]] as const);
  const midX = (A_X + B_X) / 2;
  const midY = (aY + bY) / 2;
  const angle = (Math.atan2(bY - aY, B_X - A_X) * 180) / Math.PI;

  return (
    <div>
      <div className="bg-breadboard px-2 py-4 sm:px-6">
        <CircuitCanvas
          viewBox="0 0 480 280"
          interactive
          title="Potential difference between two points"
          description={`Point A is at ${a} volts and point B is at ${b} volts, a difference of ${Math.abs(difference)} volts. ${flowing ? `Current flows from ${difference > 0 ? "A to B" : "B to A"}.` : connected ? "With no difference, no current flows." : "The points are not connected, so no current flows."}`}
          className="mx-auto max-w-2xl"
        >
          {/* Potential scale */}
          {[0, 3, 6, 9, 12].map((v) => (
            <g key={v} aria-hidden="true">
              <line x1={40} x2={460} y1={yOf(v)} y2={yOf(v)} stroke="#1a2432" strokeDasharray={v === 0 ? undefined : "2 6"} />
              <text x={32} y={yOf(v)} textAnchor="end" dominantBaseline="central" fontSize={10} fill="#7f8ea4" fontFamily="var(--font-mono)">
                {v} V
              </text>
            </g>
          ))}
          <text x={40} y={yOf(12) - 18} fontSize={10} fill="#94a3b8" fontFamily="var(--font-mono)" aria-hidden="true">
            ELECTRIC POTENTIAL
          </text>

          {/* Columns showing each point's potential above 0 V */}
          {[
            { x: A_X, y: aY, v: a, label: "A" },
            { x: B_X, y: bY, v: b, label: "B" },
          ].map((point) => (
            <g key={point.label} aria-hidden="true">
              <motion.rect
                x={point.x - 18}
                width={36}
                initial={false}
                animate={{ y: point.y, height: Math.max(0, BASE_Y - point.y) }}
                fill={point.label === "A" ? "#f5a524" : "#38bdf8"}
                fillOpacity={0.14}
                rx={4}
              />
            </g>
          ))}

          {/* Path between the points */}
          {connected ? (
            <g>
              <line x1={A_X} y1={aY} x2={B_X} y2={bY} stroke={flowing ? "#22d3ee" : "#34445a"} strokeWidth={3} />
              <CurrentFlow d={`M ${from[0]} ${from[1]} L ${to[0]} ${to[1]}`} active={flowing} speed={20 + Math.abs(difference) * 12} />
              <g transform={`translate(${midX} ${midY}) rotate(${angle})`}>
                <Resistor x={0} y={0} name="Resistor path" detail="1 kΩ" energized={flowing} />
              </g>
            </g>
          ) : null}

          {[
            { x: A_X, y: aY, v: a, label: "A", color: "#f5a524" },
            { x: B_X, y: bY, v: b, label: "B", color: "#38bdf8" },
          ].map((point) => (
            <g key={point.label} transform={`translate(0 ${point.y})`}>
              <circle cx={point.x} cy={0} r={12} fill="#101722" stroke={point.color} strokeWidth={3} />
              <text x={point.x} y={0} textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700} fill={point.color}>
                {point.label}
              </text>
              <text x={point.x + (point.label === "A" ? -20 : 20)} y={-18} textAnchor={point.label === "A" ? "end" : "start"} fontSize={12} fill="#e8eef6" fontFamily="var(--font-mono)">
                {formatFixed(point.v, 1)} V
              </text>
            </g>
          ))}

          <VoltageIndicator x={midX} y={30} value={difference} label="A − B" decimals={1} probes={{ positive: [A_X, aY - 13], negative: [B_X, bY - 13] }} />
        </CircuitCanvas>
      </div>

      <div className="grid gap-5 border-t border-line p-4 sm:p-5 md:grid-cols-2">
        <InteractiveSlider label="Potential at point A" value={a} min={0} max={MAX_VOLTS} step={0.5} onChange={setA} format={(v) => `${formatFixed(v, 1)} V`} color="var(--color-amber)" />
        <InteractiveSlider label="Potential at point B" value={b} min={0} max={MAX_VOLTS} step={0.5} onChange={setB} format={(v) => `${formatFixed(v, 1)} V`} color="var(--color-electric)" />
        <div className="flex flex-wrap gap-2 md:col-span-2" role="group" aria-label="Presets">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setA(preset.a);
                setB(preset.b);
              }}
              className={cn(
                "min-h-10 rounded-lg border px-3 font-mono text-xs transition-colors",
                a === preset.a && b === preset.b ? "border-cyan/60 bg-cyan/10 text-cyan" : "border-line-strong text-ink-muted hover:text-ink",
              )}
            >
              {preset.label}
            </button>
          ))}
          <button
            type="button"
            aria-pressed={connected}
            onClick={() => setConnected((c) => !c)}
            className="ml-auto inline-flex min-h-10 items-center gap-2 rounded-lg border border-line-strong px-3 text-xs font-semibold text-ink hover:border-cyan/60"
          >
            <Cable className="size-4 text-amber" aria-hidden="true" />
            {connected ? "Disconnect the path" : "Connect A to B"}
          </button>
        </div>
      </div>

      <div className="grid gap-2 border-t border-line p-4 font-mono text-sm sm:grid-cols-3 sm:p-5" aria-live="polite">
        <p className="rounded-lg border border-line bg-void/40 px-3 py-2 text-ink-muted">
          Point A: <span className="text-amber">{formatFixed(a, 1)} V</span>
        </p>
        <p className="rounded-lg border border-line bg-void/40 px-3 py-2 text-ink-muted">
          Point B: <span className="text-electric">{formatFixed(b, 1)} V</span>
        </p>
        <p className="rounded-lg border border-cyan/40 bg-cyan/5 px-3 py-2 text-ink-muted">
          Difference: <span className="text-cyan">{formatFixed(Math.abs(difference), 1)} V</span>
        </p>
      </div>
      <p className="border-t border-line px-4 py-3 text-sm text-ink-muted sm:px-5">
        {difference === 0
          ? `Both points are at ${formatFixed(a, 1)} V. Even if that's high, the difference is 0 V — so nothing pushes charge between them. (This is why a bird can sit safely on a single power line.)`
          : !connected
            ? `There is a ${formatFixed(Math.abs(difference), 1)} V difference, but no path — so no current flows. Voltage can exist without current.`
            : `A ${formatFixed(Math.abs(difference), 1)} V difference pushes ${formatAmps(current, 2)} through the path, from the higher point (${difference > 0 ? "A" : "B"}) to the lower one.`}
      </p>
    </div>
  );
}
