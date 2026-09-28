"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck, CircleX, FlipVertical2, Scissors, TriangleAlert } from "lucide-react";
import {
  Battery,
  CircuitCanvas,
  CircuitLabel,
  CurrentFlow,
  Led,
  Resistor,
  Wire,
  rectLoop,
} from "@/components/circuit";
import { LedIllustration } from "@/components/illustrations/ComponentIllustration";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Readout } from "@/components/ui/Readout";
import { ledSeriesResistor, nextE12Value } from "@/lib/electronics";
import { formatAmps, formatOhms, formatVolts, formatWatts } from "@/lib/format";
import { clamp } from "@/lib/math";
import { cn } from "@/lib/cn";
import { flowSpeedForCurrent } from "@/components/lab/flow-speed";
import { DeepDiveSection } from "./DeepDiveSection";

interface LedColor {
  id: string;
  label: string;
  hex: string;
  forwardVoltage: number;
}

const LED_COLORS: readonly LedColor[] = [
  { id: "red", label: "Red", hex: "#ef4444", forwardVoltage: 2.0 },
  { id: "yellow", label: "Yellow", hex: "#facc15", forwardVoltage: 2.1 },
  { id: "green", label: "Green", hex: "#22c55e", forwardVoltage: 2.2 },
  { id: "blue", label: "Blue", hex: "#3b82f6", forwardVoltage: 3.2 },
  { id: "white", label: "White", hex: "#f1f5f9", forwardVoltage: 3.2 },
];

const SUPPLY_OPTIONS = [3.3, 5, 9, 12].map((v) => ({ value: v, label: `${v} V` }));
const CURRENT_OPTIONS = [
  { value: 0.01, label: "10 mA" },
  { value: 0.02, label: "20 mA" },
];
const MAX_LED_CURRENT = 0.02;

const LEFT = 70;
const RIGHT = 380;
const TOP = 70;
const BOTTOM = 240;
const LOOP = rectLoop(LEFT, TOP, RIGHT, BOTTOM, 14);

type CircuitState = "lit" | "reversed" | "no-headroom" | "destroyed";

