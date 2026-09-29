import type { Bit } from "@/lib/logic";

/** SVG path for a sequence of bits drawn as a square wave (each bit is `step` wide). */
export function digitalPath(bits: readonly Bit[], { x = 0, step, high, low }: { x?: number; step: number; high: number; low: number }): string {
  return bits
    .map((b, i) => {
      const left = x + i * step;
      const y = b ? high : low;
      const prev = i > 0 ? (bits[i - 1] ? high : low) : y;
      return `${i === 0 ? `M ${left} ${y}` : `L ${left} ${prev} L ${left} ${y}`} L ${left + step} ${y}`;
    })
    .join(" ");
}

interface DigitalSignalProps {
  bits: readonly Bit[];
  label: string;
  color: string;
  /** Top-left of the row inside the parent SVG. */
  x?: number;
  y?: number;
  step?: number;
  height?: number;
  labelWidth?: number;
}

/** One labelled digital signal row (e.g. CLK, D or Q in a timing diagram), drawn inside an <svg>. */
export function DigitalSignal({ bits, label, color, x = 0, y = 0, step = 26, height = 24, labelWidth = 44 }: DigitalSignalProps) {
  return (
    <g>
      <text x={x + 4} y={y + height / 2 + 4} fontSize={12} fontWeight={700} fill={color} fontFamily="var(--font-mono)">
        {label}
      </text>
      <path d={digitalPath(bits, { x: x + labelWidth, step, high: y, low: y + height })} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" />
    </g>
  );
}
