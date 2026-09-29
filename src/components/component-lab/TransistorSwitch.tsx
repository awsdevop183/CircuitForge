"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Battery, CircuitCanvas, CircuitLabel, CurrentFlow, Ground, Led, Resistor, Transistor, Wire } from "@/components/circuit";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { Readout } from "@/components/ui/Readout";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { LOGIC_FAMILIES, levelToVoltage, type LogicLevel } from "@/lib/digital";
import { formatAmps } from "@/lib/format";
import { cn } from "@/lib/cn";

const FAMILY = LOGIC_FAMILIES["3v3"];
const SUPPLY = 9;
const RB = 1_000;
const RC = 330;
const VBE = 0.7;
const VCE_SAT = 0.2;
const LED_VF = 2;
const GAIN = 100;
/** Most current the LED branch can take when the transistor is fully on. */
const I_SAT = (SUPPLY - LED_VF - VCE_SAT) / RC;

type Mode = "switch" | "amplifier";

/**
 * A small base current switches (or controls) a much bigger collector current.
 * Switch mode: a GPIO pin goes LOW/HIGH. Amplifier mode: vary the base current.
 */
export function TransistorSwitch() {
  const [mode, setMode] = useState<Mode>("switch");
  const [level, setLevel] = useState<LogicLevel>("LOW");
  const [baseMicroamps, setBaseMicroamps] = useState(100);

  const inputVolts = levelToVoltage(level, FAMILY);
  const baseCurrent = mode === "switch" ? Math.max(0, (inputVolts - VBE) / RB) : baseMicroamps / 1e6;
  const collectorCurrent = Math.min(GAIN * baseCurrent, I_SAT);
  const saturated = GAIN * baseCurrent >= I_SAT;
  const on = collectorCurrent > 0.0002;
  const region = !on ? "off" : saturated ? "fully on" : "partly on (amplifying)";

  return (
    <div>
      <div className="border-b border-line p-4 sm:p-5">
        <SegmentedControl
          label="Use the transistor as…"
          options={[
            { value: "switch" as const, label: "A switch (GPIO LOW/HIGH)" },
            { value: "amplifier" as const, label: "An amplifier (vary the input)" },
          ]}
          value={mode}
          onChange={setMode}
          size="sm"
        />
      </div>
      <div className="grid grid-cols-1 gap-px bg-line lg:grid-cols-[1.35fr_1fr]">
        <div className="bg-breadboard px-2 py-4 sm:px-5">
          <CircuitCanvas
            viewBox="0 0 470 360"
            interactive
            title="NPN transistor switching an LED"
            description={`Base current ${formatAmps(baseCurrent)} controls a collector current of ${formatAmps(collectorCurrent)}. The transistor is ${region} and the LED is ${on ? "lit" : "off"}.`}
            className="mx-auto max-w-lg"
          >
            {/* Load side: 9 V → Rc → LED → collector → emitter → ground */}
            <Wire points={[[400, 150], [400, 30], [270, 30], [270, 230]]} energized={on} />
            <Wire points={[[270, 310], [270, 318]]} energized={on} />
            <Wire points={[[400, 230], [400, 318]]} energized={on} />
            <CurrentFlow d="M 400 150 L 400 30 L 270 30 L 270 310" active={on} speed={20 + (collectorCurrent / I_SAT) * 90} />
            <Battery x={400} y={190} rotation={-90} detail={`${SUPPLY} V`} energized={on} labelPlacement="left" labelOffset={26} />
            <Resistor x={270} y={70} rotation={90} name="Collector resistor" detail="330 Ω" energized={on} labelPlacement="left" labelOffset={34} />
            <Led x={270} y={150} rotation={90} brightness={collectorCurrent / I_SAT} color="#fb7185" labelPlacement="left" labelOffset={32} />
            {/* Control side: GPIO → Rb → base */}
            <g aria-hidden="true">
              <rect x={14} y={248} width={70} height={44} rx={6} fill="#0f1621" stroke={level === "HIGH" || mode === "amplifier" ? "#22d3ee" : "#34445a"} strokeWidth={2} />
              <text x={49} y={264} textAnchor="middle" fontSize={10} fill="#94a3b8" fontFamily="var(--font-mono)">
                {mode === "switch" ? "GPIO" : "INPUT"}
              </text>
              <text x={49} y={281} textAnchor="middle" fontSize={12} fontWeight={700} fill={baseCurrent > 0 ? "#22d3ee" : "#64748b"} fontFamily="var(--font-mono)">
                {mode === "switch" ? `${level} ${inputVolts} V` : `${baseMicroamps} µA`}
              </text>
            </g>
            <Wire points={[[84, 270], [100, 270]]} energized={baseCurrent > 0} />
            <Wire points={[[180, 270], [220, 270]]} energized={baseCurrent > 0} />
            <CurrentFlow d="M 84 270 L 220 270" active={baseCurrent > 0} speed={18} size={3.5} spacing={16} />
            <Resistor x={140} y={270} name="Base resistor" detail="1 kΩ" energized={baseCurrent > 0} labelOffset={24} />
            <Transistor x={260} y={270} energized={on} />
            <Ground x={270} y={318} />
            <Ground x={400} y={318} />
            <CircuitLabel x={300} y={276} text={region.toUpperCase()} tone={on ? "cyan" : "muted"} anchor="start" size={11} decorative />
          </CircuitCanvas>
        </div>
        <div className="space-y-5 bg-surface-raised p-5">
          {mode === "switch" ? (
            <div role="group" aria-label="GPIO pin level" className="grid grid-cols-2 gap-2">
              {(["LOW", "HIGH"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={level === value}
                  onClick={() => setLevel(value)}
                  className={cn(
                    "min-h-12 rounded-xl border font-mono text-sm font-semibold transition-colors",
                    level === value ? "border-cyan/70 bg-cyan/15 text-cyan" : "border-line-strong text-ink-muted hover:text-ink",
                  )}
                >
                  Input {value}
                  <span className="block text-xs font-normal">{levelToVoltage(value, FAMILY)} V</span>
                </button>
              ))}
            </div>
          ) : (
            <InteractiveSlider label="Base (input) current" value={baseMicroamps} min={0} max={300} step={5} onChange={setBaseMicroamps} format={(v) => `${v} µA`} color="var(--color-cyan)" hint={`Collector current ≈ ${GAIN} × base current, until the transistor is fully on.`} />
          )}
          <div className="grid grid-cols-2 gap-2">
            <Readout label="Base current (small)" value={formatAmps(baseCurrent, 2)} size="sm" />
            <Readout label="LED current (big)" value={formatAmps(collectorCurrent, 2)} tone="cyan" size="sm" />
          </div>
          <p className="rounded-xl border border-line bg-void/40 p-3 text-sm text-ink-muted" aria-live="polite">
            {baseCurrent > 0
              ? `A ${formatAmps(baseCurrent, 2)} input controls ${formatAmps(collectorCurrent, 2)} — about ${Math.max(1, Math.round(collectorCurrent / baseCurrent))}× more current.`
              : "No base current, so no collector current: the transistor is off."}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1.5 border-t border-line p-4 text-center font-mono text-xs sm:gap-3 sm:p-5 sm:text-sm" aria-live="polite">
        <span className={cn("rounded-lg border px-2 py-2.5", baseCurrent > 0 ? "border-cyan/50 text-cyan" : "border-line-strong text-ink-muted")}>
          Input {mode === "switch" ? level : baseCurrent > 0 ? "ON" : "OFF"}
        </span>
        <ArrowRight className="size-4 text-ink-subtle" aria-hidden="true" />
        <span className={cn("rounded-lg border px-2 py-2.5", on ? "border-cyan/50 text-cyan" : "border-line-strong text-ink-muted")}>Transistor {on ? (saturated ? "ON" : "PARTLY ON") : "OFF"}</span>
        <ArrowRight className="size-4 text-ink-subtle" aria-hidden="true" />
        <span className={cn("rounded-lg border px-2 py-2.5", on ? "border-positive/50 text-positive" : "border-line-strong text-ink-muted")}>LED {on ? "ON" : "OFF"}</span>
      </div>
    </div>
  );
}
