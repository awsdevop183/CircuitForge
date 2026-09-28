"use client";

import { motion } from "framer-motion";
import type { KeyboardEvent } from "react";
import { CircuitPart, type PartProps } from "./CircuitPart";
import { CIRCUIT_BACKGROUND, CIRCUIT_COLORS, HALF_SPAN } from "./constants";

interface SwitchProps extends PartProps {
  closed: boolean;
  /** When provided the switch becomes an operable control (click, Enter, Space). */
  onToggle?: () => void;
}

const CONTACT_X = 20;
const LEVER_LENGTH = CONTACT_X * 2;
const OPEN_ANGLE = -32;

/** Single-pole single-throw switch. Pivot on the left contact. */
export function Switch({ closed, onToggle, name = "Switch", ...part }: SwitchProps) {
  const angle = ((closed ? 0 : OPEN_ANGLE) * Math.PI) / 180;
  const leverEnd = {
    x2: -CONTACT_X + Math.cos(angle) * LEVER_LENGTH,
    y2: Math.sin(angle) * LEVER_LENGTH,
  };
  const stroke = closed ? CIRCUIT_COLORS.cyanSoft : CIRCUIT_COLORS.amber;
  const interactive = typeof onToggle === "function";

  const handleKeyDown = (event: KeyboardEvent<SVGGElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle?.();
    }
  };

  const symbol = (
    <>
      <rect x={-CONTACT_X - 4} y={-26} width={CONTACT_X * 2 + 8} height={32} fill={CIRCUIT_BACKGROUND} />
      <line x1={-HALF_SPAN} y1={0} x2={-CONTACT_X} y2={0} stroke={CIRCUIT_COLORS.symbol} strokeWidth={3} />
      <line x1={CONTACT_X} y1={0} x2={HALF_SPAN} y2={0} stroke={CIRCUIT_COLORS.symbol} strokeWidth={3} />
      <motion.line
        x1={-CONTACT_X}
        y1={0}
        initial={false}
        animate={leverEnd}
        transition={{ type: "spring", stiffness: 380, damping: 24 }}
        stroke={stroke}
        strokeWidth={3.5}
        strokeLinecap="round"
      />
      <circle cx={-CONTACT_X} cy={0} r={4} fill={CIRCUIT_BACKGROUND} stroke={CIRCUIT_COLORS.symbol} strokeWidth={2} />
      <circle cx={CONTACT_X} cy={0} r={4} fill={CIRCUIT_BACKGROUND} stroke={closed ? CIRCUIT_COLORS.cyanSoft : CIRCUIT_COLORS.symbol} strokeWidth={2} />
    </>
  );

  return (
    <CircuitPart name={name} detail={closed ? "closed" : "open"} focusable={!interactive} {...part}>
      {interactive ? (
        <g
          role="switch"
          aria-checked={closed}
          aria-label={`${name}: ${closed ? "closed" : "open"}. Activate to ${closed ? "open" : "close"} it.`}
          tabIndex={0}
          onClick={onToggle}
          onKeyDown={handleKeyDown}
          style={{ cursor: "pointer" }}
        >
          <rect x={-HALF_SPAN} y={-32} width={HALF_SPAN * 2} height={48} fill="transparent" />
          {symbol}
        </g>
      ) : (
        symbol
      )}
    </CircuitPart>
  );
}
