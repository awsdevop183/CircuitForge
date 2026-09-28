"use client";

import { CircuitPart, type PartProps } from "./CircuitPart";
import { CIRCUIT_BACKGROUND, CIRCUIT_COLORS } from "./constants";

interface TransistorProps extends PartProps {
  /** Show B / C / E pin letters. */
  showPins?: boolean;
  energized?: boolean;
}

/**
 * NPN bipolar junction transistor. Local frame: base enters from the left
 * (−40, 0), collector exits at the top (10, −40), emitter at the bottom (10, 40).
 */
export function Transistor({ showPins = true, energized = false, name = "NPN transistor", ...part }: TransistorProps) {
  const stroke = energized ? CIRCUIT_COLORS.cyanSoft : CIRCUIT_COLORS.symbol;
  return (
    <CircuitPart name={name} labelOffset={48} {...part}>
      <circle r={24} cx={2} fill={CIRCUIT_BACKGROUND} stroke={CIRCUIT_COLORS.symbolMuted} strokeWidth={1.5} />
      <g stroke={stroke} strokeWidth={2.75} strokeLinecap="round" fill="none">
        <line x1={-40} y1={0} x2={-8} y2={0} />
        <line x1={-8} y1={-14} x2={-8} y2={14} strokeWidth={4} />
        <path d="M -8 -6 L 10 -18 L 10 -40" />
        <path d="M -8 6 L 10 18 L 10 40" />
      </g>
      {/* Emitter arrow points outwards for NPN */}
      <path d="M 10 18 L 0.5 16.5 L 5 10 Z" fill={stroke} />
      {showPins ? <PinLetters pins={[["B", -30, -9], ["C", 22, -32], ["E", 22, 36]]} /> : null}
    </CircuitPart>
  );
}

export function PinLetters({ pins }: { pins: readonly (readonly [string, number, number])[] }) {
  return (
    <g fontFamily="var(--font-mono)" fontSize={10} fill={CIRCUIT_COLORS.labelMuted} textAnchor="middle" aria-hidden="true">
      {pins.map(([letter, x, y]) => (
        <text key={letter} x={x} y={y} dominantBaseline="central">
          {letter}
        </text>
      ))}
    </g>
  );
}
