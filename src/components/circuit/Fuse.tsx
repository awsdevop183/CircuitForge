"use client";

import { CircuitPart, type PartProps } from "./CircuitPart";
import { CIRCUIT_BACKGROUND, CIRCUIT_COLORS, HALF_SPAN } from "./constants";

interface FuseProps extends PartProps {
  /** A blown fuse shows a broken element. */
  blown?: boolean;
  energized?: boolean;
}

/** Fuse: a thin wire in a small body that melts (opens) when current is too high. */
export function Fuse({ blown = false, energized = false, name = "Fuse", ...part }: FuseProps) {
  const stroke = energized ? CIRCUIT_COLORS.cyanSoft : CIRCUIT_COLORS.symbol;
  return (
    <CircuitPart name={name} detail={blown ? "blown" : undefined} {...part}>
      <line x1={-HALF_SPAN} y1={0} x2={-18} y2={0} stroke={stroke} strokeWidth={3} />
      <line x1={18} y1={0} x2={HALF_SPAN} y2={0} stroke={stroke} strokeWidth={3} />
      <rect x={-18} y={-8} width={36} height={16} rx={3} fill={CIRCUIT_BACKGROUND} stroke={stroke} strokeWidth={2.25} />
      {blown ? (
        <g stroke={CIRCUIT_COLORS.danger} strokeWidth={2.25} strokeLinecap="round">
          <line x1={-18} y1={0} x2={-5} y2={0} />
          <line x1={5} y1={0} x2={18} y2={0} />
          <path d="M -5 0 L -2 -4 M 5 0 L 2 4" />
        </g>
      ) : (
        <line x1={-18} y1={0} x2={18} y2={0} stroke={stroke} strokeWidth={1.5} />
      )}
    </CircuitPart>
  );
}
