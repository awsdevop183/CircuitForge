"use client";

import { useId, type CSSProperties } from "react";
import { cn } from "@/lib/cn";

interface InteractiveSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  /** Step in value units (linear scale only). */
  step?: number;
  /**
   * "log" spreads values evenly by powers of ten — ideal for resistance
   * (10 Ω … 10 kΩ) or current (1 mA … 1 A). `min` must be > 0.
   */
  scale?: "linear" | "log";
  onChange: (value: number) => void;
  /** Formats the displayed value and the screen-reader value text. */
  format: (value: number) => string;
  /** Accent colour of the track and thumb. */
  color?: string;
  /** Small captions under the ends of the track. */
  minLabel?: string;
  maxLabel?: string;
  hint?: string;
  disabled?: boolean;
  className?: string;
}

const LOG_STEPS = 1000;

/** Rounds a log-slider value to 3 significant figures so readouts stay tidy. */
function tidy(value: number): number {
  return Number(value.toPrecision(3));
}

/** Labelled range input with a live value readout. */
export function InteractiveSlider({
  label,
  value,
  min,
  max,
  step = 1,
  scale = "linear",
  onChange,
  format,
  color = "var(--color-cyan)",
  minLabel,
  maxLabel,
  hint,
  disabled = false,
  className,
}: InteractiveSliderProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const isLog = scale === "log";

  const logMin = Math.log10(min);
  const logMax = Math.log10(max);
  const position = isLog
    ? ((Math.log10(Math.min(max, Math.max(min, value))) - logMin) / (logMax - logMin)) * LOG_STEPS
    : value;
  const fill = isLog ? (position / LOG_STEPS) * 100 : ((value - min) / (max - min)) * 100;

  const handleChange = (raw: number) => {
    if (!isLog) return onChange(raw);
    onChange(tidy(Math.pow(10, logMin + (raw / LOG_STEPS) * (logMax - logMin))));
  };

  return (
    <div className={cn("w-full", disabled && "opacity-50", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
        <output htmlFor={id} className="font-mono text-lg font-semibold tabular-nums" style={{ color }}>
          {format(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={isLog ? 0 : min}
        max={isLog ? LOG_STEPS : max}
        step={isLog ? 1 : step}
        value={position}
        disabled={disabled}
        onChange={(event) => handleChange(Number(event.target.value))}
        aria-valuetext={format(value)}
        aria-describedby={hint ? hintId : undefined}
        className="range-input mt-1 disabled:cursor-not-allowed"
        style={{ "--range-fill": `${fill}%`, "--range-color": color } as CSSProperties}
      />
      {minLabel || maxLabel ? (
        <div className="flex justify-between font-mono text-[0.7rem] text-ink-subtle" aria-hidden="true">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      ) : null}
      {hint ? (
        <p id={hintId} className="mt-1 text-xs text-ink-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
