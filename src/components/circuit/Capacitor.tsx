"use client";

import { motion } from "framer-motion";
import { CircuitPart, type PartProps } from "./CircuitPart";
import { CIRCUIT_BACKGROUND, CIRCUIT_COLORS, HALF_SPAN } from "./constants";

interface CapacitorProps extends PartProps {
  /** 0–1 state of charge. Shows stored charge on the plates. */
  charge?: number;
  /** Draw the curved negative plate of a polarised (electrolytic) capacitor. */
  polarized?: boolean;
}

const PLATE_OFFSET = 6;
const PLATE_HALF = 17;
const CHARGE_MARKS = [-11, 0, 11];

/** Capacitor. With `charge`, + and − charges appear on the plates. */
export function Capacitor({ charge = 0, polarized = false, name = "Capacitor", ...part }: CapacitorProps) {
  const level = Math.max(0, Math.min(1, charge));

  return (
    <CircuitPart name={name} {...part}>
      <rect x={-PLATE_OFFSET - 10} y={-PLATE_HALF - 2} width={PLATE_OFFSET * 2 + 20} height={PLATE_HALF * 2 + 4} fill={CIRCUIT_BACKGROUND} />
      <line x1={-HALF_SPAN} y1={0} x2={-PLATE_OFFSET} y2={0} stroke={CIRCUIT_COLORS.symbol} strokeWidth={3} />
      <line x1={PLATE_OFFSET} y1={0} x2={HALF_SPAN} y2={0} stroke={CIRCUIT_COLORS.symbol} strokeWidth={3} />
      <motion.rect
        x={-PLATE_OFFSET}
        y={-PLATE_HALF}
        width={PLATE_OFFSET * 2}
        height={PLATE_HALF * 2}
        fill={CIRCUIT_COLORS.cyan}
        initial={false}
        animate={{ opacity: level * 0.35 }}
      />
      <line x1={-PLATE_OFFSET} y1={-PLATE_HALF} x2={-PLATE_OFFSET} y2={PLATE_HALF} stroke={CIRCUIT_COLORS.symbol} strokeWidth={3} strokeLinecap="round" />
      {polarized ? (
        <path
          d={`M ${PLATE_OFFSET + 4} ${-PLATE_HALF} Q ${PLATE_OFFSET - 2} 0 ${PLATE_OFFSET + 4} ${PLATE_HALF}`}
          fill="none"
          stroke={CIRCUIT_COLORS.symbol}
          strokeWidth={3}
          strokeLinecap="round"
        />
      ) : (
        <line x1={PLATE_OFFSET} y1={-PLATE_HALF} x2={PLATE_OFFSET} y2={PLATE_HALF} stroke={CIRCUIT_COLORS.symbol} strokeWidth={3} strokeLinecap="round" />
      )}
      <motion.g initial={false} animate={{ opacity: level }} fontFamily="var(--font-mono)" fontSize={10} fontWeight={700} textAnchor="middle" dominantBaseline="central" aria-hidden="true">
        {CHARGE_MARKS.map((y) => (
          <g key={y}>
            <text x={-PLATE_OFFSET - 7} y={y} fill={CIRCUIT_COLORS.positive}>+</text>
            <text x={PLATE_OFFSET + 8} y={y} fill={CIRCUIT_COLORS.negative}>−</text>
          </g>
        ))}
      </motion.g>
    </CircuitPart>
  );
}
