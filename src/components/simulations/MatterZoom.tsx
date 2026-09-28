"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/cn";

interface ZoomLevel {
  id: string;
  name: string;
  size: string;
  caption: string;
  scene: ReactNode;
}

const LEVELS: readonly ZoomLevel[] = [
  {
    id: "object",
    name: "Object",
    size: "about 1 mm thick",
    caption: "A copper wire. It looks smooth and solid — but everything, including this wire, is made of matter.",
    scene: <WireScene />,
  },
  {
    id: "material",
    name: "Material",
    size: "atoms ≈ 0.0000003 mm apart",
    caption: "Zoomed in about ten million times: the copper is made of countless atoms packed in a neat, repeating pattern.",
    scene: <LatticeScene />,
  },
  {
    id: "atom",
    name: "Atom",
    size: "≈ 0.0000003 mm across",
    caption: "One atom: a tiny, heavy nucleus in the centre, with light electrons around it. Most of an atom is empty space.",
    scene: <AtomScene />,
  },
  {
    id: "nucleus",
    name: "Nucleus",
    size: "100,000× smaller than the atom",
    caption: "The nucleus holds protons (positive charge) and neutrons (no charge). Copper has 29 protons — we've drawn fewer to keep it clear.",
    scene: <NucleusScene />,
  },
];

/** Zoom from an everyday object down to the particles that carry electric charge. */
export function MatterZoom() {
  const [level, setLevel] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const current = LEVELS[level]!;

  const go = (next: number) => {
    setDirection(next > level ? 1 : -1);
    setLevel(next);
  };

  return (
    <div>
      <div className="relative overflow-hidden bg-breadboard">
        <div className="aspect-[16/9] w-full">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              className="h-full w-full"
              initial={{ opacity: 0, scale: direction === 1 ? 0.4 : 2.2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: direction === 1 ? 2.2 : 0.4 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {current.scene}
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="absolute left-3 top-3 rounded-md bg-void/80 px-2 py-1 font-mono text-xs text-cyan">
          {current.name} · {current.size}
        </p>
      </div>

      <div className="border-t border-line p-4 sm:p-5">
        <ol className="grid grid-cols-4 gap-1.5" aria-label="Zoom levels">
          {LEVELS.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => go(index)}
                aria-current={index === level ? "step" : undefined}
                className={cn(
                  "flex w-full flex-col items-center rounded-lg border px-1 py-2 text-xs transition-colors",
                  index === level ? "border-cyan/60 bg-cyan/10 text-cyan" : index < level ? "border-cyan/25 text-ink-muted" : "border-line-strong text-ink-subtle hover:text-ink",
                )}
              >
                <span className="font-mono text-[0.65rem]">{index + 1}</span>
                <span className="font-medium">{item.name}</span>
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-4 min-h-12 text-sm leading-relaxed text-ink-muted" aria-live="polite">
          {current.caption}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => go(level - 1)}
            disabled={level === 0}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line-strong text-sm font-semibold text-ink hover:border-cyan/60 disabled:opacity-40"
          >
            <ZoomOut className="size-4" aria-hidden="true" />
            Zoom out
          </button>
          <button
            type="button"
            onClick={() => go(level + 1)}
            disabled={level === LEVELS.length - 1}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-cyan text-sm font-semibold text-void hover:bg-cyan-soft disabled:opacity-40"
          >
            <ZoomIn className="size-4" aria-hidden="true" />
            Zoom in
          </button>
        </div>
      </div>
    </div>
  );
}

function Scene({ label, children }: { label: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 480 270" className="h-full w-full" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

function WireScene() {
  return (
    <Scene label="A coil of copper wire">
      <defs>
        <linearGradient id="copper-sheen" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f0b27a" />
          <stop offset="0.5" stopColor="#c47a3a" />
          <stop offset="1" stopColor="#7c4a1e" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse key={i} cx={200 + i * 14} cy={135} rx={46} ry={78} fill="none" stroke="url(#copper-sheen)" strokeWidth={9} />
      ))}
      <path d="M 300 135 C 340 135, 360 90, 420 80" fill="none" stroke="url(#copper-sheen)" strokeWidth={9} strokeLinecap="round" />
      <circle cx={420} cy={80} r={14} fill="none" stroke="#22d3ee" strokeWidth={2} strokeDasharray="3 3" />
    </Scene>
  );
}

function LatticeScene() {
  const atoms = [];
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 11; col++) {
      atoms.push({ x: 40 + col * 40 + (row % 2) * 20, y: 35 + row * 40 });
    }
  }
  return (
    <Scene label="Copper atoms packed in a regular pattern">
      {atoms.map((atom) => (
        <g key={`${atom.x}-${atom.y}`}>
          <circle cx={atom.x} cy={atom.y} r={17} fill="#d08a4f" fillOpacity={0.18} stroke="#d08a4f" strokeOpacity={0.5} />
          <circle cx={atom.x} cy={atom.y} r={4} fill="#fca5a5" />
        </g>
      ))}
      <circle cx={240} cy={155} r={24} fill="none" stroke="#22d3ee" strokeWidth={2} strokeDasharray="3 3" />
    </Scene>
  );
}

function AtomScene() {
  return (
    <Scene label="An atom: a small nucleus surrounded by electrons">
      <circle cx={240} cy={135} r={110} fill="url(#atom-cloud)" />
      <defs>
        <radialGradient id="atom-cloud">
          <stop offset="0" stopColor="#22d3ee" stopOpacity={0.18} />
          <stop offset="1" stopColor="#22d3ee" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={240} cy={135} rx={105} ry={40} fill="none" stroke="#34445a" strokeDasharray="3 5" />
      <ellipse cx={240} cy={135} rx={105} ry={40} fill="none" stroke="#34445a" strokeDasharray="3 5" transform="rotate(60 240 135)" />
      <ellipse cx={240} cy={135} rx={105} ry={40} fill="none" stroke="#34445a" strokeDasharray="3 5" transform="rotate(-60 240 135)" />
      <circle cx={240} cy={135} r={10} fill="#fca5a5" />
      {[
        [345, 135],
        [188, 45],
        [188, 225],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={7} fill="#67e8f9" style={{ filter: "drop-shadow(0 0 4px #22d3ee)" }} />
      ))}
      <circle cx={240} cy={135} r={22} fill="none" stroke="#22d3ee" strokeWidth={2} strokeDasharray="3 3" />
    </Scene>
  );
}

function NucleusScene() {
  const particles = [
    [240, 135, "p"], [262, 128, "n"], [226, 116, "n"], [250, 110, "p"], [218, 142, "p"], [234, 158, "n"],
    [258, 152, "p"], [276, 146, "n"], [206, 124, "p"], [270, 108, "n"], [244, 88, "p"], [224, 176, "n"],
  ] as const;
  return (
    <Scene label="A nucleus made of protons and neutrons clustered together">
      {particles.map(([x, y, kind]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r={15} fill={kind === "p" ? "#b91c1c" : "#475569"} stroke="#0b1018" strokeWidth={2} />
          {kind === "p" ? (
            <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={16} fontWeight={700} fill="#fecaca">
              +
            </text>
          ) : null}
        </g>
      ))}
      <g fontFamily="var(--font-mono)" fontSize={12}>
        <circle cx={360} cy={220} r={8} fill="#b91c1c" />
        <text x={374} y={224} fill="#e8eef6">
          proton (+)
        </text>
        <circle cx={360} cy={244} r={8} fill="#475569" />
        <text x={374} y={248} fill="#e8eef6">
          neutron (0)
        </text>
      </g>
    </Scene>
  );
}
