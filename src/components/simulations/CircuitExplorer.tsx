"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CircleCheck, CircleOff, Lightbulb, LightbulbOff, Power, RotateCcw, Scissors, Waypoints } from "lucide-react";
import {
  Battery,
  CircuitCanvas,
  CircuitLabel,
  CircuitNode,
  CurrentFlow,
  Ground,
  Led,
  Resistor,
  Switch,
  rectLoop,
  Wire,
  type FlowDirection,
} from "@/components/circuit";
import { flowSpeedForCurrent } from "@/components/lab/flow-speed";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { Readout } from "@/components/ui/Readout";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import {
  LED_MAX_CURRENT,
  RED_LED_FORWARD_VOLTAGE,
  ledBrightness,
  solveLoop,
  type LoopElement,
} from "@/lib/circuit-sim";
import { formatAmps, formatFixed, formatOhms } from "@/lib/format";
import { cn } from "@/lib/cn";

/** The four jobs every circuit needs, used by the anatomy view. */
export type CircuitRole = "source" | "path" | "load" | "control";

const ROLES: Record<CircuitRole, { label: string; description: string }> = {
  source: { label: "Source", description: "The battery provides the push (voltage) and the energy." },
  path: { label: "Path", description: "Wires give charge a complete conducting route out and back." },
  load: { label: "Load", description: "The LED (and resistor) use the energy — here it becomes light and a little heat." },
  control: { label: "Control", description: "The switch opens or closes the path to turn the circuit on and off." },
};

type SegmentId = "wire-a" | "wire-b" | "wire-c" | "wire-d";

// Geometry (viewBox 0 0 520 320)
const LEFT = 80;
const RIGHT = 440;
const TOP = 80;
const BOTTOM = 245;
const MID_Y = (TOP + BOTTOM) / 2;
const SWITCH_X = 185;
const RESISTOR_X = 330;
const GROUND_X = 170;
const LOOP = rectLoop(LEFT, TOP, RIGHT, BOTTOM, 14);

/** Wire segments between parts: hit paths for clicking and where a cut appears. */
const SEGMENTS: Record<SegmentId, { name: string; d: string; gap: { x: number; y: number; vertical: boolean } }> = {
  "wire-a": { name: "battery-to-switch wire", d: `M ${LEFT} ${MID_Y - 40} L ${LEFT} ${TOP} L ${SWITCH_X - 40} ${TOP}`, gap: { x: LEFT, y: TOP + 22, vertical: true } },
  "wire-b": { name: "switch-to-resistor wire", d: `M ${SWITCH_X + 40} ${TOP} L ${RESISTOR_X - 40} ${TOP}`, gap: { x: (SWITCH_X + RESISTOR_X) / 2, y: TOP, vertical: false } },
  "wire-c": { name: "resistor-to-LED wire", d: `M ${RESISTOR_X + 40} ${TOP} L ${RIGHT} ${TOP} L ${RIGHT} ${MID_Y - 40}`, gap: { x: RIGHT, y: TOP + 22, vertical: true } },
  "wire-d": { name: "return wire", d: `M ${RIGHT} ${MID_Y + 40} L ${RIGHT} ${BOTTOM} L ${LEFT} ${BOTTOM} L ${LEFT} ${MID_Y + 40}`, gap: { x: 330, y: BOTTOM, vertical: false } },
};

export interface CircuitExplorerProps {
  /** Which parts appear in the loop. Battery and wires are always present. */
  parts?: { switch?: boolean; resistor?: boolean; led?: boolean; ground?: boolean };
  initial?: { voltage?: number; resistance?: number; closed?: boolean };
  /** Optional learner controls. Ranges are [min, max]. */
  controls?: {
    voltage?: readonly [number, number];
    resistance?: readonly [number, number];
    direction?: boolean;
  };
  /** Let the learner cut and repair individual wires. */
  breakable?: boolean;
  /** Show voltage / resistance / current readouts. */
  readouts?: boolean;
  /** Show the source / path / load / control anatomy chips. */
  anatomy?: boolean;
  title?: string;
}

