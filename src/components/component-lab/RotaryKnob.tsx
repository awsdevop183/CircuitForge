"use client";

import { useRef, type KeyboardEvent, type PointerEvent } from "react";

interface RotaryKnobProps {
  /** 0–1 position. */
  value: number;
  onChange: (value: number) => void;
  label: string;
  /** Text for screen readers, e.g. "4.5 volts". */
  valueText?: string;
  size?: number;
}

const SWEEP = 270;
const START = -135;

/**
 * A virtual knob: drag around it, or use the arrow keys (Page Up/Down for big
 * steps, Home/End for the ends). Exposed as an ARIA slider.
 */
export function RotaryKnob({ value, onChange, label, valueText, size = 160 }: RotaryKnobProps) {
  const ref = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  const angle = START + value * SWEEP;

  const updateFromPointer = (event: PointerEvent<SVGSVGElement>) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    const dx = event.clientX - (box.left + box.width / 2);
    const dy = event.clientY - (box.top + box.height / 2);
    // 0° = straight up, clockwise positive
    const degrees = (Math.atan2(dx, -dy) * 180) / Math.PI;
    if (degrees < START - 20 || degrees > -START + 20) return; // ignore the dead zone at the bottom
    onChange(clamp((degrees - START) / SWEEP));
  };

  const onKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    const steps: Record<string, number> = { ArrowRight: 0.01, ArrowUp: 0.01, ArrowLeft: -0.01, ArrowDown: -0.01, PageUp: 0.1, PageDown: -0.1 };
    if (event.key in steps) onChange(clamp(value + steps[event.key]!));
    else if (event.key === "Home") onChange(0);
    else if (event.key === "End") onChange(1);
    else return;
    event.preventDefault();
  };

  const arc = (from: number, to: number, r: number) => {
    const p = (deg: number) => [80 + r * Math.sin((deg * Math.PI) / 180), 80 - r * Math.cos((deg * Math.PI) / 180)];
    const [x1, y1] = p(from);
    const [x2, y2] = p(to);
    return `M ${x1} ${y1} A ${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x2} ${y2}`;
  };

  return (
    <svg
      ref={ref}
      viewBox="0 0 160 160"
      width={size}
      height={size}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      aria-valuetext={valueText ?? `${Math.round(value * 100)}%`}
      className="cursor-grab touch-none select-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-cyan active:cursor-grabbing"
      onPointerDown={(event) => {
        dragging.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        updateFromPointer(event);
      }}
      onPointerMove={(event) => dragging.current && updateFromPointer(event)}
      onPointerUp={() => (dragging.current = false)}
      onKeyDown={onKeyDown}
    >
      <path d={arc(START, -START, 70)} fill="none" stroke="#1a2432" strokeWidth={8} strokeLinecap="round" />
      {value > 0.005 ? <path d={arc(START, angle, 70)} fill="none" stroke="#f5a524" strokeWidth={8} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 4px #f5a524)" }} /> : null}
      <circle cx={80} cy={80} r={52} fill="#1e293b" stroke="#475569" strokeWidth={3} />
      <circle cx={80} cy={80} r={42} fill="#0f172a" />
      <g transform={`rotate(${angle} 80 80)`}>
        <line x1={80} y1={80} x2={80} y2={44} stroke="#f5a524" strokeWidth={5} strokeLinecap="round" />
      </g>
      <text x={80} y={150} textAnchor="middle" fontSize={12} fill="#e8eef6" fontFamily="var(--font-mono)" aria-hidden="true">
        {Math.round(value * 100)}%
      </text>
    </svg>
  );
}
