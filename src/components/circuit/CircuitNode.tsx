"use client";

import { motion } from "framer-motion";
import { CIRCUIT_COLORS } from "./constants";

interface CircuitNodeProps {
  x: number;
  y: number;
  /** Glow as a live junction. */
  active?: boolean;
  radius?: number;
}

/** A junction dot where two or more conductors connect. */
export function CircuitNode({ x, y, active = false, radius = 4.5 }: CircuitNodeProps) {
  return (
    <g aria-hidden="true">
      <motion.circle
        cx={x}
        cy={y}
        r={radius * 2.4}
        fill={CIRCUIT_COLORS.cyan}
        initial={false}
        animate={{ opacity: active ? 0.22 : 0 }}
      />
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={active ? CIRCUIT_COLORS.cyanSoft : CIRCUIT_COLORS.symbol}
      />
    </g>
  );
}