/**
 * A reusable, interactive single-loop circuit. All electrical behaviour comes
 * from `solveLoop`, so every lesson that embeds it behaves consistently.
 */
export function CircuitExplorer({
  parts = {},
  initial = {},
  controls = {},
  breakable = false,
  readouts = false,
  anatomy = false,
  title = "Circuit explorer",
}: CircuitExplorerProps) {
  const { switch: hasSwitch = true, resistor: hasResistor = true, led: hasLed = true, ground: hasGround = false } = parts;
  const [voltage, setVoltage] = useState(initial.voltage ?? 9);
  const [resistance, setResistance] = useState(initial.resistance ?? 470);
  const [closed, setClosed] = useState(initial.closed ?? false);
  const [direction, setDirection] = useState<FlowDirection>("conventional");
  const [cut, setCut] = useState<ReadonlySet<SegmentId>>(new Set());
  const [role, setRole] = useState<CircuitRole | null>(null);
  const statusId = useId();

  const elements: LoopElement[] = [
    { kind: "wire", id: "wire-a", broken: cut.has("wire-a") },
    ...(hasSwitch ? [{ kind: "switch", id: "switch", closed } as const] : []),
    { kind: "wire", id: "wire-b", broken: cut.has("wire-b") },
    ...(hasResistor ? [{ kind: "resistor", id: "resistor", ohms: resistance } as const] : []),
    { kind: "wire", id: "wire-c", broken: cut.has("wire-c") },
    ...(hasLed ? [{ kind: "led", id: "led", forwardVoltage: RED_LED_FORWARD_VOLTAGE } as const] : []),
    { kind: "wire", id: "wire-d", broken: cut.has("wire-d") },
  ];
  const solution = solveLoop({ voltage, internalResistance: 0.5 }, elements);
  const flowing = solution.status === "flowing";
  const current = solution.current;
  const overdriven = hasLed && current > LED_MAX_CURRENT;
  const maxCurrent = controls.voltage ? controls.voltage[1] / (controls.resistance?.[0] ?? resistance) : voltage / resistance;

  const toggleSegment = (segment: SegmentId) =>
    setCut((previous) => {
      const next = new Set(previous);
      if (next.has(segment)) next.delete(segment);
      else next.add(segment);
      return next;
    });

  const pathComplete = solution.status !== "open";
  const brokenWires = [...cut].map((id) => SEGMENTS[id].name);

  return (
    <div>
      <div className="bg-breadboard px-2 py-4 sm:px-6">
        <CircuitCanvas
          viewBox="0 0 520 320"
          interactive
          title={title}
          description={describe(solution.status, current, hasLed, brokenWires, hasSwitch && !closed)}
          className="mx-auto max-w-2xl"
        >
          <Wire d={LOOP} energized={flowing} />
          <CurrentFlow d={LOOP} active={flowing} speed={flowSpeedForCurrent(current, Math.max(maxCurrent, 0.01))} direction={direction} />
          {role === "path" ? (
            <motion.path
              d={LOOP}
              fill="none"
              stroke="#f5a524"
              strokeWidth={8}
              strokeOpacity={0.35}
              animate={{ strokeOpacity: [0.15, 0.45, 0.15] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              aria-hidden="true"
            />
          ) : null}

          {[
            [LEFT, TOP],
            [RIGHT, TOP],
            [RIGHT, BOTTOM],
            [LEFT, BOTTOM],
          ].map(([x, y]) => (
            <CircuitNode key={`${x}-${y}`} x={x!} y={y!} active={flowing} radius={3.5} />
          ))}

          {breakable
            ? (Object.keys(SEGMENTS) as SegmentId[]).map((id) => (
                <BreakableSegment key={id} id={id} cut={cut.has(id)} onToggle={() => toggleSegment(id)} />
              ))
            : null}

          <Battery
            x={LEFT}
            y={MID_Y}
            rotation={-90}
            detail={`${formatFixed(voltage, 1)} V`}
            energized={flowing}
            labelPlacement="right"
            labelOffset={26}
            highlighted={role === "source"}
          />
          {hasSwitch ? (
            <Switch
              x={SWITCH_X}
              y={TOP}
              closed={closed}
              onToggle={() => setClosed((c) => !c)}
              labelOffset={30}
              highlighted={role === "control"}
            />
          ) : null}
          {hasResistor ? (
            <Resistor
              x={RESISTOR_X}
              y={TOP}
              detail={formatOhms(resistance)}
              energized={flowing}
              labelPlacement="bottom"
              labelOffset={22}
              highlighted={role === "load"}
            />
          ) : null}
          {hasLed ? (
            <Led
              x={RIGHT}
              y={MID_Y}
              rotation={90}
              brightness={flowing ? ledBrightness(current) : 0}
              color={overdriven ? "#fb923c" : "#fb7185"}
              detail="red, ≈ 2 V"
              labelPlacement="left"
              labelOffset={32}
              highlighted={role === "load"}
            />
          ) : null}
          {hasGround ? (
            <>
              <CircuitNode x={GROUND_X} y={BOTTOM} active={flowing} />
              <Ground x={GROUND_X} y={BOTTOM} />
              <CircuitLabel x={GROUND_X + 22} y={BOTTOM + 30} text="0 V" anchor="start" decorative />
            </>
          ) : null}

          <CircuitLabel x={LEFT - 34} y={MID_Y - 6} text="BATTERY" value={`${formatFixed(voltage, 1)} V`} anchor="end" decorative />
          {hasResistor ? <CircuitLabel x={RESISTOR_X} y={TOP - 30} text="R" value={formatOhms(resistance)} decorative /> : null}
          {hasLed ? (
            <CircuitLabel x={RIGHT + 30} y={MID_Y - 6} text="LED" value={flowing ? formatAmps(current, 2) : "OFF"} anchor="start" valueTone={flowing ? "cyan" : "muted"} decorative />
          ) : null}
        </CircuitCanvas>
      </div>

      {/* Cause → effect chain */}
      <div id={statusId} className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-1.5 border-t border-line p-3 sm:gap-3 sm:p-4" role="status" aria-live="polite">
        <ChainStep
          ok={pathComplete}
          icon={pathComplete ? Waypoints : CircleOff}
          label="Path"
          value={pathComplete ? "Complete" : "Broken"}
        />
        <ArrowRight className="size-4 self-center text-ink-subtle" aria-hidden="true" />
        <ChainStep ok={flowing} icon={flowing ? CircleCheck : CircleOff} label="Current" value={flowing ? formatAmps(current, 2) : "None"} />
        <ArrowRight className="size-4 self-center text-ink-subtle" aria-hidden="true" />
        {hasLed ? (
          <ChainStep ok={flowing} icon={flowing ? Lightbulb : LightbulbOff} label="LED" value={flowing ? (overdriven ? "Too bright!" : "ON") : "OFF"} warn={overdriven} />
        ) : (
          <ChainStep ok={flowing} icon={flowing ? Lightbulb : LightbulbOff} label="Energy" value={flowing ? "Delivered" : "Stopped"} />
        )}
      </div>
      <p className="border-t border-line px-4 py-3 text-sm text-ink-muted sm:px-5">{explain(solution.status, overdriven, brokenWires, hasSwitch && !closed)}</p>

      {anatomy ? (
        <div className="border-t border-line p-4 sm:p-5">
          <p className="mb-3 text-sm font-medium text-ink">Every circuit needs four things — select one to find it:</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Parts of a circuit">
            {(Object.keys(ROLES) as CircuitRole[]).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={role === key}
                onClick={() => setRole((current) => (current === key ? null : key))}
                className={cn(
                  "min-h-11 rounded-lg border px-3 text-sm font-semibold transition-colors",
                  role === key ? "border-amber/70 bg-amber/10 text-amber" : "border-line-strong text-ink-muted hover:text-ink",
                )}
              >
                {ROLES[key].label}
              </button>
            ))}
          </div>
          <p className="mt-3 min-h-10 text-sm text-ink-muted" aria-live="polite">
            {role ? ROLES[role].description : "The highlighted part will glow amber in the diagram."}
          </p>
        </div>
      ) : null}

      <div className="grid gap-5 border-t border-line p-4 sm:p-5 md:grid-cols-2">
        {hasSwitch ? (
          <button
            type="button"
            onClick={() => setClosed((c) => !c)}
            aria-pressed={closed}
            aria-describedby={statusId}
            className={cn(
              "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 font-semibold transition-colors md:col-span-2",
              closed
                ? "border border-line-strong bg-surface-high text-ink hover:border-amber/60"
                : "bg-cyan text-void shadow-[0_0_24px_-6px_rgb(34_211_238/0.8)] hover:bg-cyan-soft",
            )}
          >
            <Power className="size-5" aria-hidden="true" />
            {closed ? "Switch OFF (open the circuit)" : "Switch ON (close the circuit)"}
          </button>
        ) : null}
        {controls.voltage ? (
          <InteractiveSlider
            label="Battery voltage"
            value={voltage}
            min={controls.voltage[0]}
            max={controls.voltage[1]}
            step={0.5}
            onChange={setVoltage}
            format={(v) => `${formatFixed(v, 1)} V`}
            color="var(--color-amber)"
          />
        ) : null}
        {controls.resistance && hasResistor ? (
          <InteractiveSlider
            label="Resistance"
            value={resistance}
            min={controls.resistance[0]}
            max={controls.resistance[1]}
            scale="log"
            onChange={setResistance}
            format={(r) => formatOhms(r)}
            color="var(--color-electric)"
          />
        ) : null}
        {controls.direction ? (
          <SegmentedControl
            className="md:col-span-2"
            label="Show the flow as"
            options={[
              { value: "conventional" as const, label: "Conventional current (+ → −)" },
              { value: "electron" as const, label: "Electron flow (− → +)" },
            ]}
            value={direction}
            onChange={setDirection}
            size="sm"
          />
        ) : null}
        {breakable ? (
          <div className="flex flex-col gap-2 text-sm text-ink-muted md:col-span-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2">
              <Scissors className="size-4 text-amber" aria-hidden="true" />
              Click or tap any wire in the diagram to cut it (or repair it).
            </p>
            <button
              type="button"
              onClick={() => setCut(new Set())}
              disabled={cut.size === 0}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-line-strong px-3 font-medium text-ink hover:border-cyan/60 disabled:opacity-40"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Repair all wires
            </button>
          </div>
        ) : null}
      </div>

      {readouts ? (
        <div className="grid grid-cols-3 gap-2 border-t border-line p-4 sm:gap-3 sm:p-5">
          <Readout label="Voltage" value={formatFixed(voltage, 1)} unit="V" tone="amber" size="sm" />
          <Readout label="Resistance" value={hasResistor ? formatOhms(resistance) : "—"} size="sm" />
          <Readout label="Current" value={flowing ? formatAmps(current, 3) : "0 A"} tone="cyan" size="sm" />
        </div>
      ) : null}
      {readouts && hasLed && flowing ? (
        <p className="border-t border-line px-4 py-3 text-xs text-ink-subtle sm:px-5">
          The LED itself uses about {RED_LED_FORWARD_VOLTAGE} V, so the resistor gets the remaining {formatFixed(Math.max(0, voltage - RED_LED_FORWARD_VOLTAGE), 1)} V.
          {overdriven ? " This current is above a small LED's safe ~20–30 mA — a real one would dim quickly or burn out." : ""}
        </p>
      ) : null}
    </div>
  );
}

