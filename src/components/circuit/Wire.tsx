"use client";

import { motion } from "framer-motion";
import { useCircuitIds } from "./CircuitCanvas";
import { CIRCUIT_COLORS, WIRE_WIDTH, type Point } from "./constants";
import { pathThrough } from "./geometry";

type WireProps = {
  /** Illuminate the wire (current is flowing / conductor is live). */
  energized?: boolean;
  /** Colour used when energized. */
  color?: string;
  cornerRadius?: number;
  strokeWidth?: number;
  dashed?: boolean;
} & ({ points: readonly Point[]; d?: never } | { d: string; points?: never });

/** A conductor between parts. Accepts either a list of points or a raw path. */
export function Wire({
  points,
  d,
  energized = false,
  color = CIRCUIT_COLORS.wireEnergized,
  cornerRadius = 10,
  strokeWidth = WIRE_WIDTH,
  dashed = false,
}: WireProps) {
  const ids = useCircuitIds();
  const path = d ?? pathThrough(points ?? [], cornerRadius);

  return (
    <g aria-hidden="true">
      <path
        d={path}
        fill="none"
        stroke={CIRCUIT_COLORS.wireIdle}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashed ? "6 6" : undefined}
      />
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${ids.glow})`}
        initial={false}
        animate={{ opacity: energized ? 0.9 : 0 }}
        transition={{ duration: 0.45 }}
      />
    </g>
  );
}
