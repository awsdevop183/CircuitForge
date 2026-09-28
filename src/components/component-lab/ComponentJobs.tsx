"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Power } from "lucide-react";
import { Battery, Capacitor, CircuitCanvas, CircuitNode, CurrentFlow, Led, Resistor, Switch, Wire, rectLoop } from "@/components/circuit";
import { cn } from "@/lib/cn";

type Part = "battery" | "switch" | "resistor" | "led" | "capacitor";

const JOBS: Record<Part, { name: string; job: string; without: string }> = {
  battery: { name: "Battery", job: "Supplies the voltage — the push — and the energy.", without: "Without it: nothing pushes charge, so nothing happens." },
  switch: { name: "Switch", job: "Lets you open or close the path to turn the circuit on and off.", without: "Without it: the LED would be on all the time." },
  resistor: { name: "Resistor", job: "Limits the current so the LED gets a safe amount.", without: "Without it: far too much current — the LED burns out." },
  led: { name: "LED", job: "Turns electrical energy into light — the output you can see.", without: "Without it: the circuit works, but there's nothing to show it." },
  capacitor: { name: "Capacitor", job: "Stores a little charge and smooths out dips in the supply voltage.", without: "Without it: this simple circuit still works — but in real devices, supply glitches cause problems." },
};

const LEFT = 70;
const RIGHT = 400;
const TOP = 70;
const BOTTOM = 230;
const MID_Y = (TOP + BOTTOM) / 2;
const CAP_X = 140;
const LOOP = rectLoop(LEFT, TOP, RIGHT, BOTTOM, 14);

/** A small real circuit where every component has a different job. */
export function ComponentJobs() {
  const [selected, setSelected] = useState<Part>("resistor");
  const [on, setOn] = useState(true);
  const info = JOBS[selected];

  return (
    <div>
      <div className="bg-breadboard px-2 py-4 sm:px-6">
        <CircuitCanvas
          viewBox="0 0 470 280"
          interactive
          title="A circuit made of different components"
          description={`A battery, capacitor, switch, resistor and LED. The ${info.name.toLowerCase()} is highlighted: ${info.job}`}
          className="mx-auto max-w-2xl"
        >
          <Wire d={LOOP} energized={on} />
          <Wire points={[[CAP_X, TOP], [CAP_X, BOTTOM]]} energized={on} />
          <CurrentFlow d={LOOP} active={on} speed={45} />
          <CircuitNode x={CAP_X} y={TOP} active={on} />
          <CircuitNode x={CAP_X} y={BOTTOM} active={on} />
          <Battery x={LEFT} y={MID_Y} rotation={-90} detail="9 V" energized={on} highlighted={selected === "battery"} labelPlacement="right" labelOffset={26} />
          <Capacitor x={CAP_X} y={MID_Y} rotation={90} polarized charge={1} highlighted={selected === "capacitor"} labelPlacement="right" labelOffset={30} />
          <Switch x={230} y={TOP} closed={on} onToggle={() => setOn((v) => !v)} highlighted={selected === "switch"} labelOffset={30} />
          <Resistor x={330} y={TOP} detail="470 Ω" energized={on} highlighted={selected === "resistor"} labelPlacement="bottom" labelOffset={22} />
          <Led x={RIGHT} y={MID_Y} rotation={90} brightness={on ? 0.8 : 0} color="#fb7185" highlighted={selected === "led"} labelPlacement="left" labelOffset={32} />
        </CircuitCanvas>
      </div>
      <div className="grid gap-4 border-t border-line p-4 sm:p-5 md:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="mb-2 text-sm font-medium text-ink">Select a component to see its job:</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-3" role="group" aria-label="Components">
            {(Object.keys(JOBS) as Part[]).map((part) => (
              <button
                key={part}
                type="button"
                aria-pressed={selected === part}
                onClick={() => setSelected(part)}
                className={cn(
                  "min-h-10 rounded-lg border px-2 text-sm font-medium transition-colors",
                  selected === part ? "border-amber/70 bg-amber/10 text-amber" : "border-line-strong text-ink-muted hover:text-ink",
                )}
              >
                {JOBS[part].name}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setOn((v) => !v)}
            aria-pressed={on}
            className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-line-strong text-sm font-semibold text-ink hover:border-cyan/60"
          >
            <Power className="size-4" aria-hidden="true" />
            {on ? "Switch off" : "Switch on"}
          </button>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={selected} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-xl border border-line bg-void/40 p-4" aria-live="polite">
            <p className="font-display text-lg font-semibold text-ink">{info.name}</p>
            <p className="mt-1 text-sm text-ink">{info.job}</p>
            <p className="mt-3 border-t border-line pt-3 text-sm text-ink-muted">{info.without}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
