"use client";

import { CircuitPart, type PartProps } from "./CircuitPart";
import { CIRCUIT_COLORS } from "./constants";

export type GroundKind = "reference" | "earth" | "chassis";

interface GroundProps extends Omit<PartProps, "rotation"> {
  /**
   * reference — the circuit's 0 V reference (signal/common ground)
   * earth     — a real connection to the Earth (protective earth)
   * chassis   — the metal frame/case of the equipment
   */
  kind?: GroundKind;
  energized?: boolean;
}

const NAMES: Record<GroundKind, string> = {
  reference: "Ground (0 V reference)",
  earth: "Earth ground",
  chassis: "Chassis ground",
};

/**
 * Ground symbol. The connection point is at the part's origin; the symbol
 * hangs below it.
 */
export function Ground({ kind = "reference", energized = false, name, ...part }: GroundProps) {
  const stroke = energized ? CIRCUIT_COLORS.cyanSoft : CIRCUIT_COLORS.symbol;
  return (
    <CircuitPart name={name ?? NAMES[kind]} labelPlacement="bottom" labelOffset={40} {...part}>
      <g stroke={stroke} strokeWidth={2.75} strokeLinecap="round" fill="none">
        <line x1={0} y1={0} x2={0} y2={16} />
        {kind === "reference" ? (
          <path d="M -13 16 L 13 16 L 0 30 Z" strokeLinejoin="round" />
        ) : kind === "earth" ? (
          <>
            <line x1={-15} y1={16} x2={15} y2={16} />
            <line x1={-9} y1={22} x2={9} y2={22} />
            <line x1={-3.5} y1={28} x2={3.5} y2={28} />
          </>
        ) : (
          <>
            <line x1={-15} y1={16} x2={15} y2={16} />
            {[-15, -5, 5, 15].map((x) => (
              <line key={x} x1={x} y1={16} x2={x - 7} y2={27} />
            ))}
          </>
        )}
      </g>
    </CircuitPart>
  );
}
