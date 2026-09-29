"use client";

import type { KeyboardEvent } from "react";
import { CircuitCanvas } from "@/components/circuit";
import type { Point } from "@/components/circuit/constants";
import { pathThrough } from "@/components/circuit/geometry";
import { pinCount, type Bit, type GateType } from "@/lib/logic";
import { LOGIC_COLORS, bitColor } from "./constants";
import { LogicGate, gatePins } from "./LogicGate";
import { SignalWire } from "./SignalWire";

export interface ViewInput {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface ViewGate {
  id: string;
  type: GateType;
  x: number;
  y: number;
  inputs: readonly (string | null)[];
  /** Draw as a "?" mystery box. */
  hidden?: boolean;
  highlighted?: boolean;
  /** Small name tag above the gate, e.g. "G1". */
  label?: string;
  /** Draw the output lead neutral (don't reveal its value). */
  hideOutput?: boolean;
}

export interface ViewOutput {
  id: string;
  label: string;
  x: number;
  y: number;
  source: string | null;
}

interface LogicCircuitViewProps {
  inputs: readonly ViewInput[];
  gates: readonly ViewGate[];
  outputs: readonly ViewOutput[];
  /** Value of every input and gate, by id. */
  values: Readonly<Record<string, Bit>>;
  /** When provided, the input switches in the diagram are operable. */
  onToggleInput?: (id: string) => void;
  width: number;
  height: number;
  title: string;
  description?: string;
  /** Minimum rendered width in px; narrower screens scroll horizontally. */
  minWidth?: number;
  /** Maximum rendered width in px, so small circuits don't blow up on wide screens. */
  maxWidth?: number;
  className?: string;
}

const SWITCH_W = 40;

/**
 * Renders a small gate network: input switches → wires → gates → output lamps.
 * Wires light up and pulse as signals change, rippling from inputs to outputs.
 */
export function LogicCircuitView({ inputs, gates, outputs, values, onToggleInput, width, height, title, description, minWidth = 0, maxWidth, className }: LogicCircuitViewProps) {
  const inputById = new Map(inputs.map((i) => [i.id, i]));
  const gateById = new Map(gates.map((g) => [g.id, g]));

  // Depth (distance from the inputs) sets how long a change takes to ripple to each wire.
  const depth = new Map<string, number>();
  const depthOf = (id: string, seen = new Set<string>()): number => {
    if (inputById.has(id)) return 0;
    if (depth.has(id)) return depth.get(id)!;
    const gate = gateById.get(id);
    if (!gate || seen.has(id)) return 0;
    seen.add(id);
    const d = 1 + Math.max(0, ...gate.inputs.filter((s): s is string => s !== null).map((s) => depthOf(s, seen)));
    depth.set(id, d);
    return d;
  };

  const sourcePoint = (id: string): Point | null => {
    const input = inputById.get(id);
    if (input) return [input.x + SWITCH_W / 2, input.y];
    const gate = gateById.get(id);
    if (gate) return gatePins(gate.x, gate.y, pinCount(gate)).output;
    return null;
  };

  const wires: { key: string; source: string; d: string; value: Bit; delay: number; turn: Point }[] = [];
  const route = (key: string, source: string | null, to: Point) => {
    if (!source) return;
    const from = sourcePoint(source);
    if (!from) return;
    const midX = Math.max(from[0] + 8, to[0] - 16);
    const straight = Math.abs(from[1] - to[1]) < 0.5;
    const points: Point[] = straight ? [from, to] : [from, [midX, from[1]], [midX, to[1]], to];
    wires.push({ key, source, d: pathThrough(points, 6), value: values[source] ?? 0, delay: depthOf(source) * 0.3, turn: straight ? to : [midX, from[1]] });
  };
  for (const gate of gates) {
    const pins = gatePins(gate.x, gate.y, pinCount(gate)).inputs;
    gate.inputs.slice(0, pins.length).forEach((source, i) => route(`${gate.id}-${i}`, source, pins[i]!));
  }
  for (const output of outputs) route(`out-${output.id}`, output.source, [output.x - 18, output.y]);

  // Junction dots where one signal splits: every branch point, except a lone wire's turn at the far end.
  const junctions: { key: string; point: Point; value: Bit }[] = [];
  const bySource = new Map<string, typeof wires>();
  for (const w of wires) bySource.set(w.source, [...(bySource.get(w.source) ?? []), w]);
  for (const [source, group] of bySource) {
    if (group.length < 2) continue;
    const furthest = Math.max(...group.map((w) => w.turn[0]));
    for (const w of group) {
      const shared = group.filter((o) => o.turn[0] === w.turn[0] && o.turn[1] === w.turn[1]).length > 1;
      if ((w.turn[0] < furthest || shared) && !junctions.some((j) => j.point[0] === w.turn[0] && j.point[1] === w.turn[1])) {
        junctions.push({ key: `${source}-${w.key}`, point: w.turn, value: w.value });
      }
    }
  }

  const onKey = (id: string) => (event: KeyboardEvent<SVGGElement>) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      onToggleInput?.(id);
    }
  };

  return (
    <div className={className} style={{ ...(minWidth ? { overflowX: "auto" } : {}), ...(maxWidth ? { maxWidth, marginInline: "auto" } : {}) }}>
      <CircuitCanvas viewBox={`0 0 ${width} ${height}`} title={title} description={description} interactive={Boolean(onToggleInput)} className="h-auto w-full" style={minWidth ? { minWidth } : undefined}>
        {wires.map((w) => (
          <SignalWire key={`${w.key}-${w.value}`} d={w.d} value={w.value} delay={w.delay} />
        ))}
        {junctions.map((j) => (
          <circle key={j.key} cx={j.point[0]} cy={j.point[1]} r={4.5} fill={bitColor(j.value)} aria-hidden="true" />
        ))}
        {gates.map((gate) => (
          <LogicGate
            key={gate.id}
            type={gate.type}
            x={gate.x}
            y={gate.y}
            inputCount={pinCount(gate)}
            inputValues={gate.inputs.map((s) => (s ? (values[s] ?? 0) : 0))}
            output={gate.hideOutput ? undefined : (values[gate.id] ?? 0)}
            hidden={gate.hidden}
            highlighted={gate.highlighted}
          />
        ))}
        {gates.map((gate) =>
          gate.label ? (
            <text key={`label-${gate.id}`} x={gate.x} y={gate.y - 30} textAnchor="middle" fontSize={11} fontWeight={700} fill={LOGIC_COLORS.clock} fontFamily="var(--font-mono)" aria-hidden="true">
              {gate.label}
            </text>
          ) : null,
        )}
        {inputs.map((input) => {
          const value = values[input.id] ?? 0;
          const interactive = Boolean(onToggleInput);
          return (
            <g
              key={input.id}
              transform={`translate(${input.x} ${input.y})`}
              role={interactive ? "switch" : undefined}
              aria-checked={interactive ? value === 1 : undefined}
              aria-label={interactive ? `Input ${input.label}` : undefined}
              tabIndex={interactive ? 0 : undefined}
              onClick={interactive ? () => onToggleInput?.(input.id) : undefined}
              onKeyDown={interactive ? onKey(input.id) : undefined}
              className={interactive ? "logic-switch cursor-pointer outline-none" : undefined}
            >
              <text x={-SWITCH_W / 2 - 8} y={1} textAnchor="end" dominantBaseline="central" fontSize={15} fontWeight={700} fill={LOGIC_COLORS.label} fontFamily="var(--font-mono)">
                {input.label}
              </text>
              <rect x={-SWITCH_W / 2} y={-15} width={SWITCH_W} height={30} rx={8} fill={value ? "rgb(163 230 53 / 0.18)" : LOGIC_COLORS.gateFill} stroke={bitColor(value)} strokeWidth={2.5} style={{ transition: "all 0.25s" }} />
              <text x={0} y={1} textAnchor="middle" dominantBaseline="central" fontSize={17} fontWeight={700} fill={value ? LOGIC_COLORS.highSoft : LOGIC_COLORS.lowText} fontFamily="var(--font-mono)">
                {value}
              </text>
              {interactive ? <rect className="logic-switch__focus" x={-SWITCH_W / 2 - 5} y={-20} width={SWITCH_W + 10} height={40} rx={11} fill="none" stroke={LOGIC_COLORS.clock} strokeWidth={2} /> : null}
            </g>
          );
        })}
        {outputs.map((output) => {
          const value = output.source ? (values[output.source] ?? 0) : 0;
          return (
            <g key={output.id} transform={`translate(${output.x} ${output.y})`} aria-hidden="true">
              {value ? <circle r={24} fill={LOGIC_COLORS.high} opacity={0.18} /> : null}
              <circle r={17} fill={value ? "rgb(163 230 53 / 0.25)" : LOGIC_COLORS.gateFill} stroke={bitColor(value)} strokeWidth={2.5} style={{ transition: "all 0.3s" }} />
              <text x={0} y={1} textAnchor="middle" dominantBaseline="central" fontSize={16} fontWeight={700} fill={value ? LOGIC_COLORS.highSoft : LOGIC_COLORS.lowText} fontFamily="var(--font-mono)">
                {value}
              </text>
              <text x={26} y={1} dominantBaseline="central" fontSize={13} fontWeight={700} fill={LOGIC_COLORS.label} fontFamily="var(--font-mono)">
                {output.label}
              </text>
            </g>
          );
        })}
      </CircuitCanvas>
    </div>
  );
}
