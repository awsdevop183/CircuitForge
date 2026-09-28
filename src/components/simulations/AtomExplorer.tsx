"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Info, Minus, Plus } from "lucide-react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { cn } from "@/lib/cn";

type Particle = "proton" | "neutron" | "electron";
type Model = "orbits" | "cloud";

const PROTONS = 3; // lithium
const MIN_ELECTRONS = 1;
const MAX_ELECTRONS = 5;

const PARTICLES: Record<Particle, { name: string; charge: string; where: string; mass: string; role: string; color: string }> = {
  proton: {
    name: "Proton",
    charge: "+1 (positive)",
    where: "Locked in the nucleus",
    mass: "Heavy — about 1,836 electrons",
    role: "Sets what element the atom is. Protons don't move around in circuits.",
    color: "#f87171",
  },
  neutron: {
    name: "Neutron",
    charge: "0 (no charge)",
    where: "Locked in the nucleus",
    mass: "Heavy — similar to a proton",
    role: "Helps hold the nucleus together. With no charge, it plays no part in electricity.",
    color: "#94a3b8",
  },
  electron: {
    name: "Electron",
    charge: "−1 (negative)",
    where: "Around the nucleus",
    mass: "Very light",
    role: "The mobile one. In metals, outer electrons can hop between atoms — and moving electrons are what carry electricity in wires.",
    color: "#67e8f9",
  },
};

const NUCLEUS: readonly { x: number; y: number; kind: "proton" | "neutron" }[] = [
  { x: -7, y: -6, kind: "proton" },
  { x: 7, y: -5, kind: "neutron" },
  { x: 0, y: 6, kind: "proton" },
  { x: -10, y: 8, kind: "neutron" },
  { x: 10, y: 8, kind: "proton" },
  { x: 1, y: -15, kind: "neutron" },
  { x: 14, y: -14, kind: "neutron" },
];

/** Deterministic scatter for the electron-cloud dots (no hydration mismatch). */
const CLOUD_DOTS = Array.from({ length: 260 }, (_, i) => {
  const angle = i * 2.39996;
  const radius = 28 + ((i * 97) % 100) * 0.72 * (i % 3 === 0 ? 0.7 : 1);
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, o: 0.15 + ((i * 53) % 10) / 20 };
});

function electronSlots(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const inner = i < 2;
    const shellCount = inner ? Math.min(count, 2) : count - 2;
    const indexInShell = inner ? i : i - 2;
    const angle = (indexInShell / shellCount) * 360 + (inner ? 0 : 30);
    return { radius: inner ? 52 : 92, angle, shell: inner ? 0 : 1 };
  });
}

/**
 * An interactive (simplified) atom. Tap particles to learn about them, add or
 * remove electrons to make ions, and compare the orbit picture with the more
 * accurate electron-cloud picture.
 */
