"use client";

import { useState } from "react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { GATE_INFO, GATE_TYPES, evaluateGate, invert, type Bit, type GateType } from "@/lib/logic";
import { cn } from "@/lib/cn";
import { CircuitCanvas } from "@/components/circuit";
import { GateDemo } from "./GateDemo";
import { GateInput } from "./GateInput";
import { LogicGate } from "./LogicGate";

/** Pick any gate and explore it: symbol, switches, output and truth table. */
export function GateExplorer({ initial = "AND" }: { initial?: GateType }) {
  const [type, setType] = useState<GateType>(initial);
  return (
    <div>
      <div className="border-b border-line p-4 sm:p-5">
        <SegmentedControl label="Choose a gate" options={GATE_TYPES.map((g) => ({ value: g, label: g, ariaLabel: GATE_INFO[g].name }))} value={type} onChange={setType} size="sm" />
      </div>
      <GateDemo key={type} type={type} />
    </div>
  );
}

/** The same two inputs fed to every gate at once: seven different decisions. */
export function SameInputsAllGates() {
  const [a, setA] = useState<Bit>(1);
  const [b, setB] = useState<Bit>(0);
  return (
    <div className="p-4 sm:p-5">
      <div className="flex flex-wrap gap-3">
        <GateInput label="A" value={a} onToggle={() => setA(invert)} />
        <GateInput label="B" value={b} onToggle={() => setB(invert)} />
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7" aria-live="polite">
        {GATE_TYPES.map((type) => {
          const inputs: Bit[] = type === "NOT" ? [a] : [a, b];
          const out = evaluateGate(type, inputs);
          return (
            <li key={type} className={cn("flex flex-col items-center rounded-xl border p-2 transition-colors duration-300", out ? "border-logic/60 bg-logic/10" : "border-line bg-void/30")}>
              <CircuitCanvas viewBox="-56 -30 112 60" title={`${type} gate`} background="transparent" className="h-12 w-auto">
                <LogicGate type={type} x={0} y={0} inputValues={inputs} output={out} showName={false} />
              </CircuitCanvas>
              <span className="font-mono text-xs text-ink-muted">{type === "NOT" ? "NOT A" : type}</span>
              <span className={cn("font-mono text-2xl font-bold", out ? "text-logic" : "text-ink-subtle")}>
                <span className="sr-only">{type} output: </span>
                {out}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-sm text-ink-muted">Same inputs, seven different rules. Each gate makes a different decision from the same information.</p>
    </div>
  );
}
