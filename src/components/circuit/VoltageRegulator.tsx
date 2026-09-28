"use client";

import { CircuitPart, type PartProps } from "./CircuitPart";
import { CIRCUIT_BACKGROUND, CIRCUIT_COLORS, HALF_SPAN } from "./constants";

interface VoltageRegulatorProps extends PartProps {
  energized?: boolean;
  label?: string;
}

/** Three-terminal regulator: IN at (−40, 0), OUT at (40, 0), GND at (0, 40). */
export function VoltageRegulator({ energized = false, label = "REG", name = "Voltage regulator", ...part }: VoltageRegulatorProps) {
  const stroke = energized ? CIRCUIT_COLORS.cyanSoft : CIRCUIT_COLORS.symbol;
  return (
    <CircuitPart name={name} {...part}>
      <line x1={-HALF_SPAN} y1={0} x2={-24} y2={0} stroke={stroke} strokeWidth={3} />
      <line x1={24} y1={0} x2={HALF_SPAN} y2={0} stroke={stroke} strokeWidth={3} />
      <line x1={0} y1={16} x2={0} y2={HALF_SPAN} stroke={stroke} strokeWidth={3} />
      <rect x={-24} y={-16} width={48} height={32} rx={4} fill={CIRCUIT_BACKGROUND} stroke={stroke} strokeWidth={2.5} />
      <g fontFamily="var(--font-mono)" textAnchor="middle" aria-hidden="true">
        <text x={0} y={2} fontSize={10} fontWeight={700} fill={CIRCUIT_COLORS.amber} dominantBaseline="central">
          {label}
        </text>
        <text x={-15} y={-8} fontSize={6} fill={CIRCUIT_COLORS.labelMuted}>IN</text>
        <text x={14} y={-8} fontSize={6} fill={CIRCUIT_COLORS.labelMuted}>OUT</text>
        <text x={0} y={13} fontSize={6} fill={CIRCUIT_COLORS.labelMuted}>GND</text>
      </g>
    </CircuitPart>
  );
}
