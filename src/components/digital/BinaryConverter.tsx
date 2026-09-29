"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { fromBits, invert, placeValues, toBits, type Bit } from "@/lib/logic";
import { cn } from "@/lib/cn";
import { BinaryDisplay } from "./BinaryDisplay";

type Width = 4 | 8;

/**
 * Binary ⇄ decimal. Toggle bits and watch the place values add up, or type a
 * decimal number and see how it breaks down into powers of two.
 */
export function BinaryConverter({ initialValue = 5, initialWidth = 4 }: { initialValue?: number; initialWidth?: Width }) {
  const [width, setWidth] = useState<Width>(initialWidth);
  const [bits, setBits] = useState<Bit[]>(toBits(initialValue, initialWidth));
  const value = fromBits(bits);
  const max = 2 ** width - 1;
  const places = placeValues(width);

  const setValue = (next: number) => setBits(toBits(Math.max(0, Math.min(max, Math.round(next || 0))), width));
  const changeWidth = (next: Width) => {
    setWidth(next);
    setBits(toBits(Math.min(value, 2 ** next - 1), next));
  };
  const toggle = (i: number) => setBits((prev) => prev.map((b, j) => (j === i ? invert(b) : b)));
  const terms = places.filter((_, i) => bits[i] === 1);

  return (
    <div>
      <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <SegmentedControl
          label="Size"
          options={[
            { value: 4 as const, label: "4 bits (a nibble)" },
            { value: 8 as const, label: "8 bits (a byte)" },
          ]}
          value={width}
          onChange={changeWidth}
          size="sm"
        />
        <p className="font-mono text-sm text-ink-subtle">
          {width} bits → {2 ** width} values (0–{max})
        </p>
      </div>

      {/* Binary → decimal */}
      <div className="bg-logic-grid p-4 sm:p-6">
        <p className="eyebrow text-ink-subtle">Binary → decimal: tap a bit to flip it</p>
        <div className="mt-4 overflow-x-auto pb-1">
          <BinaryDisplay bits={bits} onToggle={toggle} showPlaces showContributions size="lg" className="mx-auto" />
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 font-mono" aria-live="polite">
          <span className="text-lg text-ink-muted">{terms.length ? terms.join(" + ") : "0"}</span>
          <span className="text-ink-subtle">=</span>
          <AnimatePresence mode="popLayout">
            <motion.span key={value} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} className="text-4xl font-bold text-ink">
              {value}
            </motion.span>
          </AnimatePresence>
          <span className="sr-only">
            Binary {bits.join("")} equals decimal {value}
          </span>
        </div>
      </div>

      {/* Decimal → binary */}
      <div className="grid grid-cols-1 gap-5 border-t border-line p-4 sm:p-6 md:grid-cols-[auto_1fr] md:items-start">
        <div>
          <p className="eyebrow text-ink-subtle">Decimal → binary</p>
          <div className="mt-3 flex items-center gap-2">
            <button type="button" onClick={() => setValue(value - 1)} aria-label="Decrease" className="flex size-11 items-center justify-center rounded-lg border border-line-strong text-ink hover:border-logic/60">
              <Minus className="size-4" aria-hidden="true" />
            </button>
            <label className="sr-only" htmlFor="decimal-input">
              Decimal number (0 to {max})
            </label>
            <input
              id="decimal-input"
              type="number"
              inputMode="numeric"
              min={0}
              max={max}
              value={value}
              onChange={(event) => setValue(Number(event.target.value))}
              className="h-11 w-24 rounded-lg border border-line-strong bg-surface text-center font-mono text-xl text-ink focus:border-logic/60"
            />
            <button type="button" onClick={() => setValue(value + 1)} aria-label="Increase" className="flex size-11 items-center justify-center rounded-lg border border-line-strong text-ink hover:border-logic/60">
              <Plus className="size-4" aria-hidden="true" />
            </button>
          </div>
          <p className="mt-3 font-mono text-2xl tracking-[0.25em] text-logic">{bits.join("")}</p>
        </div>
        <ol className="space-y-1 font-mono text-sm" aria-label={`How ${value} breaks down into powers of two`}>
          {places.map((place, i) => {
            const before = places.slice(0, i).reduce((rest, p, j) => rest - (bits[j] ? p : 0), value);
            return (
              <li key={place} className={cn("flex flex-wrap gap-x-2 rounded-md px-2 py-1", bits[i] ? "bg-logic/10 text-ink" : "text-ink-subtle")}>
                <span>Does {place} fit into {before}?</span>
                <span className={bits[i] ? "text-logic" : ""}>{bits[i] ? `Yes → 1, ${before} − ${place} = ${before - place} left` : "No → 0"}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
