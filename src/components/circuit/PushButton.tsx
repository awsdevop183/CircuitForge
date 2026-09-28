"use client";

import { motion } from "framer-motion";
import type { KeyboardEvent } from "react";
import { CircuitPart, type PartProps } from "./CircuitPart";
import { CIRCUIT_BACKGROUND, CIRCUIT_COLORS, HALF_SPAN } from "./constants";

interface PushButtonProps extends PartProps {
  /** "no" = normally open (closes while pressed); "nc" = normally closed (opens while pressed). */
  kind?: "no" | "nc";
  pressed: boolean;
  /** Makes the button operable: pointer down/up, or hold Space/Enter. */
  onPressChange?: (pressed: boolean) => void;
}

const CONTACT_X = 18;

/** Momentary push-button switch. Contacts close (NO) or open (NC) only while pressed. */
export function PushButton({ kind = "no", pressed, onPressChange, name, ...part }: PushButtonProps) {
  const closed = kind === "no" ? pressed : !pressed;
  const label = name ?? (kind === "no" ? "Push button (NO)" : "Push button (NC)");
  // NO: bar rests above the contacts; NC: bar rests on them. Pressing moves it down (NO) or up (NC).
  const barY = closed ? 0 : kind === "no" ? -10 : 10;
  const interactive = typeof onPressChange === "function";

  const onKeyDown = (event: KeyboardEvent<SVGGElement>) => {
    if ((event.key === " " || event.key === "Enter") && !event.repeat) {
      event.preventDefault();
      onPressChange?.(true);
    }
  };
  const onKeyUp = (event: KeyboardEvent<SVGGElement>) => {
    if (event.key === " " || event.key === "Enter") onPressChange?.(false);
  };

  const symbol = (
    <>
      <rect x={-CONTACT_X - 6} y={-30} width={CONTACT_X * 2 + 12} height={46} fill={CIRCUIT_BACKGROUND} />
      <line x1={-HALF_SPAN} y1={0} x2={-CONTACT_X} y2={0} stroke={CIRCUIT_COLORS.symbol} strokeWidth={3} />
      <line x1={CONTACT_X} y1={0} x2={HALF_SPAN} y2={0} stroke={CIRCUIT_COLORS.symbol} strokeWidth={3} />
      <circle cx={-CONTACT_X} cy={0} r={3.5} fill={CIRCUIT_BACKGROUND} stroke={CIRCUIT_COLORS.symbol} strokeWidth={2} />
      <circle cx={CONTACT_X} cy={0} r={3.5} fill={CIRCUIT_BACKGROUND} stroke={CIRCUIT_COLORS.symbol} strokeWidth={2} />
      <motion.g initial={false} animate={{ y: barY - 3 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}>
        <line x1={-CONTACT_X - 2} y1={0} x2={CONTACT_X + 2} y2={0} stroke={closed ? CIRCUIT_COLORS.cyanSoft : CIRCUIT_COLORS.amber} strokeWidth={3.5} strokeLinecap="round" />
        <line x1={0} y1={0} x2={0} y2={-14} stroke={CIRCUIT_COLORS.symbol} strokeWidth={2.5} />
        <line x1={-7} y1={-14} x2={7} y2={-14} stroke={CIRCUIT_COLORS.symbol} strokeWidth={2.5} strokeLinecap="round" />
      </motion.g>
    </>
  );

  return (
    <CircuitPart name={label} detail={closed ? "closed" : "open"} focusable={!interactive} {...part}>
      {interactive ? (
        <g
          role="button"
          aria-pressed={pressed}
          aria-label={`${label}. Press and hold to ${kind === "no" ? "close" : "open"} it.`}
          tabIndex={0}
          style={{ cursor: "pointer", touchAction: "none" }}
          onPointerDown={() => onPressChange?.(true)}
          onPointerUp={() => onPressChange?.(false)}
          onPointerLeave={() => pressed && onPressChange?.(false)}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onBlur={() => pressed && onPressChange?.(false)}
        >
          <rect x={-HALF_SPAN} y={-34} width={HALF_SPAN * 2} height={52} fill="transparent" />
          {symbol}
        </g>
      ) : (
        symbol
      )}
    </CircuitPart>
  );
}
