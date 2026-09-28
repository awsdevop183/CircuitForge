"use client";

import { useState } from "react";
import { IVGraph } from "@/components/lab/IVGraph";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { currentFrom } from "@/lib/electronics";
import { formatAmps, formatFixed, formatOhms } from "@/lib/format";

/** Ohm's law as a picture: a straight line whose steepness is set by resistance. */
export function OhmsGraphExplorer() {
  const [voltage, setVoltage] = useState(6);
  const [resistance, setResistance] = useState(40);
  const current = currentFrom(voltage, resistance);
  return (
    <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-[1.3fr_1fr] md:items-center">
      <IVGraph voltage={voltage} resistance={resistance} maxVoltage={12} maxCurrent={0.5} />
      <div className="space-y-5">
        <InteractiveSlider label="Voltage" value={voltage} min={0} max={12} step={0.5} onChange={setVoltage} format={(v) => `${formatFixed(v, 1)} V`} color="var(--color-amber)" />
        <InteractiveSlider label="Resistance" value={resistance} min={20} max={400} scale="log" onChange={setResistance} format={(r) => formatOhms(r)} color="var(--color-electric)" />
        <p className="rounded-xl border border-line bg-void/40 p-3 font-mono text-sm text-ink-muted" aria-live="polite">
          I = {formatFixed(voltage, 1)} V ÷ {formatOhms(resistance)} = <span className="text-cyan">{formatAmps(current, 3)}</span>
        </p>
        <p className="text-sm text-ink-muted">Double the voltage and the dot climbs to double the current — a straight line. Raise the resistance and the whole line gets flatter.</p>
      </div>
    </div>
  );
}
