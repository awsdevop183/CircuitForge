"use client";

import { motion } from "framer-motion";
import { placeValues, type Bit } from "@/lib/logic";
import { cn } from "@/lib/cn";

interface BinaryDisplayProps {
  bits: readonly Bit[];
  /** Make each bit a toggle switch. */
  onToggle?: (index: number) => void;
  /** Accessible name of each bit (default "Bit worth 8", …). */
  bitLabel?: (index: number, place: number) => string;
  /** Show place values (8 4 2 1) above the bits. */
  showPlaces?: boolean;
  /** Show each bit's contribution (+8 / 0) below. */
  showContributions?: boolean;
  size?: "md" | "lg";
  /** Change this to replay the "loaded" flip animation (e.g. on a clock pulse). */
  loadKey?: number;
  className?: string;
}

const SIZES = { md: "size-12 text-xl rounded-lg", lg: "size-11 text-2xl rounded-xl sm:size-14 sm:text-3xl" } as const;

/**
 * A row of bits as glowing boxes — used by the binary converter, registers
 * and anywhere else a binary number is shown or edited.
 */
export function BinaryDisplay({ bits, onToggle, bitLabel, showPlaces = false, showContributions = false, size = "md", loadKey, className }: BinaryDisplayProps) {
  const places = placeValues(bits.length);
  return (
    <div className={cn("flex w-max gap-2", className)}>
      {bits.map((b, i) => {
        const place = places[i]!;
        const box = cn(
          "flex items-center justify-center border-2 font-mono font-bold transition-all",
          SIZES[size],
          b ? "border-logic bg-logic/15 text-logic shadow-[0_0_18px_-4px_rgb(163_230_53/0.8)]" : "border-line-strong bg-void/60 text-ink-subtle",
          onToggle && !b && "hover:border-logic/50",
        );
        return (
          <div key={i} className="flex flex-col items-center gap-1.5">
            {showPlaces ? <span className="font-mono text-xs text-ink-subtle sm:text-sm">{place}</span> : null}
            {onToggle ? (
              <button type="button" role="switch" aria-checked={b === 1} aria-label={bitLabel ? bitLabel(i, place) : `Bit worth ${place}`} onClick={() => onToggle(i)} className={box}>
                {b}
              </button>
            ) : (
              <motion.span key={`${loadKey ?? 0}-${i}`} initial={loadKey ? { rotateX: 90, opacity: 0.4 } : false} animate={{ rotateX: 0, opacity: 1 }} transition={{ delay: i * 0.06 }} className={box}>
                {b}
              </motion.span>
            )}
            {showContributions ? <span className={cn("font-mono text-xs sm:text-sm", b ? "text-logic-soft" : "text-ink-subtle")}>{b ? `+${place}` : "0"}</span> : null}
          </div>
        );
      })}
    </div>
  );
}
