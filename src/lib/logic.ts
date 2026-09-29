/**
 * Pure digital-logic engine: gates, truth tables, binary numbers, adders,
 * latches and small gate networks. UI-free so lessons, the playground, the
 * challenge and the quiz all agree on every output.
 */

export type Bit = 0 | 1;

export type GateType = "NOT" | "AND" | "OR" | "NAND" | "NOR" | "XOR" | "XNOR";

export const GATE_TYPES: readonly GateType[] = ["NOT", "AND", "OR", "NAND", "NOR", "XOR", "XNOR"];

export interface GateInfo {
  name: string;
  /** Output rule in plain English (for two inputs). */
  rule: string;
  /** Short symbolic form, e.g. "A · B". */
  expression: string;
}

export const GATE_INFO: Record<GateType, GateInfo> = {
  NOT: { name: "NOT gate (inverter)", rule: "The output is the opposite of the input.", expression: "NOT A" },
  AND: { name: "AND gate", rule: "The output is 1 only when every input is 1.", expression: "A AND B" },
  OR: { name: "OR gate", rule: "The output is 1 when at least one input is 1.", expression: "A OR B" },
  NAND: { name: "NAND gate", rule: "The opposite of AND: the output is 0 only when every input is 1.", expression: "NOT (A AND B)" },
  NOR: { name: "NOR gate", rule: "The opposite of OR: the output is 1 only when every input is 0.", expression: "NOT (A OR B)" },
  XOR: { name: "XOR gate (exclusive OR)", rule: "The output is 1 when the inputs are different.", expression: "A XOR B" },
  XNOR: { name: "XNOR gate", rule: "The output is 1 when the inputs are the same.", expression: "NOT (A XOR B)" },
};

export const bit = (value: boolean | number): Bit => (value ? 1 : 0);
export const invert = (value: Bit): Bit => (value ? 0 : 1);

/**
 * Evaluate a gate. NOT uses the first input. Multi-input XOR is 1 for an odd
 * number of 1s (and XNOR for an even number), the usual definition.
 */
export function evaluateGate(type: GateType, inputs: readonly Bit[]): Bit {
  const ones = inputs.filter((v) => v === 1).length;
  switch (type) {
    case "NOT":
      return invert(inputs[0] ?? 0);
    case "AND":
      return bit(inputs.length > 0 && ones === inputs.length);
    case "OR":
      return bit(ones > 0);
    case "NAND":
      return invert(evaluateGate("AND", inputs));
    case "NOR":
      return invert(evaluateGate("OR", inputs));
    case "XOR":
      return bit(ones % 2 === 1);
    case "XNOR":
      return bit(ones % 2 === 0);
  }
}

export function gateInputCount(type: GateType): number {
  return type === "NOT" ? 1 : 2;
}

/** Inputs actually used by a gate in a network: NOT uses one, others use every connected slot (at least two). */
export function pinCount(gate: { type: GateType; inputs: readonly unknown[] }): number {
  return gate.type === "NOT" ? 1 : Math.max(2, gate.inputs.length);
}

/** Every combination of `count` inputs in counting order: 00, 01, 10, 11 (first input is the most significant). */
export function inputCombinations(count: number): Bit[][] {
  return Array.from({ length: 2 ** count }, (_, row) => toBits(row, count));
}

export interface TruthRow {
  inputs: Bit[];
  outputs: Bit[];
}

export function truthTable(inputCount: number, fn: (inputs: Bit[]) => Bit | readonly Bit[]): TruthRow[] {
  return inputCombinations(inputCount).map((inputs) => {
    const out = fn(inputs);
    return { inputs, outputs: typeof out === "number" ? [out] : [...out] };
  });
}

/** Index of a combination within `inputCombinations` (i.e. its binary value). */
export function rowIndex(inputs: readonly Bit[]): number {
  return fromBits(inputs);
}

/* ------------------------------------------------------------------ */
/* Binary numbers                                                      */
/* ------------------------------------------------------------------ */

