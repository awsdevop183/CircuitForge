import { cn } from "@/lib/cn";

interface Guide {
  value: number;
  label: string;
  color: string;
}

interface WaveformProps {
  /** Caption above the chart; also its accessible name. */
  title: string;
  /** Sample values, evenly spaced left to right. */
  samples: readonly number[];
  min: number;
  max: number;
  color: string;
  /** Dashed reference lines, e.g. a 5 V target. */
  guides?: readonly Guide[];
  /** Draw the zero line (for signals that swing + and −). */
  zeroLine?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

/** A small time-series chart for analog signals (AC, rectified, regulated…). */
export function Waveform({ title, samples, min, max, color, guides = [], zeroLine = false, width = 440, height = 110, className }: WaveformProps) {
  const pad = 10;
  const y = (v: number) => height - pad - ((v - min) / (max - min)) * (height - 2 * pad);
  const x = (i: number) => pad + (i / Math.max(1, samples.length - 1)) * (width - 2 * pad);
  const d = samples.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  return (
    <figure className={cn("w-full rounded-xl border border-line bg-void/40 p-3", className)}>
      <figcaption className="eyebrow mb-1 text-ink-subtle">{title}</figcaption>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={title}>
        {zeroLine ? <line x1={pad} x2={width - pad} y1={y(0)} y2={y(0)} stroke="#34445a" /> : null}
        {guides.map((g) => (
          <g key={g.label}>
            <line x1={pad} x2={width - pad} y1={y(g.value)} y2={y(g.value)} stroke={g.color} strokeDasharray="3 5" strokeOpacity={0.6} />
            <text x={width - pad} y={y(g.value) - 4} textAnchor="end" fontSize={9} fill={g.color} fontFamily="var(--font-mono)">
              {g.label}
            </text>
          </g>
        ))}
        <path d={d} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" />
      </svg>
    </figure>
  );
}
