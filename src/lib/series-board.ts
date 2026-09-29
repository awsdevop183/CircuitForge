/**
 * The CircuitForge circuit engine for single-loop circuits built from parts in
 * slots. A "board" is an ordered list of slots running clockwise around a loop;
 * each slot holds a part or is empty. `solveBoard` turns a board into the
 * element list for `solveLoop` and reports current, per-part voltages and
 * each part's visible state.
 *
 * EDUCATIONAL MODEL — not a SPICE simulation: ideal wires, fixed LED/diode
 * voltage drops, a lamp as a fixed resistance, a capacitor treated as an open
 * gap (its steady DC state) and one battery per loop.
 */
import { LED_MAX_CURRENT, RED_LED_FORWARD_VOLTAGE, ledBrightness, solveLoop, type LoopElement, type LoopStatus } from "./circuit-sim";

export type BoardPartKind = "battery" | "switch" | "resistor" | "led" | "lamp" | "diode" | "wire" | "capacitor";

export interface BoardPart {
  kind: BoardPartKind;
  /** Battery / LED / diode turned around relative to clockwise. */
  flipped?: boolean;
  /** Switch state (default closed). */
  closed?: boolean;
  /** Resistor value (default 470 Ω). */
  ohms?: number;
  /** Battery voltage (default 9 V). */
  voltage?: number;
}

export type Board = readonly (BoardPart | null)[];

export const DEFAULT_RESISTOR_OHMS = 470;
export const DEFAULT_BATTERY_VOLTS = 9;
export const LAMP_OHMS = 60;
export const DIODE_FORWARD_VOLTAGE = 0.7;
const INTERNAL_RESISTANCE = 0.5;

export type BoardStatus = LoopStatus | "no-source" | "multiple-sources";

export interface PartState {
  /** Voltage across the part (V). */
  voltage: number;
  /** 0–1 light output for LEDs and lamps. */
  brightness: number;
  /** LED driven past its absolute maximum current. */
  burnt: boolean;
}

export interface BoardSolution {
  status: BoardStatus;
  /** Loop current in amperes (0 unless flowing). */
  current: number;
  /** True when the battery is flipped, so conventional current runs anticlockwise. */
  anticlockwise: boolean;
  /** State of each slot, by index (null for empty slots). */
  parts: (PartState | null)[];
  /** Slot indices responsible for an open or blocked loop. */
  culprits: number[];
}

/** Solve a board. Slot indices double as element ids so results map straight back to slots. */
export function solveBoard(board: Board): BoardSolution {
  const idle = (status: BoardStatus, culprits: number[] = []): BoardSolution => ({
    status,
    current: 0,
    anticlockwise: false,
    parts: board.map((p) => (p ? { voltage: 0, brightness: 0, burnt: false } : null)),
    culprits,
  });

  const batteries = board.flatMap((p, i) => (p?.kind === "battery" ? [i] : []));
  if (batteries.length === 0) return idle("no-source");
  if (batteries.length > 1) return idle("multiple-sources", batteries);

  const batteryIndex = batteries[0]!;
  const battery = board[batteryIndex]!;
  const anticlockwise = Boolean(battery.flipped);
  // Walk the loop from the battery's + terminal in the direction it pushes.
  const order = board.map((_, i) => i).filter((i) => i !== batteryIndex);
  const clockwise = [...order.filter((i) => i > batteryIndex), ...order.filter((i) => i < batteryIndex)];
  const walk = anticlockwise ? [...clockwise].reverse() : clockwise;

  const elements: LoopElement[] = walk.map((i): LoopElement => {
    const part = board[i];
    const id = String(i);
    if (!part) return { kind: "wire", id, broken: true };
    const reversed = Boolean(part.flipped) !== anticlockwise;
    switch (part.kind) {
      case "switch":
        return { kind: "switch", id, closed: part.closed ?? true };
      case "resistor":
        return { kind: "resistor", id, ohms: part.ohms ?? DEFAULT_RESISTOR_OHMS };
      case "lamp":
        return { kind: "lamp", id, ohms: LAMP_OHMS };
      case "led":
        return { kind: "led", id, forwardVoltage: RED_LED_FORWARD_VOLTAGE, reversed };
      case "diode":
        return { kind: "led", id, forwardVoltage: DIODE_FORWARD_VOLTAGE, reversed };
      case "capacitor":
        // In steady DC a charged capacitor passes no current: effectively a gap.
        return { kind: "wire", id, broken: true };
      default:
        return { kind: "wire", id };
    }
  });

  const solution = solveLoop({ voltage: battery.voltage ?? DEFAULT_BATTERY_VOLTS, internalResistance: INTERNAL_RESISTANCE }, elements);
  const current = solution.status === "flowing" ? solution.current : 0;
  const lampMax = (battery.voltage ?? DEFAULT_BATTERY_VOLTS) / LAMP_OHMS;

  return {
    status: solution.status,
    current,
    anticlockwise,
    culprits: solution.culprits.map(Number),
    parts: board.map((part, i) => {
      if (!part) return null;
      const voltage = i === batteryIndex ? solution.terminalVoltage : (solution.drops[String(i)] ?? 0);
      const burnt = part.kind === "led" && current > LED_MAX_CURRENT;
      const brightness = part.kind === "led" ? (burnt ? 0 : ledBrightness(current)) : part.kind === "lamp" ? Math.min(1, current / lampMax) : 0;
      return { voltage, brightness, burnt };
    }),
  };
}
