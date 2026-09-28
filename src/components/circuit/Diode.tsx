"use client";

import { CircuitPart, type PartProps } from "./CircuitPart";
import { CIRCUIT_BACKGROUND, CIRCUIT_COLORS } from "./constants";
import { DiodeShape } from "./Led";

interface DiodeProps extends PartProps {
  energized?: boolean;
}

/** Rectifier diode. Anode on the left (−x), cathode (bar) on the right (+x). */
export function Diode({ energized = false, name = "Diode", ...part }: DiodeProps) {
  return (
    <CircuitPart name={name} {...part}>
      <rect x={-14} y={-14} width={28} height={28} fill={CIRCUIT_BACKGROUND} />
      <DiodeShape stroke={energized ? CIRCUIT_COLORS.cyanSoft : CIRCUIT_COLORS.symbol} fill={CIRCUIT_COLORS.symbol} fillOpacity={0.15} />
    </CircuitPart>
  );
}
