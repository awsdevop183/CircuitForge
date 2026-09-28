import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ReadoutProps {
  label: string;
  value: ReactNode;
  unit?: string;
  hint?: ReactNode;
  tone?: "cyan" | "amber" | "neutral" | "positive" | "negative";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const TONE_TEXT = {
  cyan: "text-cyan",
  amber: "text-amber",
  neutral: "text-ink",
  positive: "text-positive",
  negative: "text-negative",
} as const;

const SIZE_TEXT = { sm: "text-xl", md: "text-2xl", lg: "text-3xl sm:text-4xl" } as const;

/** Instrument-style labelled value. */
export function Readout({ label, value, unit, hint, tone = "neutral", size = "md", className }: ReadoutProps) {
  return (
    <div className={cn("rounded-xl border border-line bg-void/50 px-4 py-3", className)}>
      <p className="eyebrow text-ink-subtle">{label}</p>
      <p className={cn("mt-1 font-mono font-semibold tabular-nums", TONE_TEXT[tone], SIZE_TEXT[size])}>
        {value}
        {unit ? <span className="ml-1 text-[0.6em] font-medium text-ink-muted">{unit}</span> : null}
      </p>
      {hint ? <p className="mt-1 text-xs text-ink-subtle">{hint}</p> : null}
    </div>
  );
}
