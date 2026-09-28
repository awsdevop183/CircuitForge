"use client";

import { motion } from "framer-motion";
import { CIRCUIT_COLORS, type Point } from "./constants";

interface VoltageIndicatorProps {
  x: number;
  y: number;
  /** Measured value. */
  value: number;
  unit?: string;
  /** Meter caption, e.g. "Voltmeter". */
  label?: string;
  decimals?: number;
  /** Absolute points the red (+) and black (−) probes touch. */
  probes?: { positive: Point; negative: Point };
  /** 0–1 fill of the bar gauge beneath the reading. */
  level?: number;
  tone?: "cyan" | "amber";
}

const WIDTH = 96;
const HEIGHT = 50;

/** A digital-meter style readout, optionally with probe leads. */
export function VoltageIndicator({
  x,
  y,
  value,
  unit = "V",
  label = "Voltmeter",
  decimals = 1,
  probes,
  level,
  tone = "cyan",
}: VoltageIndicatorProps) {
  const accent = tone === "cyan" ? CIRCUIT_COLORS.cyan : CIRCUIT_COLORS.amber;
  const reading = `${Number.isFinite(value) ? value.toFixed(decimals) : "∞"} ${unit}`;
  const barWidth = WIDTH - 20;
  /** A lead exits on whichever side of the meter its probe point lies, so leads never cross. */
  const leadX = (target: Point, other: Point) => x + (target[0] <= other[0] ? -14 : 14);

  return (
    <g role="img" aria-label={`${label} reading ${reading}`}>
      {probes ? (
        <g aria-hidden="true" fill="none" strokeWidth={1.75} strokeDasharray="3 4" strokeLinecap="round">
          <path d={`M ${leadX(probes.positive, probes.negative)} ${y + HEIGHT / 2} L ${probes.positive[0]} ${probes.positive[1]}`} stroke={CIRCUIT_COLORS.positive} />
          <path d={`M ${leadX(probes.negative, probes.positive)} ${y + HEIGHT / 2} L ${probes.negative[0]} ${probes.negative[1]}`} stroke={CIRCUIT_COLORS.symbolMuted} />
          <circle cx={probes.positive[0]} cy={probes.positive[1]} r={3.5} fill={CIRCUIT_COLORS.positive} />
          <circle cx={probes.negative[0]} cy={probes.negative[1]} r={3.5} fill={CIRCUIT_COLORS.symbolMuted} />
        </g>
      ) : null}
      <g transform={`translate(${x - WIDTH / 2} ${y - HEIGHT / 2})`}>
        <rect width={WIDTH} height={HEIGHT} rx={8} fill="#0a1420" stroke={accent} strokeOpacity={0.55} />
        <text x={10} y={13} fontSize={8.5} fontFamily="var(--font-mono)" letterSpacing="0.12em" fill={CIRCUIT_COLORS.labelMuted} aria-hidden="true">
          {label.toUpperCase()}
        </text>
        <text x={WIDTH - 10} y={33} textAnchor="end" fontSize={17} fontWeight={600} fontFamily="var(--font-mono)" fill={accent} aria-hidden="true">
          {reading}
        </text>
        {typeof level === "number" ? (
          <g aria-hidden="true">
            <rect x={10} y={HEIGHT - 9} width={barWidth} height={3} rx={1.5} fill={CIRCUIT_COLORS.wireIdle} />
            <motion.rect
              x={10}
              y={HEIGHT - 9}
              height={3}
              rx={1.5}
              fill={accent}
              initial={false}
              animate={{ width: Math.max(0, Math.min(1, level)) * barWidth }}
              transition={{ type: "spring", stiffness: 200, damping: 26 }}
            />
          </g>
        ) : null}
      </g>
    </g>
  );
}
