"use client";

import { flowSpeedForCurrent } from "@/components/lab/flow-speed";
import { DEFAULT_BATTERY_VOLTS, DEFAULT_RESISTOR_OHMS, type Board, type BoardPart, type BoardSolution, type PartState } from "@/lib/series-board";
import { formatOhms } from "@/lib/format";
import { Battery } from "./Battery";
import { Capacitor } from "./Capacitor";
import { CircuitCanvas } from "./CircuitCanvas";
import { CircuitLabel } from "./CircuitLabel";
import { PANEL_BACKGROUND } from "./constants";
import { CurrentFlow } from "./CurrentFlow";
import { Diode } from "./Diode";
import { rectLoop } from "./geometry";
import { Lamp } from "./Lamp";
import { Led } from "./Led";
import { Resistor } from "./Resistor";
import { Switch } from "./Switch";
import { Wire } from "./Wire";

/** Clockwise slot positions around the loop: left side (upwards), top, right side (downwards), bottom. */
const LEFT = 80;
const RIGHT = 400;
const TOP = 70;
const BOTTOM = 230;
const MID_X = (LEFT + RIGHT) / 2;
const MID_Y = (TOP + BOTTOM) / 2;
const LOOP = rectLoop(LEFT, TOP, RIGHT, BOTTOM, 14);

export const SLOT_POSITIONS = [
  { x: LEFT, y: MID_Y, rotation: -90, label: "Left side" },
  { x: MID_X, y: TOP, rotation: 0, label: "Top" },
  { x: RIGHT, y: MID_Y, rotation: 90, label: "Right side" },
  { x: MID_X, y: BOTTOM, rotation: 180, label: "Bottom" },
] as const;

export const PART_NAMES: Record<BoardPart["kind"], string> = {
  battery: "Battery",
  switch: "Switch",
  resistor: "Resistor",
  led: "LED",
  lamp: "Lamp",
  diode: "Diode",
  wire: "Wire",
  capacitor: "Capacitor",
};

interface SeriesCircuitProps {
  /** Four slots, clockwise from the left side. */
  board: Board;
  solution: BoardSolution;
  /** Make switches operable in the diagram. */
  onToggleSwitch?: (slot: number) => void;
  title: string;
  /** Optional status line drawn under the loop. */
  caption?: { text: string; tone: "cyan" | "amber" | "danger" };
  className?: string;
}

/**
 * Renders a four-slot series circuit from data: the loop, animated current
 * and every part in its live state (lit LEDs, open switches, burnt parts).
 * Pair with `solveBoard` from lib/series-board.
 */
export function SeriesCircuit({ board, solution, onToggleSwitch, title, caption, className }: SeriesCircuitProps) {
  const flowing = solution.status === "flowing" && solution.current > 0;
  const burnt = solution.parts.some((p) => p?.burnt);
  const describe = board.map((p, i) => `${SLOT_POSITIONS[i]!.label}: ${p ? PART_NAMES[p.kind] + (p.kind === "switch" ? (p.closed === false ? " (open)" : " (closed)") : "") : "empty"}`).join(". ");

  return (
    <CircuitCanvas viewBox="0 0 480 290" interactive title={title} description={`${describe}. ${flowing ? "Current is flowing." : "No current flows."}`} className={className}>
      <Wire d={LOOP} energized={flowing} color={burnt ? "#f87171" : undefined} />
      <CurrentFlow
        d={LOOP}
        active={flowing}
        speed={burnt ? 150 : flowSpeedForCurrent(Math.min(solution.current, 0.05), 0.05)}
        direction={solution.anticlockwise ? "electron" : "conventional"}
        color={burnt ? "#fca5a5" : "#f5a524"}
      />
      {board.map((part, i) => (
        <SlotPart key={i} slot={i} part={part} state={solution.parts[i] ?? null} energized={flowing} onToggleSwitch={onToggleSwitch ? () => onToggleSwitch(i) : undefined} />
      ))}
      {caption ? <CircuitLabel x={MID_X} y={BOTTOM + 44} text={caption.text} tone={caption.tone} size={13} decorative /> : null}
    </CircuitCanvas>
  );
}

function SlotPart({ slot, part, state, energized, onToggleSwitch }: { slot: number; part: BoardPart | null; state: PartState | null; energized: boolean; onToggleSwitch?: () => void }) {
  const { x, y, rotation: base } = SLOT_POSITIONS[slot]!;
  const vertical = slot === 0 || slot === 2;
  if (!part) {
    return (
      <g aria-hidden="true">
        <rect x={vertical ? x - 22 : x - 44} y={vertical ? y - 44 : y - 22} width={vertical ? 44 : 88} height={vertical ? 88 : 44} rx={8} fill={PANEL_BACKGROUND} stroke="#475569" strokeDasharray="5 5" />
        <text x={x} y={y + 5} textAnchor="middle" fontSize={16} fill="#94a3b8" fontFamily="var(--font-mono)">
          ?
        </text>
      </g>
    );
  }
  const rotation = base + (part.flipped ? 180 : 0);
  const labelPlacement = slot === 0 ? "right" : slot === 2 ? "left" : slot === 1 ? "top" : "bottom";
  const common = { x, y, rotation, labelPlacement, labelOffset: vertical ? 30 : 26 } as const;
  switch (part.kind) {
    case "battery":
      return <Battery {...common} detail={`${part.voltage ?? DEFAULT_BATTERY_VOLTS} V`} energized={energized} />;
    case "switch":
      return <Switch {...common} closed={part.closed ?? true} onToggle={onToggleSwitch} />;
    case "resistor":
      return <Resistor {...common} detail={formatOhms(part.ohms ?? DEFAULT_RESISTOR_OHMS)} energized={energized} />;
    case "led":
      return <Led {...common} brightness={state?.brightness ?? 0} color="#fb7185" detail={state?.burnt ? "burnt out" : undefined} />;
    case "lamp":
      return <Lamp {...common} brightness={state?.brightness ?? 0} />;
    case "diode":
      return <Diode {...common} energized={energized} />;
    case "capacitor":
      return <Capacitor {...common} />;
    default:
      return (
        <g aria-hidden="true">
          <text x={vertical ? x + (slot === 0 ? 14 : -14) : x} y={vertical ? y + 4 : y + (slot === 1 ? -10 : 20)} textAnchor={vertical ? (slot === 0 ? "start" : "end") : "middle"} fontSize={10} fill="#94a3b8" fontFamily="var(--font-mono)">
            wire
          </text>
        </g>
      );
  }
}
