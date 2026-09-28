"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Power } from "lucide-react";
import {
  Battery,
  CircuitCanvas,
  CircuitLabel,
  CircuitNode,
  CurrentFlow,
  Led,
  Resistor,
  Switch,
  Wire,
  rectLoop,
} from "@/components/circuit";
import { currentFrom } from "@/lib/electronics";
import { formatAmps } from "@/lib/format";
import { cn } from "@/lib/cn";

const SUPPLY_VOLTS = 9;
const RESISTOR_OHMS = 330;
const LED_FORWARD_VOLTS = 2;
const LED_CURRENT = currentFrom(SUPPLY_VOLTS - LED_FORWARD_VOLTS, RESISTOR_OHMS);

// Loop geometry (viewBox 480 × 320)
const LEFT = 70;
const RIGHT = 410;
const TOP = 70;
const BOTTOM = 250;
const MID_X = (LEFT + RIGHT) / 2;
const MID_Y = (TOP + BOTTOM) / 2;
const LOOP = rectLoop(LEFT, TOP, RIGHT, BOTTOM, 14);

/**
 * Landing-page hero: a live battery → resistor → LED circuit. The circuit
 * powers up shortly after load; visitors can flip the switch themselves.
 */
export function HeroCircuit() {
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setClosed(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  const toggle = () => setClosed((value) => !value);

  return (
    <div className="panel-raised overflow-hidden rounded-2xl">
      {/* Instrument header */}
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-line-strong" />
            <span className="size-2.5 rounded-full bg-line-strong" />
            <span className={cn("size-2.5 rounded-full transition-colors", closed ? "bg-cyan shadow-[0_0_8px_#22d3ee]" : "bg-line-strong")} />
          </span>
          <span className="eyebrow text-ink-subtle">bench / led-circuit.cf</span>
        </div>
        <span className={cn("eyebrow flex items-center gap-1.5", closed ? "text-cyan" : "text-amber")}>
          <span className={cn("size-1.5 rounded-full", closed ? "bg-cyan" : "bg-amber")} aria-hidden="true" />
          {closed ? "Live" : "Open"}
        </span>
      </div>

      <div className="bg-breadboard relative px-2 pt-4 sm:px-6">
        <CircuitCanvas
          viewBox="10 22 460 270"
          interactive
          title="Animated circuit: battery, resistor and LED"
          description={`A 9 volt battery drives current through a 330 ohm resistor and a light-emitting diode. The switch is currently ${closed ? "closed, so current flows and the LED glows" : "open, so no current flows and the LED is dark"}. Hover or focus a component to see its name.`}
        >
          <Wire d={LOOP} energized={closed} />
          <motion.path
            d={LOOP}
            fill="none"
            stroke="#a5f3fc"
            strokeWidth={1.5}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={closed ? { pathLength: 1, opacity: [0, 1, 0.25] } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            aria-hidden="true"
          />
          <CurrentFlow d={LOOP} active={closed} speed={46} spacing={22} />

          {[
            [LEFT, TOP],
            [RIGHT, TOP],
            [RIGHT, BOTTOM],
            [LEFT, BOTTOM],
          ].map(([x, y]) => (
            <CircuitNode key={`${x}-${y}`} x={x!} y={y!} active={closed} radius={3.5} />
          ))}

          <Battery x={LEFT} y={MID_Y} rotation={-90} detail={`${SUPPLY_VOLTS} V`} energized={closed} labelPlacement="right" labelOffset={26} />
          <Resistor x={MID_X} y={TOP} detail={`${RESISTOR_OHMS} Ω`} energized={closed} labelOffset={24} />
          <Led x={RIGHT} y={MID_Y} rotation={90} brightness={closed ? 1 : 0} detail="red, 2 V" color="#fb7185" labelPlacement="left" labelOffset={30} />
          <Switch x={MID_X} y={BOTTOM} closed={closed} onToggle={toggle} labelPlacement="bottom" labelOffset={26} />

          <CircuitLabel x={LEFT - 36} y={MID_Y - 4} text="BT1" value={`${SUPPLY_VOLTS} V`} anchor="end" decorative />
          <CircuitLabel x={MID_X} y={TOP - 30} text="R1" value={`${RESISTOR_OHMS} Ω`} decorative />
          <CircuitLabel x={RIGHT + 36} y={MID_Y - 4} text="D1" value="LED" anchor="start" decorative />
        </CircuitCanvas>
      </div>

      {/* Readouts */}
      <div className="grid grid-cols-3 divide-x divide-line border-t border-line">
        <HeroReadout label="Supply" value={`${SUPPLY_VOLTS.toFixed(1)} V`} />
        <HeroReadout label="Current" value={closed ? formatAmps(LED_CURRENT, 2) : "0 A"} highlight={closed} />
        <HeroReadout label="LED" value={closed ? "ON" : "OFF"} highlight={closed} />
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3">
        <p className="text-xs text-ink-subtle">Hover or tap a component to identify it.</p>
        <button
          type="button"
          onClick={toggle}
          aria-pressed={closed}
          className={cn(
            "inline-flex min-h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border px-3 text-xs font-semibold transition-colors",
            closed ? "border-cyan/50 bg-cyan/10 text-cyan" : "border-amber/50 bg-amber/10 text-amber",
          )}
        >
          <Power className="size-3.5" aria-hidden="true" />
          {closed ? "Open switch" : "Close switch"}
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {closed ? "Circuit closed. Current flows and the LED is on." : "Circuit open. No current flows and the LED is off."}
      </p>
    </div>
  );
}

function HeroReadout({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="px-3 py-3 sm:px-4">
      <p className="eyebrow text-[0.65rem] text-ink-subtle">{label}</p>
      <p className={cn("mt-0.5 font-mono text-base font-semibold tabular-nums sm:text-lg", highlight ? "text-cyan" : "text-ink")}>
        {value}
      </p>
    </div>
  );
}
