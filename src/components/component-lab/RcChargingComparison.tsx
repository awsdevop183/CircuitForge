"use client";

import { useState } from "react";
import { Pin, PinOff } from "lucide-react";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { Readout } from "@/components/ui/Readout";
import { capacitorChargeVoltage, timeConstant } from "@/lib/electronics";
import { formatFarads, formatFixed, formatOhms } from "@/lib/format";

const SUPPLY = 9;
const WINDOW = 10; // seconds shown
const W = 460;
const H = 220;
const PAD = { left: 40, right: 14, top: 14, bottom: 30 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;

const x = (t: number) => PAD.left + (Math.min(t, WINDOW) / WINDOW) * PLOT_W;
const y = (v: number) => PAD.top + PLOT_H - (v / SUPPLY) * PLOT_H;

function curve(tau: number) {
  return Array.from({ length: 121 }, (_, i) => {
    const t = (i / 120) * WINDOW;
    return `${i === 0 ? "M" : "L"} ${x(t).toFixed(1)} ${y(capacitorChargeVoltage(SUPPLY, t, tau)).toFixed(1)}`;
  }).join(" ");
}

function formatSeconds(s: number) {
  return s < 1 ? `${formatFixed(s * 1000, 0)} ms` : `${formatFixed(s, s < 10 ? 2 : 1)} s`;
}

/**
 * How resistance and capacitance set charging time: the curve rises quickly,
 * then levels off. Pin a curve to compare two RC combinations.
 */
export function RcChargingComparison() {
  const [resistance, setResistance] = useState(10_000);
  const [capacitance, setCapacitance] = useState(100e-6);
  const [pinned, setPinned] = useState<{ tau: number; label: string } | null>(null);
  const tau = timeConstant(resistance, capacitance);
  const energy = 0.5 * capacitance * SUPPLY * SUPPLY;

  return (
    <div>
      <div className="grid gap-px bg-line lg:grid-cols-[1.5fr_1fr]">
        <figure className="bg-surface-raised p-4 sm:p-5">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Capacitor charging curve. Time constant ${formatSeconds(tau)}: 63% charged after ${formatSeconds(tau)}, about 99% after ${formatSeconds(5 * tau)}.${pinned ? ` Pinned comparison curve: ${pinned.label}.` : ""}`}>
            {[0, SUPPLY * 0.632, SUPPLY].map((v) => (
              <g key={v}>
                <line x1={PAD.left} x2={W - PAD.right} y1={y(v)} y2={y(v)} stroke="#1a2432" strokeDasharray={v === 0 ? undefined : "3 5"} />
                <text x={PAD.left - 6} y={y(v)} textAnchor="end" dominantBaseline="central" fontSize={10} fill="#7f8ea4" fontFamily="var(--font-mono)">
                  {v === 0 ? "0" : v === SUPPLY ? `${SUPPLY}V` : "63%"}
                </text>
              </g>
            ))}
            {[0, 2, 4, 6, 8, 10].map((t) => (
              <text key={t} x={x(t)} y={H - 12} textAnchor="middle" fontSize={10} fill="#7f8ea4" fontFamily="var(--font-mono)">
                {t}s
              </text>
            ))}
            <text x={PAD.left + 4} y={PAD.top + 10} fontSize={10} fill="#a3b1c4">
              Voltage
            </text>
            <text x={W - PAD.right} y={H - 24} textAnchor="end" fontSize={10} fill="#a3b1c4">
              Time →
            </text>
            {pinned ? <path d={curve(pinned.tau)} fill="none" stroke="#f5a524" strokeWidth={2} strokeDasharray="6 4" /> : null}
            <path d={curve(tau)} fill="none" stroke="#22d3ee" strokeWidth={2.5} style={{ filter: "drop-shadow(0 0 4px #22d3ee)" }} />
            {tau <= WINDOW ? (
              <g>
                <line x1={x(tau)} x2={x(tau)} y1={y(0)} y2={y(SUPPLY * 0.632)} stroke="#e8eef6" strokeDasharray="2 4" />
                <circle cx={x(tau)} cy={y(SUPPLY * 0.632)} r={4.5} fill="#101722" stroke="#e8eef6" strokeWidth={2} />
                <text x={x(tau) + 6} y={y(SUPPLY * 0.632) + 14} fontSize={10} fill="#e8eef6">
                  1τ
                </text>
              </g>
            ) : null}
            {5 * tau <= WINDOW ? (
              <g>
                <line x1={x(5 * tau)} x2={x(5 * tau)} y1={y(0)} y2={y(SUPPLY)} stroke="#34d399" strokeDasharray="2 4" />
                <text x={x(5 * tau) + 4} y={y(SUPPLY) + 14} fontSize={10} fill="#34d399">
                  ≈ full (5τ)
                </text>
              </g>
            ) : null}
          </svg>
          <figcaption className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-subtle">
            <span>
              <span className="mr-1.5 inline-block h-0.5 w-5 bg-cyan align-middle" aria-hidden="true" />
              Current setting
            </span>
            {pinned ? (
              <span>
                <span className="mr-1.5 inline-block h-0 w-5 border-t-2 border-dashed border-amber align-middle" aria-hidden="true" />
                Pinned: {pinned.label}
              </span>
            ) : null}
          </figcaption>
        </figure>
        <div className="space-y-5 bg-surface-raised p-5">
          <InteractiveSlider label="Resistance (R)" value={resistance} min={1_000} max={100_000} scale="log" onChange={setResistance} format={(r) => formatOhms(r)} color="var(--color-electric)" />
          <InteractiveSlider label="Capacitance (C)" value={capacitance} min={10e-6} max={1000e-6} scale="log" onChange={setCapacitance} format={(c) => formatFarads(c)} color="var(--color-cyan)" />
          <div className="grid grid-cols-2 gap-2">
            <Readout label="τ = R × C" value={formatSeconds(tau)} tone="amber" size="sm" />
            <Readout label="≈ Full (5τ)" value={formatSeconds(5 * tau)} tone="positive" size="sm" />
          </div>
          <Readout label="Energy stored at 9 V" value={`${formatFixed(energy * 1000, energy < 0.01 ? 2 : 1)} mJ`} hint="E = ½ × C × V²" size="sm" />
          <button
            type="button"
            onClick={() => setPinned(pinned ? null : { tau, label: `${formatOhms(resistance)}, ${formatFarads(capacitance)}` })}
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-line-strong text-sm font-semibold text-ink hover:border-amber/60"
          >
            {pinned ? <PinOff className="size-4" aria-hidden="true" /> : <Pin className="size-4 text-amber" aria-hidden="true" />}
            {pinned ? "Unpin comparison" : "Pin this curve to compare"}
          </button>
        </div>
      </div>
      <p className="border-t border-line px-4 py-3 text-sm text-ink-muted sm:px-5" aria-live="polite">
        {tau > WINDOW / 5
          ? `Slow! With τ = ${formatSeconds(tau)} the capacitor needs about ${formatSeconds(5 * tau)} to fill — more resistance or more capacitance means slower charging.`
          : `Fast: 63% in ${formatSeconds(tau)}, practically full after ${formatSeconds(5 * tau)}. Bigger R or C would slow it down.`}
      </p>
    </div>
  );
}
