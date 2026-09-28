import { cn } from "@/lib/cn";

interface BlockMeterProps {
  /** 0–1 filled fraction. */
  fraction: number;
  blocks?: number;
  /** Accessible description of what's measured, e.g. "Current 20 mA of 30 mA". */
  label: string;
  tone?: "cyan" | "amber" | "positive" | "negative";
  className?: string;
}

const TONES = { cyan: "text-cyan", amber: "text-amber", positive: "text-positive", negative: "text-negative" } as const;

/** A text-mode bar like "█████░░░░" — the same visual language as the lessons' diagrams. */
export function BlockMeter({ fraction, blocks = 16, label, tone = "cyan", className }: BlockMeterProps) {
  const filled = Math.round(Math.max(0, Math.min(1, fraction)) * blocks);
  return (
    <span role="img" aria-label={label} className={cn("inline-block whitespace-nowrap font-mono tracking-tight", className)}>
      <span className={TONES[tone]} aria-hidden="true">
        {"█".repeat(filled)}
      </span>
      <span className="text-line-strong" aria-hidden="true">
        {"░".repeat(blocks - filled)}
      </span>
    </span>
  );
}
