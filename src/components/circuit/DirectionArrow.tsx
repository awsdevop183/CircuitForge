"use client";

import { motion } from "framer-motion";
import { CIRCUIT_COLORS } from "./constants";

interface DirectionArrowProps {
  x: number;
  y: number;
  /** Direction the arrow points, in degrees (0 = right, 90 = down). */
  angle: number;
  color?: string;
  size?: number;
  visible?: boolean;
}

/** A small chevron showing the direction of current along a wire. */
export function DirectionArrow({
  x,
  y,
  angle,
  color = CIRCUIT_COLORS.amber,
  size = 9,
  visible = true,
}: DirectionArrowProps) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`} aria-hidden="true">
      <motion.path
        d={`M ${-size * 0.6} ${-size * 0.75} L ${size * 0.6} 0 L ${-size * 0.6} ${size * 0.75}`}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </g>
  );
}
