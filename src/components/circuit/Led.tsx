"use client";

import { motion } from "framer-motion";
import { CircuitPart, type PartProps } from "./CircuitPart";
import { useCircuitIds } from "./CircuitCanvas";
import { CIRCUIT_BACKGROUND, CIRCUIT_COLORS, HALF_SPAN } from "./constants";

interface LedProps extends PartProps {
  /** 0–1 brightness. 0 = off. */
  brightness?: number;
  /** Emitted light colour. */
  color?: string;
  /** Draw the light-emission arrows. Set false to draw a plain diode. */
  emissionArrows?: boolean;
}

const TRIANGLE_HALF = 11;

/**
 * Light-emitting diode. Anode on the left (−x), cathode on the right (+x);
 * conventional current flows anode → cathode.
 */
export function Led({
  brightness = 0,
  color = CIRCUIT_COLORS.cyan,
  emissionArrows = true,
  name = "LED",
  ...part
}: LedProps) {
  const ids = useCircuitIds();
  const level = Math.max(0, Math.min(1, brightness));

  return (
    <CircuitPart name={name} {...part}>
      <rect x={-TRIANGLE_HALF - 3} y={-15} width={TRIANGLE_HALF * 2 + 6} height={30} fill={CIRCUIT_BACKGROUND} />
      <motion.circle
        r={26}
        fill={color}
        filter={`url(#${ids.softGlow})`}
        initial={false}
        animate={{ opacity: level * 0.85 }}
        transition={{ duration: 0.35 }}
      />
      <DiodeShape stroke={level > 0.05 ? color : CIRCUIT_COLORS.symbol} fill={color} fillOpacity={0.12 + level * 0.8} />
      {emissionArrows ? (
        <motion.g
          initial={false}
          animate={{ opacity: 0.45 + level * 0.55 }}
          stroke={level > 0.05 ? color : CIRCUIT_COLORS.symbolMuted}
          strokeWidth={1.75}
          fill="none"
          strokeLinecap="round"
        >
          <EmissionArrow x={-1} y={-14} />
          <EmissionArrow x={7} y={-12} />
        </motion.g>
      ) : null}
    </CircuitPart>
  );
}

/** The triangle-and-bar diode glyph shared by Diode and LED. */
export function DiodeShape({
  stroke,
  fill = "none",
  fillOpacity = 1,
}: {
  stroke: string;
  fill?: string;
  fillOpacity?: number;
}) {
  return (
    <g>
      <line x1={-HALF_SPAN} y1={0} x2={-TRIANGLE_HALF} y2={0} stroke={stroke} strokeWidth={3} />
      <line x1={TRIANGLE_HALF} y1={0} x2={HALF_SPAN} y2={0} stroke={stroke} strokeWidth={3} />
      <path
        d={`M ${-TRIANGLE_HALF} ${-TRIANGLE_HALF} L ${TRIANGLE_HALF} 0 L ${-TRIANGLE_HALF} ${TRIANGLE_HALF} Z`}
        fill={fill}
        fillOpacity={fillOpacity}
        stroke={stroke}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <line x1={TRIANGLE_HALF} y1={-TRIANGLE_HALF - 1} x2={TRIANGLE_HALF} y2={TRIANGLE_HALF + 1} stroke={stroke} strokeWidth={2.75} strokeLinecap="round" />
    </g>
  );
}

function EmissionArrow({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <line x1={0} y1={0} x2={7} y2={-9} />
      <path d="M 2.5 -8.5 L 7 -9 L 6.5 -4.5" />
    </g>
  );
}
