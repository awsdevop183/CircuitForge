"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Recycle, Trash2 } from "lucide-react";
import { Battery, CircuitCanvas, CurrentFlow, Resistor, Wire, rectLoop } from "@/components/circuit";
import { flowSpeedForCurrent } from "@/components/lab/flow-speed";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { Readout } from "@/components/ui/Readout";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { formatAmps, formatFixed, formatOhms } from "@/lib/format";
import { cn } from "@/lib/cn";

interface BatteryType {
  id: string;
  name: string;
  chemistry: string;
  voltage: number;
  /** Capacity in mAh. */
  capacity: number;
  /** Rough internal resistance in ohms. */
  internal: number;
  rechargeable: boolean;
  color: string;
}

export const BATTERY_TYPES: readonly BatteryType[] = [
  { id: "aa", name: "AA", chemistry: "Alkaline", voltage: 1.5, capacity: 2500, internal: 0.15, rechargeable: false, color: "#f5a524" },
  { id: "aa-nimh", name: "AA NiMH", chemistry: "Nickel-metal hydride", voltage: 1.2, capacity: 2000, internal: 0.03, rechargeable: true, color: "#34d399" },
  { id: "9v", name: "9 V", chemistry: "Alkaline", voltage: 9, capacity: 550, internal: 1.5, rechargeable: false, color: "#38bdf8" },
  { id: "coin", name: "CR2032", chemistry: "Lithium coin cell", voltage: 3, capacity: 220, internal: 15, rechargeable: false, color: "#cbd5e1" },
  { id: "18650", name: "18650", chemistry: "Lithium-ion", voltage: 3.7, capacity: 3000, internal: 0.05, rechargeable: true, color: "#a78bfa" },
];

function formatDuration(hours: number) {
  if (!Number.isFinite(hours)) return "—";
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours < 48) return `${formatFixed(hours, 1)} h`;
  return `${Math.round(hours / 24)} days`;
}

/**
 * Voltage vs capacity, and who decides the current. The battery supplies a
 * voltage; the load's resistance (plus the battery's own) sets the current.
 */
