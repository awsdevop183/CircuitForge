import { cn } from "@/lib/cn";

interface ProgressBarProps {
  value: number;
  max: number;
  label: string;
  showValue?: boolean;
  className?: string;
}

/** Accessible progress meter. The text label always accompanies the bar. */
export function ProgressBar({ value, max, label, showValue = true, className }: ProgressBarProps) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className={cn("w-full", className)}>
      <div className="mb-1.5 flex items-center justify-between gap-3 text-xs text-ink-subtle">
        <span>{label}</span>
        {showValue ? (
          <span className="font-mono text-ink-muted">
            {value}/{max}
          </span>
        ) : null}
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${value} of ${max} complete`}
        className="h-1.5 overflow-hidden rounded-full bg-line"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-deep to-cyan shadow-[0_0_10px_rgb(34_211_238/0.6)] transition-[width] duration-700 ease-[var(--ease-circuit)]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
