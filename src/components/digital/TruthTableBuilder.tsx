"use client";

import { useState } from "react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { GATE_INFO, GATE_TYPES, evaluateGate, invert, rowIndex, truthTable, type Bit, type GateType } from "@/lib/logic";
import { GateInput } from "./GateInput";
import { GateOutput } from "./GateOutput";
import { LogicCircuitView } from "./LogicCircuitView";
import { TruthTable } from "./TruthTable";

const LABELS = ["A", "B", "C"];
const Y: Record<number, number[]> = { 1: [90], 2: [60, 120], 3: [44, 90, 136] };

/**
 * Choose how many inputs and which gate; the truth table is generated
 * automatically. Toggle inputs and watch the matching row light up.
 */
export function TruthTableBuilder() {
  const [count, setCount] = useState(2);
  const [gate, setGate] = useState<GateType>("AND");
  const [inputs, setInputs] = useState<Bit[]>([0, 0]);
  const available = count === 1 ? (["NOT"] as GateType[]) : GATE_TYPES.filter((g) => g !== "NOT");
  const activeGate = available.includes(gate) ? gate : available[0]!;
  const labels = LABELS.slice(0, count);
  const output = evaluateGate(activeGate, inputs);
  const rows = truthTable(count, (bits) => evaluateGate(activeGate, bits));

  const changeCount = (next: number) => {
    setCount(next);
    setInputs(Array.from({ length: next }, () => 0 as Bit));
    if (next === 1) setGate("NOT");
    else if (gate === "NOT") setGate("AND");
  };
  const toggle = (i: number) => setInputs((prev) => prev.map((v, j) => (j === i ? invert(v) : v)));

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 border-b border-line p-4 sm:p-5 lg:grid-cols-[auto_1fr]">
        <SegmentedControl label="Number of inputs" options={[1, 2, 3].map((n) => ({ value: n, label: String(n) }))} value={count} onChange={changeCount} size="sm" />
        <SegmentedControl label="Logic gate" options={available.map((g) => ({ value: g, label: g, ariaLabel: GATE_INFO[g].name }))} value={activeGate} onChange={setGate} size="sm" />
      </div>
      <div className="grid grid-cols-1 gap-px bg-line lg:grid-cols-[1.3fr_1fr]">
        <div className="bg-logic-grid p-3 sm:p-5">
          <LogicCircuitView
            inputs={labels.map((l, i) => ({ id: l, label: l, x: 60, y: Y[count]![i]! }))}
            gates={[{ id: "g", type: activeGate, x: 210, y: 90, inputs: labels }]}
            outputs={[{ id: "o", label: "OUT", x: 340, y: 90, source: "g" }]}
            values={{ ...Object.fromEntries(labels.map((l, i) => [l, inputs[i]!])), g: output }}
            onToggleInput={(id) => toggle(labels.indexOf(id))}
            width={400}
            height={180}
            title={`${count}-input ${activeGate} gate`}
            description={`Inputs ${labels.map((l, i) => `${l} = ${inputs[i]}`).join(", ")}; output ${output}.`}
            className="mx-auto max-w-lg"
          />
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            {labels.map((l, i) => (
              <GateInput key={l} label={l} value={inputs[i]!} onToggle={() => toggle(i)} />
            ))}
            <GateOutput label="Output" value={output} />
          </div>
          {count === 1 ? <p className="mt-3 text-center text-sm text-ink-muted">With a single input, the NOT gate is the useful one: the others need at least two inputs to compare.</p> : null}
          {count === 3 && (activeGate === "XOR" || activeGate === "XNOR") ? (
            <p className="mt-3 text-center text-sm text-ink-muted">With three inputs, XOR outputs 1 when an <strong className="text-ink">odd</strong> number of inputs are 1 (XNOR: an even number).</p>
          ) : null}
        </div>
        <div className="bg-surface-raised p-4 sm:p-5">
          <p className="eyebrow text-ink-subtle">
            {count} input{count > 1 ? "s" : ""} → 2<sup>{count}</sup> = {rows.length} rows
          </p>
          <TruthTable inputLabels={labels} outputLabels={["OUT"]} rows={rows} activeRow={rowIndex(inputs)} onSelectRow={setInputs} caption={`${count}-input ${activeGate} truth table`} className="mt-2" />
          <p className="mt-3 text-sm text-ink-muted">Rows count up in binary (000, 001, 010…), so no combination is ever missed. Each extra input doubles the rows.</p>
        </div>
      </div>
    </div>
  );
}
