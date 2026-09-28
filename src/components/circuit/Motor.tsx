"use client";

import { motion } from "framer-motion";
import { CircuitPart, type PartProps } from "./CircuitPart";
import { CIRCUIT_BACKGROUND, CIRCUIT_COLORS, HALF_SPAN } from "./constants";

interface MotorProps extends PartProps {
  /** 0–1 speed. 0 = stopped. */
  speed?: number;
}

const RADIUS = 18;

/** DC motor (circle with M) with a spinning rotor indicator. */
export function Motor({ speed = 0, name = "Motor", rotation = 0, ...part }: MotorProps) {
  const running = speed > 0.02;
  return (
    <CircuitPart name={name} detail={running ? "running" : "stopped"} rotation={rotation} {...part}>
      <line x1={-HALF_SPAN} y1={0} x2={-RADIUS} y2={0} stroke={CIRCUIT_COLORS.symbol} strokeWidth={3} />
      <line x1={RADIUS} y1={0} x2={HALF_SPAN} y2={0} stroke={CIRCUIT_COLORS.symbol} strokeWidth={3} />
      <circle r={RADIUS} fill={CIRCUIT_BACKGROUND} stroke={running ? CIRCUIT_COLORS.cyanSoft : CIRCUIT_COLORS.symbol} strokeWidth={2.5} />
      <motion.g
        animate={running ? { rotate: 360 } : { rotate: 0 }}
        transition={running ? { duration: 1.4 - speed, repeat: Infinity, ease: "linear" } : { duration: 0.3 }}
      >
        <circle r={12} fill="none" stroke={CIRCUIT_COLORS.amber} strokeWidth={1.5} strokeDasharray="5 5" opacity={running ? 1 : 0.35} />
      </motion.g>
      <text transform={`rotate(${-rotation})`} textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight={700} fontFamily="var(--font-mono)" fill={running ? CIRCUIT_COLORS.cyan : CIRCUIT_COLORS.symbol} aria-hidden="true">
        M
      </text>
    </CircuitPart>
  );
}
