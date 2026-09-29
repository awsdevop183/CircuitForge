"use client";

import { useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useFrame } from "@/lib/use-frame";
import { RotateCcw } from "lucide-react";
import { CircuitCanvas, CurrentFlow } from "@/components/circuit";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { Readout } from "@/components/ui/Readout";

/** Electrons in one coulomb of charge. */
const ELECTRONS_PER_COULOMB = 6.241509e18;
const MAX_AMPS = 3;
const GATE_X = 220;

/**
 * Current = how much charge passes a point each second. A checkpoint on the
 * wire counts the charge going by.
 */
export function ChargeCounter() {
  const [amps, setAmps] = useState(1);
  const [coulombs, setCoulombs] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef);

  useFrame((_, delta) => {
    if (!inView || amps <= 0) return;
    setCoulombs((c) => c + (amps * Math.min(delta, 64)) / 1000);
  });

  const electrons = coulombs * ELECTRONS_PER_COULOMB;

  return (
    <div ref={containerRef} className="p-5 sm:p-8">
      <CircuitCanvas
        viewBox="0 0 440 130"
        title="Charge passing a checkpoint"
        description={`${amps} amps: ${amps} coulombs of charge pass the checkpoint every second.`}
      >
        <rect x={10} y={40} width={420} height={40} rx={20} fill="#d08a4f" opacity={0.15} stroke="#d08a4f" strokeOpacity={0.45} />
        <CurrentFlow d="M 20 52 L 420 52" active={amps > 0} speed={30 + (amps / MAX_AMPS) * 150} spacing={22} size={7} />
        <CurrentFlow d="M 20 68 L 420 68" active={amps > 0} speed={30 + (amps / MAX_AMPS) * 150} spacing={22} size={7} />
        <line x1={GATE_X} x2={GATE_X} y1={24} y2={96} stroke="#22d3ee" strokeWidth={2} strokeDasharray="4 4" />
        <rect x={GATE_X - 44} y={2} width={88} height={20} rx={5} fill="#0f1621" stroke="#22d3ee" strokeOpacity={0.6} />
        <text x={GATE_X} y={12} textAnchor="middle" dominantBaseline="central" fontSize={10} fill="#e8eef6" fontFamily="var(--font-mono)">
          CHECKPOINT
        </text>
        <text x={GATE_X} y={116} textAnchor="middle" fontSize={11} fill="#94a3b8" fontFamily="var(--font-mono)">
          {amps.toFixed(1)} C passes here every second
        </text>
      </CircuitCanvas>

      <div className="mt-6 grid gap-5 md:grid-cols-[1fr_1.2fr] md:items-end">
        <InteractiveSlider
          label="Current"
          value={amps}
          min={0}
          max={MAX_AMPS}
          step={0.1}
          onChange={setAmps}
          format={(v) => `${v.toFixed(1)} A`}
          minLabel="0 A"
          maxLabel={`${MAX_AMPS} A`}
        />
        <div className="grid grid-cols-[1fr_1fr_auto] items-stretch gap-2">
          <Readout label="Charge counted" value={coulombs.toFixed(1)} unit="C" tone="cyan" size="sm" />
          <Readout label="Electrons" value={electrons === 0 ? "0" : electrons.toExponential(2).replace("e+", " × 10^")} size="sm" />
          <button
            type="button"
            onClick={() => setCoulombs(0)}
            className="flex items-center justify-center rounded-xl border border-line-strong px-3 text-ink-muted hover:border-cyan/50 hover:text-ink"
            aria-label="Reset counter"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
