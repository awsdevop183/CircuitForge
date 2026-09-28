"use client";

import { motion } from "framer-motion";
import { CircuitPart, type PartProps } from "./CircuitPart";
import { CIRCUIT_BACKGROUND, CIRCUIT_COLORS, HALF_SPAN } from "./constants";

interface PotentiometerProps extends PartProps {
  /** Wiper position 0–1 along the track (left terminal → right terminal). */
  position?: number;
  energized?: boolean;
  /** Show the wiper terminal lead (3-terminal use). */
  showWiper?: boolean;
}

const BODY = 26;

/**
 * Potentiometer: a resistor with a movable wiper (arrow). Ends at (±40, 0);
 * wiper terminal at (0, −40) when shown.
 */
export function Potentiometer({ position = 0.5, energized = false, showWiper = true, name = "Potentiometer", ...part }: PotentiometerProps) {
  const stroke = energized ? CIRCUIT_COLORS.cyanSoft : CIRCUIT_COLORS.symbol;
  const wiperX = -BODY + Math.max(0, Math.min(1, position)) * BODY * 2;
  return (
    <CircuitPart name={name} detail={`${Math.round(position * 100)}%`} {...part}>
      <rect x={-BODY - 2} y={-11} width={BODY * 2 + 4} height={22} fill={CIRCUIT_BACKGROUND} />
      <line x1={-HALF_SPAN} y1={0} x2={-BODY} y2={0} stroke={stroke} strokeWidth={3} />
      <line x1={BODY} y1={0} x2={HALF_SPAN} y2={0} stroke={stroke} strokeWidth={3} />
      <rect x={-BODY} y={-8} width={BODY * 2} height={16} rx={2} fill="none" stroke={stroke} strokeWidth={2.5} />
      <motion.g initial={false} animate={{ x: wiperX }} transition={{ type: "spring", stiffness: 260, damping: 26 }}>
        {showWiper ? <line x1={0} y1={-HALF_SPAN} x2={0} y2={-18} stroke={CIRCUIT_COLORS.amber} strokeWidth={2.5} /> : null}
        <path d="M 0 -10 L -5 -19 L 5 -19 Z" fill={CIRCUIT_COLORS.amber} />
      </motion.g>
    </CircuitPart>
  );
}
