"use client";

import { useState } from "react";
import { GATE_INFO, evaluateGate, invert, rowIndex, truthTable, type Bit, type GateType } from "@/lib/logic";
import { GateInput } from "./GateInput";
import { LogicCircuitView } from "./LogicCircuitView";
import { TruthTable } from "./TruthTable";

const BASE: Record<"NAND" | "NOR" | "XNOR", GateType> = { NAND: "AND", NOR: "OR", XNOR: "XOR" };

/**
 * An inverted gate shown as its two-step recipe (e.g. AND then NOT) next to
 * the single symbol, driven by the same inputs so they always agree.
 */
export function GateComposition({ type }: { type: "NAND" | "NOR" | "XNOR" }) {
  const [a, setA] = useState<Bit>(0);
  const [b, setB] = useState<Bit>(0);
  const base = BASE[type];
  const mid = evaluateGate(base, [a, b]);
  const out = evaluateGate(type, [a, b]);
  const values: Record<string, Bit> = { A: a, B: b, first: mid, not: invert(mid), single: out };
  const toggle = (id: string) => (id === "A" ? setA(invert) : setB(invert));
  const inputs = [
    { id: "A", label: "A", x: 50, y: 50 },
    { id: "B", label: "B", x: 50, y: 110 },
  ];

  return (
    <div>
      <div className="grid gap-px bg-line lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-2 bg-logic-grid p-3 sm:p-5">
          <p className="eyebrow text-ink-subtle">
            {base} followed by NOT
          </p>
          <LogicCircuitView
            inputs={inputs}
            gates={[
              { id: "first", type: base, x: 180, y: 80, inputs: ["A", "B"] },
              { id: "not", type: "NOT", x: 320, y: 80, inputs: ["first"] },
            ]}
            outputs={[{ id: "o", label: "OUT", x: 430, y: 80, source: "not" }]}
            values={values}
            onToggleInput={toggle}
            width={490}
            height={160}
            minWidth={420}
            title={`${base} gate followed by a NOT gate`}
            description={`${base} gives ${mid}; NOT flips it to ${invert(mid)}.`}
          />
          <p className="text-center font-mono text-2xl text-ink-subtle" aria-hidden="true">
            =
          </p>
          <p className="eyebrow text-ink-subtle">One {type} gate</p>
          <LogicCircuitView
            inputs={inputs}
            gates={[{ id: "single", type, x: 220, y: 80, inputs: ["A", "B"] }]}
            outputs={[{ id: "o", label: "OUT", x: 360, y: 80, source: "single" }]}
            values={values}
            width={490}
            height={160}
            minWidth={420}
            title={`A single ${type} gate`}
            description={`${type} output = ${out}.`}
          />
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <GateInput label="A" value={a} onToggle={() => setA(invert)} />
            <GateInput label="B" value={b} onToggle={() => setB(invert)} />
          </div>
        </div>
        <div className="bg-surface-raised p-4 sm:p-5">
          <p className="eyebrow text-ink-subtle">Build the table column by column</p>
          <TruthTable
            inputLabels={["A", "B"]}
            outputLabels={[base, type]}
            rows={truthTable(2, (bits) => [evaluateGate(base, bits), evaluateGate(type, bits)])}
            activeRow={rowIndex([a, b])}
            onSelectRow={([x, y]) => {
              setA(x!);
              setB(y!);
            }}
            caption={`${base} and ${type} truth table`}
            className="mt-2"
          />
          <p className="mt-4 text-sm text-ink-muted">
            The <span className="font-semibold text-logic">{type}</span> column is the <span className="font-semibold text-ink">{base}</span> column with every bit flipped. {GATE_INFO[type].rule}
          </p>
        </div>
      </div>
    </div>
  );
}
