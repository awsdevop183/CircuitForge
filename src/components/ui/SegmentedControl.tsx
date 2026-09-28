"use client";

import { useId, useRef, type KeyboardEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export interface SegmentOption<T extends string | number> {
  value: T;
  label: ReactNode;
  /** Accessible label if `label` is not plain text. */
  ariaLabel?: string;
}

interface SegmentedControlProps<T extends string | number> {
  label: string;
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Visually hide the group label (it is still announced). */
  hideLabel?: boolean;
  size?: "sm" | "md";
  className?: string;
}

/**
 * A radio group styled as a segmented switch. Arrow keys move between options
 * (roving tabindex), matching native radio behaviour.
 */
export function SegmentedControl<T extends string | number>({
  label,
  options,
  value,
  onChange,
  hideLabel = false,
  size = "md",
  className,
}: SegmentedControlProps<T>) {
  const groupId = useId();
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keyToDelta: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let nextIndex: number | undefined;
    if (event.key in keyToDelta) nextIndex = (index + keyToDelta[event.key]! + options.length) % options.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = options.length - 1;
    if (nextIndex === undefined) return;
    event.preventDefault();
    onChange(options[nextIndex]!.value);
    buttonRefs.current[nextIndex]?.focus();
  };

  return (
    <div className={className}>
      <p id={groupId} className={cn("mb-2 text-sm font-medium text-ink", hideLabel && "sr-only")}>
        {label}
      </p>
      <div
        role="radiogroup"
        aria-labelledby={groupId}
        className="relative inline-flex w-full rounded-xl border border-line-strong bg-void/60 p-1"
      >
        {options.map((option, index) => {
          const selected = index === selectedIndex;
          return (
            <button
              key={String(option.value)}
              ref={(element) => {
                buttonRefs.current[index] = element;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={option.ariaLabel}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(option.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "relative flex-1 rounded-lg font-mono font-semibold transition-colors duration-200",
                size === "sm" ? "min-h-9 px-2 text-xs" : "min-h-11 px-3 text-sm",
                selected ? "text-void" : "text-ink-muted hover:text-ink",
              )}
            >
              {selected ? (
                <motion.span
                  layoutId={`segment-${groupId}`}
                  className="absolute inset-0 rounded-lg bg-cyan shadow-[0_0_18px_-4px_rgb(34_211_238/0.8)]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  aria-hidden="true"
                />
              ) : null}
              <span className="relative">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
