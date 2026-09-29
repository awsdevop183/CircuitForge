"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useFrame } from "@/lib/use-frame";
import { BatteryCharging, Pause, Play, RotateCcw, Zap } from "lucide-react";
import {
  Battery,
  Capacitor,
  CircuitCanvas,
  CircuitLabel,
  CircuitNode,
  CurrentFlow,
  Resistor,
  Switch,
  Wire,
  rectLoop,
} from "@/components/circuit";
import { flowSpeedForCurrent } from "@/components/lab/flow-speed";
import { Button } from "@/components/ui/Button";
import { Readout } from "@/components/ui/Readout";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { capacitorDischargeVoltage, timeConstant } from "@/lib/electronics";
import { formatAmps, formatFarads, formatOhms } from "@/lib/format";
import { DeepDiveSection } from "./DeepDiveSection";

type Phase = "idle" | "charging" | "discharging";

const SUPPLY = 9;
const RESISTOR_OPTIONS = [1_000, 4_700, 10_000].map((value) => ({ value, label: formatOhms(value) }));
const CAPACITOR_OPTIONS = [100e-6, 470e-6, 1000e-6].map((value) => ({ value, label: formatFarads(value) }));
/** After five time constants a capacitor is considered fully charged/discharged. */
const SETTLE_TAUS = 5;

// Circuit geometry (viewBox 460 × 300)
const LEFT = 60;
const SHUNT_X = 170;
const RIGHT = 370;
const TOP = 60;
const BOTTOM = 240;
const MID_Y = (TOP + BOTTOM) / 2;
const LOOP = rectLoop(LEFT, TOP, RIGHT, BOTTOM, 12);
const CHARGE_PATH = `M ${LEFT} ${MID_Y - 40} L ${LEFT} ${TOP} L ${RIGHT} ${TOP} L ${RIGHT} ${BOTTOM} L ${LEFT} ${BOTTOM} L ${LEFT} ${MID_Y + 40}`;
const DISCHARGE_PATH = `M ${RIGHT} ${MID_Y - 40} L ${RIGHT} ${TOP} L ${SHUNT_X} ${TOP} L ${SHUNT_X} ${BOTTOM} L ${RIGHT} ${BOTTOM} L ${RIGHT} ${MID_Y + 40}`;

export function CapacitorDeepDive() {
  return (
    <DeepDiveSection
      eyebrow="Interactive"
      title="Charge it. Discharge it. Time it."
      description="A capacitor fills with charge through a resistor — quickly at first, then slower and slower. The resistor and capacitor together set the pace: τ = R × C."
    >
      <CapacitorLab />
    </DeepDiveSection>
  );
}

/**
 * RC charging/discharging experiment: pick R and C, charge, pause, discharge
 * or reset, and watch the voltage curve against the time constant.
 */
