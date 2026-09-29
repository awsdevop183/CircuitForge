"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Binary, Calculator, Cpu, Database, Layers, Monitor, Rows3, ToggleRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

interface Level {
  id: string;
  title: string;
  icon: LucideIcon;
  scale: string;
  detail: string;
  lesson?: string;
}

/** From switch to computer, bottom-up. */
const LEVELS: readonly Level[] = [
  { id: "transistor", title: "Transistors", icon: ToggleRight, scale: "billions on one chip", detail: "Tiny electronic switches, each far smaller than a bacterium. A modern processor contains billions of them.", lesson: "Module 02 · The transistor" },
  { id: "gates", title: "Logic gates", icon: Binary, scale: "a few transistors each", detail: "A handful of transistors wired together make a gate: NOT, NAND, NOR… Every gate is just switches deciding 0 or 1.", lesson: "Lessons 5–12" },
  { id: "circuits", title: "Digital circuits", icon: Layers, scale: "gates combined", detail: "Gates connected together make circuits that choose, compare and route signals.", lesson: "Lesson 14" },
  { id: "adders", title: "Adders", icon: Calculator, scale: "one full adder per bit", detail: "Chains of full adders add binary numbers. Together with other circuits they form the arithmetic logic unit (ALU).", lesson: "Lessons 15–16" },
  { id: "registers", title: "Registers", icon: Rows3, scale: "flip-flops sharing a clock", detail: "Flip-flops store the numbers the processor is working on right now.", lesson: "Lessons 18–19" },
  { id: "memory", title: "Memory", icon: Database, scale: "billions of bits", detail: "Huge arrays of storage cells, each with an address, hold programs and data. (Main memory uses tiny capacitor cells rather than flip-flops, but the idea of addressed bits is the same.)", lesson: "Lesson 19" },
  { id: "cpu", title: "CPU", icon: Cpu, scale: "ALU + registers + control", detail: "The processor fetches instructions from memory, uses its adders and logic to carry them out, and stores results in registers — billions of times per second, in step with a clock.", },
  { id: "computer", title: "Computer", icon: Monitor, scale: "CPU + memory + inputs/outputs", detail: "Add storage, a screen, a keyboard and software, and you have a computer — or a phone, a games console or a microcontroller." },
];

/**
 * Animated ladder of abstraction: each level is built from the one below.
 * A signal pulse climbs the spine from transistors to a whole computer.
 */
export function ComputerStack() {
  const [selected, setSelected] = useState("gates");
  const reduceMotion = useReducedMotion();
  const level = LEVELS.find((l) => l.id === selected)!;
  const reversed = [...LEVELS].reverse();

  return (
    <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-[1fr_1.1fr]">
      <div className="relative bg-logic-grid p-4 sm:p-6">
        {/* Spine with a climbing pulse */}
        <div className="absolute bottom-10 left-9 top-10 w-0.5 bg-line-strong sm:left-11" aria-hidden="true">
          {!reduceMotion ? (
            <motion.span
              className="absolute left-1/2 size-3 -translate-x-1/2 rounded-full bg-logic shadow-[0_0_14px_rgb(163_230_53)]"
              initial={{ bottom: "0%" }}
              animate={{ bottom: ["0%", "100%"] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.4 }}
            />
          ) : null}
        </div>
        <ol className="relative space-y-2" aria-label="From transistors to a computer, top to bottom">
          {reversed.map((l, i) => {
            const Icon = l.icon;
            const active = l.id === selected;
            return (
              <motion.li key={l.id} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: (LEVELS.length - 1 - i) * 0.08 }}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelected(l.id)}
                  className={cn(
                    "flex min-h-12 w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors",
                    active ? "border-logic/70 bg-logic/10" : "border-line bg-surface/80 hover:border-logic/40",
                  )}
                >
                  <span className={cn("relative z-10 flex size-9 shrink-0 items-center justify-center rounded-lg border", active ? "border-logic bg-void text-logic" : "border-line-strong bg-void text-ink-muted")}>
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-semibold text-ink">{l.title}</span>
                    <span className="block font-mono text-xs text-ink-subtle">{l.scale}</span>
                  </span>
                  {i < reversed.length - 1 ? <span className="sr-only">, built from {reversed[i + 1]!.title}</span> : null}
                </button>
              </motion.li>
            );
          })}
        </ol>
      </div>
      <div className="flex flex-col justify-center bg-surface-raised p-5 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div key={level.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} aria-live="polite">
            <p className="eyebrow text-logic">Level {LEVELS.indexOf(level) + 1} of {LEVELS.length}</p>
            <h3 className="mt-2 text-2xl font-semibold text-ink">{level.title}</h3>
            <p className="mt-3 leading-relaxed text-ink-muted">{level.detail}</p>
            {level.lesson ? <p className="mt-4 font-mono text-xs text-ink-subtle">Where you met it: {level.lesson}</p> : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
