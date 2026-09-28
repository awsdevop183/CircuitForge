/**
 * A tiny, UI-free simulator for a single series loop:
 *
 *   source (+) → element 1 → element 2 → … → source (−)
 *
 * It is deliberately simple (ideal wires, LEDs as a fixed forward voltage,
 * batteries with optional internal resistance) but covers everything the
 * fundamentals module needs: open circuits, switches, broken wires, blown
 * fuses, reversed LEDs, too little voltage, short circuits and node voltages.
 */

export type LoopElement =
  | { kind: "resistor"; id: string; ohms: number }
  | { kind: "lamp"; id: string; ohms: number }
  | { kind: "led"; id: string; forwardVoltage: number; reversed?: boolean }
  | { kind: "switch"; id: string; closed: boolean }
  | { kind: "wire"; id: string; ohms?: number; broken?: boolean }
  | { kind: "fuse"; id: string; ratingAmps: number };

export interface LoopSource {
  voltage: number;
  /** Real batteries have a little internal resistance, which limits a short circuit. */
  internalResistance?: number;
}

export type LoopStatus =
  /** Complete path and enough voltage: current flows. */
  | "flowing"
  /** A switch is open or a wire is broken: no complete path. */
  | "open"
  /** A diode/LED is reversed and blocks the current. */
  | "blocked"
  /** The source can't overcome the LEDs' forward voltage. */
  | "insufficient-voltage"
  /** The current would exceed a fuse rating, so the fuse has opened the loop. */
  | "fuse-blown";

export interface LoopSolution {
  status: LoopStatus;
  /** Loop current in amperes (0 unless status is "flowing"). */
  current: number;
  /** Current that *would* flow with every fuse bypassed — used to explain a blown fuse. */
  prospectiveCurrent: number;
  /** Ids of the elements responsible for an open/blocked loop. */
  culprits: string[];
  /** Voltage across each element, keyed by id. */
  drops: Record<string, number>;
  /** Voltage across the source terminals (drops under heavy load). */
  terminalVoltage: number;
  /**
   * Potential at each node relative to the source's negative terminal.
   * Node 0 is the + terminal; node i sits after element i − 1; the last node is
   * back at the − terminal.
   */
  nodePotentials: number[];
}

/** Resistance used for an "ideal" wire so a dead short stays finite. */
const WIRE_OHMS = 0.01;

export function solveLoop(source: LoopSource, elements: readonly LoopElement[]): LoopSolution {
  const internal = source.internalResistance ?? 0;
  const zeroDrops = Object.fromEntries(elements.map((e) => [e.id, 0]));
  const idle = (status: LoopStatus, culprits: string[], prospectiveCurrent = 0): LoopSolution => ({
    status,
    current: 0,
    prospectiveCurrent,
    culprits,
    drops: zeroDrops,
    terminalVoltage: source.voltage,
    nodePotentials: nodePotentialsFor(source.voltage, elements, zeroDrops),
  });

  const breaks = elements
    .filter((e) => (e.kind === "switch" && !e.closed) || (e.kind === "wire" && e.broken))
    .map((e) => e.id);
  if (breaks.length > 0) return idle("open", breaks);

  const reversed = elements.filter((e) => e.kind === "led" && e.reversed).map((e) => e.id);
  if (reversed.length > 0) return idle("blocked", reversed);

  const forwardDrop = elements.reduce((sum, e) => (e.kind === "led" ? sum + e.forwardVoltage : sum), 0);
  const headroom = source.voltage - forwardDrop;
  if (headroom <= 0) {
    return idle(
      "insufficient-voltage",
      elements.filter((e) => e.kind === "led").map((e) => e.id),
    );
  }

  const loopResistance =
    internal +
    elements.reduce((sum, e) => {
      if (e.kind === "resistor" || e.kind === "lamp") return sum + e.ohms;
      if (e.kind === "wire") return sum + (e.ohms ?? WIRE_OHMS);
      return sum;
    }, 0);
  const current = headroom / Math.max(loopResistance, WIRE_OHMS);

  const blown = elements.filter((e) => e.kind === "fuse" && current > e.ratingAmps).map((e) => e.id);
  if (blown.length > 0) return idle("fuse-blown", blown, current);

  const drops: Record<string, number> = {};
  for (const element of elements) {
    switch (element.kind) {
      case "resistor":
      case "lamp":
        drops[element.id] = current * element.ohms;
        break;
      case "wire":
        drops[element.id] = current * (element.ohms ?? WIRE_OHMS);
        break;
      case "led":
        drops[element.id] = element.forwardVoltage;
        break;
      default:
        drops[element.id] = 0;
    }
  }

  const terminalVoltage = source.voltage - current * internal;
  return {
    status: "flowing",
    current,
    prospectiveCurrent: current,
    culprits: [],
    drops,
    terminalVoltage,
    nodePotentials: nodePotentialsFor(terminalVoltage, elements, drops),
  };
}

function nodePotentialsFor(
  terminalVoltage: number,
  elements: readonly LoopElement[],
  drops: Record<string, number>,
): number[] {
  const potentials = [terminalVoltage];
  for (const element of elements) {
    potentials.push(potentials[potentials.length - 1]! - (drops[element.id] ?? 0));
  }
  return potentials;
}

/** Typical small indicator LED limits, used for brightness and warnings. */
export const LED_RATED_CURRENT = 0.02;
export const LED_MAX_CURRENT = 0.03;
export const RED_LED_FORWARD_VOLTAGE = 2;

/** 0–1 LED brightness from its current (roughly linear up to its rating). */
export function ledBrightness(current: number): number {
  return Math.max(0, Math.min(1, current / LED_RATED_CURRENT));
}
