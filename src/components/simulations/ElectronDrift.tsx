"use client";

import { useRef, useState } from "react";
import { useAnimationFrame, useInView, useReducedMotion } from "framer-motion";
import { ArrowLeft, Plug, Unplug } from "lucide-react";
import { cn } from "@/lib/cn";

const WIDTH = 480;
const HEIGHT = 170;
const WIRE_TOP = 40;
const WIRE_BOTTOM = 130;
const COUNT = 30;
/** Drift speed towards the + terminal (exaggerated so it's visible). */
const DRIFT = 45;
const JITTER = 70;

interface Electron {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/** Deterministic starting positions so server and client render the same thing. */
function initialElectrons(): Electron[] {
  return Array.from({ length: COUNT }, (_, i) => ({
    x: 30 + ((i * 137) % 420),
    y: WIRE_TOP + 10 + ((i * 53) % (WIRE_BOTTOM - WIRE_TOP - 20)),
    vx: ((i * 7) % 5) - 2,
    vy: ((i * 11) % 5) - 2,
  }));
}

const IONS = Array.from({ length: 24 }, (_, i) => ({ x: 40 + (i % 12) * 36, y: i < 12 ? 64 : 106 }));

/**
 * Free electrons in a wire always jiggle randomly — but that goes nowhere on
 * average. Connect a battery and they all gain a slow drift in one direction:
 * that drift is an electric current.
 */
export function ElectronDrift() {
  const [connected, setConnected] = useState(false);
  const [electrons, setElectrons] = useState<Electron[]>(initialElectrons);
  const [passed, setPassed] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduceMotion = useReducedMotion();

  useAnimationFrame((_, delta) => {
    if (!inView || reduceMotion) return;
    const dt = Math.min(delta, 50) / 1000;
    let crossed = 0;
    const next = electrons.map((e) => {
        // Random thermal jiggle: nudge velocity, keep it bounded.
        let vx = clampVelocity(e.vx + (Math.random() - 0.5) * JITTER * dt * 8);
        let vy = clampVelocity(e.vy + (Math.random() - 0.5) * JITTER * dt * 8);
        let x = e.x + (vx - (connected ? DRIFT : 0)) * dt;
        let y = e.y + vy * dt;
        if (y < WIRE_TOP + 6 || y > WIRE_BOTTOM - 6) {
          vy = -vy;
          y = Math.min(WIRE_BOTTOM - 6, Math.max(WIRE_TOP + 6, y));
        }
        if (x < 12) {
          x += WIDTH - 24;
          crossed += 1;
        } else if (x > WIDTH - 12) {
          x -= WIDTH - 24;
          vx = -Math.abs(vx);
        }
        return { x, y, vx, vy };
      });
    setElectrons(next);
    if (crossed > 0) setPassed((p) => p + crossed);
  });

  return (
    <div ref={ref}>
      <div className="bg-breadboard px-2 py-4 sm:px-6">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="mx-auto h-auto w-full max-w-2xl" role="img" aria-label={connected ? "A wire connected to a battery: the free electrons still jiggle, but now all drift towards the positive end." : "A wire on its own: free electrons jiggle randomly in every direction but go nowhere overall."}>
          <rect x={8} y={WIRE_TOP} width={WIDTH - 16} height={WIRE_BOTTOM - WIRE_TOP} rx={20} fill="#d08a4f" fillOpacity={0.12} stroke="#d08a4f" strokeOpacity={0.45} />
          {IONS.map((ion) => (
            <g key={`${ion.x}-${ion.y}`} aria-hidden="true">
              <circle cx={ion.x} cy={ion.y} r={9} fill="#1e293b" stroke="#475569" />
              <text x={ion.x} y={ion.y} textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={700} fill="#fca5a5">
                +
              </text>
            </g>
          ))}
          {electrons.map((e, i) => (
            <circle key={i} cx={e.x} cy={e.y} r={4.5} fill="#67e8f9" style={{ filter: "drop-shadow(0 0 3px #22d3ee)" }} />
          ))}
          <g fontFamily="var(--font-mono)" fontSize={13} fontWeight={700}>
            <text x={16} y={24} fill={connected ? "#f87171" : "#475569"}>
              {connected ? "+ battery" : "(no battery)"}
            </text>
            <text x={WIDTH - 16} y={24} textAnchor="end" fill={connected ? "#60a5fa" : "#475569"}>
              {connected ? "battery −" : ""}
            </text>
          </g>
          {connected ? (
            <g aria-hidden="true" stroke="#22d3ee" strokeWidth={2} fill="none" opacity={0.8}>
              <path d={`M ${WIDTH / 2 + 40} ${HEIGHT - 14} L ${WIDTH / 2 - 40} ${HEIGHT - 14}`} />
              <path d={`M ${WIDTH / 2 - 32} ${HEIGHT - 20} L ${WIDTH / 2 - 40} ${HEIGHT - 14} L ${WIDTH / 2 - 32} ${HEIGHT - 8}`} />
            </g>
          ) : null}
        </svg>
      </div>
      <div className="flex flex-col gap-3 border-t border-line p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <p className="flex items-center gap-2 text-sm text-ink-muted" aria-live="polite">
          {connected ? <ArrowLeft className="size-4 shrink-0 text-cyan" aria-hidden="true" /> : null}
          {connected
            ? `Drifting towards + … ${passed} electrons have reached the + end so far.`
            : "Random jiggling only — as many electrons go left as right, so there's no current."}
        </p>
        <button
          type="button"
          aria-pressed={connected}
          onClick={() => {
            setConnected((c) => !c);
            setPassed(0);
          }}
          className={cn(
            "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold",
            connected ? "border border-line-strong text-ink hover:border-amber/60" : "bg-cyan text-void hover:bg-cyan-soft",
          )}
        >
          {connected ? <Unplug className="size-4" aria-hidden="true" /> : <Plug className="size-4" aria-hidden="true" />}
          {connected ? "Disconnect the battery" : "Connect a battery"}
        </button>
      </div>
    </div>
  );
}

function clampVelocity(v: number) {
  return Math.max(-60, Math.min(60, v));
}
