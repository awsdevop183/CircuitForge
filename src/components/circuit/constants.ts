/**
 * Shared constants for the CircuitForge SVG circuit visual language.
 *
 * Coordinate convention: every two-terminal part is drawn centred on its
 * origin, lying horizontally, with its terminals at (±PART_SPAN / 2, 0).
 * Parts are positioned with `x`, `y` and `rotation` (degrees, clockwise).
 */

export const PART_SPAN = 80;
export const HALF_SPAN = PART_SPAN / 2;

export const WIRE_WIDTH = 3;

export const CIRCUIT_COLORS = {
  wireIdle: "#34445a",
  wireEnergized: "#22d3ee",
  symbol: "#cbd5e1",
  symbolMuted: "#64748b",
  cyan: "#22d3ee",
  cyanSoft: "#a5f3fc",
  electric: "#38bdf8",
  amber: "#f5a524",
  amberSoft: "#fde68a",
  orange: "#fb923c",
  positive: "#f87171",
  negative: "#60a5fa",
  success: "#34d399",
  danger: "#f87171",
  labelText: "#e8eef6",
  labelMuted: "#94a3b8",
  labelBg: "#0f1621",
  labelBorder: "#2a3a50",
} as const;

/** Default diagram backdrop: matches the raised panels (`--color-surface-raised`) diagrams sit on. */
export const PANEL_BACKGROUND = "#101722";

/** Fill used to "cut" wires where a part body sits on top of them. */
export const CIRCUIT_BACKGROUND = "var(--circuit-bg, #0b1018)";

export type Point = readonly [number, number];

export type FlowDirection = "conventional" | "electron";
