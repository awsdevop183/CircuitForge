"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Scissors } from "lucide-react";
import { Battery, CircuitCanvas, CircuitLabel, CurrentFlow, Led, Resistor, Wire, rectLoop } from "@/components/circuit";
import { flowSpeedForCurrent } from "@/components/lab/flow-speed";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { Readout } from "@/components/ui/Readout";
import { LED_MAX_CURRENT, LED_RATED_CURRENT, RED_LED_FORWARD_VOLTAGE, ledBrightness, solveLoop } from "@/lib/circuit-sim";
import { formatAmps, formatFixed, formatOhms } from "@/lib/format";
import { cn } from "@/lib/cn";
import { StatusBanner } from "./StatusBanner";

const LEFT = 70;
const RIGHT = 390;
const TOP = 70;
const BOTTOM = 230;
const MID_Y = (TOP + BOTTOM) / 2;
const LOOP = rectLoop(LEFT, TOP, RIGHT, BOTTOM, 14);
const METER_MAX = 0.04;

type Safety = "off" | "safe" | "caution" | "destroyed";

function safetyOf(current: number): Safety {
  if (current <= 0) return "off";
  if (current <= LED_RATED_CURRENT) return "safe";
  if (current <= LED_MAX_CURRENT) return "caution";
  return "destroyed";
}

/**
 * Battery → resistor → LED → battery. Change voltage and resistance, watch
 * brightness and current, and see what happens when the resistor is missing.
 */
