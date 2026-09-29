"use client";

import { cn } from "@/lib/cn";

interface MomentaryButtonProps {
  label: string;
  pressed: boolean;
  onPressChange: (pressed: boolean) => void;
  tone?: "logic" | "clock" | "negative";
  className?: string;
}

const TONES = {
  logic: "bg-logic text-void",
  clock: "bg-clock text-void",
  negative: "bg-negative text-void",
} as const;

/** Press-and-hold button (pointer or Space/Enter): active only while held, like a push button. */
export function MomentaryButton({ label, pressed, onPressChange, tone = "logic", className }: MomentaryButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onPointerDown={(event) => {
        try {
          // Keep receiving pointerup even if the finger slides off the button.
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          // Not a capturable pointer (e.g. synthetic events) — fine.
        }
        onPressChange(true);
      }}
      onPointerUp={() => onPressChange(false)}
      onPointerCancel={() => onPressChange(false)}
      onKeyDown={(event) => {
        if ((event.key === " " || event.key === "Enter") && !event.repeat) {
          event.preventDefault();
          onPressChange(true);
        }
      }}
      onKeyUp={(event) => {
        if (event.key === " " || event.key === "Enter") onPressChange(false);
      }}
      onBlur={() => pressed && onPressChange(false)}
      className={cn(
        "min-h-14 min-w-28 touch-none select-none rounded-xl border-2 px-4 font-mono text-base font-bold tracking-[0.08em] transition-all",
        pressed ? cn("translate-y-0.5 border-transparent", TONES[tone]) : "border-line-strong bg-surface text-ink hover:border-logic/50",
        className,
      )}
    >
      {label}
      <span className="block text-[0.65rem] font-medium tracking-normal opacity-80">{pressed ? "held" : "press & hold"}</span>
    </button>
  );
}
