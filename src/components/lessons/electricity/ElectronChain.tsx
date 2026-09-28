"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const SLOTS = 10;
const START_X = 60;
const SPACING = 34;
const WIRE_Y = 60;

/**
 * A wire is already full of electrons. Push one in at one end and one pops
 * out of the other end straight away — which is why a lamp lights instantly
 * even though each electron drifts slowly.
 */
export function ElectronChain() {
  const [nextId, setNextId] = useState(SLOTS);
  const [electrons, setElectrons] = useState<number[]>(() => Array.from({ length: SLOTS }, (_, i) => i));
  const [pushed, setPushed] = useState(0);

  const push = () => {
    setElectrons((current) => [nextId, ...current.slice(0, SLOTS - 1)]);
    setNextId((id) => id + 1);
    setPushed((count) => count + 1);
  };

  const wireEnd = START_X + SPACING * (SLOTS - 1) + 30;

  return (
    <div className="p-5 sm:p-8">
      <svg viewBox="0 0 440 120" className="h-auto w-full" role="img" aria-label={`A wire full of electrons. ${pushed} electrons pushed in so far; each push makes one leave the far end immediately.`}>
        <rect x={START_X - 30} y={WIRE_Y - 18} width={wireEnd - START_X + 30} height={36} rx={18} fill="#d08a4f" opacity={0.18} stroke="#d08a4f" strokeOpacity={0.5} />
        <text x={START_X - 38} y={WIRE_Y} textAnchor="end" dominantBaseline="central" fontSize={11} fill="#94a3b8" fontFamily="var(--font-mono)">IN</text>
        <text x={wireEnd + 8} y={WIRE_Y} dominantBaseline="central" fontSize={11} fill="#94a3b8" fontFamily="var(--font-mono)">OUT</text>
        <AnimatePresence initial={false}>
          {electrons.map((id, index) => (
            <motion.g
              key={id}
              initial={{ x: START_X - SPACING, opacity: 0 }}
              animate={{ x: START_X + index * SPACING, opacity: 1 }}
              exit={{ x: START_X + SLOTS * SPACING + 10, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              <circle cy={WIRE_Y} r={11} fill="#67e8f9" style={{ filter: "drop-shadow(0 0 5px #22d3ee)" }} />
              <text y={WIRE_Y} textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight={700} fill="#0b1018">−</text>
            </motion.g>
          ))}
        </AnimatePresence>
        <text x={220} y={108} textAnchor="middle" fontSize={11} fill="#7f8ea4">Copper wire (already full of free electrons)</text>
      </svg>
      <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-ink-muted" aria-live="polite">
          Pushed in: <span className="font-mono text-ink">{pushed}</span> · Came out: <span className="font-mono text-cyan">{pushed}</span>
        </p>
        <button
          type="button"
          onClick={push}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-cyan px-4 text-sm font-semibold text-void hover:bg-cyan-soft"
        >
          Push one electron in
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