function describe(status: string, current: number, hasLed: boolean, broken: string[], switchOpen: boolean): string {
  if (status === "flowing") return `The circuit is complete. ${formatAmps(current)} flows around the loop${hasLed ? " and the LED is lit" : ""}.`;
  if (status === "open") {
    const reasons = [switchOpen ? "the switch is open" : null, broken.length ? `the ${broken.join(" and ")} ${broken.length > 1 ? "are" : "is"} cut` : null].filter(Boolean);
    return `The circuit is incomplete because ${reasons.join(" and ")}. No current flows${hasLed ? " and the LED is off" : ""}.`;
  }
  if (status === "insufficient-voltage") return "The battery voltage is too low to switch the LED on, so no current flows.";
  return "No current flows.";
}

function explain(status: string, overdriven: boolean, broken: string[], switchOpen: boolean): string {
  if (status === "flowing") {
    return overdriven
      ? "Complete path → current flows → LED ON… but far too brightly. Increase the resistance to protect it."
      : "Complete path → current flows → LED ON. Charge travels all the way around the loop and back to the battery.";
  }
  if (status === "open") {
    if (broken.length && switchOpen) return "Two gaps: the switch is open and a wire is cut. No complete path → no current → LED OFF.";
    if (broken.length) return "A cut wire breaks the loop just like an open switch. No complete path → no current → LED OFF.";
    return "The switch is open, leaving a gap. No complete path → no current → LED OFF.";
  }
  if (status === "insufficient-voltage") return "The path is complete, but the battery can't provide the ~2 V the LED needs, so it stays dark.";
  return "No current flows.";
}

