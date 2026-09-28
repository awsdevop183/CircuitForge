"use client";

import { useId, type CSSProperties } from "react";
import { cn } from "@/lib/cn";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  /** Formats the displayed value and the screen-reader value text. */
  format: (value: number) => string;
  /** Accent colour of the track and thumb. */
  color?: string;
  /** Small captions under the ends of the track. */
  minLabel?: string;
  maxLabel?: string;
  hint?: string;
  className?: string;
}

/** Labelled range input with a live value readout. */
export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
  color = "var(--color-cyan)",
  minLabel,
  maxLabel,
  hint,
  className,
}: SliderProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const fill = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("w-full", className)}>
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
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-valuetext={format(value)}
        aria-describedby={hint ? hintId : undefined}
        className="range-input mt-1"
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
