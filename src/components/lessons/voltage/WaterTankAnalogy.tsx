"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CircuitCanvas, CurrentFlow } from "@/components/circuit";
import { Slider } from "@/components/ui/Slider";

const TANK_TOP = 30;
const TANK_BOTTOM = 190;
const TANK_HEIGHT = TANK_BOTTOM - TANK_TOP;
const PIPE_Y = 176;
const LOW_LEVEL = 0.2;

/**
 * Voltage as a difference in "height". Water only flows between the tanks
 * when one is higher than the other — like charge between two points with a
 * potential difference.
 */
export function WaterTankAnalogy() {
  const [difference, setDifference] = useState(60);
  const highLevel = LOW_LEVEL + (difference / 100) * (1 - LOW_LEVEL - 0.05);
  const flowing = difference > 0;
  const levelY = (level: number) => TANK_BOTTOM - level * TANK_HEIGHT;

  return (
    <div className="grid gap-6 p-5 sm:p-8 md:grid-cols-[1.4fr_1fr] md:items-center">
      <CircuitCanvas
        viewBox="0 0 420 220"
        title="Water tank analogy for voltage"
        description={`The left tank is ${difference}% higher than the right tank. ${flowing ? "Water flows through the pipe from high to low." : "Both levels are equal, so no water flows."}`}
      >
        {/* Tanks */}
        {[40, 290].map((x) => (
          <rect key={x} x={x} y={TANK_TOP} width={90} height={TANK_HEIGHT} rx={6} fill="#0b1018" stroke="#34445a" strokeWidth={2} />
        ))}
        <motion.rect
          x={42}
          width={86}
          fill="#0ea5e9"
          fillOpacity={0.5}
          initial={false}
          animate={{ y: levelY(highLevel), height: highLevel * TANK_HEIGHT - 2 }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
        <rect x={292} y={levelY(LOW_LEVEL)} width={86} height={LOW_LEVEL * TANK_HEIGHT - 2} fill="#0ea5e9" fillOpacity={0.5} />

        {/* Height difference marker */}
        <motion.g initial={false} animate={{ opacity: flowing ? 1 : 0.3 }}>
          <motion.line
            x1={210}
            x2={210}
            y1={levelY(LOW_LEVEL)}
            initial={false}
            animate={{ y2: levelY(highLevel) }}
            stroke="#f5a524"
            strokeWidth={2}
            strokeDasharray="4 4"
          />
          <motion.line x1={128} x2={290} initial={false} animate={{ y1: levelY(highLevel), y2: levelY(highLevel) }} stroke="#f5a524" strokeOpacity={0.5} strokeDasharray="2 5" />
          <line x1={128} x2={290} y1={levelY(LOW_LEVEL)} y2={levelY(LOW_LEVEL)} stroke="#f5a524" strokeOpacity={0.5} strokeDasharray="2 5" />
          <motion.text
            x={218}
            initial={false}
            animate={{ y: (levelY(LOW_LEVEL) + levelY(highLevel)) / 2 }}
            dominantBaseline="central"
            fontSize={11}
            fill="#f5a524"
            fontFamily="var(--font-mono)"
          >
            height difference
          </motion.text>
        </motion.g>

        {/* Pipe */}
        <rect x={130} y={PIPE_Y - 9} width={160} height={18} fill="#0b1018" stroke="#34445a" strokeWidth={2} />
        <CurrentFlow d={`M 132 ${PIPE_Y} L 288 ${PIPE_Y}`} active={flowing} speed={8 + difference * 1.4} spacing={16} size={6} color="#7dd3fc" />
        <text x={85} y={212} textAnchor="middle" fontSize={11} fill="#94a3b8" fontFamily="var(--font-mono)">HIGH</text>
        <text x={335} y={212} textAnchor="middle" fontSize={11} fill="#94a3b8" fontFamily="var(--font-mono)">LOW</text>
      </CircuitCanvas>

      <div className="space-y-5">
        <Slider
          label="Height difference"
          value={difference}
          min={0}
          max={100}
          step={5}
          onChange={setDifference}
          format={(v) => `${v}%`}
          color="var(--color-amber)"
        />
        <dl className="space-y-2 text-sm">
          {[
            ["Height difference", "Voltage"],
            ["Water flow", "Current"],
            ["Pipe", "Wire"],
          ].map(([water, electric]) => (
            <div key={water} className="flex items-center justify-between gap-3 rounded-lg border border-line bg-void/40 px-3 py-2">
              <dt className="text-ink-muted">{water}</dt>
              <dd className="font-mono text-cyan">≈ {electric}</dd>
            </div>
          ))}
        </dl>
        <p className="text-sm text-ink-muted" aria-live="polite">
          {flowing
            ? "The bigger the difference, the harder the push and the faster the flow."
            : "Same height on both sides: no difference, no push, no flow."}
        </p>
      </div>
    </div>
  );
}
