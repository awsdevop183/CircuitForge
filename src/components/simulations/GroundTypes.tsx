"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TriangleAlert, Zap } from "lucide-react";
import {
  Battery,
  CircuitCanvas,
  CircuitLabel,
  CurrentFlow,
  Ground,
  Lamp,
  Led,
  Resistor,
  Wire,
  type GroundKind,
} from "@/components/circuit";
import { SegmentedControl } from "@/components/ui/SegmentedControl";

const INFO: Record<GroundKind, { title: string; symbolName: string; summary: string; points: string[] }> = {
  reference: {
    title: "Circuit reference (0 V, “common”)",
    symbolName: "Signal / reference ground",
    summary: "The point in a circuit that everyone agrees to call 0 V. Every other voltage is measured from here.",
    points: [
      "In a battery circuit it's usually the battery's − terminal.",
      "Schematics draw many ground symbols to avoid messy wires — all of them are the same connected node.",
      "It has nothing to do with the Earth: a phone or torch has a 0 V reference but no connection to the soil.",
    ],
  },
  earth: {
    title: "Earth ground (protective earth)",
    symbolName: "Earth ground",
    summary: "A real wire connected to a metal rod or pipe buried in the soil. Used in buildings for safety.",
    points: [
      "The metal case of an appliance is wired to earth through the plug's earth pin.",
      "If a fault makes the case live, current rushes to earth instead of through a person — and trips the fuse or breaker.",
      "This is mains wiring: only qualified electricians work on it.",
    ],
  },
  chassis: {
    title: "Chassis ground",
    symbolName: "Chassis ground",
    summary: "The metal frame or body of a piece of equipment, used as a shared connection.",
    points: [
      "In a car, the battery's − terminal is bolted to the metal body. The body carries current back from the lights and radio.",
      "The car isn't connected to the Earth at all — rubber tyres insulate it from the road.",
      "Computer cases and metal enclosures are often tied to the circuit's 0 V as well.",
    ],
  },
};

