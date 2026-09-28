"use client";

import { CircuitPart, type PartProps } from "./CircuitPart";
import { CIRCUIT_BACKGROUND, CIRCUIT_COLORS, HALF_SPAN } from "./constants";

interface BatteryProps extends PartProps {
  /** Number of cells drawn in the symbol. */
  cells?: 1 | 2;
  /** Show + / − terminal markings. */
  showPolarity?: boolean;
  /** Highlight the terminals (e.g. when the circuit is live). */
  energized?: boolean;
}

const LONG_PLATE = 16;
const SHORT_PLATE = 8;
const PLATE_GAP = 7;

/**
 * DC voltage source. Negative terminal on the left (−x), positive on the right (+x)
 * in the part's local frame.
 */
export function Battery({
  cells = 2,
  showPolarity = true,
  energized = false,
  name = "Battery",
  rotation = 0,
  ...part
}: BatteryProps) {
  // Plates from left to right alternate short (−) and long (+).
  const plateCount = cells * 2;
  const firstX = -((plateCount - 1) * PLATE_GAP) / 2;
  const plates = Array.from({ length: plateCount }, (_, i) => ({
    x: firstX + i * PLATE_GAP,
    isLong: i % 2 === 1,
  }));
  const leftEdge = plates[0]!.x;
  const rightEdge = plates[plates.length - 1]!.x;
  const stroke = energized ? CIRCUIT_COLORS.cyanSoft : CIRCUIT_COLORS.symbol;

  return (
    <CircuitPart name={name} rotation={rotation} {...part}>
      <rect x={leftEdge - 6} y={-LONG_PLATE - 2} width={rightEdge - leftEdge + 12} height={LONG_PLATE * 2 + 4} fill={CIRCUIT_BACKGROUND} />
      <line x1={-HALF_SPAN} y1={0} x2={leftEdge} y2={0} stroke={stroke} strokeWidth={3} />
      <line x1={rightEdge} y1={0} x2={HALF_SPAN} y2={0} stroke={stroke} strokeWidth={3} />
      {plates.map((plate) => (
        <line
          key={plate.x}
          x1={plate.x}
          x2={plate.x}
          y1={plate.isLong ? -LONG_PLATE : -SHORT_PLATE}
          y2={plate.isLong ? LONG_PLATE : SHORT_PLATE}
          stroke={stroke}
          strokeWidth={plate.isLong ? 2.5 : 5}
          strokeLinecap="round"
        />
      ))}
      {showPolarity ? (
        <>
          <PolaritySign x={rightEdge + 12} y={-16} sign="+" rotation={rotation} />
          <PolaritySign x={leftEdge - 12} y={-16} sign="−" rotation={rotation} />
        </>
      ) : null}
    </CircuitPart>
  );
}

function PolaritySign({ x, y, sign, rotation }: { x: number; y: number; sign: "+" | "−"; rotation: number }) {
  return (
    <text
      x={x}
      y={y}
      transform={`rotate(${-rotation} ${x} ${y})`}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={15}
      fontWeight={700}
      fontFamily="var(--font-mono)"
      fill={sign === "+" ? CIRCUIT_COLORS.positive : CIRCUIT_COLORS.negative}
      aria-hidden="true"
    >
      {sign}
    </text>
  );
}
