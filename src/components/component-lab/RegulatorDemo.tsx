"use client";

import { useState } from "react";
import { ArrowDown } from "lucide-react";
import { useSimulationClock } from "@/components/simulations/use-simulation-clock";
import { VoltageRegulatorVisual } from "@/components/visuals";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { Waveform } from "@/components/ui/Waveform";
import { Readout } from "@/components/ui/Readout";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { formatAmps, formatFixed, formatWatts } from "@/lib/format";
import { StatusBanner } from "./StatusBanner";

type Kind = "linear" | "switching";

const TARGET = 5;
/** Headroom each type needs above the output (7805-style linear vs a small buck converter). */
const DROPOUT: Record<Kind, number> = { linear: 2, switching: 0.5 };
const SWITCHING_EFFICIENCY = 0.9;
const RIPPLE = 0.8;

export interface RegulatorResult {
  vout: number;
  regulating: boolean;
  efficiency: number;
  heat: number;
}

/** Output voltage, efficiency and wasted heat for a simple 5 V regulator model. */
export function regulate(kind: Kind, vin: number, loadCurrent: number): RegulatorResult {
  const regulating = vin >= TARGET + DROPOUT[kind];
  const vout = regulating ? TARGET : Math.max(0, vin - DROPOUT[kind]);
  const pout = vout * loadCurrent;
  const efficiency = kind === "linear" ? (vin > 0 ? vout / vin : 0) : SWITCHING_EFFICIENCY;
  const pin = efficiency > 0 ? pout / efficiency : 0;
  return { vout, regulating, efficiency, heat: Math.max(0, pin - pout) };
}

/** A wobbly input becomes a steady 5 V output — as long as there's enough headroom. */
export function RegulatorDemo() {
  const [kind, setKind] = useState<Kind>("linear");
  const [vin, setVin] = useState(12);
  const [loadMilliamps, setLoadMilliamps] = useState(300);
  const [time, ref] = useSimulationClock<HTMLDivElement>();
  const load = loadMilliamps / 1000;
  const result = regulate(kind, vin, load);

  // Samples: the input wobbles; the output is flat while regulating, otherwise it follows the input.
  const samples = (output: boolean) =>
    Array.from({ length: 101 }, (_, i) => {
      const t = time - (1 - i / 100) * 2.5;
      const input = vin + RIPPLE * Math.sin(2 * Math.PI * 1.2 * t);
      return output ? (result.regulating ? TARGET : Math.max(0, input - DROPOUT[kind])) : input;
    });
  const guide = [{ value: TARGET, label: "5 V", color: "#34d399" }];

  return (
    <div ref={ref}>
      <div className="grid grid-cols-1 gap-px bg-line lg:grid-cols-[1fr_1.1fr]">
        <div className="flex flex-col items-center gap-2 bg-breadboard p-5">
          <Waveform title={`Input: ${formatFixed(vin, 1)} V (wobbly)`} samples={samples(false)} min={0} max={16} color="#f5a524" guides={guide} width={300} height={90} className="max-w-sm" />
          <ArrowDown className="size-5 text-ink-subtle" aria-hidden="true" />
          <div className="flex items-center gap-3 rounded-xl border border-line-strong bg-void/50 px-4 py-2">
            <VoltageRegulatorVisual className="h-16 w-auto" />
            <div>
              <p className="font-semibold text-ink">{kind === "linear" ? "Linear regulator" : "Switching regulator"}</p>
              <p className="font-mono text-xs text-ink-muted">5 V output</p>
            </div>
          </div>
          <ArrowDown className="size-5 text-ink-subtle" aria-hidden="true" />
          <Waveform title={`Output: ${formatFixed(result.vout, 2)} V ${result.regulating ? "(steady)" : "(dropping out!)"}`} samples={samples(true)} min={0} max={16} color={result.regulating ? "#22d3ee" : "#f87171"} guides={guide} width={300} height={90} className="max-w-sm" />
        </div>
        <div className="space-y-5 bg-surface-raised p-5">
          <SegmentedControl
            label="Regulator type"
            options={[
              { value: "linear" as const, label: "Linear (e.g. 7805)" },
              { value: "switching" as const, label: "Switching (buck)" },
            ]}
            value={kind}
            onChange={setKind}
            size="sm"
          />
          <InteractiveSlider label="Input voltage" value={vin} min={3} max={15} step={0.5} onChange={setVin} format={(v) => `${formatFixed(v, 1)} V`} color="var(--color-amber)" />
          <InteractiveSlider label="Load current" value={loadMilliamps} min={10} max={1000} step={10} onChange={setLoadMilliamps} format={(v) => formatAmps(v / 1000)} color="var(--color-cyan)" />
          <div className="grid grid-cols-3 gap-2">
            <Readout label="Output" value={formatFixed(result.vout, 2)} unit="V" tone={result.regulating ? "cyan" : "negative"} size="sm" />
            <Readout label="Efficiency" value={Math.round(result.efficiency * 100)} unit="%" size="sm" />
            <Readout label="Heat" value={formatWatts(result.heat, 2)} tone={result.heat > 1 ? "negative" : "amber"} size="sm" />
          </div>
        </div>
      </div>
      <div className="border-t border-line p-4 sm:p-5">
        {!result.regulating ? (
          <StatusBanner level="danger" title="Not enough input voltage — the output drops.">
            A {kind} regulator needs about {DROPOUT[kind]} V more than its output. Below {formatFixed(TARGET + DROPOUT[kind], 1)} V in, it can&apos;t hold 5 V, and sensitive electronics may reset or misbehave.
          </StatusBanner>
        ) : kind === "linear" && result.heat > 1 ? (
          <StatusBanner level="caution" title={`The linear regulator is burning ${formatWatts(result.heat, 2)} as heat.`}>
            Heat = (Vin − Vout) × current. It would need a heatsink — or use a switching regulator instead.
          </StatusBanner>
        ) : (
          <StatusBanner level="ok" title="Regulating: a steady 5 V despite the wobbly input.">
            {kind === "linear" ? " Simple and quiet, but it throws away the extra voltage as heat." : " It switches on and off very fast to convert power efficiently — much less heat."}
          </StatusBanner>
        )}
      </div>
    </div>
  );
}
