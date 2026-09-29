"use client";

import { motion } from "framer-motion";
import type { Bit } from "@/lib/logic";
import { cn } from "@/lib/cn";

interface DigitalIndicatorProps {
  value: Bit;
  size?: "sm" | "md" | "lg";
  /** Show HIGH/LOW under the 1/0. Default true. */
  showLevel?: boolean;
  className?: string;
}

const SIZES = { sm: "size-10 text-lg", md: "size-14 text-2xl", lg: "size-20 text-4xl" } as const;

/** A glowing 1 / dim 0 lamp. Pulses when the value changes. */
export function DigitalIndicator({ value, size = "md", showLevel = true, className }: DigitalIndicatorProps) {
  return (
    <span className={cn("inline-flex flex-col items-center gap-1", className)}>
      <motion.span
        key={value}
        initial={{ scale: 0.85 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 420, damping: 18 }}
        className={cn(
          "flex items-center justify-center rounded-full border-2 font-mono font-bold transition-colors duration-300",
          SIZES[size],
          value
            ? "border-logic bg-logic/20 text-logic-soft shadow-[0_0_24px_-2px_rgb(163_230_53/0.7)]"
            : "border-line-strong bg-void/60 text-ink-subtle",
        )}
      >
        {value}
      </motion.span>
      {showLevel ? <span className={cn("font-mono text-[0.7rem] font-semibold tracking-[0.12em]", value ? "text-logic" : "text-ink-subtle")}>{value ? "HIGH" : "LOW"}</span> : null}
    </span>
  );
}
