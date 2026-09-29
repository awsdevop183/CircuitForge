"use client";

import { useState } from "react";
import { CircuitCanvas, VoltageIndicator, type Point } from "@/components/circuit";
import { SegmentedControl } from "@/components/ui/SegmentedControl";

type ProbePlacement = "across" | "negative" | "positive";

const BATTERY_VOLTS = 9;
const NEGATIVE: Point = [70, 150];
const POSITIVE: Point = [350, 150];

const PLACEMENTS: Record<ProbePlacement, { red: Point; black: Point; reading: number; explanation: string }> = {
  across: {
    red: POSITIVE,
    black: NEGATIVE,
    reading: BATTERY_VOLTS,
    explanation: "Across the two terminals the meter reads 9 V — that's the difference in electrical 'pressure' between them.",
  },
  negative: {
    red: [NEGATIVE[0] + 6, NEGATIVE[1] - 14],
    black: NEGATIVE,
    reading: 0,
    explanation: "Both probes on the same terminal: no difference between them, so 0 V.",
  },
  positive: {
    red: POSITIVE,
    black: [POSITIVE[0] - 6, POSITIVE[1] - 14],
    reading: 0,
    explanation: "Still 0 V. Voltage is never measured at one point — only between two points.",
  },
};

const OPTIONS = [
  { value: "across" as const, label: "+ and −" },
  { value: "negative" as const, label: "− and −" },
  { value: "positive" as const, label: "+ and +" },
];

// Electrons crowd near the negative terminal and thin out towards the positive one.
const ELECTRON_DOTS: Point[] = Array.from({ length: 34 }, (_, i) => {
  const t = Math.pow((i * 0.618) % 1, 2.2);
  const x = 108 + t * 190;
  const y = 126 + ((i * 37) % 48);
  return [Math.round(x), y];
});

/** Probe a battery's terminals with a voltmeter. */
export function TerminalProbe() {
  const [placement, setPlacement] = useState<ProbePlacement>("across");
  const current = PLACEMENTS[placement];

  return (
    <div className="grid gap-6 p-5 sm:p-8 md:grid-cols-[1.4fr_1fr] md:items-center">
      <CircuitCanvas
        viewBox="0 0 420 220"
        title="Measuring a battery with a voltmeter"
        description={`A 9 volt battery. The voltmeter probes are on ${OPTIONS.find((o) => o.value === placement)!.label} and it reads ${current.reading} volts.`}
      >
        {/* Battery body */}
        <rect x={80} y={112} width={250} height={76} rx={10} fill="#111827" stroke="#374151" strokeWidth={2} />
        <rect x={250} y={112} width={80} height={76} fill="#f5a524" opacity={0.85} />
        <rect x={330} y={134} width={14} height={32} rx={3} fill="#cbd5e1" />
        <rect x={66} y={138} width={14} height={24} rx={3} fill="#94a3b8" />
        {ELECTRON_DOTS.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={3.2} fill="#67e8f9" opacity={0.85} />
        ))}
        <text x={290} y={156} textAnchor="middle" dominantBaseline="central" fontSize={30} fontWeight={700} fill="#0b1018">+</text>
        <text x={40} y={150} textAnchor="middle" dominantBaseline="central" fontSize={30} fontWeight={700} fill="#60a5fa">−</text>
        <text x={372} y={150} textAnchor="middle" dominantBaseline="central" fontSize={26} fontWeight={700} fill="#f87171">+</text>
        <text x={160} y={204} textAnchor="middle" fontSize={10} fill="#94a3b8" fontFamily="var(--font-mono)">electrons crowd at −</text>

        <VoltageIndicator x={210} y={46} value={current.reading} label="Voltmeter" probes={{ positive: current.red, negative: current.black }} />
      </CircuitCanvas>

      <div className="space-y-4">
        <SegmentedControl label="Probe placement" options={OPTIONS} value={placement} onChange={setPlacement} />
        <p className="rounded-xl border border-line bg-void/40 p-4 text-sm text-ink-muted" aria-live="polite">
          <span className="mb-1 block font-mono text-2xl font-semibold text-cyan">{current.reading.toFixed(1)} V</span>
          {current.explanation}
        </p>
      </div>
    </div>
  );
}
