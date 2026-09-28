"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck, CircleSlash, CircleDot } from "lucide-react";
import {
  Battery,
  CircuitCanvas,
  CircuitLabel,
  CurrentFlow,
  Lamp,
  Wire,
  rectLoop,
} from "@/components/circuit";
import { cn } from "@/lib/cn";

type MaterialClass = "conductor" | "partial" | "insulator";

interface Material {
  id: string;
  name: string;
  kind: MaterialClass;
  /** 0–1: how well it conducts in this simple tester. */
  conductivity: number;
  color: string;
  note: string;
}

const MATERIALS: readonly Material[] = [
  { id: "copper", name: "Copper wire", kind: "conductor", conductivity: 1, color: "#d08a4f", note: "Metals have free electrons that drift easily from atom to atom." },
  { id: "foil", name: "Aluminium foil", kind: "conductor", conductivity: 0.95, color: "#cbd5e1", note: "Another metal — lots of free electrons, so the bulb lights fully." },
  { id: "graphite", name: "Pencil lead", kind: "partial", conductivity: 0.4, color: "#4b5563", note: "Graphite (carbon) conducts, but not as well as metal. The bulb glows dimly." },
  { id: "salt-water", name: "Salt water", kind: "partial", conductivity: 0.3, color: "#38bdf8", note: "Dissolved salt makes charged particles that can move. Pure water barely conducts." },
  { id: "rubber", name: "Rubber", kind: "insulator", conductivity: 0, color: "#1f2937", note: "Electrons are tightly bound to their atoms. Nothing can flow — that's why cables are coated in it." },
  { id: "glass", name: "Glass", kind: "insulator", conductivity: 0, color: "#a5f3fc", note: "An excellent insulator, used to hold high-voltage power lines." },
  { id: "wood", name: "Dry wood", kind: "insulator", conductivity: 0, color: "#a16207", note: "Dry wood insulates. Wet wood can conduct — water changes everything." },
];

const KIND_LABEL: Record<MaterialClass, string> = {
  conductor: "Conductor",
  partial: "Weak conductor",
  insulator: "Insulator",
};

const LEFT = 60;
const RIGHT = 360;
const TOP = 60;
const BOTTOM = 200;
const LOOP = rectLoop(LEFT, TOP, RIGHT, BOTTOM, 14);
const SAMPLE_X = (LEFT + RIGHT) / 2;

