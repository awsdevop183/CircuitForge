"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck, CircleOff, Power } from "lucide-react";
import {
  Battery,
  CircuitCanvas,
  CircuitNode,
  CurrentFlow,
  Lamp,
  Switch,
  Wire,
  rectLoop,
} from "@/components/circuit";
import { cn } from "@/lib/cn";

const LEFT = 70;
const RIGHT = 390;
const TOP = 70;
const BOTTOM = 240;
const LOOP = rectLoop(LEFT, TOP, RIGHT, BOTTOM, 14);
const SWITCH_X = (LEFT + RIGHT) / 2;

/**
 * Battery → wire → bulb → wire → battery, with a switch that opens and
 * closes the loop. The core "a circuit must be complete" experiment.
 */
export function OpenClosedCircuit() {
  const [closed, setClosed] = useState(false);
  const toggle = () => setClosed((value) => !value);

  return (
    <div>
      <div className="bg-breadboard px-2 py-5 sm:px-8">
        <CircuitCanvas
          viewBox="0 0 460 300"
          interactive
          title="A simple circuit with a switch"
          description={
            closed
              ? "The switch is closed. The loop is complete, current flows all the way round and the bulb is lit."
              : "The switch is open. There is a gap in the loop, so no current flows and the bulb is dark."
          }
          className="mx-auto max-w-2xl"
        >
          <Wire d={LOOP} energized={closed} />
          <CurrentFlow d={LOOP} active={closed} speed={55} spacing={22} />
          {[
            [LEFT, TOP],
            [RIGHT, TOP],
            [RIGHT, BOTTOM],
            [LEFT, BOTTOM],
          ].map(([x, y]) => (
            <CircuitNode key={`${x}-${y}`} x={x!} y={y!} active={closed} radius={3.5} />
          ))}
          <Battery x={LEFT} y={(TOP + BOTTOM) / 2} rotation={-90} detail="1.5 V" energized={closed} labelPlacement="right" labelOffset={26} />
          <Lamp x={RIGHT} y={(TOP + BOTTOM) / 2} rotation={90} brightness={closed ? 1 : 0} labelPlacement="left" labelOffset={36} />
          <Switch x={SWITCH_X} y={BOTTOM} closed={closed} onToggle={toggle} labelPlacement="top" labelOffset={34} />

          {/* Highlight the break when the circuit is open */}
          <AnimatePresence>
            {!closed ? (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-hidden="true">
                <motion.circle
                  cx={SWITCH_X + 20}
                  cy={BOTTOM}
                  r={16}
                  fill="none"
                  stroke="#f5a524"
                  strokeWidth={2}
                  animate={{ r: [14, 22, 14], opacity: [0.9, 0.2, 0.9] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
                <text x={SWITCH_X} y={BOTTOM + 38} textAnchor="middle" fontSize={12} fill="#f5a524" fontFamily="var(--font-mono)">
                  GAP — NO PATH
                </text>
              </motion.g>
            ) : null}
          </AnimatePresence>
          <text x={(LEFT + RIGHT) / 2} y={TOP - 22} textAnchor="middle" fontSize={12} fill="#94a3b8" fontFamily="var(--font-mono)" aria-hidden="true">
            {closed ? "CHARGE FLOWS ALL THE WAY ROUND" : "NOTHING MOVES"}
          </text>
        </CircuitCanvas>
      </div>

      <div className="flex flex-col gap-4 border-t border-line p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl border px-4 py-3",
            closed ? "border-positive/50 bg-positive/5" : "border-amber/50 bg-amber/5",
          )}
          role="status"
          aria-live="polite"
        >
          {closed ? (
            <CircleCheck className="size-6 shrink-0 text-positive" aria-hidden="true" />
          ) : (
            <CircleOff className="size-6 shrink-0 text-amber" aria-hidden="true" />
          )}
          <div>
            <p className={cn("font-display text-lg font-semibold", closed ? "text-positive" : "text-amber")}>
              {closed ? "Circuit complete" : "Circuit incomplete"}
            </p>
            <p className="text-sm text-ink-muted">
              {closed ? "Closed loop — current flows and the bulb lights." : "Open loop — there's a gap, so no current can flow."}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={toggle}
          aria-pressed={closed}
          className={cn(
            "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 font-semibold transition-colors",
            closed
              ? "border border-line-strong bg-surface-high text-ink hover:border-amber/60"
              : "bg-cyan text-void shadow-[0_0_24px_-6px_rgb(34_211_238/0.8)] hover:bg-cyan-soft",
          )}
        >
          <Power className="size-5" aria-hidden="true" />
          {closed ? "Open the circuit" : "Close the circuit"}
        </button>
      </div>
    </div>
  );
}
