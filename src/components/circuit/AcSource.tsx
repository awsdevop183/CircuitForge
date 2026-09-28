"use client";

import { CircuitPart, type PartProps } from "./CircuitPart";
import { CIRCUIT_BACKGROUND, CIRCUIT_COLORS, HALF_SPAN } from "./constants";

const RADIUS = 17;

/** Alternating-current voltage source (circle with a sine wave). */
export function AcSource({ name = "AC source", energized = false, ...part }: PartProps & { energized?: boolean }) {
  const stroke = energized ? CIRCUIT_COLORS.cyanSoft : CIRCUIT_COLORS.symbol;
  return (
    <CircuitPart name={name} {...part}>
      <line x1={-HALF_SPAN} y1={0} x2={-RADIUS} y2={0} stroke={stroke} strokeWidth={3} />
      <line x1={RADIUS} y1={0} x2={HALF_SPAN} y2={0} stroke={stroke} strokeWidth={3} />
      <circle r={RADIUS} fill={CIRCUIT_BACKGROUND} stroke={stroke} strokeWidth={2.5} />
      <path d="M -10 0 C -6 -12, -2 -12, 0 0 S 6 12, 10 0" fill="none" stroke={CIRCUIT_COLORS.amber} strokeWidth={2.25} strokeLinecap="round" />
    </CircuitPart>
  );
}
