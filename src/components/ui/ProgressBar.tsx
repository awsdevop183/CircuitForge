import { cn } from "@/lib/cn";

interface ProgressBarProps {
  /** Accessible name, e.g. "Electricity & Fundamentals progress". */
  label: string;
  /** Spoken value, e.g. "8 of 15 lessons completed". */
  valueText: string;
  value: number;
  max: number;
  /** Draw one segment per item (like a row of LEDs) instead of a continuous bar. */
  segments?: readonly boolean[];
  size?: "sm" | "md";
  tone?: "cyan" | "logic";
  className?: string;
}

const LIT = { cyan: "bg-cyan shadow-[0_0_8px_rgb(34_211_238/0.7)]", logic: "bg-logic shadow-[0_0_8px_rgb(163_230_53/0.7)]" } as const;

/** Accessible progress bar: segmented (one per lesson) or continuous. */
export function ProgressBar({ label, valueText, value, max, segments, size = "sm", tone = "cyan", className }: ProgressBarProps) {
  const height = size === "md" ? "h-3" : "h-1.5";
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} aria-valuetext={valueText} className={cn("flex gap-[3px]", height, className)}>
      {segments ? (
        segments.map((lit, i) => <span key={i} className={cn("flex-1 rounded-sm transition-colors duration-500", lit ? LIT[tone] : "bg-line")} />)
      ) : (
        <span className="relative flex-1 overflow-hidden rounded-sm bg-line">
          <span className={cn("absolute inset-y-0 left-0 rounded-sm transition-[width] duration-500", LIT[tone])} style={{ width: `${max > 0 ? (value / max) * 100 : 0}%` }} />
        </span>
      )}
    </div>
  );
}
