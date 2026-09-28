"use client";

import { CircuitPart, type PartProps } from "./CircuitPart";
import { CIRCUIT_BACKGROUND, CIRCUIT_COLORS, HALF_SPAN } from "./constants";

interface AmmeterProps extends PartProps {
  /** Formatted reading shown on hover/focus, e.g. "0.10 A". */
  reading?: string;
  energized?: boolean;
}

const RADIUS = 15;

/** In-line current meter (circle with "A"). */
export function Ammeter({ reading, energized = false, name = "Ammeter", rotation = 0, ...part }: AmmeterProps) {
  const stroke = energized ? CIRCUIT_COLORS.cyanSoft : CIRCUIT_COLORS.symbol;
  return (
    <CircuitPart name={name} detail={reading} rotation={rotation} {...part}>
      <line x1={-HALF_SPAN} y1={0} x2={-RADIUS} y2={0} stroke={stroke} strokeWidth={3} />
      <line x1={RADIUS} y1={0} x2={HALF_SPAN} y2={0} stroke={stroke} strokeWidth={3} />
      <circle r={RADIUS} fill={CIRCUIT_BACKGROUND} stroke={stroke} strokeWidth={2.5} />
      <text
        transform={`rotate(${-rotation})`}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={15}
        fontWeight={700}
        fontFamily="var(--font-mono)"
        fill={energized ? CIRCUIT_COLORS.cyan : CIRCUIT_COLORS.symbol}
        aria-hidden="true"
      >
        A
      </text>
    </CircuitPart>
  );
}
