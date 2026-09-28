"use client";

import { CircuitPart, type PartProps } from "./CircuitPart";
import { CIRCUIT_BACKGROUND, CIRCUIT_COLORS } from "./constants";
import { PinLetters } from "./Transistor";

interface MosfetProps extends PartProps {
  showPins?: boolean;
  /** Channel is conducting — highlights the channel segments. */
  conducting?: boolean;
}

/**
 * N-channel enhancement-mode MOSFET. Local frame: gate from the left (−40, 8),
 * drain at the top (10, −40), source at the bottom (10, 40).
 */
export function Mosfet({ showPins = true, conducting = false, name = "N-channel MOSFET", ...part }: MosfetProps) {
  const channel = conducting ? CIRCUIT_COLORS.cyan : CIRCUIT_COLORS.symbol;
  return (
    <CircuitPart name={name} labelOffset={48} {...part}>
      <circle r={25} cx={0} fill={CIRCUIT_BACKGROUND} stroke={CIRCUIT_COLORS.symbolMuted} strokeWidth={1.5} />
      <g stroke={CIRCUIT_COLORS.symbol} strokeWidth={2.75} strokeLinecap="round" fill="none">
        {/* Gate */}
        <line x1={-40} y1={10} x2={-13} y2={10} />
        <line x1={-13} y1={-14} x2={-13} y2={10} />
        {/* Drain and source connections */}
        <path d="M -6 -12 L 10 -12 L 10 -40" />
        <path d="M -6 12 L 10 12 L 10 40" />
        <path d="M -6 0 L 10 0 L 10 12" />
      </g>
      {/* Channel segments (enhancement mode = broken line) */}
      <g stroke={channel} strokeWidth={3.5} strokeLinecap="round">
        <line x1={-6} y1={-17} x2={-6} y2={-8} />
        <line x1={-6} y1={-4} x2={-6} y2={4} />
        <line x1={-6} y1={8} x2={-6} y2={17} />
      </g>
      {/* Body arrow points into the channel for N-channel */}
      <path d="M -5 0 L 3 -4.5 L 3 4.5 Z" fill={CIRCUIT_COLORS.symbol} />
      {showPins ? <PinLetters pins={[["G", -30, 1], ["D", 22, -32], ["S", 22, 36]]} /> : null}
    </CircuitPart>
  );
}
