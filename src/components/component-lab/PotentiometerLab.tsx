"use client";

import { useState } from "react";
import { Battery, CircuitCanvas, CircuitNode, CurrentFlow, Led, Potentiometer, Resistor, VoltageIndicator, Wire, rectLoop } from "@/components/circuit";
import { Readout } from "@/components/ui/Readout";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { ledBrightness } from "@/lib/circuit-sim";
import { formatAmps, formatFixed, formatOhms } from "@/lib/format";
import { BlockMeter } from "./BlockMeter";
import { RotaryKnob } from "./RotaryKnob";

type Mode = "divider" | "dimmer";

const SUPPLY = 9;
const POT_OHMS = 10_000;
const SAFETY_RESISTOR = 330;
const LED_VF = 2;

/** Turn a virtual knob: see the wiper move, the output voltage change and an LED dim. */
export function PotentiometerLab() {
  const [position, setPosition] = useState(0.5);
  const [mode, setMode] = useState<Mode>("divider");

  const vout = SUPPLY * position;
  // As a dimmer: the knob sets how much of the 10 kΩ track is in series with the LED.
  const potResistance = (1 - position) * POT_OHMS;
  const ledCurrent = (SUPPLY - LED_VF) / (SAFETY_RESISTOR + potResistance);

  return (
    <div>
      <div className="border-b border-line p-4 sm:p-5">
        <SegmentedControl
          label="Use the potentiometer as…"
          options={[
            { value: "divider" as const, label: "Voltage divider (3 pins)" },
            { value: "dimmer" as const, label: "LED dimmer (variable resistor)" },
          ]}
          value={mode}
          onChange={setMode}
          size="sm"
        />
      </div>
      <div className="grid gap-px bg-line md:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center justify-center gap-3 bg-surface-raised p-5">
          <RotaryKnob
            value={position}
            onChange={setPosition}
            label="Potentiometer knob"
            valueText={mode === "divider" ? `${Math.round(position * 100)}%, output ${formatFixed(vout, 1)} volts` : `${Math.round(position * 100)}%, LED current ${formatAmps(ledCurrent, 2)}`}
          />
          <p className="text-xs text-ink-subtle">Drag the knob, or focus it and use the arrow keys.</p>
          <div className="w-full font-mono text-xs text-ink-muted">
            <div className="flex justify-between">
              <span>0%</span>
              <span>100%</span>
            </div>
            <div className="relative mt-1 h-1.5 rounded-full bg-line">
              <div className="absolute inset-y-0 left-0 rounded-full bg-amber" style={{ width: `${position * 100}%` }} />
            </div>
          </div>
        </div>
        <div className="bg-breadboard px-2 py-4 sm:px-5">
          {mode === "divider" ? (
            <CircuitCanvas viewBox="0 0 420 260" interactive title="Potentiometer as a voltage divider" description={`The wiper is at ${Math.round(position * 100)} percent, so the output is ${formatFixed(vout, 1)} of ${SUPPLY} volts.`} className="mx-auto max-w-md">
              <Wire d={rectLoop(60, 50, 300, 210, 12)} energized />
              <CurrentFlow d={rectLoop(60, 50, 300, 210, 12)} active speed={30} />
              <Battery x={60} y={130} rotation={-90} detail={`${SUPPLY} V`} energized labelPlacement="right" labelOffset={26} />
              {/* Track runs top (+9 V) → bottom (0 V); wiper points right */}
              <Potentiometer x={300} y={130} rotation={90} position={1 - position} energized labelPlacement="left" labelOffset={34} showWiper={false} />
              <Wire points={[[300, 130 + (0.5 - position) * 52], [350, 130 + (0.5 - position) * 52]]} energized color="#f5a524" />
              <CircuitNode x={300} y={130 + (0.5 - position) * 52} active />
              <VoltageIndicator x={360} y={50} value={vout} label="Wiper" decimals={1} tone="amber" level={position} probes={{ positive: [350, 130 + (0.5 - position) * 52], negative: [300, 210] }} />
            </CircuitCanvas>
          ) : (
            <CircuitCanvas viewBox="0 0 420 260" interactive title="Potentiometer dimming an LED" description={`The potentiometer adds ${formatOhms(potResistance)} in series, so ${formatAmps(ledCurrent, 2)} flows and the LED is at ${Math.round(ledBrightness(ledCurrent) * 100)} percent brightness.`} className="mx-auto max-w-md">
              <Wire d={rectLoop(60, 50, 360, 210, 12)} energized />
              <CurrentFlow d={rectLoop(60, 50, 360, 210, 12)} active speed={10 + ledBrightness(ledCurrent) * 70} />
              <Battery x={60} y={130} rotation={-90} detail={`${SUPPLY} V`} energized labelPlacement="right" labelOffset={26} />
              <Resistor x={150} y={50} name="Safety resistor" detail="330 Ω" energized labelPlacement="bottom" labelOffset={22} />
              <Potentiometer x={260} y={50} position={position} energized detail={formatOhms(potResistance)} labelPlacement="bottom" labelOffset={22} showWiper={false} />
              <Led x={360} y={130} rotation={90} brightness={ledBrightness(ledCurrent)} color="#fb7185" labelPlacement="left" labelOffset={32} />
            </CircuitCanvas>
          )}
        </div>
      </div>
      <div className="grid gap-4 border-t border-line p-4 sm:p-5 md:grid-cols-[1fr_1.2fr] md:items-center">
        {mode === "divider" ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              <Readout label="Wiper position" value={Math.round(position * 100)} unit="%" size="sm" />
              <Readout label="Output voltage" value={formatFixed(vout, 2)} unit="V" tone="amber" size="sm" />
            </div>
            <div>
              <BlockMeter fraction={position} label={`Output ${formatFixed(vout, 1)} volts`} tone="amber" />
              <p className="mt-2 text-sm text-ink-muted">The wiper taps off a fraction of the supply: at 50% you get half of {SUPPLY} V. Microcontrollers read knobs exactly this way.</p>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2">
              <Readout label="Pot resistance" value={formatOhms(potResistance)} size="sm" />
              <Readout label="LED current" value={formatAmps(ledCurrent, 2)} tone="cyan" size="sm" />
            </div>
            <p className="text-sm text-ink-muted">Turning up removes resistance, so more current flows and the LED brightens. The fixed 330 Ω resistor keeps the LED safe even at 100%.</p>
          </>
        )}
      </div>
    </div>
  );
}
