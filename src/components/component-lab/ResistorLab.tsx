"use client";

import { useState } from "react";
import { OhmsLawCircuit } from "@/components/lab/OhmsLawCircuit";
import { FormulaDisplay } from "@/components/lab/FormulaDisplay";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { currentFrom, powerFrom } from "@/lib/electronics";
import { formatAmps, formatFixed, formatOhms, formatWatts } from "@/lib/format";
import { cn } from "@/lib/cn";
import { BlockMeter } from "./BlockMeter";
import { StatusBanner } from "./StatusBanner";

const COMPARISON = [100, 1_000, 10_000] as const;
const QUARTER_WATT = 0.25;

/** 0–1 on a log scale from 0.1 mA to 1 A, so 10× less current = a few blocks fewer. */
function logFraction(current: number) {
  if (current <= 0) return 0;
  return Math.max(0, Math.min(1, (Math.log10(current) + 4) / 4));
}

/** Change a resistor's value and the voltage; see I = V ÷ R and compare standard values. */
export function ResistorLab() {
  const [voltage, setVoltage] = useState(5);
  const [resistance, setResistance] = useState(1_000);
  const current = currentFrom(voltage, resistance);
  const power = powerFrom(voltage, current);

  return (
    <div>
      <div className="grid gap-px bg-line lg:grid-cols-[1.3fr_1fr]">
        <div className="bg-breadboard px-2 py-4 sm:px-6">
          <OhmsLawCircuit voltage={voltage} resistance={resistance} current={current} power={power} maxCurrent={12 / 10} />
        </div>
        <div className="space-y-5 bg-surface-raised p-5">
          <InteractiveSlider label="Resistance" value={resistance} min={10} max={100_000} scale="log" onChange={setResistance} format={(r) => formatOhms(r)} color="var(--color-electric)" minLabel="10 Ω" maxLabel="100 kΩ" />
          <InteractiveSlider label="Voltage" value={voltage} min={0} max={12} step={0.5} onChange={setVoltage} format={(v) => `${formatFixed(v, 1)} V`} color="var(--color-amber)" />
          <FormulaDisplay
            label="Current"
            result={{ symbol: "I", value: formatAmps(current, 3), tone: "cyan" }}
            expression={[{ symbol: "V", value: `${formatFixed(voltage, 1)} V`, tone: "amber" }, "÷", { symbol: "R", value: formatOhms(resistance), tone: "electric" }]}
          />
        </div>
      </div>

      <div className="border-t border-line p-4 sm:p-5">
        <p className="mb-3 text-sm font-medium text-ink">Same {formatFixed(voltage, 1)} V, different resistors:</p>
        <ul className="space-y-2" aria-label="Current through standard resistor values">
          {[...COMPARISON, resistance].map((r, index) => {
            const i = currentFrom(voltage, r);
            const yours = index === COMPARISON.length;
            return (
              <li key={`${r}-${index}`} className={cn("grid grid-cols-[5.5rem_1fr_4.5rem] items-center gap-3 rounded-lg px-2 py-1.5", yours && "bg-cyan/10")}>
                <span className="font-mono text-sm text-ink">{yours ? "Yours" : formatOhms(r)}</span>
                <BlockMeter fraction={logFraction(i)} label={`${formatOhms(r)}: ${formatAmps(i)}`} className="overflow-hidden text-sm sm:text-base" />
                <span className="text-right font-mono text-xs text-cyan">{formatAmps(i, 2)}</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-2 text-xs text-ink-subtle">Each step is ten times the resistance — and one tenth of the current. (Bars use a log scale so small currents stay visible.)</p>
      </div>

      <div className="border-t border-line p-4 sm:p-5">
        {power > QUARTER_WATT ? (
          <StatusBanner level="caution" title={`The resistor is turning ${formatWatts(power, 2)} into heat.`}>
            A common ¼ W resistor would overheat. Use a higher resistance or a resistor with a bigger power rating.
          </StatusBanner>
        ) : (
          <StatusBanner level="ok" title={`Power check: ${formatWatts(power, 2)} — fine for a ¼ W resistor.`}>
            Power = V × I tells you how much heat the resistor must get rid of.
          </StatusBanner>
        )}
      </div>
    </div>
  );
}
