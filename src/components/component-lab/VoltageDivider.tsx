"use client";

import { useState } from "react";
import { Battery, CircuitCanvas, CircuitLabel, CircuitNode, CurrentFlow, Resistor, VoltageIndicator, Wire, rectLoop } from "@/components/circuit";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { formatFixed, formatOhms } from "@/lib/format";
import { BlockMeter } from "./BlockMeter";

const SUPPLY = 9;
const LEFT = 70;
const RIGHT = 330;
const TOP = 60;
const BOTTOM = 240;
const MID_Y = (TOP + BOTTOM) / 2;

/** Two resistors in series split the supply: Vout = Vin × R2 ÷ (R1 + R2). */
export function VoltageDivider() {
  const [r1, setR1] = useState(1_000);
  const [r2, setR2] = useState(1_000);
  const vout = (SUPPLY * r2) / (r1 + r2);

  return (
    <div className="grid gap-px bg-line md:grid-cols-[1.2fr_1fr]">
      <div className="bg-breadboard px-2 py-4 sm:px-5">
        <CircuitCanvas viewBox="0 0 440 290" interactive title="Voltage divider" description={`${SUPPLY} volts across R1 ${formatOhms(r1)} and R2 ${formatOhms(r2)}. The output between the resistors is ${formatFixed(vout, 2)} volts.`} className="mx-auto max-w-md">
          <Wire d={rectLoop(LEFT, TOP, RIGHT, BOTTOM, 12)} energized />
          <CurrentFlow d={rectLoop(LEFT, TOP, RIGHT, BOTTOM, 12)} active speed={30} />
          <Battery x={LEFT} y={MID_Y} rotation={-90} detail={`${SUPPLY} V`} energized labelPlacement="right" labelOffset={26} />
          <Resistor x={RIGHT} y={105} rotation={90} name="R1" detail={formatOhms(r1)} energized labelPlacement="left" labelOffset={34} />
          <Resistor x={RIGHT} y={195} rotation={90} name="R2" detail={formatOhms(r2)} energized labelPlacement="left" labelOffset={34} />
          <CircuitNode x={RIGHT} y={MID_Y} active />
          <Wire points={[[RIGHT, MID_Y], [RIGHT + 50, MID_Y]]} energized color="#f5a524" />
          <CircuitLabel x={RIGHT - 16} y={104} text="R1" anchor="end" decorative />
          <CircuitLabel x={RIGHT - 16} y={196} text="R2" anchor="end" decorative />
          <VoltageIndicator x={RIGHT + 40} y={MID_Y - 70} value={vout} label="Vout" decimals={2} tone="amber" probes={{ positive: [RIGHT + 50, MID_Y], negative: [RIGHT, BOTTOM] }} />
        </CircuitCanvas>
      </div>
      <div className="space-y-5 bg-surface-raised p-5">
        <InteractiveSlider label="R1 (top)" value={r1} min={100} max={10_000} scale="log" onChange={setR1} format={(r) => formatOhms(r)} color="var(--color-electric)" />
        <InteractiveSlider label="R2 (bottom)" value={r2} min={100} max={10_000} scale="log" onChange={setR2} format={(r) => formatOhms(r)} color="var(--color-electric)" />
        <div className="rounded-xl border border-amber/40 bg-void/40 p-4">
          <p className="eyebrow text-ink-subtle">Output voltage</p>
          <p className="mt-1 font-mono text-3xl font-semibold text-amber" aria-live="polite">{formatFixed(vout, 2)} V</p>
          <BlockMeter fraction={vout / SUPPLY} label={`${formatFixed((vout / SUPPLY) * 100, 0)}% of the supply`} tone="amber" className="mt-2" />
          <p className="mt-2 font-mono text-xs text-ink-muted">
            {SUPPLY} V × {formatOhms(r2)} ÷ ({formatOhms(r1)} + {formatOhms(r2)})
          </p>
        </div>
        <p className="text-sm text-ink-muted">The bigger R2 is compared with R1, the bigger its share of the voltage. Equal resistors split it in half.</p>
      </div>
    </div>
  );
}
