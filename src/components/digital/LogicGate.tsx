"use client";

import type { Point } from "@/components/circuit/constants";
import type { Bit, GateType } from "@/lib/logic";
import { LOGIC_COLORS, bitColor } from "./constants";

/** Where input leads start and the output lead ends, in the gate's local frame. */
export const GATE_PIN_X = 50;

export function inputPinYs(count: number): number[] {
  if (count <= 1) return [0];
  if (count === 2) return [-12, 12];
  return [-16, 0, 16];
}

/** Absolute pin positions for a gate drawn at (x, y). */
export function gatePins(x: number, y: number, count: number): { inputs: Point[]; output: Point } {
  return {
    inputs: inputPinYs(count).map((dy) => [x - GATE_PIN_X, y + dy] as const),
    output: [x + GATE_PIN_X, y] as const,
  };
}

const HALF_H = 22;
/** x of the curved back edge of OR-family shapes at height y (a quadratic from (-30,-22) via (-18,0)). */
function orBackX(y: number, offset = 0) {
  const t = (y + HALF_H) / (2 * HALF_H);
  return -30 + offset + 24 * t * (1 - t);
}

const BODY: Record<"and" | "or" | "not", string> = {
  and: "M -28 -22 H 2 A 22 22 0 0 1 2 22 H -28 Z",
  or: "M -30 -22 Q -18 0 -30 22 Q 4 22 26 0 Q 4 -22 -30 -22 Z",
  not: "M -22 -18 L 16 0 L -22 18 Z",
};

function family(type: GateType): "and" | "or" | "not" {
  if (type === "NOT") return "not";
  if (type === "AND" || type === "NAND") return "and";
  return "or";
}

const inverted = (type: GateType) => type === "NOT" || type === "NAND" || type === "NOR" || type === "XNOR";

/** Right-hand edge of the body (before the output lead). */
function bodyEnd(type: GateType) {
  const base = { and: 24, or: 26, not: 16 }[family(type)];
  return inverted(type) ? base + 8 : base;
}

interface LogicGateProps {
  type: GateType;
  x: number;
  y: number;
  /** Number of inputs drawn (NOT always has one). */
  inputCount?: number;
  inputValues?: readonly Bit[];
  output?: Bit;
  /** Draw a "?" box instead of the symbol (for mystery-gate questions). */
  hidden?: boolean;
  /** Show the gate's name under the symbol. Default true. */
  showName?: boolean;
  /** Emphasise the gate (e.g. the part a lesson is talking about). */
  highlighted?: boolean;
}

/**
 * A distinctive-shape logic gate symbol with its input and output leads,
 * coloured by the signals on them. Inputs arrive at x − 50, the output leaves at x + 50.
 */
export function LogicGate({ type, x, y, inputCount, inputValues = [], output, hidden = false, showName = true, highlighted = false }: LogicGateProps) {
  const count = type === "NOT" ? 1 : (inputCount ?? 2);
  const ys = inputPinYs(count);
  const fam = family(type);
  const end = hidden ? 30 : bodyEnd(type);
  const outColor = output === undefined ? LOGIC_COLORS.gate : bitColor(output);

  return (
    <g transform={`translate(${x} ${y})`} aria-hidden="true">
      {highlighted ? <rect x={-44} y={-34} width={88} height={68} rx={12} fill="none" stroke={LOGIC_COLORS.clock} strokeDasharray="4 4" /> : null}
      {/* Input leads */}
      {ys.map((dy, i) => {
        const backX = hidden ? -30 : fam === "and" ? -28 : fam === "not" ? -22 : orBackX(dy, type === "XOR" || type === "XNOR" ? -7 : 0);
        const value = inputValues[i];
        return <line key={dy} x1={-GATE_PIN_X} y1={dy} x2={backX} y2={dy} stroke={value === undefined ? LOGIC_COLORS.gate : bitColor(value)} strokeWidth={3} style={{ transition: "stroke 0.25s" }} />;
      })}
      {/* Output lead */}
      <line x1={end} y1={0} x2={GATE_PIN_X} y2={0} stroke={outColor} strokeWidth={3} style={{ transition: "stroke 0.25s" }} />
      {hidden ? (
        <>
          <rect x={-30} y={-24} width={60} height={48} rx={8} fill={LOGIC_COLORS.gateFill} stroke={LOGIC_COLORS.clock} strokeWidth={2.5} strokeDasharray="5 4" />
          <text x={0} y={2} textAnchor="middle" dominantBaseline="central" fontSize={22} fontWeight={700} fill={LOGIC_COLORS.clock} fontFamily="var(--font-mono)">
            ?
          </text>
        </>
      ) : (
        <>
          <path d={BODY[fam]} fill={LOGIC_COLORS.gateFill} stroke={LOGIC_COLORS.gate} strokeWidth={2.5} strokeLinejoin="round" />
          {type === "XOR" || type === "XNOR" ? <path d="M -37 -22 Q -25 0 -37 22" fill="none" stroke={LOGIC_COLORS.gate} strokeWidth={2.5} /> : null}
          {inverted(type) ? <circle cx={end - 4} cy={0} r={4} fill={LOGIC_COLORS.gateFill} stroke={LOGIC_COLORS.gate} strokeWidth={2.5} /> : null}
          {showName ? (
            <text x={fam === "not" ? -6 : -4} y={1} textAnchor="middle" dominantBaseline="central" fontSize={type.length > 3 ? 8.5 : 10} fontWeight={700} fill={LOGIC_COLORS.muted} fontFamily="var(--font-mono)">
              {type === "NOT" ? "" : type}
            </text>
          ) : null}
        </>
      )}
      {showName && type === "NOT" && !hidden ? (
        <text x={-4} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={LOGIC_COLORS.muted} fontFamily="var(--font-mono)">
          NOT
        </text>
      ) : null}
    </g>
  );
}
