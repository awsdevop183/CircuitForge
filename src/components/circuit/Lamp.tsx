"use client";

import { motion } from "framer-motion";
import { CircuitPart, type PartProps } from "./CircuitPart";
import { useCircuitIds } from "./CircuitCanvas";
import { CIRCUIT_BACKGROUND, CIRCUIT_COLORS, HALF_SPAN } from "./constants";

interface LampProps extends PartProps {
  /** 0–1 brightness. */
  brightness?: number;
}

const BULB_RADIUS = 17;

/** Incandescent lamp / light bulb (circle with filament). */
export function Lamp({ brightness = 0, name = "Light bulb", ...part }: LampProps) {
  const ids = useCircuitIds();
  const level = Math.max(0, Math.min(1, brightness));
  const lit = level > 0.02;

  return (
    <CircuitPart name={name} {...part}>
      <motion.circle
        r={BULB_RADIUS + 16}
        fill={CIRCUIT_COLORS.amber}
        filter={`url(#${ids.softGlow})`}
        initial={false}
        animate={{ opacity: level * 0.9, scale: 0.7 + level * 0.5 }}
        transition={{ duration: 0.4 }}
      />
      <line x1={-HALF_SPAN} y1={0} x2={-BULB_RADIUS} y2={0} stroke={CIRCUIT_COLORS.symbol} strokeWidth={3} />
      <line x1={BULB_RADIUS} y1={0} x2={HALF_SPAN} y2={0} stroke={CIRCUIT_COLORS.symbol} strokeWidth={3} />
      <circle r={BULB_RADIUS} fill={CIRCUIT_BACKGROUND} />
      <motion.circle
        r={BULB_RADIUS}
        initial={false}
        animate={{ fillOpacity: 0.1 + level * 0.55 }}
        fill={CIRCUIT_COLORS.amberSoft}
        stroke={lit ? CIRCUIT_COLORS.amber : CIRCUIT_COLORS.symbol}
        strokeWidth={2.5}
      />
      {/* Filament */}
      <path
        d="M -17 0 L -8 0 Q -6 -8 -3 0 Q 0 8 3 0 Q 6 -8 8 0 L 17 0"
        fill="none"
        stroke={lit ? "#fff7d6" : CIRCUIT_COLORS.symbolMuted}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </CircuitPart>
  );
}
