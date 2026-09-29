"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

type Sign = "+" | "−";

const ATTRACT_GAP = 42;
const REPEL_GAP = 140;

/** Two charges the learner can flip, showing attraction and repulsion. */
export function ChargeInteraction() {
  const [left, setLeft] = useState<Sign>("+");
  const [right, setRight] = useState<Sign>("−");
  const attract = left !== right;
  const gap = attract ? ATTRACT_GAP : REPEL_GAP;

  return (
    <div className="p-5 sm:p-8">
      <svg viewBox="-200 -70 400 140" className="h-auto w-full" role="img" aria-label={`A ${nameOf(left)} charge and a ${nameOf(right)} charge. They ${attract ? "attract each other" : "repel each other"}.`}>
        <line x1={-190} x2={190} y1={0} y2={0} stroke="#1a2432" strokeDasharray="2 6" />
        <ForceArrows gap={gap} attract={attract} />
        <Charge sign={left} x={-gap} />
        <Charge sign={right} x={gap} />
      </svg>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <SignPicker label="Left charge" value={left} onChange={setLeft} />
        <motion.p
          key={String(attract)}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "rounded-xl border px-4 py-3 text-center font-display text-lg font-semibold",
            attract ? "border-cyan/50 text-cyan" : "border-amber/50 text-amber",
          )}
          aria-live="polite"
        >
          {attract ? "Opposites attract" : "Like charges repel"}
        </motion.p>
        <SignPicker label="Right charge" value={right} onChange={setRight} />
      </div>
    </div>
  );
}

function nameOf(sign: Sign) {
  return sign === "+" ? "positive" : "negative";
}

function Charge({ sign, x }: { sign: Sign; x: number }) {
  const positive = sign === "+";
  return (
    <motion.g initial={false} animate={{ x }} transition={{ type: "spring", stiffness: 90, damping: 12 }}>
      <circle r={30} fill={positive ? "#f87171" : "#22d3ee"} opacity={0.15} />
      <circle r={22} fill={positive ? "#7f1d1d" : "#164e63"} stroke={positive ? "#f87171" : "#67e8f9"} strokeWidth={2.5} />
      <text textAnchor="middle" dominantBaseline="central" fontSize={26} fontWeight={700} fill={positive ? "#fecaca" : "#cffafe"}>
        {sign}
      </text>
    </motion.g>
  );
}

function ForceArrows({ gap, attract }: { gap: number; attract: boolean }) {
  const markerId = `charge-arrow-${useId().replace(/:/g, "")}`;
  const color = attract ? "#22d3ee" : "#f5a524";
  // Each arrow sits just outside its charge: pointing inwards (attract) or outwards (repel).
  const arrow = (side: -1 | 1) => {
    const near = side * (gap + 32);
    const far = side * (gap + 66);
    const [from, to] = attract ? [far, near] : [near, far];
    return (
      <motion.path
        key={side}
        initial={false}
        animate={{ d: `M ${from} 0 L ${to} 0` }}
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        markerEnd={`url(#${markerId})`}
        transition={{ type: "spring", stiffness: 90, damping: 12 }}
      />
    );
  };
  return (
    <g aria-hidden="true">
      <defs>
        <marker id={markerId} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
        </marker>
      </defs>
      {arrow(-1)}
      {arrow(1)}
    </g>
  );
}

function SignPicker({ label, value, onChange }: { label: string; value: Sign; onChange: (sign: Sign) => void }) {
  return (
    <div role="group" aria-label={label} className="flex items-center justify-center gap-2">
      <span className="mr-1 text-xs text-ink-subtle">{label}</span>
      {(["+", "−"] as const).map((sign) => (
        <button
          key={sign}
          type="button"
          aria-pressed={value === sign}
          aria-label={`${label}: ${nameOf(sign)}`}
          onClick={() => onChange(sign)}
          className={cn(
            "flex size-11 items-center justify-center rounded-lg border font-mono text-xl font-bold transition-colors",
            value === sign
              ? sign === "+"
                ? "border-[#f87171] bg-[#f87171]/15 text-[#fca5a5]"
                : "border-cyan bg-cyan/15 text-cyan-soft"
              : "border-line-strong text-ink-subtle hover:text-ink",
          )}
        >
          {sign}
        </button>
      ))}
    </div>
  );
}
