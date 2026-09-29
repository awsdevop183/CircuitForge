"use client";

import type { Bit } from "@/lib/logic";
import { cn } from "@/lib/cn";

interface GateInputProps {
  label: string;
  value: Bit;
  onToggle: () => void;
  className?: string;
}

/** A large, touch-friendly input switch for a logic signal. */
export function GateInput({ label, value, onToggle, className }: GateInputProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value === 1}
      aria-label={`Input ${label}`}
      onClick={onToggle}
      className={cn(
        "group flex min-h-14 min-w-28 items-center gap-3 rounded-xl border-2 px-3 py-2 text-left transition-colors",
        value ? "border-logic/70 bg-logic/10" : "border-line-strong bg-surface hover:border-logic/40",
        className,
      )}
    >
      <span className="font-mono text-lg font-bold text-ink">{label}</span>
      <span className={cn("relative h-7 w-12 shrink-0 rounded-full border transition-colors", value ? "border-logic bg-logic/30" : "border-line-strong bg-void")} aria-hidden="true">
        <span className={cn("absolute top-0.5 size-5.5 rounded-full transition-all duration-200", value ? "left-[1.45rem] bg-logic shadow-[0_0_12px_rgb(163_230_53/0.8)]" : "left-0.5 bg-ink-subtle")} />
      </span>
      <span className={cn("ml-auto font-mono text-2xl font-bold", value ? "text-logic" : "text-ink-subtle")} aria-hidden="true">
        {value}
      </span>
    </button>
  );
}