export function LedDeepDive() {
  const [colorId, setColorId] = useState("red");
  const [supply, setSupply] = useState(5);
  const [targetCurrent, setTargetCurrent] = useState(0.02);
  const [reversed, setReversed] = useState(false);
  const [resistorRemoved, setResistorRemoved] = useState(false);

  const color = LED_COLORS.find((c) => c.id === colorId)!;
  const idealResistance = ledSeriesResistor(supply, color.forwardVoltage, targetCurrent);
  const chosenResistance = idealResistance === null ? null : nextE12Value(idealResistance);
  const headroom = supply - color.forwardVoltage;

  let state: CircuitState;
  if (reversed) state = "reversed";
  else if (headroom <= 0) state = "no-headroom";
  else if (resistorRemoved) state = "destroyed";
  else state = "lit";

  const current = state === "lit" && chosenResistance ? headroom / chosenResistance : 0;
  const brightness = clamp(current / MAX_LED_CURRENT, 0, 1);
  const resistorPower = chosenResistance ? current * current * chosenResistance : 0;

  return (
    <div className="space-y-16">
      <DeepDiveSection
        eyebrow="Anatomy"
        title="Which leg is which?"
        description="An LED only works one way round. Current must enter the anode and leave the cathode."
      >
        <LedAnatomy color={color.hex} label={color.label} forwardVoltage={color.forwardVoltage} />
      </DeepDiveSection>

      <DeepDiveSection
        eyebrow="Interactive"
        title="Light it safely"
        description="Choose an LED and a supply. CircuitForge calculates the series resistor, picks the nearest standard value, and shows you the result. Then try breaking the rules."
      >
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            <div className="panel-raised bg-breadboard rounded-2xl px-2 py-4 sm:px-6">
              <CircuitCanvas
                viewBox="0 0 450 290"
                interactive
                title="LED circuit"
                description={describeState(state, color, supply, current)}
              >
                <Wire d={LOOP} energized={state === "lit"} />
                <CurrentFlow d={LOOP} active={state === "lit"} speed={flowSpeedForCurrent(current, MAX_LED_CURRENT)} />
                <Battery x={LEFT} y={(TOP + BOTTOM) / 2} rotation={-90} detail={formatVolts(supply)} labelPlacement="right" labelOffset={26} />
                {resistorRemoved ? (
                  <CircuitLabel x={(LEFT + RIGHT) / 2} y={TOP - 16} text="NO RESISTOR" tone="danger" decorative />
                ) : (
                  <Resistor x={(LEFT + RIGHT) / 2} y={TOP} detail={chosenResistance ? formatOhms(chosenResistance) : "—"} labelPlacement="bottom" labelOffset={20} />
                )}
                <Led
                  x={RIGHT}
                  y={(TOP + BOTTOM) / 2}
                  rotation={reversed ? -90 : 90}
                  brightness={brightness}
                  color={color.hex}
                  detail={`${color.label}, ${formatVolts(color.forwardVoltage)}`}
                  labelPlacement="left"
                  labelOffset={30}
                />
                {state === "destroyed" ? <BurntMarker x={RIGHT} y={(TOP + BOTTOM) / 2} /> : null}
                {!resistorRemoved && chosenResistance ? (
                  <CircuitLabel x={(LEFT + RIGHT) / 2} y={TOP - 30} text="R" value={formatOhms(chosenResistance)} decorative />
                ) : null}
                <CircuitLabel x={LEFT - 32} y={(TOP + BOTTOM) / 2 - 6} text="SUPPLY" value={formatVolts(supply)} anchor="end" decorative />
                <CircuitLabel x={RIGHT + 30} y={(TOP + BOTTOM) / 2 - 6} text={reversed ? "REVERSED" : "LED"} value={formatAmps(current, 2)} anchor="start" tone={reversed ? "amber" : "muted"} valueTone="cyan" decorative />
              </CircuitCanvas>
            </div>
            <StatusMessage state={state} color={color} supply={supply} />
          </div>

          <div className="space-y-5">
            <SegmentedControl
              label="LED colour"
              options={LED_COLORS.map((c) => ({ value: c.id, label: c.label }))}
              value={colorId}
              onChange={setColorId}
              size="sm"
            />
            <SegmentedControl label="Supply voltage" options={SUPPLY_OPTIONS} value={supply} onChange={setSupply} size="sm" />
            <SegmentedControl label="Target LED current" options={CURRENT_OPTIONS} value={targetCurrent} onChange={setTargetCurrent} size="sm" />

            <div className="grid grid-cols-2 gap-3">
              <Readout
                label="Calculated R"
                value={idealResistance === null ? "—" : formatOhms(idealResistance)}
                hint={`(${formatVolts(supply)} − ${formatVolts(color.forwardVoltage)}) ÷ ${formatAmps(targetCurrent)}`}
                size="sm"
              />
              <Readout label="Standard value" value={chosenResistance ? formatOhms(chosenResistance) : "—"} tone="cyan" hint="Next E12 value up" size="sm" />
              <Readout label="Actual current" value={formatAmps(current, 3)} tone="cyan" size="sm" />
              <Readout label="Resistor power" value={formatWatts(resistorPower, 2)} size="sm" hint={resistorPower > 0.25 ? "Use a ½ W resistor" : "¼ W is fine"} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ToggleButton pressed={reversed} onClick={() => setReversed((v) => !v)} icon={<FlipVertical2 className="size-4" aria-hidden="true" />}>
                {reversed ? "Fix polarity" : "Flip the LED"}
              </ToggleButton>
              <ToggleButton pressed={resistorRemoved} onClick={() => setResistorRemoved((v) => !v)} icon={<Scissors className="size-4" aria-hidden="true" />} danger>
                {resistorRemoved ? "Add resistor" : "Remove resistor"}
              </ToggleButton>
            </div>
          </div>
        </div>
      </DeepDiveSection>
    </div>
  );
}

