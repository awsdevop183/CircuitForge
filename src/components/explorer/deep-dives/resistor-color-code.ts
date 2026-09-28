/** Resistor colour-code data (IEC 60062), 4-band scheme. */

export interface BandColor {
  name: string;
  hex: string;
  /** Text colour that stays legible on the swatch. */
  ink: string;
}

export const DIGIT_COLORS: readonly BandColor[] = [
  { name: "Black", hex: "#1a1a1a", ink: "#fff" },
  { name: "Brown", hex: "#8b4513", ink: "#fff" },
  { name: "Red", hex: "#dc2626", ink: "#fff" },
  { name: "Orange", hex: "#f97316", ink: "#111" },
  { name: "Yellow", hex: "#facc15", ink: "#111" },
  { name: "Green", hex: "#16a34a", ink: "#04110a" },
  { name: "Blue", hex: "#2563eb", ink: "#fff" },
  { name: "Violet", hex: "#7c3aed", ink: "#fff" },
  { name: "Grey", hex: "#6b7280", ink: "#fff" },
  { name: "White", hex: "#f5f5f5", ink: "#111" },
];

const GOLD: BandColor = { name: "Gold", hex: "#d4af37", ink: "#111" };
const SILVER: BandColor = { name: "Silver", hex: "#c0c0c0", ink: "#111" };

export interface MultiplierBand extends BandColor {
  factor: number;
}

export const MULTIPLIER_BANDS: readonly MultiplierBand[] = [
  ...DIGIT_COLORS.slice(0, 7).map((color, index) => ({ ...color, factor: Math.pow(10, index) })),
  { ...GOLD, factor: 0.1 },
  { ...SILVER, factor: 0.01 },
];

export interface ToleranceBand extends BandColor {
  percent: number;
}

export const TOLERANCE_BANDS: readonly ToleranceBand[] = [
  { ...DIGIT_COLORS[1]!, percent: 1 },
  { ...DIGIT_COLORS[2]!, percent: 2 },
  { ...GOLD, percent: 5 },
  { ...SILVER, percent: 10 },
];

export function decodeResistor(firstDigit: number, secondDigit: number, multiplierIndex: number): number {
  const multiplier = MULTIPLIER_BANDS[multiplierIndex]?.factor ?? 1;
  return Number(((firstDigit * 10 + secondDigit) * multiplier).toPrecision(3));
}
