"use client";

import type { Bit } from "@/lib/logic";
import { cn } from "@/lib/cn";
import { DigitalIndicator } from "./DigitalIndicator";

/** The output of a logic circuit: a label and a glowing indicator, announced to screen readers. */
export function GateOutput({ label, value, className }: { label: string; value: Bit; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 rounded-xl border border-line-strong bg-void/40 px-3 py-2", className)}>
      <span className="font-mono text-sm font-semibold uppercase tracking-[0.08em] text-ink-muted">{label}</span>
      <DigitalIndicator value={value} size="sm" />
      <span className="sr-only" aria-live="polite">
        {label} is {value}
      </span>
    </div>
  );
}
