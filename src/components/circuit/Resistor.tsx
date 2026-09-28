"use client";

import { motion } from "framer-motion";
import { CircuitPart, type PartProps } from "./CircuitPart";
import { useCircuitIds } from "./CircuitCanvas";
import { CIRCUIT_BACKGROUND, CIRCUIT_COLORS, HALF_SPAN } from "./constants";

interface ResistorProps extends PartProps {
  /** 0–1: how hot the resistor is. Adds an amber/orange glow. */
  heat?: number;
  energized?: boolean;
}

const BODY_HALF = 24;
const ZIGZAG_AMPLITUDE = 9;
const ZIGZAG_PEAKS = 6;

function zigzagPath(): string {
  const step = (BODY_HALF * 2) / ZIGZAG_PEAKS;
  const points: string[] = [`M ${-BODY_HALF} 0`];
  for (let i = 0; i < ZIGZAG_PEAKS; i++) {
    const x = -BODY_HALF + step * (i + 0.5);
    const y = i % 2 === 0 ? -ZIGZAG_AMPLITUDE : ZIGZAG_AMPLITUDE;
    points.push(`L ${x} ${y}`);
  }
  points.push(`L ${BODY_HALF} 0`);
  return points.join(" ");
}

const ZIGZAG = zigzagPath();

/** Resistor (zig-zag symbol). Limits current; glows when dissipating heat. */
export function Resistor({ heat = 0, energized = false, name = "Resistor", ...part }: ResistorProps) {
  const ids = useCircuitIds();
  const hot = Math.max(0, Math.min(1, heat));
  const stroke = hot > 0.55 ? CIRCUIT_COLORS.orange : energized ? CIRCUIT_COLORS.cyanSoft : CIRCUIT_COLORS.symbol;

  return (
    <CircuitPart name={name} {...part}>
      <rect x={-BODY_HALF - 2} y={-14} width={BODY_HALF * 2 + 4} height={28} fill={CIRCUIT_BACKGROUND} />
      <motion.ellipse
        cx={0}
        cy={0}
        rx={30}
        ry={16}
        fill={CIRCUIT_COLORS.orange}
        filter={`url(#${ids.softGlow})`}
        animate={{ opacity: hot * 0.75 }}
        transition={{ duration: 0.4 }}
      />
      <line x1={-HALF_SPAN} y1={0} x2={-BODY_HALF} y2={0} stroke={stroke} strokeWidth={3} />
      <line x1={BODY_HALF} y1={0} x2={HALF_SPAN} y2={0} stroke={stroke} strokeWidth={3} />
      <path d={ZIGZAG} fill="none" stroke={stroke} strokeWidth={2.75} strokeLinejoin="round" strokeLinecap="round" />
    </CircuitPart>
  );
}