export function CapacitorLab() {
  const [resistance, setResistance] = useState(4_700);
  const [capacitance, setCapacitance] = useState(470e-6);
  const [phase, setPhase] = useState<Phase>("idle");
  const [voltage, setVoltage] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  // Voltage at the start of the current phase; elapsed time is measured from there.
  const [startVoltage, setStartVoltage] = useState(0);
  const [paused, setPaused] = useState(false);
  const elapsedRef = useRef(0);

  const tau = timeConstant(resistance, capacitance);
  const settled = elapsed >= tau * SETTLE_TAUS;

  useFrame((_, delta) => {
    if (phase === "idle" || settled || paused) return;
    elapsedRef.current += Math.min(delta, 64) / 1000;
    const t = elapsedRef.current;
    setElapsed(t);
    setVoltage(
      phase === "charging"
        ? SUPPLY - (SUPPLY - startVoltage) * Math.exp(-t / tau)
        : capacitorDischargeVoltage(startVoltage, t, tau),
    );
  });

  const startPhase = (next: Phase) => {
    setStartVoltage(voltage);
    elapsedRef.current = 0;
    setElapsed(0);
    setPaused(false);
    setPhase(next);
  };

  const reset = () => {
    elapsedRef.current = 0;
    setElapsed(0);
    setStartVoltage(0);
    setVoltage(0);
    setPaused(false);
    setPhase("idle");
  };

  /** Changing R or C mid-way continues from the present voltage. */
  const changeComponent = (apply: () => void) => {
    setStartVoltage(voltage);
    elapsedRef.current = 0;
    setElapsed(0);
    apply();
  };

  const current =
    phase === "charging" ? (SUPPLY - voltage) / resistance : phase === "discharging" ? voltage / resistance : 0;
  const flowing = !settled && !paused && current > 1e-6;
  const maxCurrent = SUPPLY / RESISTOR_OPTIONS[0]!.value;

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <div className="panel-raised bg-breadboard rounded-2xl px-2 py-4 sm:px-6">
            <CircuitCanvas
              viewBox="0 0 460 290"
              interactive
              title="RC charging circuit"
              description={`A ${SUPPLY} volt battery charges a ${formatFarads(capacitance)} capacitor through a ${formatOhms(resistance)} resistor. The capacitor is at ${voltage.toFixed(2)} volts and is ${phase === "idle" ? "idle" : phase}.`}
            >
              <Wire d={LOOP} energized={phase === "charging" && flowing} />
              <Wire points={[[SHUNT_X, TOP], [SHUNT_X, BOTTOM]]} energized={phase === "discharging" && flowing} />
              <CurrentFlow d={CHARGE_PATH} active={phase === "charging" && flowing} speed={flowSpeedForCurrent(current, maxCurrent)} />
              <CurrentFlow d={DISCHARGE_PATH} active={phase === "discharging" && flowing} speed={flowSpeedForCurrent(current, maxCurrent)} />
              <CircuitNode x={SHUNT_X} y={TOP} active={flowing} />
              <CircuitNode x={SHUNT_X} y={BOTTOM} active={flowing} />

              <Battery x={LEFT} y={MID_Y} rotation={-90} detail={`${SUPPLY} V`} labelPlacement="right" labelOffset={26} />
              <Switch x={(LEFT + SHUNT_X) / 2} y={TOP} closed={phase === "charging"} name="Charge switch" labelOffset={28} />
              <Switch x={SHUNT_X} y={MID_Y} rotation={90} closed={phase === "discharging"} name="Discharge switch" labelPlacement="right" labelOffset={30} />
              <Resistor x={(SHUNT_X + RIGHT) / 2} y={TOP} detail={formatOhms(resistance)} energized={flowing} labelPlacement="bottom" labelOffset={20} />
              <Capacitor x={RIGHT} y={MID_Y} rotation={90} charge={voltage / SUPPLY} detail={formatFarads(capacitance)} labelPlacement="left" labelOffset={28} />

              <CircuitLabel x={RIGHT + 30} y={MID_Y - 6} text="Vc" value={`${voltage.toFixed(2)} V`} anchor="start" valueTone="cyan" decorative />
              <CircuitLabel x={(SHUNT_X + RIGHT) / 2} y={TOP - 38} text="R" value={formatOhms(resistance)} decorative />
            </CircuitCanvas>
          </div>
          <div className="panel-raised rounded-2xl p-4 sm:p-5">
            <ChargeCurve phase={phase} startVoltage={startVoltage} elapsed={elapsed} tau={tau} voltage={voltage} />
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={() => startPhase("charging")} disabled={phase === "charging" && !settled} variant="primary">
              <BatteryCharging className="size-4" aria-hidden="true" />
              Charge
            </Button>
            <Button onClick={() => startPhase("discharging")} disabled={voltage < 0.01 || (phase === "discharging" && !settled)} variant="amber">
              <Zap className="size-4" aria-hidden="true" />
              Discharge
            </Button>
            <Button onClick={() => setPaused((p) => !p)} disabled={phase === "idle" || settled} variant="secondary" aria-pressed={paused}>
              {paused ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}
              {paused ? "Resume" : "Stop"}
            </Button>
            <Button onClick={reset} variant="ghost">
              <RotateCcw className="size-4" aria-hidden="true" />
              Reset
            </Button>
          </div>
          <SegmentedControl
            label="Resistance"
            options={RESISTOR_OPTIONS}
            value={resistance}
            onChange={(value) => changeComponent(() => setResistance(value))}
            size="sm"
          />
          <SegmentedControl
            label="Capacitance"
            options={CAPACITOR_OPTIONS}
            value={capacitance}
            onChange={(value) => changeComponent(() => setCapacitance(value))}
            size="sm"
          />
          <div className="grid grid-cols-2 gap-3">
            <Readout label="Capacitor" value={voltage.toFixed(2)} unit="V" tone="cyan" />
            <Readout label="Current" value={formatAmps(flowing ? current : 0, 2)} />
            <Readout label="τ = R × C" value={tau.toFixed(2)} unit="s" tone="amber" />
            <Readout label="Charge level" value={Math.round((voltage / SUPPLY) * 100)} unit="%" />
          </div>
          <p className="text-sm text-ink-muted" aria-live="polite">
            {paused
              ? `Stopped at ${voltage.toFixed(2)} V. Press Resume to carry on.`
              : phase === "idle"
              ? "Press Charge to close the charge switch."
              : settled
                ? `Settled after 5τ (${(tau * SETTLE_TAUS).toFixed(1)} s). The capacitor is ${phase === "charging" ? "fully charged — current has stopped" : "empty"}.`
                : phase === "charging"
                  ? "Charging: current is largest at the start and falls as the capacitor fills."
                  : "Discharging: the capacitor now acts like a small battery, pushing current back through the resistor."}
          </p>
        </div>
      </div>
    </div>
  );
}

