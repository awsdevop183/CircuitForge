"use client";

import { useState } from "react";
import { FlipHorizontal2 } from "lucide-react";
import { Battery, CircuitCanvas, CircuitLabel, CurrentFlow, Diode, Lamp, Wire, rectLoop } from "@/components/circuit";
import { useSimulationClock } from "@/components/simulations/use-simulation-clock";
import { Readout } from "@/components/ui/Readout";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { solveLoop } from "@/lib/circuit-sim";
import { formatAmps } from "@/lib/format";
import { cn } from "@/lib/cn";
import { BlockMeter } from "./BlockMeter";
import { StatusBanner } from "./StatusBanner";

const SUPPLY = 9;
const LAMP_OHMS = 60;
const DIODE_DROP = 0.7;
const LEFT = 70;
const RIGHT = 390;
const TOP = 70;
const BOTTOM = 220;
const MID_Y = (TOP + BOTTOM) / 2;
const LOOP = rectLoop(LEFT, TOP, RIGHT, BOTTOM, 14);

/** Battery → diode → lamp. Flip the diode and the current stops. */
export function DiodeLab() {
  const [reversed, setReversed] = useState(false);
  // A diode behaves like a one-way LED-style drop of ~0.7 V.
  const solution = solveLoop({ voltage: SUPPLY }, [
    { kind: "led", id: "diode", forwardVoltage: DIODE_DROP, reversed },
    { kind: "lamp", id: "lamp", ohms: LAMP_OHMS },
  ]);
  const current = solution.current;
  const maxCurrent = (SUPPLY - DIODE_DROP) / LAMP_OHMS;

  return (
    <div>
      <div className="bg-breadboard px-2 py-4 sm:px-6">
        <CircuitCanvas
          viewBox="0 0 460 270"
          interactive
          title="Diode circuit"
          description={reversed ? "The diode is reversed. It blocks the current, so the lamp is dark." : `The diode points with the current. It conducts ${formatAmps(current)} and the lamp lights.`}
          className="mx-auto max-w-2xl"
        >
          <Wire d={LOOP} energized={!reversed} />
          <CurrentFlow d={LOOP} active={!reversed} speed={60} />
          <Battery x={LEFT} y={MID_Y} rotation={-90} detail={`${SUPPLY} V`} energized={!reversed} labelPlacement="right" labelOffset={26} />
          {/* Current flows left → right along the top: forward = anode on the left. */}
          <Diode x={(LEFT + RIGHT) / 2} y={TOP} rotation={reversed ? 180 : 0} energized={!reversed} detail={reversed ? "reverse biased" : "forward biased"} labelPlacement="bottom" labelOffset={22} />
          <Lamp x={RIGHT} y={MID_Y} rotation={90} brightness={reversed ? 0 : 0.85} labelPlacement="left" labelOffset={36} />
          <CircuitLabel x={(LEFT + RIGHT) / 2} y={TOP - 26} text={reversed ? "REVERSE: BLOCKS" : "FORWARD: CONDUCTS"} tone={reversed ? "amber" : "cyan"} decorative />
        </CircuitCanvas>
      </div>
      <div className="grid gap-4 border-t border-line p-4 sm:p-5 md:grid-cols-[auto_1fr] md:items-center">
        <button
          type="button"
          aria-pressed={reversed}
          onClick={() => setReversed((r) => !r)}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-cyan px-4 text-sm font-semibold text-void hover:bg-cyan-soft"
        >
          <FlipHorizontal2 className="size-4" aria-hidden="true" />
          Reverse the diode
        </button>
        <div className="space-y-1.5 font-mono text-sm">
          <p className={cn("flex flex-wrap items-center gap-3", reversed ? "text-ink-subtle" : "text-ink")}>
            <span className="w-40">Correct direction</span>
            <BlockMeter fraction={1} label={`Forward current ${formatAmps(maxCurrent)}`} blocks={12} />
          </p>
          <p className={cn("flex flex-wrap items-center gap-3", reversed ? "text-ink" : "text-ink-subtle")}>
            <span className="w-40">Reverse direction</span>
            <BlockMeter fraction={0} label="Reverse current: practically zero" blocks={12} />
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 border-t border-line p-4 sm:grid-cols-3 sm:p-5">
        <Readout label="Current" value={formatAmps(current, 2)} tone="cyan" size="sm" />
        <Readout label="Voltage across diode" value={reversed ? `${SUPPLY} V` : `${DIODE_DROP} V`} tone="amber" size="sm" hint={reversed ? "It blocks the full supply" : "Its forward drop"} />
        <Readout label="Bias" value={reversed ? "Reverse" : "Forward"} size="sm" />
      </div>
      <div className="border-t border-line p-4 sm:p-5">
        <StatusBanner level={reversed ? "caution" : "ok"} title={reversed ? "Reverse bias: the diode blocks current." : "Forward bias: current flows."}>
          {reversed
            ? " The cathode (band) now faces the + side. The diode acts like an open switch, so the lamp is off — only a tiny leakage current (microamps) gets through."
            : ` Current enters the anode and leaves through the cathode (the band). The diode uses about ${DIODE_DROP} V; the lamp gets the rest.`}
        </StatusBanner>
      </div>
    </div>
  );
}

