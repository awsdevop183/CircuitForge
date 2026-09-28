"use client";

import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

const PROTONS = 3;
const MIN_ELECTRONS = 1;
const MAX_ELECTRONS = 5;

/** Nucleus particle layout (protons and neutrons), relative to the centre. */
const NUCLEUS: readonly { x: number; y: number; kind: "proton" | "neutron" }[] = [
  { x: -7, y: -6, kind: "proton" },
  { x: 7, y: -5, kind: "neutron" },
  { x: 0, y: 6, kind: "proton" },
  { x: -9, y: 7, kind: "neutron" },
  { x: 9, y: 7, kind: "proton" },
  { x: 0, y: -12, kind: "neutron" },
];

/** Electron slots: inner shell holds 2, outer shell the rest. */
function electronPositions(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const inner = i < 2;
    const shellCount = inner ? Math.min(count, 2) : count - 2;
    const indexInShell = inner ? i : i - 2;
    const angle = (indexInShell / shellCount) * 360 + (inner ? 0 : 30);
    return { radius: inner ? 52 : 92, angle, shell: inner ? 0 : 1 };
  });
}

/**
 * An atom whose electron count the learner can change. Shows how losing or
 * gaining electrons gives an atom an overall electric charge.
 */
export function AtomModel() {
  const [electrons, setElectrons] = useState(PROTONS);
  const netCharge = PROTONS - electrons;
  const status = netCharge === 0 ? "Neutral" : netCharge > 0 ? "Positive ion" : "Negative ion";
  const positions = electronPositions(electrons);

  return (
    <div className="grid gap-6 p-5 sm:p-8 md:grid-cols-[1.2fr_1fr] md:items-center">
      <svg viewBox="-120 -120 240 240" className="mx-auto h-auto w-full max-w-xs" role="img" aria-label={`Atom with ${PROTONS} protons and ${electrons} electrons. Overall charge: ${status.toLowerCase()}.`}>
        <circle r={52} fill="none" stroke="#263447" strokeDasharray="3 5" />
        <circle r={92} fill="none" stroke="#263447" strokeDasharray="3 5" />
        <circle r={28} fill="#22d3ee" opacity={0.06} />
        {NUCLEUS.map((particle, i) => (
          <g key={i} transform={`translate(${particle.x} ${particle.y})`}>
            <circle r={8} fill={particle.kind === "proton" ? "#f87171" : "#64748b"} stroke="#0b1018" strokeWidth={1.5} />
            {particle.kind === "proton" ? (
              <text textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={700} fill="#fff">
                +
              </text>
            ) : null}
          </g>
        ))}
        {[0, 1].map((shell) => (
          <motion.g
            key={shell}
            animate={{ rotate: 360 }}
            transition={{ duration: shell === 0 ? 9 : 16, repeat: Infinity, ease: "linear" }}
          >
            {/* Invisible ring centres the group's bounding box (the rotation origin) on the nucleus */}
            <circle r={shell === 0 ? 58 : 98} fill="none" stroke="none" />
            {positions
              .filter((p) => p.shell === shell)
              .map((p, i) => {
                const rad = (p.angle * Math.PI) / 180;
                return (
                  <g key={`${shell}-${i}`} transform={`translate(${Math.cos(rad) * p.radius} ${Math.sin(rad) * p.radius})`}>
                    <circle r={7} fill="#67e8f9" style={{ filter: "drop-shadow(0 0 4px #22d3ee)" }} />
                    <text textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700} fill="#0b1018">
                      −
                    </text>
                  </g>
                );
              })}
          </motion.g>
        ))}
      </svg>

      <div>
        <dl className="grid grid-cols-3 gap-2 text-center">
          <Count label="Protons" value={PROTONS} tone="text-[#f87171]" sign="+" />
          <Count label="Electrons" value={electrons} tone="text-cyan-soft" sign="−" />
          <div className="rounded-xl border border-line bg-void/50 p-3">
            <dt className="eyebrow text-[0.6rem] text-ink-subtle">Net charge</dt>
            <dd className="mt-1 font-mono text-2xl font-semibold text-ink">{netCharge > 0 ? `+${netCharge}` : netCharge}</dd>
          </div>
        </dl>
        <p
          className={cn(
            "mt-4 rounded-xl border px-4 py-3 text-center font-display text-lg font-semibold",
            netCharge === 0 ? "border-line-strong text-ink" : netCharge > 0 ? "border-[#f87171]/50 text-[#fca5a5]" : "border-cyan/50 text-cyan-soft",
          )}
          aria-live="polite"
        >
          {status}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setElectrons((n) => Math.max(MIN_ELECTRONS, n - 1))}
            disabled={electrons <= MIN_ELECTRONS}
            className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line-strong bg-surface-high text-sm font-semibold text-ink hover:border-cyan/50 disabled:opacity-40"
          >
            <Minus className="size-4" aria-hidden="true" />
            Remove electron
          </button>
          <button
            type="button"
            onClick={() => setElectrons((n) => Math.min(MAX_ELECTRONS, n + 1))}
            disabled={electrons >= MAX_ELECTRONS}
            className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line-strong bg-surface-high text-sm font-semibold text-ink hover:border-cyan/50 disabled:opacity-40"
          >
            <Plus className="size-4" aria-hidden="true" />
            Add electron
          </button>
        </div>
        <p className="mt-4 text-sm text-ink-muted">
          Protons stay locked in the nucleus. Only <strong className="text-ink">electrons</strong> move — and moving electrons are what
          electricity is made of.
        </p>
      </div>
    </div>
  );
}

function Count({ label, value, tone, sign }: { label: string; value: number; tone: string; sign: string }) {
  return (
    <div className="rounded-xl border border-line bg-void/50 p-3">
      <dt className="eyebrow text-[0.6rem] text-ink-subtle">{label}</dt>
      <dd className={cn("mt-1 font-mono text-2xl font-semibold", tone)}>
        {value}
        <span className="ml-0.5 text-base" aria-hidden="true">
          {sign}
        </span>
      </dd>
    </div>
  );
}
