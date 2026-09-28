import { clamp } from "@/lib/math";

/**
 * Map a current (A) to an on-screen charge speed (SVG units/s).
 * Square-root scaling keeps small currents visibly moving while large
 * currents are clearly faster, without becoming a blur.
 */
export function flowSpeedForCurrent(current: number, referenceCurrent: number): number {
  if (current <= 0) return 0;
  const ratio = clamp(current / referenceCurrent, 0, 1);
  return 10 + Math.sqrt(ratio) * 150;
}
