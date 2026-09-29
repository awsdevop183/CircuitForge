"use client";

import { useState } from "react";
import { Power } from "lucide-react";
import {
  Battery,
  CircuitCanvas,
  CircuitLabel,
  CurrentFlow,
  Lamp,
  Switch,
  VoltageIndicator,
  Wire,
  rectLoop,
} from "@/components/circuit";
import { DialGauge } from "@/components/electricity/DialGauge";
import { flowSpeedForCurrent } from "@/components/lab/flow-speed";
import { Readout } from "@/components/ui/Readout";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { currentFrom } from "@/lib/electronics";
import { formatAmps } from "@/lib/format";
import { clamp } from "@/lib/math";
import { cn } from "@/lib/cn";

const VOLTAGE_STEPS = [1, 5, 10, 12] as const;
/** A 12 V, 6 W lamp: R = V² / P = 24 Ω. */
const LAMP_RATED_VOLTS = 12;
const LAMP_RESISTANCE = 24;
const MAX_CURRENT = LAMP_RATED_VOLTS / LAMP_RESISTANCE;

const LEFT = 80;
const RIGHT = 380;
const TOP = 110;
const BOTTOM = 260;
const LOOP = rectLoop(LEFT, TOP, RIGHT, BOTTOM, 14);
const MID_Y = (TOP + BOTTOM) / 2;

/**
 * Step the supply from 1 V to 12 V and see the bulb respond. Opening the
 * switch shows that voltage can exist without any current.
 */
export function VoltageExplorer() {
  const [voltage, setVoltage] = useState<number>(5);
  const [closed, setClosed] = useState(true);

  const current = closed ? currentFrom(voltage, LAMP_RESISTANCE) : 0;
  // Lamp power rises with V²; perceived brightness is compressed.
  const brightness = closed ? clamp(Math.pow(voltage / LAMP_RATED_VOLTS, 1.6), 0, 1) : 0;

  return (
    <div>
      <div className="grid grid-cols-1 gap-px bg-line lg:grid-cols-[1.5fr_1fr]">
        <div className="bg-breadboard px-2 py-4 sm:px-6">
          <CircuitCanvas
            viewBox="0 0 460 300"
            interactive
            title="Voltage explorer circuit"
            description={`A ${voltage} volt battery, a switch that is ${closed ? "closed" : "open"}, and a 12 volt bulb. ${closed ? `Current is ${formatAmps(current)}.` : "No current flows, but the voltmeter still reads the battery voltage."}`}
          >
            <Wire d={LOOP} energized={closed} />
            <CurrentFlow d={LOOP} active={closed && current > 0} speed={flowSpeedForCurrent(current, MAX_CURRENT)} />
            <Battery x={LEFT} y={MID_Y} rotation={-90} detail={`${voltage} V`} energized={closed} labelPlacement="right" labelOffset={26} />
            <Lamp x={(LEFT + RIGHT) / 2} y={TOP} brightness={brightness} detail="12 V bulb" />
            <Switch x={(LEFT + RIGHT) / 2} y={BOTTOM} closed={closed} onToggle={() => setClosed((c) => !c)} labelPlacement="bottom" labelOffset={24} />
            <VoltageIndicator
              x={LEFT + 20}
              y={40}
              value={voltage}
              label="Battery"
              decimals={0}
              probes={{ positive: [LEFT, MID_Y - 40], negative: [LEFT, MID_Y + 40] }}
              level={voltage / LAMP_RATED_VOLTS}
              tone="amber"
            />
            <CircuitLabel x={RIGHT + 24} y={MID_Y - 6} text="CURRENT" value={formatAmps(current, 2)} anchor="start" valueTone="cyan" decorative />
          </CircuitCanvas>
        </div>
        <div className="flex flex-col justify-center gap-4 bg-surface-raised p-5">
          <div className="mx-auto w-full max-w-[13rem]">
            <DialGauge value={voltage} max={LAMP_RATED_VOLTS} label="Electrical push" unit="V" ticks={[0, 6, 12]} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Readout label="Current" value={formatAmps(current, 2)} tone="cyan" size="sm" />
            <Readout label="Brightness" value={Math.round(brightness * 100)} unit="%" tone="amber" size="sm" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 border-t border-line p-4 sm:grid-cols-[1fr_auto] sm:items-end sm:p-5">
        <SegmentedControl
          label="Battery voltage"
          options={VOLTAGE_STEPS.map((v) => ({ value: v, label: `${v} V` }))}
          value={voltage}
          onChange={setVoltage}
        />
        <button
          type="button"
          onClick={() => setClosed((c) => !c)}
          aria-pressed={closed}
          className={cn(
            "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors",
            closed ? "border-line-strong bg-surface-high text-ink hover:border-amber/60" : "border-cyan/60 bg-cyan/10 text-cyan",
          )}
        >
          <Power className="size-4" aria-hidden="true" />
          {closed ? "Open switch" : "Close switch"}
        </button>
      </div>
      <p className="border-t border-line px-4 py-3 text-sm text-ink-muted sm:px-5" aria-live="polite">
        {closed
          ? voltage === 1
            ? "1 V barely pushes — the filament hardly warms."
            : voltage === 12
              ? "12 V: the bulb's full rated voltage. Maximum push, maximum glow."
              : `${voltage} V pushes more charge through the bulb each second.`
          : `The battery still has ${voltage} V between its terminals — but with no path, nothing flows. Voltage is the push; current needs a path.`}
      </p>
    </div>
  );
}
