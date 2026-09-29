"use client";

import { useState } from "react";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { LOGIC_FAMILIES, voltageToLevel } from "@/lib/digital";
import { formatFixed } from "@/lib/format";
import { cn } from "@/lib/cn";
import { LOGIC_COLORS } from "./constants";

type View = "simple" | "real";
type FamilyId = keyof typeof LOGIC_FAMILIES;

const H = 280;
const TOP = 20;
const BOTTOM = 250;

/**
 * Logic levels, twice: the beginner picture (LOW → 0, HIGH → 1) and the real
 * one, where each input accepts a *range* of voltages and the ranges depend on
 * the device.
 */
export function LogicLevelsExplorer() {
  const [view, setView] = useState<View>("simple");
  const [familyId, setFamilyId] = useState<FamilyId>("5v");
  const [volts, setVolts] = useState(4.2);
  const family = LOGIC_FAMILIES[familyId];
  const v = Math.min(volts, family.supply);
  const reading = voltageToLevel(v, family);
  const y = (value: number) => BOTTOM - (value / family.supply) * (BOTTOM - TOP);

  return (
    <div>
      <div className="border-b border-line p-4 sm:p-5">
        <SegmentedControl
          label="View"
          options={[
            { value: "simple" as const, label: "Simple picture" },
            { value: "real" as const, label: "Real voltage ranges" },
          ]}
          value={view}
          onChange={setView}
          size="sm"
        />
      </div>
      {view === "simple" ? (
        <div className="grid grid-cols-1 gap-4 bg-logic-grid p-5 sm:grid-cols-2 sm:p-8">
          <div className="flex items-center gap-4 rounded-2xl border border-line-strong bg-void/50 p-5">
            <span className="font-mono text-xl font-bold text-ink-muted">LOW</span>
            <span className="text-ink-subtle" aria-hidden="true">→</span>
            <span className="flex size-16 items-center justify-center rounded-full border-2 border-line-strong font-mono text-3xl font-bold text-ink-subtle">0</span>
            <span className="text-sm text-ink-muted">a voltage near 0 V</span>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-logic/50 bg-logic/10 p-5">
            <span className="font-mono text-xl font-bold text-logic">HIGH</span>
            <span className="text-ink-subtle" aria-hidden="true">→</span>
            <span className="flex size-16 items-center justify-center rounded-full border-2 border-logic font-mono text-3xl font-bold text-logic shadow-[0_0_24px_-4px_rgb(163_230_53/0.8)]">1</span>
            <span className="text-sm text-ink-muted">a voltage near the supply</span>
          </div>
          <p className="text-sm text-ink-muted sm:col-span-2">
            This is the idea to hold on to. But &ldquo;near 0 V&rdquo; and &ldquo;near the supply&rdquo; are ranges — switch to the real view to see them.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-[auto_1fr]">
          <div className="flex justify-center bg-logic-grid p-4 sm:p-6">
            <svg viewBox={`0 0 260 ${H}`} className="h-72 w-auto" role="img" aria-label={`Input voltage ranges for ${family.name}: LOW up to ${family.inputLowMax} volts, HIGH from ${family.inputHighMin} volts. ${formatFixed(v, 2)} volts reads as ${reading === "UNDEFINED" ? "not guaranteed" : reading}.`}>
              {/* Zones */}
              <rect x={70} y={y(family.inputLowMax)} width={70} height={BOTTOM - y(family.inputLowMax)} fill="#1e293b" stroke="#475569" />
              <rect x={70} y={y(family.inputHighMin)} width={70} height={y(family.inputLowMax) - y(family.inputHighMin)} fill="url(#undefined-hatch)" stroke={LOGIC_COLORS.clock} />
              <rect x={70} y={TOP} width={70} height={y(family.inputHighMin) - TOP} fill="rgb(163 230 53 / 0.2)" stroke={LOGIC_COLORS.high} />
              <defs>
                <pattern id="undefined-hatch" width={8} height={8} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <rect width={8} height={8} fill="rgb(167 139 250 / 0.12)" />
                  <line x1={0} y1={0} x2={0} y2={8} stroke="rgb(167 139 250 / 0.5)" strokeWidth={2} />
                </pattern>
              </defs>
              <g fontFamily="var(--font-mono)" fontSize={11} fontWeight={700}>
                <text x={150} y={(TOP + y(family.inputHighMin)) / 2 + 4} fill={LOGIC_COLORS.high}>
                  HIGH → 1
                </text>
                <text x={150} y={(y(family.inputHighMin) + y(family.inputLowMax)) / 2 - 4} fill={LOGIC_COLORS.clock}>
                  not
                </text>
                <text x={150} y={(y(family.inputHighMin) + y(family.inputLowMax)) / 2 + 10} fill={LOGIC_COLORS.clock}>
                  guaranteed
                </text>
                <text x={150} y={(y(family.inputLowMax) + BOTTOM) / 2 + 4} fill={LOGIC_COLORS.lowText}>
                  LOW → 0
                </text>
                {[0, family.inputLowMax, family.inputHighMin, family.supply].map((mark) => (
                  <text key={mark} x={62} y={y(mark) + 4} textAnchor="end" fill="#94a3b8" fontWeight={400}>
                    {formatFixed(mark, 1)} V
                  </text>
                ))}
              </g>
              {/* Marker */}
              <g style={{ transition: "transform 0.2s" }} transform={`translate(0 ${y(v)})`}>
                <line x1={64} x2={146} y1={0} y2={0} stroke="#ffffff" strokeWidth={2.5} />
                <path d="M 58 -6 L 66 0 L 58 6 Z" fill="#ffffff" />
              </g>
            </svg>
          </div>
          <div className="space-y-4 bg-surface-raised p-4 sm:p-5">
            <SegmentedControl
              label="Example device family"
              options={(Object.keys(LOGIC_FAMILIES) as FamilyId[]).map((id) => ({ value: id, label: `${LOGIC_FAMILIES[id].supply} V logic`, ariaLabel: LOGIC_FAMILIES[id].name }))}
              value={familyId}
              onChange={(id) => {
                setFamilyId(id);
                setVolts(Math.min(volts, LOGIC_FAMILIES[id].supply));
              }}
              size="sm"
            />
            <InteractiveSlider label="Input voltage" value={v} min={0} max={family.supply} step={0.05} onChange={setVolts} format={(x) => `${formatFixed(x, 2)} V`} color="var(--color-logic)" />
            <p
              className={cn(
                "rounded-xl border p-4 text-lg font-semibold",
                reading === "HIGH" ? "border-logic/50 bg-logic/10 text-logic" : reading === "LOW" ? "border-line-strong bg-void/40 text-ink" : "border-clock/50 bg-clock/10 text-clock",
              )}
              role="status"
            >
              {formatFixed(v, 2)} V reads as {reading === "HIGH" ? "HIGH → 1" : reading === "LOW" ? "LOW → 0" : "…not guaranteed! It might read as 0 or 1."}
            </p>
            <p className="text-sm text-ink-muted">
              {family.name}: example input thresholds. HIGH does <strong className="text-ink">not</strong> mean exactly {family.supply} V — any voltage above {family.inputHighMin} V counts. Real thresholds differ from device to device, so engineers check each part&apos;s datasheet.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
