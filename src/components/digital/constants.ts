/** Colours for the digital-logic visual language (kept in step with --color-logic / --color-clock). */
export const LOGIC_COLORS = {
  high: "#a3e635",
  highSoft: "#d9f99d",
  low: "#3f4d62",
  lowText: "#94a3b8",
  clock: "#a78bfa",
  gate: "#cbd5e1",
  gateFill: "#0b1018",
  label: "#e8eef6",
  muted: "#94a3b8",
} as const;

export const bitColor = (value: 0 | 1) => (value ? LOGIC_COLORS.high : LOGIC_COLORS.low);