function describeState(state: CircuitState, color: LedColor, supply: number, current: number): string {
  switch (state) {
    case "lit":
      return `A ${color.label.toLowerCase()} LED lit from ${formatVolts(supply)} with ${formatAmps(current)} flowing.`;
    case "reversed":
      return "The LED is connected backwards, so it blocks current and stays dark.";
    case "no-headroom":
      return `The ${formatVolts(supply)} supply is below the LED's forward voltage, so it does not light.`;
    case "destroyed":
      return "Without a resistor, far too much current flows and the LED burns out.";
  }
}

function StatusMessage({ state, color, supply }: { state: CircuitState; color: LedColor; supply: number }) {
  const config = {
    lit: { icon: CircleCheck, tone: "border-positive/40 bg-positive/5 text-positive", text: "Lit and safe. The resistor takes the extra voltage so the LED gets just the current it needs." },
    reversed: { icon: CircleX, tone: "border-amber/40 bg-amber/5 text-amber", text: "Reverse-biased: an LED is a diode, so it blocks current flowing the wrong way. Nothing is damaged — it simply stays off." },
    "no-headroom": { icon: CircleX, tone: "border-amber/40 bg-amber/5 text-amber", text: `${formatVolts(supply)} isn't enough to overcome the ${formatVolts(color.forwardVoltage)} forward voltage — the LED stays dark. Pick a higher supply.` },
    destroyed: { icon: TriangleAlert, tone: "border-negative/50 bg-negative/10 text-negative", text: "Burnt out! With nothing to limit it, current rushes far past 20 mA. In a real circuit the LED would flash once and die." },
  }[state];
  const Icon = config.icon;

  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={state}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        role="status"
        className={cn("flex items-start gap-3 rounded-xl border p-4 text-sm", config.tone)}
      >
        <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <span className="text-ink-muted">{config.text}</span>
      </motion.p>
    </AnimatePresence>
  );
}

function BurntMarker({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} aria-hidden="true">
      <circle r={20} fill="#1a0b0b" opacity={0.85} />
      <path d="M -9 -9 L 9 9 M 9 -9 L -9 9" stroke="#f87171" strokeWidth={3.5} strokeLinecap="round" />
    </g>
  );
}

function ToggleButton({
  pressed,
  onClick,
  icon,
  danger = false,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  icon: ReactNode;
  danger?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-semibold transition-colors",
        pressed
          ? danger
            ? "border-negative/60 bg-negative/10 text-negative"
            : "border-amber/60 bg-amber/10 text-amber"
          : "border-line-strong bg-surface-high text-ink hover:border-cyan/50",
      )}
    >
      {icon}
      {children}
    </button>
  );
}

/** LED legs, markings and forward voltage, with the realistic LED illustration. */
export function LedAnatomy({ color = "#ef4444", label = "Red", forwardVoltage = 2 }: { color?: string; label?: string; forwardVoltage?: number }) {
  return (
    <div className="grid items-center gap-6 md:grid-cols-[1fr_1.2fr]">
      <div className="panel-raised flex justify-center rounded-2xl p-6">
        <LedIllustration lit color={color} className="h-56 w-auto" />
      </div>
      <ul className="space-y-3">
        {[
          { title: "Anode (+) — the longer leg", body: "Connect towards the positive side of the supply." },
          { title: "Cathode (−) — the shorter leg", body: "Also marked by a flat edge on the rim. Connect towards negative." },
          { title: "Forward voltage", body: `This ${label.toLowerCase()} LED needs about ${formatVolts(forwardVoltage)} across it before it lights.` },
          { title: "Always use a resistor", body: "An LED has almost no resistance of its own once it's on. Something else must limit the current." },
        ].map((item) => (
          <li key={item.title} className="panel rounded-xl p-4">
            <p className="font-semibold text-ink">{item.title}</p>
            <p className="mt-1 text-sm text-ink-muted">{item.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
