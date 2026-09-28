/**
 * Pure electronics calculations used by lessons and lab experiments.
 * Keep these free of UI concerns so they can be unit-tested and reused
 * by future simulators.
 */

/** Ohm's law: I = V / R. Returns 0 A for an open circuit (R = ∞) or R ≤ 0 guard. */
export function currentFrom(voltage: number, resistance: number): number {
  if (!Number.isFinite(resistance) || resistance <= 0) return 0;
  return voltage / resistance;
}

/** Ohm's law: V = I × R. */
export function voltageFrom(current: number, resistance: number): number {
  return current * resistance;
}

/** Ohm's law: R = V / I. */
export function resistanceFrom(voltage: number, current: number): number {
  if (current === 0) return Number.POSITIVE_INFINITY;
  return voltage / current;
}

/** Electrical power: P = V × I. */
export function powerFrom(voltage: number, current: number): number {
  return voltage * current;
}

/** Equivalent resistance of resistors in series: R = R1 + R2 + … */
export function seriesResistance(resistances: readonly number[]): number {
  return resistances.reduce((sum, r) => sum + r, 0);
}

/** Equivalent resistance of resistors in parallel: 1/R = 1/R1 + 1/R2 + … */
export function parallelResistance(resistances: readonly number[]): number {
  const conductance = resistances.reduce((sum, r) => (r > 0 ? sum + 1 / r : sum), 0);
  return conductance === 0 ? Number.POSITIVE_INFINITY : 1 / conductance;
}

export interface BranchResult {
  resistance: number;
  voltage: number;
  current: number;
  power: number;
}

export interface NetworkResult {
  totalResistance: number;
  totalCurrent: number;
  branches: BranchResult[];
}

/**
 * Solve a simple network of resistive loads driven by one ideal source.
 * A load with `connected: false` is treated as removed (open).
 */
export function solveSeries(
  sourceVoltage: number,
  loads: readonly { resistance: number; connected: boolean }[],
): NetworkResult {
  const isOpen = loads.some((load) => !load.connected);
  const totalResistance = isOpen
    ? Number.POSITIVE_INFINITY
    : seriesResistance(loads.map((load) => load.resistance));
  const totalCurrent = currentFrom(sourceVoltage, totalResistance);

  const branches = loads.map((load) => {
    const current = load.connected ? totalCurrent : 0;
    const voltage = load.connected ? current * load.resistance : 0;
    return { resistance: load.resistance, voltage, current, power: voltage * current };
  });

  return { totalResistance, totalCurrent, branches };
}

export function solveParallel(
  sourceVoltage: number,
  loads: readonly { resistance: number; connected: boolean }[],
): NetworkResult {
  const branches = loads.map((load) => {
    const current = load.connected ? currentFrom(sourceVoltage, load.resistance) : 0;
    const voltage = load.connected ? sourceVoltage : 0;
    return { resistance: load.resistance, voltage, current, power: voltage * current };
  });
  const totalCurrent = branches.reduce((sum, branch) => sum + branch.current, 0);
  const totalResistance = parallelResistance(
    loads.filter((load) => load.connected).map((load) => load.resistance),
  );

  return { totalResistance, totalCurrent, branches };
}

/** Series resistor needed to run an LED at a target current from a supply. */
export function ledSeriesResistor(
  supplyVoltage: number,
  forwardVoltage: number,
  currentAmps: number,
): number | null {
  const headroom = supplyVoltage - forwardVoltage;
  if (headroom <= 0 || currentAmps <= 0) return null;
  return headroom / currentAmps;
}

/** RC time constant τ = R × C (seconds). */
export function timeConstant(resistanceOhms: number, capacitanceFarads: number): number {
  return resistanceOhms * capacitanceFarads;
}

/** Capacitor voltage while charging: Vc = Vs × (1 − e^(−t/τ)). */
export function capacitorChargeVoltage(supply: number, t: number, tau: number): number {
  if (tau <= 0) return supply;
  return supply * (1 - Math.exp(-t / tau));
}

/** Capacitor voltage while discharging from V0: Vc = V0 × e^(−t/τ). */
export function capacitorDischargeVoltage(initial: number, t: number, tau: number): number {
  if (tau <= 0) return 0;
  return initial * Math.exp(-t / tau);
}

/** Standard E12 resistor series (one decade). */
export const E12_SERIES = [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2] as const;

/** Round a resistance up to the nearest standard E12 value (safe for LED resistors). */
export function nextE12Value(ohms: number): number {
  if (ohms <= 0 || !Number.isFinite(ohms)) return 0;
  const decade = Math.pow(10, Math.floor(Math.log10(ohms)));
  for (const base of E12_SERIES) {
    const candidate = base * decade;
    if (candidate >= ohms - 1e-9) return Number(candidate.toPrecision(3));
  }
  return Number((10 * decade).toPrecision(3));
}
