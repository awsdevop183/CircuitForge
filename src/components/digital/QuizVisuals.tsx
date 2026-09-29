"use client";

import { useState } from "react";
import { CircuitCanvas } from "@/components/circuit";
import { evaluateGate, evaluateNetwork, invert, type Bit, type GateType, type NetworkGate } from "@/lib/logic";
import { GateInput } from "./GateInput";
import { LogicCircuitView } from "./LogicCircuitView";
import { LogicGate } from "./LogicGate";

/** A bare gate symbol with no name — for "identify the gate" questions. */
export function GateSymbolVisual({ type }: { type: GateType }) {
  return (
    <CircuitCanvas viewBox="-60 -34 120 68" title="Mystery logic gate symbol" background="transparent" className="h-24 w-auto">
      <LogicGate type={type} x={0} y={0} showName={false} />
    </CircuitCanvas>
  );
}

/** A hidden gate the learner can probe by toggling its inputs — an interactive circuit question. */
export function MysteryGate({ type }: { type: GateType }) {
  const [a, setA] = useState<Bit>(0);
  const [b, setB] = useState<Bit>(0);
  const out = evaluateGate(type, type === "NOT" ? [a] : [a, b]);
  return (
    <div className="w-full">
      <LogicCircuitView
        inputs={[
          { id: "A", label: "A", x: 60, y: 45 },
          { id: "B", label: "B", x: 60, y: 115 },
        ]}
        gates={[{ id: "g", type, x: 210, y: 80, inputs: ["A", "B"], hidden: true }]}
        outputs={[{ id: "o", label: "OUT", x: 340, y: 80, source: "g" }]}
        values={{ A: a, B: b, g: out }}
        onToggleInput={(id) => (id === "A" ? setA(invert) : setB(invert))}
        width={400}
        height={160}
        title="Mystery gate: toggle A and B to investigate"
        description={`A ${a}, B ${b}, output ${out}.`}
        className="mx-auto max-w-sm"
      />
      <div className="mt-2 flex justify-center gap-2">
        <GateInput label="A" value={a} onToggle={() => setA(invert)} />
        <GateInput label="B" value={b} onToggle={() => setB(invert)} />
      </div>
      <p className="mt-2 text-center text-xs text-ink-subtle" aria-live="polite">
        Output: {out}. Try all four combinations.
      </p>
    </div>
  );
}

/** A small fixed circuit with given input values, for "predict the output" questions. The output is shown as "?". */
export function PredictCircuit({ inputs, gates, outputGate }: { inputs: Record<string, Bit>; gates: NetworkGate[]; outputGate: string }) {
  const values = evaluateNetwork(inputs, gates).values;
  const ids = Object.keys(inputs);
  const twoStage = gates.length > 1;
  const positions: Record<string, { x: number; y: number }> = twoStage
    ? { [gates[0]!.id]: { x: 190, y: 60 }, [gates[1]!.id]: { x: 330, y: 95 } }
    : { [gates[0]!.id]: { x: 210, y: 80 } };
  return (
    <LogicCircuitView
      inputs={ids.map((id, i) => ({ id, label: id, x: 50, y: ids.length === 3 ? [40, 90, 150][i]! : ids.length === 1 ? 80 : [45, 115][i]! }))}
      gates={gates.map((g) => ({ ...g, ...positions[g.id]!, hideOutput: g.id === outputGate }))}
      outputs={[]}
      values={values}
      width={twoStage ? 420 : 300}
      height={twoStage ? 180 : 160}
      title="Predict the output of this circuit"
      description={`Inputs: ${ids.map((id) => `${id} = ${inputs[id]}`).join(", ")}. ${gates.map((g) => `${g.id} is a ${g.type} gate fed by ${g.inputs.join(" and ")}`).join("; ")}.`}
      className="mx-auto w-full max-w-md"
    />
  );
}
