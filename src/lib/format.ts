/**
 * Human-friendly formatting of electrical quantities with SI prefixes.
 */

const PREFIXES = [
  { factor: 1e9, symbol: "G" },
  { factor: 1e6, symbol: "M" },
  { factor: 1e3, symbol: "k" },
  { factor: 1, symbol: "" },
  { factor: 1e-3, symbol: "m" },
  { factor: 1e-6, symbol: "µ" },
  { factor: 1e-9, symbol: "n" },
  { factor: 1e-12, symbol: "p" },
] as const;

interface FormatOptions {
  /** Significant digits to keep. Default 3. */
  precision?: number;
  /** Put a space between number and unit. Default true. */
  spaced?: boolean;
}

/** Format a value with an SI prefix, e.g. 0.02 A → "20 mA", 4700 Ω → "4.7 kΩ". */
export function formatSI(value: number, unit: string, options: FormatOptions = {}): string {
  const { precision = 3, spaced = true } = options;
  const gap = spaced ? " " : "";

  if (!Number.isFinite(value)) return `∞${gap}${unit}`;
  if (value === 0) return `0${gap}${unit}`;

  const magnitude = Math.abs(value);
  const prefix = PREFIXES.find((p) => magnitude >= p.factor * 0.9995) ?? PREFIXES[PREFIXES.length - 1]!;
  const scaled = value / prefix.factor;
  const formatted = Number(scaled.toPrecision(precision)).toString();
  return `${formatted}${gap}${prefix.symbol}${unit}`;
}

/** Fixed-decimal formatting for lab readouts, e.g. formatFixed(0.1, 2) → "0.10". */
export function formatFixed(value: number, decimals: number): string {
  if (!Number.isFinite(value)) return "∞";
  return value.toFixed(decimals);
}

export const formatVolts = (v: number, precision?: number) => formatSI(v, "V", { precision });
export const formatAmps = (a: number, precision?: number) => formatSI(a, "A", { precision });
export const formatOhms = (r: number, precision?: number) => formatSI(r, "Ω", { precision });
export const formatWatts = (p: number, precision?: number) => formatSI(p, "W", { precision });
export const formatFarads = (f: number, precision?: number) => formatSI(f, "F", { precision });
