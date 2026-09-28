"use client";

import { motion } from "framer-motion";
import { formatAmps, formatOhms } from "@/lib/format";

interface IVGraphProps {
  voltage: number;
  resistance: number;
  maxVoltage: number;
  maxCurrent: number;
}

const WIDTH = 320;
const HEIGHT = 200;
const PAD = { top: 14, right: 16, bottom: 34, left: 48 };
const PLOT_W = WIDTH - PAD.left - PAD.right;
const PLOT_H = HEIGHT - PAD.top - PAD.bottom;

/**
 * Current-vs-voltage line for the chosen resistance, with the present
 * operating point. A steeper line means less resistance.
 */
export function IVGraph({ voltage, resistance, maxVoltage, maxCurrent }: IVGraphProps) {
  const x = (v: number) => PAD.left + (v / maxVoltage) * PLOT_W;
  const y = (i: number) => PAD.top + PLOT_H - (Math.min(i, maxCurrent) / maxCurrent) * PLOT_H;

  // The line I = V/R, clipped where it leaves the top of the plot.
  const lineEndV = Math.min(maxVoltage, maxCurrent * resistance);
  const current = voltage / resistance;
  const pointVisible = current <= maxCurrent;
  const xTicks = [0, maxVoltage / 2, maxVoltage];
  const yTicks = [0, maxCurrent / 2, maxCurrent];

  return (
    <figure>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Graph of current against voltage for ${formatOhms(resistance)}. At ${voltage} volts the current is ${formatAmps(current)}.`}
      >
        {/* Recessive grid */}
        {yTicks.map((tick) => (
          <g key={`y-${tick}`}>
            <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y(tick)} y2={y(tick)} stroke="#1a2432" />
            <text x={PAD.left - 8} y={y(tick)} textAnchor="end" dominantBaseline="central" fontSize={10} fill="#7f8ea4" fontFamily="var(--font-mono)">
              {tick === 0 ? "0" : formatAmps(tick, 2)}
            </text>
          </g>
        ))}
        {xTicks.map((tick) => (
          <text key={`x-${tick}`} x={x(tick)} y={HEIGHT - PAD.bottom + 16} textAnchor="middle" fontSize={10} fill="#7f8ea4" fontFamily="var(--font-mono)">
            {tick} V
          </text>
        ))}
        <line x1={PAD.left} x2={PAD.left} y1={PAD.top} y2={PAD.top + PLOT_H} stroke="#263447" />
        <line x1={PAD.left} x2={WIDTH - PAD.right} y1={PAD.top + PLOT_H} y2={PAD.top + PLOT_H} stroke="#263447" />
        <text x={PAD.left + PLOT_W / 2} y={HEIGHT - 4} textAnchor="middle" fontSize={10} fill="#a3b1c4">
          Voltage
        </text>
        <text transform={`translate(12 ${PAD.top + PLOT_H / 2}) rotate(-90)`} textAnchor="middle" fontSize={10} fill="#a3b1c4">
          Current
        </text>

        {/* I = V / R */}
        <motion.line
          x1={x(0)}
          y1={y(0)}
          initial={false}
          animate={{ x2: x(lineEndV), y2: y(lineEndV / resistance) }}
          transition={{ type: "spring", stiffness: 160, damping: 24 }}
          stroke="#22d3ee"
          strokeWidth={2}
          strokeLinecap="round"
        />

        {/* Operating point with guides */}
        {pointVisible ? (
          <g>
            <motion.line
              initial={false}
              animate={{ x1: x(voltage), x2: x(voltage), y1: y(current), y2: PAD.top + PLOT_H }}
              stroke="#7f8ea4"
              strokeDasharray="2 3"
            />
            <motion.line
              initial={false}
              animate={{ x1: PAD.left, x2: x(voltage), y1: y(current), y2: y(current) }}
              stroke="#7f8ea4"
              strokeDasharray="2 3"
            />
            <motion.circle
              r={5}
              initial={false}
              animate={{ cx: x(voltage), cy: y(current) }}
              transition={{ type: "spring", stiffness: 200, damping: 24 }}
              fill="#f5a524"
              stroke="#101722"
              strokeWidth={2}
            />
          </g>
        ) : (
          <text x={WIDTH - PAD.right} y={PAD.top + 10} textAnchor="end" fontSize={10} fill="#e8eef6">
            ↑ off the chart ({formatAmps(current, 2)})
          </text>
        )}
      </svg>
      <figcaption className="mt-1 text-xs text-ink-subtle">
        Steeper line = less resistance. The amber dot is your current setting.
      </figcaption>
    </figure>
  );
}
