"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck, Flame, ShieldCheck, Zap } from "lucide-react";
import {
  Battery,
  CircuitCanvas,
  CircuitLabel,
  CircuitNode,
  CurrentFlow,
  Fuse,
  Lamp,
  Wire,
  pathThrough,
  rectLoop,
} from "@/components/circuit";
import { flowSpeedForCurrent } from "@/components/lab/flow-speed";
import { Readout } from "@/components/ui/Readout";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { solveLoop, type LoopElement } from "@/lib/circuit-sim";
import { formatAmps, formatFixed, formatWatts } from "@/lib/format";
import { cn } from "@/lib/cn";

type Mode = "normal" | "short";

const SUPPLY = 9;
/** A real 9 V battery has roughly 1.5 Ω of internal resistance — that's what limits a short. */
const INTERNAL_OHMS = 1.5;
const LAMP_OHMS = 45;
const SHORT_WIRE_OHMS = 0.02;
const FUSE_RATING = 1;
const NORMAL_CURRENT = SUPPLY / (LAMP_OHMS + INTERNAL_OHMS);

const LEFT = 70;
const RIGHT = 400;
const SHORT_X = 300;
const TOP = 70;
const BOTTOM = 230;
const MID_Y = (TOP + BOTTOM) / 2;
const LOOP = rectLoop(LEFT, TOP, RIGHT, BOTTOM, 14);
/** Path current takes in a short: battery → top → down the short wire → bottom → battery. */
const SHORT_PATH = pathThrough(
  [
    [LEFT, MID_Y - 40],
    [LEFT, TOP],
    [SHORT_X, TOP],
    [SHORT_X, BOTTOM],
    [LEFT, BOTTOM],
    [LEFT, MID_Y + 40],
  ],
  12,
);

/**
 * Normal circuit vs short circuit. The short wire offers an almost
 * resistance-free path around the lamp, so the current is limited only by the
 * battery's own internal resistance — and becomes enormous.
 */