function ChainStep({
  ok,
  icon: Icon,
  label,
  value,
  warn = false,
}: {
  ok: boolean;
  icon: typeof Lightbulb;
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-1 rounded-xl border px-1.5 py-2.5 text-center sm:flex-row sm:gap-2.5 sm:px-3",
        warn ? "border-orange/50 bg-orange/10" : ok ? "border-positive/40 bg-positive/5" : "border-line-strong bg-void/40",
      )}
    >
      <Icon className={cn("size-5 shrink-0", warn ? "text-orange" : ok ? "text-positive" : "text-ink-subtle")} aria-hidden="true" />
      <span className="min-w-0">
        <span className="eyebrow block text-[0.6rem] text-ink-subtle">{label}</span>
        <span className={cn("block font-mono text-xs font-semibold sm:text-sm", warn ? "text-orange" : ok ? "text-ink" : "text-ink-muted")}>{value}</span>
      </span>
    </div>
  );
}

function BreakableSegment({ id, cut, onToggle }: { id: SegmentId; cut: boolean; onToggle: () => void }) {
  const segment = SEGMENTS[id];
  const { x, y, vertical } = segment.gap;
  const onKeyDown = (event: KeyboardEvent<SVGGElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle();
    }
  };
  return (
    <g
      role="button"
      tabIndex={0}
      aria-pressed={cut}
      aria-label={`${cut ? "Repair" : "Cut"} the ${segment.name}`}
      onClick={onToggle}
      onKeyDown={onKeyDown}
      className="group cursor-pointer outline-none"
    >
      <path d={segment.d} fill="none" stroke="transparent" strokeWidth={22} />
      <path d={segment.d} fill="none" stroke="#f5a524" strokeWidth={6} strokeOpacity={0} className="transition-[stroke-opacity] group-hover:[stroke-opacity:0.25] group-focus-visible:[stroke-opacity:0.5]" />
      {cut ? (
        <g aria-hidden="true">
          <rect x={vertical ? x - 8 : x - 11} y={vertical ? y - 11 : y - 8} width={vertical ? 16 : 22} height={vertical ? 22 : 16} fill="var(--circuit-bg)" />
          {vertical ? (
            <>
              <line x1={x - 6} x2={x + 6} y1={y - 10} y2={y - 10} stroke="#f5a524" strokeWidth={3} strokeLinecap="round" />
              <line x1={x - 6} x2={x + 6} y1={y + 10} y2={y + 10} stroke="#f5a524" strokeWidth={3} strokeLinecap="round" />
            </>
          ) : (
            <>
              <line x1={x - 10} x2={x - 10} y1={y - 6} y2={y + 6} stroke="#f5a524" strokeWidth={3} strokeLinecap="round" />
              <line x1={x + 10} x2={x + 10} y1={y - 6} y2={y + 6} stroke="#f5a524" strokeWidth={3} strokeLinecap="round" />
            </>
          )}
          <text x={vertical ? x + 16 : x} y={vertical ? y + 4 : y - 14} textAnchor={vertical ? "start" : "middle"} fontSize={11} fill="#f5a524" fontFamily="var(--font-mono)">
            CUT
          </text>
        </g>
      ) : null}
    </g>
  );
}