export function AtomExplorer() {
  const [electrons, setElectrons] = useState(PROTONS);
  const [selected, setSelected] = useState<Particle>("electron");
  const [model, setModel] = useState<Model>("orbits");
  const netCharge = PROTONS - electrons;
  const status = netCharge === 0 ? "Neutral atom" : netCharge > 0 ? "Positive ion" : "Negative ion";
  const slots = electronSlots(electrons);
  const info = PARTICLES[selected];

  // Particles in the drawing are pointer shortcuts; the buttons below are the keyboard-accessible controls.
  const selectable = (particle: Particle) => ({
    onClick: () => setSelected(particle),
    className: "cursor-pointer",
  });

  return (
    <div>
      <div className="grid gap-px bg-line md:grid-cols-[1.2fr_1fr]">
        <div className="bg-breadboard flex flex-col items-center justify-center p-4 sm:p-6">
          <svg viewBox="-120 -120 240 240" className="h-auto w-full max-w-sm" role="group" aria-label={`Lithium atom with ${PROTONS} protons, 4 neutrons and ${electrons} electrons (${status.toLowerCase()}). Shown as the ${model === "orbits" ? "simplified orbit" : "electron cloud"} model.`}>
            {model === "orbits" ? (
              <>
                <circle r={52} fill="none" stroke="#34445a" strokeDasharray="3 5" />
                <circle r={92} fill="none" stroke="#34445a" strokeDasharray="3 5" />
              </>
            ) : (
              <g aria-hidden="true">
                <circle r={110} fill="url(#electron-cloud-glow)" />
                <defs>
                  <radialGradient id="electron-cloud-glow">
                    <stop offset="0.15" stopColor="#22d3ee" stopOpacity={0.3} />
                    <stop offset="0.55" stopColor="#22d3ee" stopOpacity={0.12} />
                    <stop offset="1" stopColor="#22d3ee" stopOpacity={0} />
                  </radialGradient>
                </defs>
                {CLOUD_DOTS.slice(0, 40 + electrons * 44).map((dot, i) => (
                  <circle key={i} cx={dot.x} cy={dot.y} r={1.3} fill="#a5f3fc" opacity={dot.o} />
                ))}
              </g>
            )}
            <g>
              {NUCLEUS.map((particle, i) => (
                <g key={i} transform={`translate(${particle.x} ${particle.y})`} {...selectable(particle.kind)}>
                  <circle r={8} fill={particle.kind === "proton" ? "#b91c1c" : "#475569"} stroke={selected === particle.kind ? "#fcd34d" : "#0b1018"} strokeWidth={selected === particle.kind ? 2.5 : 1.5} />
                  {particle.kind === "proton" ? (
                    <text textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={700} fill="#fecaca" pointerEvents="none">
                      +
                    </text>
                  ) : null}
                </g>
              ))}
            </g>
            {model === "orbits"
              ? [0, 1].map((shell) => (
                  <motion.g key={shell} animate={{ rotate: 360 }} transition={{ duration: shell === 0 ? 10 : 18, repeat: Infinity, ease: "linear" }}>
                    {/* Invisible ring centres the rotation on the nucleus */}
                    <circle r={shell === 0 ? 58 : 98} fill="none" stroke="none" />
                    {slots
                      .filter((slot) => slot.shell === shell)
                      .map((slot, i) => {
                        const rad = (slot.angle * Math.PI) / 180;
                        return (
                          <g key={i} transform={`translate(${Math.cos(rad) * slot.radius} ${Math.sin(rad) * slot.radius})`} {...selectable("electron")}>
                            {/* Counter-rotate so the − sign stays upright while the shell turns */}
                            <motion.g animate={{ rotate: -360 }} transition={{ duration: shell === 0 ? 10 : 18, repeat: Infinity, ease: "linear" }}>
                              <circle r={7.5} fill="#67e8f9" stroke={selected === "electron" ? "#fcd34d" : "transparent"} strokeWidth={2} style={{ filter: "drop-shadow(0 0 4px #22d3ee)" }} />
                              <text textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700} fill="#0b1018" pointerEvents="none">
                                −
                              </text>
                            </motion.g>
                          </g>
                        );
                      })}
                  </motion.g>
                ))
              : null}
          </svg>
          <div className="mt-2 flex flex-wrap justify-center gap-2" role="group" aria-label="Choose a particle">
            {(Object.keys(PARTICLES) as Particle[]).map((particle) => (
              <button
                key={particle}
                type="button"
                aria-pressed={selected === particle}
                onClick={() => setSelected(particle)}
                className={cn(
                  "inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 text-sm",
                  selected === particle ? "border-amber/70 bg-amber/10 text-ink" : "border-line-strong text-ink-muted hover:text-ink",
                )}
              >
                <span className="size-3 rounded-full" style={{ backgroundColor: PARTICLES[particle].color }} aria-hidden="true" />
                {PARTICLES[particle].name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 bg-surface-raised p-5">
          <AnimatePresence mode="wait">
            <motion.dl key={selected} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-xl border border-line bg-void/40 p-4" aria-live="polite">
              <dt className="sr-only">Particle</dt>
              <dd className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
                <span className="size-3.5 rounded-full" style={{ backgroundColor: info.color }} aria-hidden="true" />
                {info.name}
              </dd>
              {(
                [
                  ["Charge", info.charge],
                  ["Where", info.where],
                  ["Mass", info.mass],
                ] as const
              ).map(([label, value]) => (
                <div key={label} className="mt-2 flex justify-between gap-3 text-sm">
                  <dt className="text-ink-subtle">{label}</dt>
                  <dd className="text-right text-ink">{value}</dd>
                </div>
              ))}
              <dt className="sr-only">Role</dt>
              <dd className="mt-3 border-t border-line pt-3 text-sm text-ink-muted">{info.role}</dd>
            </motion.dl>
          </AnimatePresence>

          <div className="grid grid-cols-3 gap-2 text-center">
            <Tally label="Protons" value={`${PROTONS}+`} tone="text-[#fca5a5]" />
            <Tally label="Electrons" value={`${electrons}−`} tone="text-cyan-soft" />
            <Tally label="Net charge" value={netCharge > 0 ? `+${netCharge}` : `${netCharge}`} tone="text-ink" />
          </div>
          <p
            className={cn(
              "rounded-xl border px-4 py-2.5 text-center font-display font-semibold",
              netCharge === 0 ? "border-line-strong text-ink" : netCharge > 0 ? "border-[#f87171]/50 text-[#fca5a5]" : "border-cyan/50 text-cyan-soft",
            )}
            aria-live="polite"
          >
            {status}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setElectrons((n) => Math.max(MIN_ELECTRONS, n - 1))} disabled={electrons <= MIN_ELECTRONS} className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line-strong bg-surface-high text-sm font-semibold text-ink hover:border-cyan/50 disabled:opacity-40">
              <Minus className="size-4" aria-hidden="true" />
              Remove electron
            </button>
            <button type="button" onClick={() => setElectrons((n) => Math.min(MAX_ELECTRONS, n + 1))} disabled={electrons >= MAX_ELECTRONS} className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line-strong bg-surface-high text-sm font-semibold text-ink hover:border-cyan/50 disabled:opacity-40">
              <Plus className="size-4" aria-hidden="true" />
              Add electron
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-line p-4 sm:p-5">
        <SegmentedControl
          label="Picture of the atom"
          options={[
            { value: "orbits" as const, label: "Simplified: orbits" },
            { value: "cloud" as const, label: "More accurate: electron cloud" },
          ]}
          value={model}
          onChange={setModel}
          size="sm"
        />
        <p className="mt-3 flex gap-2 text-sm text-ink-muted">
          <Info className="mt-0.5 size-4 shrink-0 text-electric" aria-hidden="true" />
          {model === "orbits"
            ? "This is a simplified teaching model. Real electrons don't travel around neat circular tracks like planets — but the picture correctly shows a heavy positive centre with light negative electrons around it."
            : "Quantum physics says an electron has no exact path. Instead there's a “cloud” showing where it is likely to be found — denser means more likely. For electronics, the simple model is all you need."}
        </p>
      </div>
    </div>
  );
}

function Tally({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-xl border border-line bg-void/50 p-2.5">
      <p className="eyebrow text-[0.6rem] text-ink-subtle">{label}</p>
      <p className={cn("mt-1 font-mono text-xl font-semibold", tone)}>{value}</p>
    </div>
  );
}