/** Unsigned binary digits of `value`, most significant bit first. */
export function toBits(value: number, width: number): Bit[] {
  return Array.from({ length: width }, (_, i) => bit((value >> (width - 1 - i)) & 1));
}

export function fromBits(bits: readonly Bit[]): number {
  return bits.reduce<number>((total, b) => total * 2 + b, 0);
}

/** Place values for a width, e.g. 4 → [8, 4, 2, 1]. */
export function placeValues(width: number): number[] {
  return Array.from({ length: width }, (_, i) => 2 ** (width - 1 - i));
}

/* ------------------------------------------------------------------ */
/* Arithmetic                                                          */
/* ------------------------------------------------------------------ */

export function halfAdder(a: Bit, b: Bit): { sum: Bit; carry: Bit } {
  return { sum: evaluateGate("XOR", [a, b]), carry: evaluateGate("AND", [a, b]) };
}

export interface FullAdderResult {
  sum: Bit;
  carryOut: Bit;
  /** Internal signals of the two-half-adder implementation. */
  internal: { xorAB: Bit; andAB: Bit; andCarry: Bit };
}

/** Full adder built from two half adders and an OR gate. */
export function fullAdder(a: Bit, b: Bit, carryIn: Bit): FullAdderResult {
  const first = halfAdder(a, b);
  const second = halfAdder(first.sum, carryIn);
  return {
    sum: second.sum,
    carryOut: evaluateGate("OR", [first.carry, second.carry]),
    internal: { xorAB: first.sum, andAB: first.carry, andCarry: second.carry },
  };
}

/* ------------------------------------------------------------------ */
/* Memory                                                              */
/* ------------------------------------------------------------------ */

export interface LatchResult {
  q: Bit;
  /** SET and RESET both active: not allowed for an SR latch. */
  invalid: boolean;
}

/** Next state of an SR latch: SET → 1, RESET → 0, neither → hold. */
export function srLatch(q: Bit, set: Bit, reset: Bit): LatchResult {
  if (set && reset) return { q: 0, invalid: true };
  if (set) return { q: 1, invalid: false };
  if (reset) return { q: 0, invalid: false };
  return { q, invalid: false };
}

/** A D flip-flop copies D to Q only on a rising clock edge. */
export function dFlipFlop(q: Bit, d: Bit, previousClock: Bit, clock: Bit): Bit {
  return previousClock === 0 && clock === 1 ? d : q;
}

/* ------------------------------------------------------------------ */
/* Gate networks                                                       */
/* ------------------------------------------------------------------ */

export interface NetworkGate {
  id: string;
  type: GateType;
  /** Source ids (circuit inputs or other gates); null = unconnected. */
  inputs: readonly (string | null)[];
}

/**
 * Evaluate a gate network. Unconnected inputs read as 0 (and are reported),
 * cycles resolve to 0 (and are reported) so a playground can never hang.
 */
export function evaluateNetwork(
  inputValues: Readonly<Record<string, Bit>>,
  gates: readonly NetworkGate[],
): { values: Record<string, Bit>; floating: string[]; cyclic: string[] } {
  const byId = new Map(gates.map((g) => [g.id, g]));
  const values: Record<string, Bit> = { ...inputValues };
  const floating = new Set<string>();
  const cyclic = new Set<string>();
  const visiting = new Set<string>();

  const valueOf = (id: string | null, owner: string): Bit => {
    if (id === null) {
      floating.add(owner);
      return 0;
    }
    if (id in values) return values[id]!;
    const gate = byId.get(id);
    if (!gate) {
      floating.add(owner);
      return 0;
    }
    if (visiting.has(id)) {
      cyclic.add(id);
      return 0;
    }
    visiting.add(id);
    const count = pinCount(gate);
    const slots = Array.from({ length: count }, (_, i) => gate.inputs[i] ?? null);
    const result = evaluateGate(gate.type, slots.map((src) => valueOf(src, gate.id)));
    visiting.delete(id);
    values[id] = result;
    return result;
  };

  for (const gate of gates) valueOf(gate.id, gate.id);
  return { values, floating: [...floating], cyclic: [...cyclic] };
}
