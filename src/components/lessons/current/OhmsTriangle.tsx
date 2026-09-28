"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SegmentedControl } from "@/components/ui/SegmentedControl";

type Unknown = "V" | "I" | "R";

const FORMULAS: Record<Unknown, { formula: string; words: string }> = {
  V: { formula: "V = I × R", words: "Voltage equals current times resistance." },
  I: { formula: "I = V ÷ R", words: "Current equals voltage divided by resistance." },
  R: { formula: "R = V ÷ I", words: "Resistance equals voltage divided by current." },
};

const POSITIONS: Record<Unknown, { x: number; y: number }> = {
  V: { x: 100, y: 62 },
  I: { x: 62, y: 128 },
  R: { x: 138, y: 128 },
};

const COLORS: Record<Unknown, string> = { V: "#f5a524", I: "#22d3ee", R: "#38bdf8" };

/**
 * The Ohm's-law triangle: cover the quantity you want and the other two show
 * how to calculate it.
 */
export function OhmsTriangle() {
  const [unknown, setUnknown] = useState<Unknown>("I");

  return (
    <div className="grid gap-6 p-5 sm:p-8 md:grid-cols-[1fr_1.2fr] md:items-center">
      <svg viewBox="0 0 200 170" className="mx-auto h-auto w-full max-w-[16rem]" role="img" aria-label={`Ohm's law triangle. Covering ${unknown} gives ${FORMULAS[unknown].formula}.`}>
        <path d="M 100 12 L 188 160 L 12 160 Z" fill="#0b1018" stroke="#34445a" strokeWidth={2} strokeLinejoin="round" />
        <line x1={46} y1={100} x2={154} y2={100} stroke="#34445a" strokeWidth={2} />
        <line x1={100} y1={100} x2={100} y2={160} stroke="#34445a" strokeWidth={2} />
        <text x={100} y={146} textAnchor="middle" fontSize={16} fill="#7f8ea4" aria-hidden="true">×</text>
        {(Object.keys(POSITIONS) as Unknown[]).map((key) => {
          const covered = key === unknown;
          const { x, y } = POSITIONS[key];
          return (
            <g key={key}>
              <motion.circle
                cx={x}
                cy={y}
                r={20}
                initial={false}
                animate={{ opacity: covered ? 1 : 0, scale: covered ? 1 : 0.6 }}
                fill={COLORS[key]}
                fillOpacity={0.18}
                stroke={COLORS[key]}
                strokeWidth={2}
              />
              <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={28} fontWeight={700} fill={COLORS[key]} fontFamily="var(--font-mono)">
                {key}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="space-y-5">
        <SegmentedControl
          label="What do you want to find?"
          options={[
            { value: "V" as const, label: "Voltage", ariaLabel: "Find voltage" },
            { value: "I" as const, label: "Current", ariaLabel: "Find current" },
            { value: "R" as const, label: "Resistance", ariaLabel: "Find resistance" },
          ]}
          value={unknown}
          onChange={setUnknown}
          size="sm"
        />
        <motion.div key={unknown} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-line bg-void/50 p-5 text-center">
          <p className="font-mono text-3xl font-semibold" style={{ color: COLORS[unknown] }}>
            {FORMULAS[unknown].formula}
          </p>
          <p className="mt-2 text-sm text-ink-muted">{FORMULAS[unknown].words}</p>
        </motion.div>
        <p className="text-sm text-ink-muted">
          Cover the letter you want. If the other two sit side by side, <strong className="text-ink">multiply</strong>. If one is over the
          other, <strong className="text-ink">divide</strong>.
        </p>
      </div>
    </div>
  );
}