export function ShortCircuitDemo() {
  const [mode, setMode] = useState<Mode>("normal");
  const [fused, setFused] = useState(false);

  // The short wire sits in parallel with the lamp; with ~0 Ω it takes essentially all the current.
  const load: LoopElement =
    mode === "short" ? { kind: "wire", id: "short", ohms: SHORT_WIRE_OHMS } : { kind: "lamp", id: "lamp", ohms: LAMP_OHMS };
  const elements: LoopElement[] = [...(fused ? [{ kind: "fuse", id: "fuse", ratingAmps: FUSE_RATING } as const] : []), load];
  const solution = solveLoop({ voltage: SUPPLY, internalResistance: INTERNAL_OHMS }, elements);
  const current = solution.current;
  const blown = solution.status === "fuse-blown";
  const flowing = solution.status === "flowing";
  const shorted = mode === "short" && flowing;
  // Heat generated inside the battery itself: P = I² × r.
  const batteryHeat = current * current * INTERNAL_OHMS;
  const heatColor = shorted ? "#fb923c" : undefined;

  return (
    <div>
      <div className="bg-breadboard relative px-2 py-4 sm:px-6">
        <CircuitCanvas
          viewBox="0 0 480 300"
          interactive
          title={mode === "short" ? "Short circuit" : "Normal circuit"}
          description={
            blown
              ? "The short circuit drew so much current that the fuse melted and opened the circuit. No current flows now."
              : mode === "short"
                ? `A wire connects straight across the battery, bypassing the lamp. About ${formatAmps(current)} rushes through the short. The lamp is dark and the wires and battery heat up.`
                : `Battery, then lamp, then back to the battery. ${formatAmps(current)} flows and the lamp glows.`
          }
          className="mx-auto max-w-2xl"
        >
          <Wire d={LOOP} energized={flowing && mode === "normal"} />
          {mode === "short" ? <Wire d={SHORT_PATH} energized={shorted} color={heatColor} strokeWidth={shorted ? 4 : 3} /> : null}
          <CurrentFlow d={mode === "short" ? SHORT_PATH : LOOP} active={flowing} speed={flowSpeedForCurrent(current, SUPPLY / INTERNAL_OHMS)} color={shorted ? "#fdba74" : undefined} />

          {mode === "short" ? (
            <>
              <CircuitNode x={SHORT_X} y={TOP} active={shorted} />
              <CircuitNode x={SHORT_X} y={BOTTOM} active={shorted} />
              <CircuitLabel x={SHORT_X - 12} y={MID_Y} text="SHORT" tone="danger" anchor="end" decorative />
              {shorted ? (
                <motion.rect
                  x={SHORT_X - 14}
                  y={TOP}
                  width={28}
                  height={BOTTOM - TOP}
                  rx={10}
                  fill="#fb923c"
                  animate={{ opacity: [0.08, 0.25, 0.08] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  aria-hidden="true"
                />
              ) : null}
            </>
          ) : null}

          <Battery x={LEFT} y={MID_Y} rotation={-90} detail={`${SUPPLY} V`} energized={flowing} labelPlacement="right" labelOffset={26} />
          {fused ? <Fuse x={170} y={TOP} blown={blown} energized={flowing} detail={`${FUSE_RATING} A`} labelOffset={26} /> : null}
          <Lamp x={RIGHT} y={MID_Y} rotation={90} brightness={mode === "normal" && flowing ? 0.85 : 0} detail={`${LAMP_OHMS} Ω`} labelPlacement="left" labelOffset={36} />
          {shorted ? (
            <motion.circle cx={LEFT} cy={MID_Y} r={34} fill="#fb923c" animate={{ opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 1, repeat: Infinity }} aria-hidden="true" />
          ) : null}

          <CircuitLabel x={LEFT - 30} y={MID_Y - 6} text="BATTERY" value={`${SUPPLY} V`} anchor="end" decorative />
          <CircuitLabel
            x={(LEFT + RIGHT) / 2}
            y={BOTTOM + 34}
            text={blown ? "FUSE BLOWN — CIRCUIT OPEN" : `I = ${formatAmps(current, 2)}`}
            tone={blown ? "amber" : shorted ? "danger" : "cyan"}
            size={13}
            decorative
          />
        </CircuitCanvas>
      </div>

      <div className="grid gap-5 border-t border-line p-4 sm:p-5 md:grid-cols-[1fr_auto] md:items-end">
        <SegmentedControl
          label="Circuit"
          options={[
            { value: "normal" as const, label: "Normal: through the lamp" },
            { value: "short" as const, label: "Short circuit" },
          ]}
          value={mode}
          onChange={setMode}
        />
        <button
          type="button"
          aria-pressed={fused}
          onClick={() => setFused((f) => !f)}
          className={cn(
            "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors",
            fused ? "border-positive/60 bg-positive/10 text-positive" : "border-line-strong text-ink hover:border-cyan/60",
          )}
        >
          <ShieldCheck className="size-4" aria-hidden="true" />
          {fused ? "Fuse fitted (1 A)" : "Add a 1 A fuse"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-line p-4 sm:grid-cols-4 sm:gap-3 sm:p-5">
        <Readout label="Current" value={formatAmps(current, 2)} tone={shorted ? "negative" : "cyan"} size="sm" />
        <Readout label="Load resistance" value={mode === "short" ? "≈ 0 Ω" : `${LAMP_OHMS} Ω`} size="sm" />
        <Readout label="Battery terminals" value={formatFixed(solution.terminalVoltage, 2)} unit="V" tone="amber" size="sm" />
        <Readout label="Heat inside battery" value={formatWatts(batteryHeat, 2)} tone={batteryHeat > 1 ? "negative" : "neutral"} size="sm" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${mode}-${blown}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          role="status"
          className={cn(
            "flex items-start gap-3 border-t border-line p-4 text-sm sm:p-5",
            shorted ? "bg-negative/[0.07]" : blown ? "bg-positive/[0.05]" : "",
          )}
        >
          {shorted ? (
            <Flame className="mt-0.5 size-5 shrink-0 text-negative" aria-hidden="true" />
          ) : blown ? (
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-positive" aria-hidden="true" />
          ) : mode === "normal" ? (
            <CircleCheck className="mt-0.5 size-5 shrink-0 text-positive" aria-hidden="true" />
          ) : (
            <Zap className="mt-0.5 size-5 shrink-0 text-amber" aria-hidden="true" />
          )}
          <p className="text-ink-muted">
            {shorted
              ? `Short circuit! The wire bypasses the lamp, so almost nothing limits the current except the battery's own ~${INTERNAL_OHMS} Ω inside. About ${formatAmps(current, 2)} flows — roughly ${Math.round(current / NORMAL_CURRENT)}× normal. The lamp goes dark, the wire and battery heat up fast, and the battery's voltage collapses.`
              : blown
                ? `The fuse did its job: the short tried to draw about ${formatAmps(solution.prospectiveCurrent, 2)}, more than its ${FUSE_RATING} A rating, so its thin wire melted and opened the circuit. Current is now zero — that's exactly why fuses exist.`
                : `Normal operation: the lamp's ${LAMP_OHMS} Ω limits the current to about ${formatAmps(current, 2)}. The battery's energy becomes light and heat in the lamp.`}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