export function LedCircuitLab() {
  const [voltage, setVoltage] = useState(9);
  const [resistance, setResistance] = useState(470);
  const [resistorRemoved, setResistorRemoved] = useState(false);

  const solution = solveLoop({ voltage, internalResistance: 0.5 }, [
    ...(resistorRemoved ? [] : [{ kind: "resistor" as const, id: "r", ohms: resistance }]),
    { kind: "led", id: "led", forwardVoltage: RED_LED_FORWARD_VOLTAGE },
  ]);
  const current = solution.current;
  const safety = safetyOf(current);
  const destroyed = safety === "destroyed";
  const brightness = destroyed ? 0 : ledBrightness(current);

  return (
    <div>
      <div className={cn("bg-breadboard relative px-2 py-4 sm:px-6", destroyed && "bg-negative/[0.06]")}>
        <CircuitCanvas
          viewBox="0 0 460 290"
          interactive
          title="LED circuit"
          description={
            destroyed
              ? `${resistorRemoved ? "With no resistor" : "With too little resistance"}, far more than 30 milliamps flows. A real LED would burn out.`
              : current > 0
                ? `${formatFixed(voltage, 1)} volts through ${formatOhms(resistance)} gives ${formatAmps(current)} — the LED is lit.`
                : "The battery voltage is too low to light the LED."
          }
          className="mx-auto max-w-2xl"
        >
          <Wire d={LOOP} energized={current > 0} color={destroyed ? "#f87171" : undefined} />
          <CurrentFlow d={LOOP} active={current > 0} speed={flowSpeedForCurrent(Math.min(current, 0.05), 0.05)} color={destroyed ? "#fca5a5" : undefined} />
          <Battery x={LEFT} y={MID_Y} rotation={-90} detail={`${formatFixed(voltage, 1)} V`} energized={current > 0} labelPlacement="right" labelOffset={26} />
          {resistorRemoved ? (
            <g aria-hidden="true">
              <CircuitLabel x={(LEFT + RIGHT) / 2} y={TOP - 18} text="NO RESISTOR!" tone="danger" size={13} />
            </g>
          ) : (
            <Resistor x={(LEFT + RIGHT) / 2} y={TOP} detail={formatOhms(resistance)} energized={current > 0} labelPlacement="bottom" labelOffset={22} />
          )}
          <Led x={RIGHT} y={MID_Y} rotation={90} brightness={brightness} color={safety === "caution" ? "#fb923c" : "#fb7185"} detail="red, 2 V" labelPlacement="left" labelOffset={32} />
          {destroyed ? (
            <motion.g initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} aria-hidden="true">
              <circle cx={RIGHT} cy={MID_Y} r={26} fill="#2a0b0b" stroke="#f87171" strokeWidth={2} />
              <path d={`M ${RIGHT - 11} ${MID_Y - 11} L ${RIGHT + 11} ${MID_Y + 11} M ${RIGHT + 11} ${MID_Y - 11} L ${RIGHT - 11} ${MID_Y + 11}`} stroke="#f87171" strokeWidth={4} strokeLinecap="round" />
              <text x={RIGHT - 34} y={MID_Y + 4} textAnchor="end" fontSize={12} fontWeight={700} fill="#f87171" fontFamily="var(--font-mono)">
                BURNT OUT
              </text>
            </motion.g>
          ) : null}
        </CircuitCanvas>
      </div>

      <div className="grid gap-5 border-t border-line p-4 sm:p-5 md:grid-cols-2">
        <InteractiveSlider label="Battery voltage" value={voltage} min={1.5} max={12} step={0.5} onChange={setVoltage} format={(v) => `${formatFixed(v, 1)} V`} color="var(--color-amber)" />
        <InteractiveSlider
          label="Resistance"
          value={resistance}
          min={10}
          max={4_700}
          scale="log"
          onChange={setResistance}
          format={(r) => formatOhms(r)}
          color="var(--color-electric)"
          disabled={resistorRemoved}
        />
        <button
          type="button"
          aria-pressed={resistorRemoved}
          onClick={() => setResistorRemoved((v) => !v)}
          className={cn(
            "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold md:col-span-2",
            resistorRemoved ? "border-negative/60 bg-negative/10 text-negative" : "border-line-strong text-ink hover:border-negative/60",
          )}
        >
          <Scissors className="size-4" aria-hidden="true" />
          {resistorRemoved ? "Put the resistor back" : "Try the wrong circuit: remove the resistor"}
        </button>
      </div>

      <div className="grid gap-4 border-t border-line p-4 sm:p-5 md:grid-cols-[1fr_1.4fr]">
        <div className="grid grid-cols-2 gap-2">
          <Readout label="Current" value={destroyed ? "≫ 30 mA" : formatAmps(current, 2)} tone={destroyed ? "negative" : "cyan"} size="sm" />
          <Readout label="Brightness" value={Math.round(brightness * 100)} unit="%" tone="amber" size="sm" />
        </div>
        <SafetyMeter current={current} />
      </div>
      <div className="border-t border-line p-4 sm:p-5">
        {safety === "off" ? (
          <StatusBanner level="info" title="LED off — not enough voltage.">
            A red LED needs about {RED_LED_FORWARD_VOLTAGE} V before any current flows. Raise the battery voltage.
          </StatusBanner>
        ) : safety === "safe" ? (
          <StatusBanner level="ok" title="Operating safely.">
            The resistor limits the current to {formatAmps(current, 2)} — within a small LED&apos;s ~20 mA rating.
          </StatusBanner>
        ) : safety === "caution" ? (
          <StatusBanner level="caution" title="Too bright — above the recommended current.">
            {formatAmps(current, 2)} will shorten the LED&apos;s life. Increase the resistance.
          </StatusBanner>
        ) : (
          <StatusBanner level="danger" title={resistorRemoved ? "Wrong circuit: no current limit!" : "Far too much current!"}>
            Once an LED is on it has almost no resistance of its own, so {resistorRemoved ? "without a resistor" : "with so little resistance"} the current is limited only by the battery — hundreds of milliamps or more. The LED overheats and burns out in moments. Always use a series resistor.
          </StatusBanner>
        )}
      </div>
    </div>
  );
}

function SafetyMeter({ current }: { current: number }) {
  const fraction = Math.min(1, current / METER_MAX);
  return (
    <div>
      <p className="mb-2 flex justify-between text-xs text-ink-subtle">
        <span>LED current</span>
        <span className="font-mono">0 – 40 mA</span>
      </p>
      <div className="relative h-4 overflow-hidden rounded-full" role="img" aria-label={`LED current ${formatAmps(current)}: ${current <= LED_RATED_CURRENT ? "safe zone" : current <= LED_MAX_CURRENT ? "caution zone" : "danger zone"}`}>
        <div className="absolute inset-y-0 left-0 w-1/2 bg-positive/35" />
        <div className="absolute inset-y-0 left-1/2 w-1/4 bg-orange/40" />
        <div className="absolute inset-y-0 left-3/4 w-1/4 bg-negative/40" />
        <motion.div className="absolute inset-y-0 w-1 bg-ink shadow-[0_0_8px_#fff]" initial={false} animate={{ left: `calc(${fraction * 100}% - 2px)` }} />
      </div>
      <p className="mt-1 grid grid-cols-4 font-mono text-[0.65rem] text-ink-subtle" aria-hidden="true">
        <span className="col-span-2">safe ≤ 20 mA</span>
        <span>caution</span>
        <span className="text-right">damage</span>
      </p>
    </div>
  );
}
