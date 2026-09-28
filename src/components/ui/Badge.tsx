import { Clock, Lock, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Difficulty } from "@/content/types";

type Tone = "neutral" | "cyan" | "amber" | "positive";

const TONES: Record<Tone, string> = {
  neutral: "border-line-strong bg-surface-raised text-ink-muted",
  cyan: "border-cyan/35 bg-cyan/10 text-cyan-soft",
  amber: "border-amber/40 bg-amber/10 text-amber-soft",
  positive: "border-positive/40 bg-positive/10 text-positive",
};

interface BadgeProps {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}

export function Badge({ tone = "neutral", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[0.7rem] font-medium uppercase tracking-[0.08em]",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const DIFFICULTY_LEVEL: Record<Difficulty, number> = { beginner: 1, intermediate: 2, advanced: 3 };
const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

/** Difficulty shown as text plus a 3-bar meter (never colour alone). */
export function DifficultyBadge({ difficulty, className }: { difficulty: Difficulty; className?: string }) {
  const level = DIFFICULTY_LEVEL[difficulty];
  return (
    <Badge className={className}>
      <span className="flex items-end gap-[2px]" aria-hidden="true">
        {[1, 2, 3].map((bar) => (
          <span
            key={bar}
            className={cn("w-[3px] rounded-sm", bar <= level ? "bg-amber" : "bg-line-strong")}
            style={{ height: `${4 + bar * 2}px` }}
          />
        ))}
      </span>
      <span>
        <span className="sr-only">Difficulty: </span>
        {DIFFICULTY_LABEL[difficulty]}
      </span>
    </Badge>
  );
}

export function ComingSoonBadge({ className, label = "Coming soon" }: { className?: string; label?: string }) {
  return (
    <Badge className={className}>
      <Lock className="size-3" aria-hidden="true" />
      {label}
    </Badge>
  );
}

export function PreviewBadge({ className }: { className?: string }) {
  return (
    <Badge tone="amber" className={className}>
      <Sparkles className="size-3" aria-hidden="true" />
      Preview
    </Badge>
  );
}

export function DurationBadge({ minutes, className }: { minutes: number; className?: string }) {
  return (
    <Badge className={className}>
      <Clock className="size-3" aria-hidden="true" />
      {minutes} min
    </Badge>
  );
}
