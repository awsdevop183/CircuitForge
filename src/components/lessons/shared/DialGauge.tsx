"use client";

import { motion } from "framer-motion";

interface DialGaugeProps {
  value: number;
  max: number;
  label: string;
  unit: string;
  color?: string;
  /** Tick values printed on the dial. */
  ticks?: readonly number[];
}

const START_ANGLE = -120;
const SWEEP = 240;
const RADIUS = 62;

function polar(angleDeg: number, r: number): [number, number] {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return [80 + r * Math.cos(rad), 80 + r * Math.sin(rad)];
}

function arc(fromDeg: number, toDeg: number, r: number): string {
  const [x1, y1] = polar(fromDeg, r);
  const [x2, y2] = polar(toDeg, r);
  const large = toDeg - fromDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

/** An analogue dial — a physical-feeling way to show "how much push". */
export function DialGauge({ value, max, label, unit, color = "#f5a524", ticks = [] }: DialGaugeProps) {
  const fraction = Math.max(0, Math.min(1, value / max));
  const needleAngle = START_ANGLE + fraction * SWEEP;

  return (
    <svg viewBox="0 0 160 140" className="h-auto w-full" role="img" aria-label={`${label}: ${value} ${unit}`}>
      <path d={arc(START_ANGLE, START_ANGLE + SWEEP, RADIUS)} fill="none" stroke="#1a2432" strokeWidth={10} strokeLinecap="round" />
      <motion.path
        d={arc(START_ANGLE, START_ANGLE + SWEEP, RADIUS)}
        fill="none"
        stroke={color}
        strokeWidth={10}
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: Math.max(0.001, fraction) }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
      {ticks.map((tick) => {
        const angle = START_ANGLE + (tick / max) * SWEEP;
        const [x, y] = polar(angle, RADIUS - 20);
        return (
          <text key={tick} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={9} fill="#7f8ea4" fontFamily="var(--font-mono)">
            {tick}
          </text>
        );
      })}
      <g transform="translate(80 80)">
        {/* Rotates about the needle's base: bottom-centre of its bounding box. */}
        <motion.g
          initial={false}
          animate={{ rotate: needleAngle }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
          style={{ originX: 0.5, originY: 1 }}
        >
          <line x1={0} y1={0} x2={0} y2={-50} stroke="#e8eef6" strokeWidth={2.5} strokeLinecap="round" />
        </motion.g>
      </g>
      <circle cx={80} cy={80} r={6} fill="#e8eef6" />
      <text x={80} y={112} textAnchor="middle" fontSize={16} fontWeight={600} fill="#e8eef6" fontFamily="var(--font-mono)">
        {value} {unit}
      </text>
      <text x={80} y={130} textAnchor="middle" fontSize={9} letterSpacing="0.12em" fill="#7f8ea4" fontFamily="var(--font-mono)">
        {label.toUpperCase()}
      </text>
    </svg>
  );
}