/** Put different materials in the gap of a circuit and see which ones conduct. */
export function MaterialTester() {
  const radioName = useId();
  const [materialId, setMaterialId] = useState("copper");
  const material = MATERIALS.find((m) => m.id === materialId)!;
  const conducts = material.conductivity > 0;
  const KindIcon = material.kind === "conductor" ? CircleCheck : material.kind === "partial" ? CircleDot : CircleSlash;

  return (
    <div>
      <div className="grid gap-px bg-line md:grid-cols-[1.35fr_1fr]">
        <div className="bg-breadboard px-2 py-4 sm:px-5">
          <CircuitCanvas
            viewBox="0 0 420 250"
            interactive
            title="Material tester circuit"
            description={`${material.name} is placed in the gap of a circuit with a battery and a bulb. ${conducts ? "Current flows and the bulb lights." : "No current flows and the bulb stays dark."}`}
          >
            <Wire d={LOOP} energized={conducts} />
            <CurrentFlow d={LOOP} active={conducts} speed={20 + material.conductivity * 60} direction="electron" />
            <Battery x={LEFT} y={(TOP + BOTTOM) / 2} rotation={-90} detail="3 V" energized={conducts} labelPlacement="right" labelOffset={26} />
            <Lamp x={SAMPLE_X} y={TOP} brightness={material.conductivity} />
            <MaterialSample material={material} />
            <CircuitLabel x={SAMPLE_X} y={BOTTOM + 40} text="TEST GAP" decorative />
          </CircuitCanvas>
        </div>
        <div className="bg-surface-raised p-4 sm:p-5">
          <p className="eyebrow mb-2 text-ink-subtle">Zoom: inside the material</p>
          <AtomicZoom material={material} />
        </div>
      </div>

      <div className="border-t border-line p-4 sm:p-5">
        <fieldset>
          <legend className="mb-3 text-sm font-medium text-ink">Choose a material to test</legend>
          <div className="flex flex-wrap gap-2">
            {MATERIALS.map((m) => (
              <label key={m.id} className="cursor-pointer">
                <input
                  type="radio"
                  name={radioName}
                  value={m.id}
                  checked={materialId === m.id}
                  onChange={() => setMaterialId(m.id)}
                  className="peer sr-only"
                />
                <span
                  className={cn(
                    "flex min-h-10 items-center gap-2 rounded-lg border px-3 text-sm transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cyan",
                    materialId === m.id ? "border-cyan/60 bg-cyan/10 text-ink" : "border-line-strong text-ink-muted hover:text-ink",
                  )}
                >
                  <span className="size-3 rounded-sm border border-white/20" style={{ backgroundColor: m.color }} aria-hidden="true" />
                  {m.name}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <AnimatePresence mode="wait">
          <motion.div
            key={material.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              "mt-4 flex items-start gap-3 rounded-xl border p-4",
              material.kind === "conductor" && "border-positive/40 bg-positive/5",
              material.kind === "partial" && "border-amber/40 bg-amber/5",
              material.kind === "insulator" && "border-line-strong bg-void/40",
            )}
            role="status"
          >
            <KindIcon
              className={cn(
                "mt-0.5 size-5 shrink-0",
                material.kind === "conductor" ? "text-positive" : material.kind === "partial" ? "text-amber" : "text-ink-subtle",
              )}
              aria-hidden="true"
            />
            <p className="text-sm text-ink-muted">
              <strong className="text-ink">
                {material.name}: {KIND_LABEL[material.kind]}.
              </strong>{" "}
              {material.note}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function MaterialSample({ material }: { material: Material }) {
  return (
    <g aria-hidden="true">
      <rect x={SAMPLE_X - 44} y={BOTTOM - 16} width={88} height={32} fill="#101722" />
      {/* Crocodile clips */}
      {[-1, 1].map((side) => (
        <path
          key={side}
          d={`M ${SAMPLE_X + side * 52} ${BOTTOM - 8} L ${SAMPLE_X + side * 40} ${BOTTOM - 8} L ${SAMPLE_X + side * 40} ${BOTTOM + 8} L ${SAMPLE_X + side * 52} ${BOTTOM + 8}`}
          fill="none"
          stroke="#f87171"
          strokeWidth={3}
          strokeLinejoin="round"
        />
      ))}
      <line x1={SAMPLE_X - 52} y1={BOTTOM} x2={SAMPLE_X - 60} y2={BOTTOM} stroke="#f87171" strokeWidth={3} />
      <line x1={SAMPLE_X + 52} y1={BOTTOM} x2={SAMPLE_X + 60} y2={BOTTOM} stroke="#f87171" strokeWidth={3} />
      <motion.rect
        key={material.id}
        x={SAMPLE_X - 38}
        y={BOTTOM - 11}
        width={76}
        height={22}
        rx={material.id === "salt-water" ? 11 : 4}
        fill={material.color}
        fillOpacity={material.id === "glass" || material.id === "salt-water" ? 0.45 : 1}
        stroke="#ffffff"
        strokeOpacity={0.2}
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
      />
    </g>
  );
}

const LATTICE_COLUMNS = [30, 80, 130, 180, 230];
const LATTICE_ROWS = [35, 95, 155];

/** A magnified view: fixed atoms plus either free-flowing or bound electrons. */
function AtomicZoom({ material }: { material: Material }) {
  const free = material.conductivity > 0;
  const lanes = [65, 125];

  return (
    <CircuitCanvas
      viewBox="0 0 260 190"
      title={`Atomic view of ${material.name}`}
      description={free ? "Free electrons drift between the fixed atoms." : "Every electron is held tightly by its own atom; none can drift."}
    >
      <rect x={4} y={4} width={252} height={182} rx={10} fill={material.color} opacity={0.07} />
      {free
        ? lanes.map((y) => (
            <CurrentFlow
              key={`${material.id}-${y}`}
              d={`M 250 ${y} L 10 ${y}`}
              active
              speed={12 + material.conductivity * 40}
              spacing={material.kind === "partial" ? 48 : 26}
              size={7}
              color="#67e8f9"
              direction="conventional"
            />
          ))
        : null}
      {LATTICE_ROWS.map((y) =>
        LATTICE_COLUMNS.map((x) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r={13} fill="#1e293b" stroke="#475569" />
            <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={700} fill="#fca5a5">
              +
            </text>
            {!free ? (
              <g className="animate-electron-jiggle" style={{ animationDelay: `${(x + y) % 7 * 0.2}s` }}>
                <circle cx={x + 17} cy={y - 8} r={3.5} fill="#67e8f9" />
                <circle cx={x - 16} cy={y + 9} r={3.5} fill="#67e8f9" />
              </g>
            ) : null}
          </g>
        )),
      )}
    </CircuitCanvas>
  );
}