export function BatteryModel() {
  const [typeId, setTypeId] = useState("9v");
  const [load, setLoad] = useState(470);
  const battery = BATTERY_TYPES.find((b) => b.id === typeId)!;
  const current = battery.voltage / (load + battery.internal);
  const shortCircuit = battery.voltage / battery.internal;
  const runtimeHours = battery.capacity / 1000 / current;
  const maxCapacity = Math.max(...BATTERY_TYPES.map((b) => b.capacity));
  const maxVoltage = Math.max(...BATTERY_TYPES.map((b) => b.voltage));

  return (
    <div>
      <div className="border-b border-line p-4 sm:p-5">
        <SegmentedControl label="Battery" options={BATTERY_TYPES.map((b) => ({ value: b.id, label: b.name, ariaLabel: `${b.name} ${b.chemistry}` }))} value={typeId} onChange={setTypeId} size="sm" />
      </div>
      <div className="grid gap-px bg-line md:grid-cols-[1fr_1.2fr]">
        {/* Battery visual: voltage vs capacity */}
        <div className="flex items-center justify-center bg-surface-raised p-5">
          <svg viewBox="0 0 220 240" className="h-auto w-full max-w-[16rem]" role="img" aria-label={`${battery.name} ${battery.chemistry} battery: ${battery.voltage} volts, ${battery.capacity} milliamp-hours, ${battery.rechargeable ? "rechargeable" : "not rechargeable"}.`}>
            <rect x={60} y={12} width={30} height={12} rx={3} fill="#cbd5e1" />
            <rect x={30} y={24} width={90} height={190} rx={12} fill="#0b1018" stroke="#475569" strokeWidth={3} />
            <motion.rect
              x={36}
              width={78}
              rx={8}
              initial={false}
              animate={{ height: (battery.capacity / maxCapacity) * 178, y: 208 - (battery.capacity / maxCapacity) * 178 }}
              fill={battery.color}
              fillOpacity={0.35}
            />
            <text x={75} y={50} textAnchor="middle" fontSize={22} fontWeight={700} fill="#e8eef6" fontFamily="var(--font-mono)">+</text>
            <text x={75} y={205} textAnchor="middle" fontSize={22} fontWeight={700} fill="#60a5fa" fontFamily="var(--font-mono)">−</text>
            <text x={75} y={120} textAnchor="middle" fontSize={15} fontWeight={700} fill="#e8eef6" fontFamily="var(--font-mono)">{battery.name}</text>
            <text x={75} y={140} textAnchor="middle" fontSize={10} fill="#94a3b8" fontFamily="var(--font-mono)">{battery.capacity} mAh</text>
            {/* Voltage gauge beside it */}
            <rect x={150} y={24} width={14} height={190} rx={7} fill="#1a2432" />
            <motion.rect x={150} width={14} rx={7} initial={false} animate={{ height: (battery.voltage / maxVoltage) * 190, y: 214 - (battery.voltage / maxVoltage) * 190 }} fill="#f5a524" />
            <text x={157} y={230} textAnchor="middle" fontSize={10} fill="#f5a524" fontFamily="var(--font-mono)">{battery.voltage} V</text>
            <text x={75} y={232} textAnchor="middle" fontSize={9} fill="#94a3b8" fontFamily="var(--font-mono)">capacity (fill)</text>
          </svg>
        </div>
        <div className="space-y-4 bg-surface-raised p-5">
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg border border-amber/40 bg-void/40 p-3">
              <dt className="eyebrow text-ink-subtle">Voltage</dt>
              <dd className="font-mono text-lg text-amber">{battery.voltage} V</dd>
              <dd className="text-xs text-ink-muted">How hard it pushes</dd>
            </div>
            <div className="rounded-lg border border-cyan/40 bg-void/40 p-3">
              <dt className="eyebrow text-ink-subtle">Capacity</dt>
              <dd className="font-mono text-lg text-cyan">{battery.capacity} mAh</dd>
              <dd className="text-xs text-ink-muted">How long it lasts</dd>
            </div>
          </dl>
          <p className={cn("flex items-center gap-2 rounded-lg border px-3 py-2 text-sm", battery.rechargeable ? "border-positive/40 text-positive" : "border-orange/40 text-orange")}>
            {battery.rechargeable ? <Recycle className="size-4" aria-hidden="true" /> : <Trash2 className="size-4" aria-hidden="true" />}
            {battery.chemistry}: {battery.rechargeable ? "rechargeable" : "single-use — never try to recharge it"}
          </p>
          <InteractiveSlider label="Load resistance (the circuit)" value={load} min={10} max={10_000} scale="log" onChange={setLoad} format={(r) => formatOhms(r)} color="var(--color-electric)" />
        </div>
      </div>
      <div className="bg-breadboard border-t border-line px-2 py-3 sm:px-6">
        <CircuitCanvas viewBox="0 0 420 150" interactive title="Battery driving a load" description={`${battery.voltage} volts across ${formatOhms(load)} gives ${formatAmps(current)}.`} className="mx-auto max-w-md">
          <Wire d={rectLoop(60, 30, 360, 120, 10)} energized />
          <CurrentFlow d={rectLoop(60, 30, 360, 120, 10)} active speed={flowSpeedForCurrent(current, 0.2)} />
          <Battery x={60} y={75} rotation={-90} cells={1} detail={`${battery.voltage} V`} energized labelPlacement="right" labelOffset={26} />
          <Resistor x={360} y={75} rotation={90} name="Load" detail={formatOhms(load)} energized labelPlacement="left" labelOffset={34} />
        </CircuitCanvas>
      </div>
      <div className="grid grid-cols-2 gap-2 border-t border-line p-4 sm:grid-cols-3 sm:p-5">
        <Readout label="Current (set by the circuit)" value={formatAmps(current, 3)} tone="cyan" size="sm" />
        <Readout label="Estimated runtime" value={formatDuration(runtimeHours)} tone="amber" size="sm" hint="capacity ÷ current (approx.)" />
        <Readout label="Short-circuit limit" value={formatAmps(shortCircuit, 2)} size="sm" hint={`V ÷ ${battery.internal} Ω internal resistance`} />
      </div>
      <p className="border-t border-line px-4 py-3 text-sm text-ink-muted sm:px-5" aria-live="polite">
        The same {battery.name} battery gives {formatAmps(current, 2)} to a {formatOhms(load)} load — change the load and the current changes, not the battery. Big currents drain it faster (and real batteries deliver less than their rated capacity when pushed hard).
      </p>
    </div>
  );
}
