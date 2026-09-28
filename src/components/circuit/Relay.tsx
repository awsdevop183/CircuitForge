"use client";

import { motion } from "framer-motion";
import { CircuitPart, type PartProps } from "./CircuitPart";
import { CIRCUIT_BACKGROUND, CIRCUIT_COLORS } from "./constants";

interface RelayProps extends PartProps {
  /** Coil energized → contact closes. */
  energized?: boolean;
}

/**
 * Electromechanical relay: a coil (left) mechanically linked to a normally-open
 * contact (right). Coil pins at (−22, ±40), contact pins at (18, ±40).
 */
export function Relay({ energized = false, name = "Relay", ...part }: RelayProps) {
  const leverTip = energized ? { x2: 18, y2: -16 } : { x2: 32, y2: -12 };
  const coilStroke = energized ? CIRCUIT_COLORS.cyanSoft : CIRCUIT_COLORS.symbol;
  return (
    <CircuitPart name={name} labelOffset={48} {...part}>
      <rect x={-40} y={-40} width={80} height={80} fill="transparent" />
      <g stroke={coilStroke} strokeWidth={2.5} fill="none" strokeLinecap="round">
        <line x1={-22} y1={-40} x2={-22} y2={-17} />
        <line x1={-22} y1={17} x2={-22} y2={40} />
        <rect x={-32} y={-17} width={20} height={34} rx={2} fill={CIRCUIT_BACKGROUND} />
        <path d="M -32 -10 L -12 10" strokeWidth={1.75} />
      </g>
      <line x1={-12} y1={0} x2={24} y2={0} stroke={CIRCUIT_COLORS.symbolMuted} strokeWidth={1.5} strokeDasharray="3 3" />
      <g stroke={CIRCUIT_COLORS.symbol} strokeWidth={2.5} strokeLinecap="round">
        <line x1={18} y1={40} x2={18} y2={16} />
        <line x1={18} y1={-16} x2={18} y2={-40} />
      </g>
      <motion.line
        x1={18}
        y1={16}
        initial={false}
        animate={leverTip}
        stroke={energized ? CIRCUIT_COLORS.cyanSoft : CIRCUIT_COLORS.amber}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <circle cx={18} cy={16} r={3.5} fill={CIRCUIT_BACKGROUND} stroke={CIRCUIT_COLORS.symbol} strokeWidth={2} />
      <circle cx={18} cy={-16} r={3.5} fill={CIRCUIT_BACKGROUND} stroke={CIRCUIT_COLORS.symbol} strokeWidth={2} />
    </CircuitPart>
  );
}