/** Three meanings of "ground", each with its own diagram. */
export function GroundTypes() {
  const [kind, setKind] = useState<GroundKind>("reference");
  const info = INFO[kind];

  return (
    <div>
      <div className="border-b border-line p-4 sm:p-5">
        <SegmentedControl
          label="Which kind of ground?"
          options={[
            { value: "reference" as const, label: "Circuit 0 V" },
            { value: "earth" as const, label: "Earth" },
            { value: "chassis" as const, label: "Chassis" },
          ]}
          value={kind}
          onChange={setKind}
        />
      </div>
      <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-[1.3fr_1fr]">
        <div className="bg-breadboard flex items-center px-2 py-4 sm:px-5">
          <AnimatePresence mode="wait">
            <motion.div key={kind} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
              {kind === "reference" ? <ReferenceDiagram /> : kind === "earth" ? <EarthDiagram /> : <ChassisDiagram />}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="bg-surface-raised p-5">
          <div className="flex items-center gap-4">
            <svg viewBox="-30 -8 60 48" className="h-12 w-16 shrink-0" aria-hidden="true">
              <GroundSymbolStatic kind={kind} />
            </svg>
            <div>
              <p className="eyebrow text-ink-subtle">Symbol</p>
              <p className="font-medium text-ink">{info.symbolName}</p>
            </div>
          </div>
          <p className="mt-4 font-display text-lg font-semibold text-ink">{info.title}</p>
          <p className="mt-2 text-sm text-ink-muted">{info.summary}</p>
          <ul className="mt-4 space-y-2">
            {info.points.map((point) => (
              <li key={point} className="flex gap-2 text-sm text-ink-muted">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-cyan" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** Plain (non-interactive) copy of the ground glyphs for the legend. */
function GroundSymbolStatic({ kind }: { kind: GroundKind }) {
  return (
    <g stroke="#cbd5e1" strokeWidth={2.75} strokeLinecap="round" fill="none">
      <line x1={0} y1={-6} x2={0} y2={16} />
      {kind === "reference" ? (
        <path d="M -13 16 L 13 16 L 0 30 Z" strokeLinejoin="round" />
      ) : kind === "earth" ? (
        <>
          <line x1={-15} y1={16} x2={15} y2={16} />
          <line x1={-9} y1={22} x2={9} y2={22} />
          <line x1={-3.5} y1={28} x2={3.5} y2={28} />
        </>
      ) : (
        <>
          <line x1={-15} y1={16} x2={15} y2={16} />
          {[-15, -5, 5, 15].map((x) => (
            <line key={x} x1={x} y1={16} x2={x - 7} y2={27} />
          ))}
        </>
      )}
    </g>
  );
}

function ReferenceDiagram() {
  return (
    <CircuitCanvas
      viewBox="0 0 420 230"
      interactive
      title="Circuit reference ground"
      description="A battery, resistor and LED. The battery's negative terminal and the LED's lower end each connect to a ground symbol. Both symbols are the same 0 volt node."
    >
      <Wire points={[[70, 60], [70, 30], [300, 30], [300, 60]]} energized />
      <Wire points={[[70, 140], [70, 160]]} energized />
      <Wire points={[[300, 140], [300, 160]]} energized />
      <CurrentFlow d="M 70 60 L 70 30 L 300 30 L 300 60" active speed={30} />
      <Battery x={70} y={100} rotation={-90} detail="9 V" energized labelPlacement="right" labelOffset={26} />
      <Resistor x={185} y={30} detail="470 Ω" energized labelPlacement="bottom" labelOffset={22} />
      <Led x={300} y={100} rotation={90} brightness={0.8} color="#fb7185" labelPlacement="left" labelOffset={32} />
      <Ground x={70} y={160} />
      <Ground x={300} y={160} />
      <path d="M 70 200 L 70 212 L 300 212 L 300 200" fill="none" stroke="#34d399" strokeWidth={1.5} strokeDasharray="4 5" aria-hidden="true" />
      <CircuitLabel x={185} y={206} text="SAME 0 V NODE — WIRE NOT DRAWN" tone="success" size={10} decorative />
      <CircuitLabel x={330} y={96} text="0 V" value="reference" anchor="start" tone="success" decorative />
    </CircuitCanvas>
  );
}

function EarthDiagram() {
  const [fault, setFault] = useState(false);
  const faultPath = "M 150 120 L 150 150 L 250 150 L 250 175 L 330 175 L 330 196";
  return (
    <div>
      <CircuitCanvas
        viewBox="0 0 420 250"
        interactive
        title="Protective earth in a building"
        description={
          fault
            ? "A fault has made the appliance's metal case live. Current flows through the earth wire into the ground rod instead of through a person, which trips the protection."
            : "An appliance with a metal case. Its earth wire runs through the plug and the building wiring to a metal rod driven into the soil."
        }
      >
        {/* Soil */}
        <rect x={0} y={196} width={420} height={54} fill="#5b3a1e" fillOpacity={0.35} />
        <text x={12} y={240} fontSize={10} fill="#d6a77a" fontFamily="var(--font-mono)" aria-hidden="true">
          SOIL
        </text>
        {/* Appliance */}
        <rect x={80} y={40} width={140} height={80} rx={8} fill="#1e293b" stroke={fault ? "#f87171" : "#94a3b8"} strokeWidth={2.5} />
        <text x={150} y={76} textAnchor="middle" fontSize={11} fill="#cbd5e1" fontFamily="var(--font-mono)" aria-hidden="true">
          METAL CASE
        </text>
        <text x={150} y={92} textAnchor="middle" fontSize={9} fill="#94a3b8" fontFamily="var(--font-mono)" aria-hidden="true">
          (e.g. a washing machine)
        </text>
        {fault ? (
          <motion.g animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.6, repeat: Infinity }} aria-hidden="true">
            <path d="M 210 48 l 8 -10 l -4 10 l 8 -6" stroke="#fde68a" strokeWidth={2} fill="none" />
          </motion.g>
        ) : null}
        {/* Earth wire: case → wall → rod */}
        <Wire d={faultPath} energized={fault} color="#34d399" />
        <CurrentFlow d={faultPath} active={fault} speed={70} color="#fca5a5" />
        <rect x={236} y={126} width={28} height={40} rx={4} fill="#0f1621" stroke="#64748b" />
        <text x={276} y={140} fontSize={9} fill="#94a3b8" fontFamily="var(--font-mono)" aria-hidden="true">
          WALL SOCKET
        </text>
        <text x={276} y={152} fontSize={9} fill="#34d399" fontFamily="var(--font-mono)" aria-hidden="true">
          earth pin
        </text>
        {/* Earth rod driven into the soil */}
        <Ground kind="earth" x={330} y={196} name="Earth rod in the soil" />
        <text x={354} y={216} fontSize={9} fill="#e8eef6" fontFamily="var(--font-mono)" aria-hidden="true">
          EARTH ROD
        </text>
      </CircuitCanvas>
      <div className="mt-2 flex justify-center">
        <button
          type="button"
          aria-pressed={fault}
          onClick={() => setFault((f) => !f)}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line-strong px-3 text-sm font-semibold text-ink hover:border-negative/60"
        >
          {fault ? <TriangleAlert className="size-4 text-negative" aria-hidden="true" /> : <Zap className="size-4 text-amber" aria-hidden="true" />}
          {fault ? "Clear the fault" : "Show what happens in a fault"}
        </button>
      </div>
    </div>
  );
}

function ChassisDiagram() {
  const feed = "M 150 100 L 150 88 L 290 88 L 290 100";
  const returnPath = "M 290 188 L 290 198 L 150 198 L 150 188";
  return (
    <CircuitCanvas
      viewBox="0 0 420 262"
      interactive
      title="Chassis ground in a car"
      description="A car battery's positive terminal feeds a headlamp through a wire. The battery's negative terminal and the lamp's other side are both bolted to the metal car body, which carries the current back."
    >
      {/* Car body outline = the chassis */}
      <path d="M 30 205 L 30 130 L 80 120 L 130 70 L 310 70 L 350 120 L 395 130 L 395 205 Z" fill="#1e293b" fillOpacity={0.5} stroke="#94a3b8" strokeWidth={2.5} strokeLinejoin="round" />
      <circle cx={85} cy={214} r={16} fill="#0b1018" stroke="#475569" strokeWidth={5} />
      <circle cx={340} cy={214} r={16} fill="#0b1018" stroke="#475569" strokeWidth={5} />
      <text x={212} y={252} textAnchor="middle" fontSize={9} fill="#94a3b8" fontFamily="var(--font-mono)" aria-hidden="true">
        rubber tyres — no connection to the Earth
      </text>
      <text x={220} y={148} textAnchor="middle" fontSize={10} fill="#cbd5e1" fontFamily="var(--font-mono)" aria-hidden="true">
        METAL CAR BODY
      </text>
      <text x={220} y={162} textAnchor="middle" fontSize={10} fill="#cbd5e1" fontFamily="var(--font-mono)" aria-hidden="true">
        (CHASSIS)
      </text>
      <Wire d={feed} energized />
      <CurrentFlow d={feed} active speed={40} />
      {/* Return current through the body itself */}
      <CurrentFlow d={returnPath} active speed={40} color="#fcd34d" intensity={0.85} />
      <Battery x={150} y={140} rotation={-90} detail="12 V" energized labelPlacement="right" labelOffset={26} />
      <Lamp x={290} y={140} rotation={90} brightness={0.9} name="Headlamp" labelPlacement="left" labelOffset={36} />
      <Ground kind="chassis" x={150} y={180} name="Battery − bolted to chassis" />
      <Ground kind="chassis" x={290} y={180} name="Lamp bolted to chassis" />
      <CircuitLabel x={220} y={82} text="+12 V WIRE" tone="cyan" size={10} decorative />
      <CircuitLabel x={220} y={192} text="RETURN VIA BODY" tone="amber" size={10} decorative />
    </CircuitCanvas>
  );
}