/**
 * Rectification: an AC input swings + and −; a diode lets only the positive
 * halves through, turning AC into (bumpy) DC.
 */
export function HalfWaveRectifier() {
  const [withDiode, setWithDiode] = useState<"no" | "yes">("yes");
  const [time, ref] = useSimulationClock<HTMLDivElement>();
  const W = 440;
  const H = 110;
  const mid = H / 2;
  const amp = 38;
  const trace = (rectify: boolean) =>
    Array.from({ length: 161 }, (_, i) => {
      const t = time - (1 - i / 160) * 3;
      const v = Math.sin(2 * Math.PI * 0.7 * t);
      const out = rectify ? Math.max(0, v) : v;
      return `${i === 0 ? "M" : "L"} ${(20 + (i / 160) * (W - 40)).toFixed(1)} ${(mid - out * amp).toFixed(1)}`;
    }).join(" ");

  return (
    <div ref={ref} className="p-4 sm:p-5">
      <SegmentedControl
        label="Between the AC source and the load…"
        options={[
          { value: "no" as const, label: "Plain wire" },
          { value: "yes" as const, label: "A diode" },
        ]}
        value={withDiode}
        onChange={setWithDiode}
        size="sm"
      />
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {[
          { title: "Input: AC", d: trace(false), color: "#22d3ee" },
          { title: withDiode === "yes" ? "Output: positive halves only" : "Output: still AC", d: trace(withDiode === "yes"), color: "#f5a524" },
        ].map((panel) => (
          <figure key={panel.title} className="rounded-xl border border-line bg-void/40 p-3">
            <figcaption className="eyebrow mb-1 text-ink-subtle">{panel.title}</figcaption>
            <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={panel.title}>
              <line x1={20} x2={W - 20} y1={mid} y2={mid} stroke="#34445a" />
              <text x={14} y={mid - 30} fontSize={10} fill="#fca5a5" textAnchor="end" fontFamily="var(--font-mono)">+</text>
              <text x={14} y={mid + 34} fontSize={10} fill="#93c5fd" textAnchor="end" fontFamily="var(--font-mono)">−</text>
              <path d={panel.d} fill="none" stroke={panel.color} strokeWidth={2.5} />
            </svg>
          </figure>
        ))}
      </div>
      <p className="mt-3 text-sm text-ink-muted" aria-live="polite">
        {withDiode === "yes"
          ? "The diode blocks every negative half. What's left always flows the same way — a first step in turning mains AC into the DC that electronics need."
          : "Without a diode, the output swings positive and negative, just like the input."}
      </p>
    </div>
  );
}
