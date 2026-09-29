"use client";

import { useState } from "react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { evaluateGate, evaluateNetwork, invert, rowIndex, truthTable, type Bit, type GateType } from "@/lib/logic";
import { GateInput } from "./GateInput";
import { LogicCircuitView, type ViewGate } from "./LogicCircuitView";
import { TruthTable } from "./TruthTable";

type Target = "NOT" | "AND" | "OR";

const BUILDS: Record<Target, { gates: ViewGate[]; out: string; inputs: string[]; note: string }> = {
  NOT: {
    inputs: ["A"],
    gates: [{ id: "n1", type: "NAND", x: 210, y: 80, inputs: ["A", "A"] }],
    out: "n1",
    note: "Tie both inputs together: NAND(A, A) is 0 only when A is 1 — exactly NOT A.",
  },
  AND: {
    inputs: ["A", "B"],
    gates: [
      { id: "n1", type: "NAND", x: 180, y: 80, inputs: ["A", "B"] },
      { id: "n2", type: "NAND", x: 330, y: 80, inputs: ["n1", "n1"] },
    ],
    out: "n2",
    note: "A NAND, then a NAND wired as NOT, flips the result back: AND.",
  },
  OR: {
    inputs: ["A", "B"],
    gates: [
      { id: "n1", type: "NAND", x: 180, y: 40, inputs: ["A", "A"] },
      { id: "n2", type: "NAND", x: 180, y: 120, inputs: ["B", "B"] },
      { id: "n3", type: "NAND", x: 330, y: 80, inputs: ["n1", "n2"] },
    ],
    out: "n3",
    note: "Invert both inputs, then NAND them: the output is 1 if A or B is 1.",
  },
};

/** NAND is "universal": NOT, AND and OR can all be built from NAND gates alone. */
export function NandUniversal() {
  const [target, setTarget] = useState<Target>("NOT");
  const [a, setA] = useState<Bit>(0);
  const [b, setB] = useState<Bit>(0);
  const build = BUILDS[target];
  const inputs: Record<string, Bit> = build.inputs.length === 1 ? { A: a } : { A: a, B: b };
  const net = (vals: Record<string, Bit>) => evaluateNetwork(vals, build.gates).values;
  const values = net(inputs);
  const count = build.inputs.length;
  const targetOut = (bits: Bit[]) => evaluateGate(target as GateType, bits);

  return (
    <div>
      <div className="border-b border-line p-4 sm:p-5">
        <SegmentedControl label="Build this gate from NANDs only" options={(["NOT", "AND", "OR"] as Target[]).map((t) => ({ value: t, label: t }))} value={target} onChange={setTarget} size="sm" />
      </div>
      <div className="grid gap-px bg-line lg:grid-cols-[1.5fr_1fr]">
        <div className="bg-logic-grid p-3 sm:p-5">
          <LogicCircuitView
            inputs={build.inputs.map((id, i) => ({ id, label: id, x: 50, y: count === 1 ? 80 : [40, 120][i]! }))}
            gates={build.gates}
            outputs={[{ id: "o", label: "OUT", x: 440, y: 80, source: build.out }]}
            values={values}
            onToggleInput={(id) => (id === "A" ? setA(invert) : setB(invert))}
            width={500}
            height={160}
            minWidth={420}
            title={`${target} built from NAND gates`}
            description={`Output ${values[build.out]}.`}
          />
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            <GateInput label="A" value={a} onToggle={() => setA(invert)} />
            {count === 2 ? <GateInput label="B" value={b} onToggle={() => setB(invert)} /> : null}
          </div>
          <p className="mt-3 text-sm text-ink-muted">{build.note}</p>
        </div>
        <div className="bg-surface-raised p-4 sm:p-5">
          <p className="eyebrow text-ink-subtle">Built vs real {target}</p>
          <TruthTable
            inputLabels={build.inputs}
            outputLabels={["NANDs", target]}
            rows={truthTable(count, (bits) => {
              const vals: Record<string, Bit> = Object.fromEntries(build.inputs.map((id, i) => [id, bits[i]!]));
              return [net(vals)[build.out]!, targetOut(bits)];
            })}
            activeRow={rowIndex(count === 1 ? [a] : [a, b])}
            caption={`${target} built from NAND gates compared with a real ${target} gate`}
            className="mt-2"
          />
          <p className="mt-3 text-sm text-positive">The two columns match on every row.</p>
        </div>
      </div>
    </div>
  );
}
