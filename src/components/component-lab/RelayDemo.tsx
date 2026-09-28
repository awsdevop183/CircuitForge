"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Power } from "lucide-react";
import { Battery, CircuitCanvas, CurrentFlow, Lamp, Switch, Wire } from "@/components/circuit";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { cn } from "@/lib/cn";

type Contact = "NO" | "NC";

// Relay geometry: coil at left-centre, armature pivot at (270, 250)
const COIL_X = 170;
const PIVOT = { x: 280, y: 250 };
const NO_CONTACT = { x: 330, y: 150 };
const NC_CONTACT = { x: 250, y: 150 };

/**
 * A 5 V coil circuit switches a completely separate 12 V lamp circuit. The
 * only link between them is magnetic.
 */
export function RelayDemo() {
  const [coilOn, setCoilOn] = useState(false);
  const [wiredTo, setWiredTo] = useState<Contact>("NO");
  // Energised: armature pulled to NO. De-energised: rests on NC.
  const touching: Contact = coilOn ? "NO" : "NC";
  const loadOn = touching === wiredTo;
  const armTip = touching === "NO" ? NO_CONTACT : NC_CONTACT;
  const loadContact = wiredTo === "NO" ? NO_CONTACT : NC_CONTACT;

  return (
    <div>
      <div className="bg-breadboard px-2 py-4 sm:px-5">
        <CircuitCanvas
          viewBox="0 0 520 330"
          interactive
          title="Relay: a low-voltage circuit switching a separate load"
          description={`The coil is ${coilOn ? "energised" : "off"}, so the armature touches the ${touching} contact. The lamp is wired to ${wiredTo}, so it is ${loadOn ? "on" : "off"}.`}
          className="mx-auto max-w-2xl"
        >
          {/* Control circuit (left) */}
          <Wire points={[[50, 110], [50, 40], [COIL_X, 40], [COIL_X, 120]]} energized={coilOn} />
          <Wire points={[[COIL_X, 200], [COIL_X, 290], [50, 290], [50, 190]]} energized={coilOn} />
          <CurrentFlow d={`M 50 110 L 50 40 L ${COIL_X} 40 L ${COIL_X} 290 L 50 290 L 50 190`} active={coilOn} speed={40} />
          <Battery x={50} y={150} rotation={-90} detail="5 V control" energized={coilOn} labelPlacement="right" labelOffset={26} />
          <Switch x={110} y={290} closed={coilOn} onToggle={() => setCoilOn((c) => !c)} name="Control switch" labelPlacement="top" labelOffset={30} />
          {/* Coil */}
          <g aria-hidden="true">
            <rect x={COIL_X - 18} y={120} width={36} height={80} rx={4} fill="#101722" stroke={coilOn ? "#a5f3fc" : "#cbd5e1"} strokeWidth={2.5} />
            {[132, 146, 160, 174, 188].map((yy) => (
              <path key={yy} d={`M ${COIL_X - 18} ${yy} q 18 -8 36 0`} fill="none" stroke={coilOn ? "#22d3ee" : "#64748b"} strokeWidth={2} />
            ))}
            <motion.g initial={false} animate={{ opacity: coilOn ? 1 : 0 }}>
              {[0, 1].map((i) => (
                <path key={i} d={`M ${COIL_X + 24 + i * 10} 130 q 16 30 0 60`} fill="none" stroke="#22d3ee" strokeWidth={1.5} strokeDasharray="3 4" />
              ))}
            </motion.g>
            <text x={COIL_X} y={112} textAnchor="middle" fontSize={10} fill="#94a3b8" fontFamily="var(--font-mono)">COIL</text>
          </g>

          {/* Isolation boundary */}
          <line x1={225} x2={225} y1={20} y2={315} stroke="#f5a524" strokeDasharray="5 6" strokeOpacity={0.6} aria-hidden="true" />
          <text x={225} y={14} textAnchor="middle" fontSize={9} fill="#f5a524" fontFamily="var(--font-mono)" aria-hidden="true">
            ISOLATION — NO ELECTRICAL CONNECTION
          </text>

          {/* Load circuit (right): 12 V → COM (pivot) → contact → lamp → back */}
          <Wire points={[[480, 190], [480, 290], [PIVOT.x, 290], [PIVOT.x, PIVOT.y]]} energized={loadOn} />
          <Wire points={[[loadContact.x, loadContact.y], [loadContact.x, 60], [400, 60]]} energized={loadOn} />
          <Wire points={[[440, 60], [480, 60], [480, 110]]} energized={loadOn} />
          {/* Conventional current leaves the + terminal (bottom, since the battery is rotated) */}
          <CurrentFlow d={`M 480 190 L 480 290 L ${PIVOT.x} 290 L ${PIVOT.x} ${PIVOT.y} L ${loadContact.x} ${loadContact.y} L ${loadContact.x} 60 L 480 60 L 480 110`} active={loadOn} speed={50} />
          <Battery x={480} y={150} rotation={90} detail="12 V load supply" energized={loadOn} labelPlacement="left" labelOffset={26} />
          <Lamp x={420} y={60} brightness={loadOn ? 0.9 : 0} name="Load (lamp)" labelOffset={36} />
          {/* Contacts and armature */}
          <g aria-hidden="true">
            {[
              { c: NC_CONTACT, label: "NC" },
              { c: NO_CONTACT, label: "NO" },
            ].map(({ c, label }) => (
              <g key={label}>
                <circle cx={c.x} cy={c.y} r={5} fill="#101722" stroke={label === wiredTo ? "#f5a524" : "#64748b"} strokeWidth={2.5} />
                <text x={c.x + (label === "NO" ? 10 : -10)} y={c.y + 4} textAnchor={label === "NO" ? "start" : "end"} fontSize={11} fontWeight={700} fill={label === wiredTo ? "#f5a524" : "#94a3b8"} fontFamily="var(--font-mono)">
                  {label}
                </text>
              </g>
            ))}
            <motion.line x1={PIVOT.x} y1={PIVOT.y} initial={false} animate={{ x2: armTip.x, y2: armTip.y + 5 }} transition={{ type: "spring", stiffness: 300, damping: 18 }} stroke={loadOn ? "#a5f3fc" : "#cbd5e1"} strokeWidth={4} strokeLinecap="round" />
            <circle cx={PIVOT.x} cy={PIVOT.y} r={5} fill="#cbd5e1" />
            <text x={PIVOT.x + 10} y={PIVOT.y + 14} fontSize={10} fill="#94a3b8" fontFamily="var(--font-mono)">COM</text>
          </g>
        </CircuitCanvas>
      </div>
      <div className="grid gap-4 border-t border-line p-4 sm:p-5 md:grid-cols-[auto_1fr] md:items-end">
        <button
          type="button"
          aria-pressed={coilOn}
          onClick={() => setCoilOn((c) => !c)}
          className={cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold", coilOn ? "border border-line-strong text-ink" : "bg-cyan text-void hover:bg-cyan-soft")}
        >
          <Power className="size-4" aria-hidden="true" />
          {coilOn ? "Turn the coil OFF" : "Turn the coil ON"}
        </button>
        <SegmentedControl
          label="Wire the lamp to the…"
          options={[
            { value: "NO" as const, label: "NO contact (normally open)" },
            { value: "NC" as const, label: "NC contact (normally closed)" },
          ]}
          value={wiredTo}
          onChange={setWiredTo}
          size="sm"
        />
      </div>
      <div className="grid gap-2 border-t border-line p-4 font-mono text-sm sm:grid-cols-3 sm:p-5" aria-live="polite">
        <p className="rounded-lg border border-line bg-void/40 px-3 py-2 text-ink-muted">
          Coil: <span className={coilOn ? "text-cyan" : "text-ink"}>{coilOn ? "ON" : "OFF"}</span>
        </p>
        <p className="rounded-lg border border-line bg-void/40 px-3 py-2 text-ink-muted">
          NO contact → <span className={coilOn ? "text-cyan" : "text-ink"}>{coilOn ? "CLOSED" : "OPEN"}</span>
        </p>
        <p className="rounded-lg border border-line bg-void/40 px-3 py-2 text-ink-muted">
          Lamp: <span className={loadOn ? "text-positive" : "text-ink"}>{loadOn ? "ON" : "OFF"}</span>
        </p>
      </div>
    </div>
  );
}