interface ChargeCurveProps {
  phase: Phase;
  startVoltage: number;
  elapsed: number;
  tau: number;
  voltage: number;
}

const CHART = { width: 420, height: 170, left: 36, right: 12, top: 12, bottom: 28 };

/** Voltage-vs-time curve for the current phase, plotted over five time constants. */
function ChargeCurve({ phase, startVoltage, elapsed, tau, voltage }: ChargeCurveProps) {
  const plotW = CHART.width - CHART.left - CHART.right;
  const plotH = CHART.height - CHART.top - CHART.bottom;
  const span = tau * SETTLE_TAUS;
  const x = (t: number) => CHART.left + (Math.min(t, span) / span) * plotW;
  const y = (v: number) => CHART.top + plotH - (v / SUPPLY) * plotH;

  const valueAt = (t: number) =>
    phase === "discharging"
      ? capacitorDischargeVoltage(startVoltage, t, tau)
      : phase === "charging"
        ? SUPPLY - (SUPPLY - startVoltage) * Math.exp(-t / tau)
        : startVoltage;

  const samples = Array.from({ length: 61 }, (_, i) => (i / 60) * span);
  const curve = samples.map((t, i) => `${i === 0 ? "M" : "L"} ${x(t).toFixed(1)} ${y(valueAt(t)).toFixed(1)}`).join(" ");
  const tauMark = valueAt(tau);

  return (
    <figure>
      <figcaption className="mb-2 flex items-center justify-between text-xs text-ink-subtle">
        <span className="eyebrow">Capacitor voltage over time</span>
        <span className="font-mono">t = {elapsed.toFixed(1)} s</span>
      </figcaption>
      <svg
        viewBox={`0 0 ${CHART.width} ${CHART.height}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Capacitor voltage curve. After ${elapsed.toFixed(1)} seconds the capacitor is at ${voltage.toFixed(2)} volts. One time constant is ${tau.toFixed(2)} seconds.`}
      >
        {[0, SUPPLY / 2, SUPPLY].map((v) => (
          <g key={v}>
            <line x1={CHART.left} x2={CHART.width - CHART.right} y1={y(v)} y2={y(v)} stroke="#1a2432" />
            <text x={CHART.left - 6} y={y(v)} textAnchor="end" dominantBaseline="central" fontSize={10} fill="#7f8ea4" fontFamily="var(--font-mono)">
              {v}V
            </text>
          </g>
        ))}
        {[1, 2, 3, 4, 5].map((n) => (
          <g key={n}>
            <line x1={x(n * tau)} x2={x(n * tau)} y1={CHART.top} y2={CHART.top + plotH} stroke="#1a2432" strokeDasharray={n === 1 ? "3 3" : undefined} />
            <text x={x(n * tau)} y={CHART.height - 10} textAnchor="middle" fontSize={10} fill={n === 1 ? "#e8eef6" : "#7f8ea4"} fontFamily="var(--font-mono)">
              {n}τ
            </text>
          </g>
        ))}
        {phase !== "idle" ? (
          <>
            <path d={curve} fill="none" stroke="#22d3ee" strokeWidth={2} strokeLinecap="round" />
            <circle cx={x(tau)} cy={y(tauMark)} r={3.5} fill="#101722" stroke="#e8eef6" strokeWidth={1.5} />
            <text x={x(tau) + 6} y={y(tauMark) + (phase === "charging" ? 12 : -8)} fontSize={10} fill="#e8eef6">
              {phase === "charging" ? "63% of the way after 1τ" : "37% left after 1τ"}
            </text>
            <motion.circle cx={x(elapsed)} cy={y(voltage)} r={5} fill="#f5a524" stroke="#101722" strokeWidth={2} />
          </>
        ) : (
          <text x={CHART.left + plotW / 2} y={CHART.top + plotH / 2} textAnchor="middle" fontSize={12} fill="#a3b1c4">
            Press Charge to start the clock
          </text>
        )}
      </svg>
    </figure>
  );
}
