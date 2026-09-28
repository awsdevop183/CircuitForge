"use client";

import { useState } from "react";
import { ArrowDown } from "lucide-react";
import { Battery, CircuitCanvas, CircuitLabel, CircuitNode, CurrentFlow, Diode, Ground, Mosfet, Motor, Resistor, Wire } from "@/components/circuit";
import { Readout } from "@/components/ui/Readout";
import { LOGIC_FAMILIES, levelToVoltage, type LogicLevel } from "@/lib/digital";
import { formatAmps, formatWatts } from "@/lib/format";
import { cn } from "@/lib/cn";

const FAMILY = LOGIC_FAMILIES["3v3"];
const MOTOR_SUPPLY = 12;
const MOTOR_OHMS = 10;

/**
 * Microcontroller → MOSFET → motor. A 3.3 V signal that supplies almost no
 * current switches a 12 V motor drawing over an amp.
 */
export function MosfetSwitch() {
  const [level, setLevel] = useState<LogicLevel>("LOW");
  const gateVolts = levelToVoltage(level, FAMILY);
  const on = level === "HIGH";
  const motorCurrent = on ? MOTOR_SUPPLY / MOTOR_OHMS : 0;

  return (
    <div>
      <div className="grid gap-px bg-line lg:grid-cols-[1.35fr_1fr]">
        <div className="bg-breadboard px-2 py-4 sm:px-5">
          <CircuitCanvas
            viewBox="0 0 470 360"
            interactive
            title="MOSFET switching a motor"
            description={`The microcontroller pin is ${level} (${gateVolts} volts). The MOSFET is ${on ? "on, and the 12 volt motor runs, drawing 1.2 amps" : "off, so the motor is stopped"}.`}
            className="mx-auto max-w-lg"
          >
            <Wire points={[[400, 150], [400, 30], [270, 30], [270, 110]]} energized={on} />
            <Wire points={[[270, 190], [270, 230]]} energized={on} />
            <Wire points={[[270, 310], [270, 318]]} energized={on} />
            <Wire points={[[400, 230], [400, 318]]} energized={on} />
            {/* Flyback diode across the motor */}
            <Wire points={[[270, 80], [330, 80], [330, 110]]} />
            <Wire points={[[330, 190], [330, 212], [270, 212]]} />
            <CircuitNode x={270} y={80} />
            <CircuitNode x={270} y={212} />
            <CurrentFlow d="M 400 150 L 400 30 L 270 30 L 270 310" active={on} speed={110} />
            <Battery x={400} y={190} rotation={-90} detail="12 V" energized={on} labelPlacement="left" labelOffset={26} />
            <Motor x={270} y={150} rotation={90} speed={on ? 0.8 : 0} labelPlacement="left" labelOffset={30} />
            <Diode x={330} y={150} rotation={-90} name="Flyback diode" detail="protects the MOSFET" labelPlacement="right" labelOffset={20} />
            {/* Control side */}
            <g aria-hidden="true">
              <rect x={10} y={250} width={82} height={50} rx={6} fill="#0f1621" stroke={on ? "#22d3ee" : "#34445a"} strokeWidth={2} />
              <text x={51} y={266} textAnchor="middle" fontSize={9} fill="#94a3b8" fontFamily="var(--font-mono)">
                MICRO-
              </text>
              <text x={51} y={277} textAnchor="middle" fontSize={9} fill="#94a3b8" fontFamily="var(--font-mono)">
                CONTROLLER
              </text>
              <text x={51} y={292} textAnchor="middle" fontSize={11} fontWeight={700} fill={on ? "#22d3ee" : "#64748b"} fontFamily="var(--font-mono)">
                {level} {gateVolts} V
              </text>
            </g>
            <Wire points={[[92, 280], [110, 280]]} energized={on} color="#22d3ee" />
            <Wire points={[[190, 280], [220, 280]]} energized={on} color="#22d3ee" />
            <Resistor x={150} y={280} name="Gate resistor" detail="100 Ω" labelOffset={24} />
            <Wire points={[[205, 280], [205, 318]]} />
            <CircuitNode x={205} y={280} />
            <CircuitLabel x={196} y={330} text="10k PULL-DOWN" anchor="end" size={9} decorative />
            <Mosfet x={260} y={270} conducting={on} />
            <Ground x={205} y={318} />
            <Ground x={270} y={318} />
            <Ground x={400} y={318} />
          </CircuitCanvas>
        </div>
        <div className="space-y-4 bg-surface-raised p-5">
          <div role="group" aria-label="Microcontroller output" className="grid grid-cols-2 gap-2">
            {(["LOW", "HIGH"] as const).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={level === value}
                onClick={() => setLevel(value)}
                className={cn(
                  "min-h-12 rounded-xl border font-mono text-sm font-semibold",
                  level === value ? "border-cyan/70 bg-cyan/15 text-cyan" : "border-line-strong text-ink-muted hover:text-ink",
                )}
              >
                Pin {value}
                <span className="block text-xs font-normal">{levelToVoltage(value, FAMILY)} V</span>
              </button>
            ))}
          </div>
          <div className="rounded-xl border border-line bg-void/40 p-3 text-center font-mono text-sm">
            <p className="text-ink-muted">Microcontroller: {gateVolts} V, ≈ 0 mA</p>
            <ArrowDown className="mx-auto my-1 size-4 text-ink-subtle" aria-hidden="true" />
            <p className={on ? "text-cyan" : "text-ink-muted"}>MOSFET {on ? "ON" : "OFF"}</p>
            <ArrowDown className="mx-auto my-1 size-4 text-ink-subtle" aria-hidden="true" />
            <p className={on ? "text-positive" : "text-ink-muted"}>Motor {on ? "RUNNING" : "STOPPED"}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Readout label="Motor current" value={formatAmps(motorCurrent, 2)} tone="cyan" size="sm" />
            <Readout label="Motor power" value={formatWatts(motorCurrent * MOTOR_SUPPLY, 3)} tone="amber" size="sm" />
          </div>
          <p className="text-sm text-ink-muted" aria-live="polite">
            {on
              ? "The gate needs voltage, not current: a tiny 3.3 V signal is switching 14 W."
              : "Gate at 0 V: the drain–source path is open and the motor is off."}
          </p>
        </div>
      </div>
    </div>
  );
}
