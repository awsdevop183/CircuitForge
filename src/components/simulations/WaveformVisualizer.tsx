"use client";

export type WaveformKind = "dc" | "ac";

interface WaveformVisualizerProps {
  kind: WaveformKind;
  /** DC level or AC peak, in volts. */
  amplitude: number;
  /** AC frequency in Hz (ignored for DC). */
  frequency: number;
  /** Current simulation time in seconds. */
  time: number;
  /** Seconds of history shown across the plot. */
  window?: number;
}

const WIDTH = 480;
const HEIGHT = 200;
const PAD = { left: 44, right: 24, top: 16, bottom: 28 };
const PLOT_W = WIDTH - PAD.left - PAD.right;
const PLOT_H = HEIGHT - PAD.top - PAD.bottom;
const SAMPLES = 160;

/** Instantaneous voltage of the waveform at time t. */
export function waveformValue(kind: WaveformKind, amplitude: number, frequency: number, t: number): number {
  return kind === "dc" ? amplitude : amplitude * Math.sin(2 * Math.PI * frequency * t);
}

/**
 * A scrolling voltage-vs-time trace, like an oscilloscope. The newest value is
 * at the right edge; the region above the zero line is positive, below is negative.
 */
export function WaveformVisualizer({ kind, amplitude, frequency, time, window = 3 }: WaveformVisualizerProps) {
  const maxV = Math.max(amplitude, 1) * 1.25;
  const x = (tAgo: number) => PAD.left + PLOT_W - (tAgo / window) * PLOT_W;
  const y = (v: number) => PAD.top + PLOT_H / 2 - (v / maxV) * (PLOT_H / 2);
  const points = Array.from({ length: SAMPLES + 1 }, (_, i) => {
    const tAgo = (i / SAMPLES) * window;
    return `${i === 0 ? "M" : "L"} ${x(tAgo).toFixed(1)} ${y(waveformValue(kind, amplitude, frequency, time - tAgo)).toFixed(1)}`;
  }).join(" ");
  const now = waveformValue(kind, amplitude, frequency, time);

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="h-auto w-full"
      role="img"
      aria-label={
        kind === "dc"
          ? `DC waveform: a flat line at +${amplitude} volts. The polarity never changes.`
          : `AC waveform: a sine wave swinging between +${amplitude} and −${amplitude} volts, ${frequency} times per second in this slowed-down view.`
      }
    >
      {/* Positive and negative halves */}
      <rect x={PAD.left} y={PAD.top} width={PLOT_W} height={PLOT_H / 2} fill="#f87171" fillOpacity={0.04} />
      <rect x={PAD.left} y={PAD.top + PLOT_H / 2} width={PLOT_W} height={PLOT_H / 2} fill="#60a5fa" fillOpacity={0.04} />
      <line x1={PAD.left} x2={PAD.left + PLOT_W} y1={y(0)} y2={y(0)} stroke="#34445a" strokeWidth={1.5} />
      {[amplitude, -amplitude].map((v) => (
        <g key={v}>
          <line x1={PAD.left} x2={PAD.left + PLOT_W} y1={y(v)} y2={y(v)} stroke="#1a2432" strokeDasharray="3 5" />
          <text x={PAD.left - 6} y={y(v)} textAnchor="end" dominantBaseline="central" fontSize={10} fill="#7f8ea4" fontFamily="var(--font-mono)">
            {v > 0 ? "+" : "−"}
            {Math.abs(v)} V
          </text>
        </g>
      ))}
      <text x={PAD.left - 6} y={y(0)} textAnchor="end" dominantBaseline="central" fontSize={10} fill="#94a3b8" fontFamily="var(--font-mono)">
        0 V
      </text>
      <text x={PAD.left + 6} y={PAD.top + 12} fontSize={10} fill="#fca5a5" fontFamily="var(--font-mono)">
        + POSITIVE
      </text>
      <text x={PAD.left + 6} y={PAD.top + PLOT_H - 6} fontSize={10} fill="#93c5fd" fontFamily="var(--font-mono)">
        − NEGATIVE
      </text>
      <path d={points} fill="none" stroke={kind === "dc" ? "#f5a524" : "#22d3ee"} strokeWidth={2.5} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 4px ${kind === "dc" ? "#f5a524" : "#22d3ee"})` }} />
      <circle cx={x(0)} cy={y(now)} r={5} fill="#e8eef6" stroke="#101722" strokeWidth={2} />
      <text x={PAD.left + PLOT_W / 2} y={HEIGHT - 6} textAnchor="middle" fontSize={10} fill="#7f8ea4">
        time →
      </text>
    </svg>
  );
}
