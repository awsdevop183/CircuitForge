"use client";

import { CIRCUIT_COLORS } from "./constants";

type LabelTone = "default" | "muted" | "cyan" | "amber" | "positive" | "negative" | "success" | "danger";

const TONE_COLORS: Record<LabelTone, string> = {
  default: CIRCUIT_COLORS.labelText,
  muted: CIRCUIT_COLORS.labelMuted,
  cyan: CIRCUIT_COLORS.cyan,
  amber: CIRCUIT_COLORS.amber,
  positive: CIRCUIT_COLORS.positive,
  negative: CIRCUIT_COLORS.negative,
  success: CIRCUIT_COLORS.success,
  danger: CIRCUIT_COLORS.danger,
};

interface CircuitLabelProps {
  x: number;
  y: number;
  text: string;
  /** Optional value drawn on a second line in a mono font, e.g. "220 Ω". */
  value?: string;
  tone?: LabelTone;
  valueTone?: LabelTone;
  anchor?: "start" | "middle" | "end";
  size?: number;
  /** Hide from assistive tech when the same info is conveyed elsewhere. */
  decorative?: boolean;
}

/** Static text annotation inside a circuit diagram. */
export function CircuitLabel({
  x,
  y,
  text,
  value,
  tone = "muted",
  valueTone = "default",
  anchor = "middle",
  size = 12,
  decorative = false,
}: CircuitLabelProps) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={size}
      aria-hidden={decorative ? "true" : undefined}
    >
      <tspan x={x} fill={TONE_COLORS[tone]} fontFamily="var(--font-mono)" letterSpacing="0.06em">
        {text}
      </tspan>
      {value ? (
        <tspan
          x={x}
          dy={size * 1.35}
          fill={TONE_COLORS[valueTone]}
          fontFamily="var(--font-mono)"
          fontWeight={600}
          fontSize={size * 1.1}
        >
          {value}
        </tspan>
      ) : null}
    </text>
  );
}
