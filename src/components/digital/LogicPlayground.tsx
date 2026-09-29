"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, RotateCcw, Trash2, TriangleAlert } from "lucide-react";
import { GATE_INFO, GATE_TYPES, evaluateNetwork, invert, pinCount, rowIndex, truthTable, type Bit, type GateType, type NetworkGate } from "@/lib/logic";
import { useProgress } from "@/lib/progress/use-progress";
import { cn } from "@/lib/cn";
import { GateInput } from "./GateInput";
import { GateOutput } from "./GateOutput";
import { LogicCircuitView, type ViewGate } from "./LogicCircuitView";
import { TruthTable } from "./TruthTable";

const INPUT_IDS = ["A", "B", "C"] as const;
const OUTPUT_IDS = ["Y", "Z"] as const;
const MAX_GATES = 8;
export const PLAYGROUND_ID = "lab/digital-playground";

interface PlaygroundState {
  gates: NetworkGate[];
  outputs: Record<(typeof OUTPUT_IDS)[number], string | null>;
  nextId: number;
}

export type PlaygroundPreset = "and-or" | "half-adder" | "xor-from-nand" | "majority" | "blank";

const PRESETS: Record<PlaygroundPreset, { label: string; state: PlaygroundState; note: string }> = {
  "and-or": {
    label: "(A AND B) OR C",
    note: "Y is 1 when both A and B are 1 — or whenever C is 1.",
    state: { gates: [{ id: "G1", type: "AND", inputs: ["A", "B"] }, { id: "G2", type: "OR", inputs: ["G1", "C"] }], outputs: { Y: "G2", Z: null }, nextId: 3 },
  },
  "half-adder": {
    label: "Half adder",
    note: "Y is the SUM (XOR) and Z is the CARRY (AND) of A + B.",
    state: { gates: [{ id: "G1", type: "XOR", inputs: ["A", "B"] }, { id: "G2", type: "AND", inputs: ["A", "B"] }], outputs: { Y: "G1", Z: "G2" }, nextId: 3 },
  },
  "xor-from-nand": {
    label: "XOR from 4 NANDs",
    note: "Four NAND gates behave exactly like one XOR gate. Compare Y with A XOR B.",
    state: {
      gates: [
        { id: "G1", type: "NAND", inputs: ["A", "B"] },
        { id: "G2", type: "NAND", inputs: ["A", "G1"] },
        { id: "G3", type: "NAND", inputs: ["B", "G1"] },
        { id: "G4", type: "NAND", inputs: ["G2", "G3"] },
      ],
      outputs: { Y: "G4", Z: null },
      nextId: 5,
    },
  },
  majority: {
    label: "Majority vote",
    note: "Y is 1 when at least two of A, B and C are 1 — a tiny voting machine.",
    state: {
      gates: [
        { id: "G1", type: "AND", inputs: ["A", "B"] },
        { id: "G2", type: "AND", inputs: ["A", "C"] },
        { id: "G3", type: "AND", inputs: ["B", "C"] },
        { id: "G4", type: "OR", inputs: ["G1", "G2"] },
        { id: "G5", type: "OR", inputs: ["G4", "G3"] },
      ],
      outputs: { Y: "G5", Z: null },
      nextId: 6,
    },
  },
  blank: { label: "Blank board", note: "Add gates and connect them.", state: { gates: [], outputs: { Y: null, Z: null }, nextId: 1 } },
};

/** Layout gates in columns by depth (distance from the inputs). */
function layout(gates: readonly NetworkGate[]) {
  const depth: Record<string, number> = {};
  for (const gate of gates) {
    const sources = gate.inputs.slice(0, pinCount(gate)).filter((s): s is string => s !== null && s in depth);
    depth[gate.id] = 1 + Math.max(0, ...sources.map((s) => depth[s]!));
  }
  const columns: string[][] = [];
  for (const gate of gates) (columns[depth[gate.id]! - 1] ??= []).push(gate.id);
  const tallest = Math.max(INPUT_IDS.length, ...columns.map((c) => c?.length ?? 0));
  const rowGap = 92;
  const height = tallest * rowGap + 20;
  const positions: Record<string, { x: number; y: number }> = {};
  columns.forEach((column, c) => {
    const offset = (height - column.length * rowGap) / 2 + rowGap / 2;
    column.forEach((id, r) => (positions[id] = { x: 200 + c * 160, y: offset + r * rowGap }));
  });
  const inputOffset = (height - INPUT_IDS.length * rowGap) / 2 + rowGap / 2;
  const width = 200 + Math.max(1, columns.length) * 160 + 90;
  return { positions, height, width, inputY: (i: number) => inputOffset + i * rowGap, outputX: width - 70 };
}

interface LogicPlaygroundProps {
  initialPreset?: PlaygroundPreset;
  /** Hide the preset picker (e.g. when embedded in a lesson). */
  compact?: boolean;
}

/**
 * Logic Gate Playground: add gates, wire them to inputs or to earlier gates,
 * toggle A/B/C and watch signals ripple to the outputs. The truth table of
 * the whole circuit is generated live.
 */
export function LogicPlayground({ initialPreset = "and-or", compact = false }: LogicPlaygroundProps) {
  const { challengeResult, recordChallengeAttempt } = useProgress();
  const [preset, setPreset] = useState<PlaygroundPreset>(initialPreset);
  const [circuit, setCircuit] = useState<PlaygroundState>(PRESETS[initialPreset].state);
  const [inputs, setInputs] = useState<Record<string, Bit>>({ A: 1, B: 1, C: 0 });

  const { gates, outputs } = circuit;
  const { values, floating } = evaluateNetwork(inputs, gates);
  const { positions, height, width, inputY, outputX } = layout(gates);
  const outputEntries = OUTPUT_IDS.map((id) => ({ id, source: outputs[id] }));
  const connectedOutputs = outputEntries.filter((o) => o.source !== null);

  // Which inputs does the circuit actually use? Only those go in the truth table.
  const used = INPUT_IDS.filter((id) => gates.some((g) => g.inputs.slice(0, pinCount(g)).includes(id)) || Object.values(outputs).includes(id));
  const tableInputs = used.length ? used : (["A"] as const);
  const rows = truthTable(tableInputs.length, (bits) => {
    const vals = { A: 0, B: 0, C: 0, ...Object.fromEntries(tableInputs.map((id, i) => [id, bits[i]!])) } as Record<string, Bit>;
    const result = evaluateNetwork(vals, gates).values;
    return connectedOutputs.map((o) => (o.source ? (result[o.source] ?? 0) : 0));
  });

  const update = (next: PlaygroundState) => {
    setCircuit(next);
    // Milestone: a circuit with one gate feeding another, connected to an output.
    const chained = next.gates.some((g) => g.inputs.slice(0, pinCount(g)).some((s) => s !== null && s.startsWith("G")));
    if (chained && Object.values(next.outputs).some((o) => o !== null) && !challengeResult(PLAYGROUND_ID)?.completedAt) {
      recordChallengeAttempt(PLAYGROUND_ID, true);
    }
  };
  const loadPreset = (id: PlaygroundPreset) => {
    setPreset(id);
    update(PRESETS[id].state);
  };
  const addGate = (type: GateType) => {
    if (gates.length >= MAX_GATES) return;
    const id = `G${circuit.nextId}`;
    const previous = gates[gates.length - 1]?.id ?? null;
    const defaults: (string | null)[] = type === "NOT" ? [previous ?? "A"] : [previous ?? "A", previous ? "C" : "B"];
    update({ ...circuit, gates: [...gates, { id, type, inputs: defaults }], outputs: { ...outputs, Y: id }, nextId: circuit.nextId + 1 });
  };
  const setGate = (index: number, change: Partial<NetworkGate>) => {
    update({ ...circuit, gates: gates.map((g, i) => (i === index ? { ...g, ...change } : g)) });
  };
  const removeGate = (index: number) => {
    const id = gates[index]!.id;
    update({
      ...circuit,
      gates: gates.filter((_, i) => i !== index).map((g) => ({ ...g, inputs: g.inputs.map((s) => (s === id ? null : s)) })),
      outputs: { Y: outputs.Y === id ? null : outputs.Y, Z: outputs.Z === id ? null : outputs.Z },
    });
  };

  const viewGates: ViewGate[] = gates.map((g) => ({ ...g, ...positions[g.id]!, label: g.id }));
  const sourceOptions = (index: number) => [...INPUT_IDS, ...gates.slice(0, index).map((g) => g.id)];

  return (
    <div>
      {!compact ? (
        <div className="flex flex-wrap items-center gap-2 border-b border-line p-4 sm:p-5">
          <span className="mr-1 text-sm font-medium text-ink-muted">Examples:</span>
          {(Object.keys(PRESETS) as PlaygroundPreset[]).map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={preset === id}
              onClick={() => loadPreset(id)}
              className={cn("min-h-10 rounded-lg border px-3 text-sm font-medium transition-colors", preset === id ? "border-logic/70 bg-logic/10 text-logic" : "border-line-strong text-ink-muted hover:text-ink")}
            >
              {PRESETS[id].label}
            </button>
          ))}
        </div>
      ) : null}

      {/* Inputs and outputs */}
      <div className="flex flex-wrap items-center gap-3 border-b border-line bg-surface-raised p-4 sm:p-5">
        {INPUT_IDS.map((id) => (
          <GateInput key={id} label={id} value={inputs[id]!} onToggle={() => setInputs((v) => ({ ...v, [id]: invert(v[id]!) }))} />
        ))}
        <span className="hidden text-ink-subtle sm:inline" aria-hidden="true">
          →
        </span>
        {outputEntries.map((o) =>
          o.source ? (
            <GateOutput key={o.id} label={o.id} value={values[o.source] ?? 0} />
          ) : (
            <span key={o.id} className="rounded-xl border border-dashed border-line-strong px-3 py-3 font-mono text-sm text-ink-muted">
              {o.id}: not connected
            </span>
          ),
        )}
      </div>

      {/* Canvas */}
      <div className="bg-logic-grid p-3 sm:p-5">
        <LogicCircuitView
          inputs={INPUT_IDS.map((id, i) => ({ id, label: id, x: 60, y: inputY(i) }))}
          gates={viewGates}
          outputs={outputEntries.filter((o) => o.source !== null).map((o) => ({ id: o.id, label: o.id, x: outputX, y: height / 2 + (connectedOutputs.length === 2 ? (o.id === "Y" ? -46 : 46) : 0), source: o.source }))}
          values={values}
          onToggleInput={(id) => setInputs((v) => ({ ...v, [id]: invert(v[id]!) }))}
          width={width}
          height={height}
          minWidth={Math.min(width, 900) * 0.8}
          maxWidth={width * 1.25}
          title="Your logic circuit"
          description={`${gates.length} gates. ${outputEntries.map((o) => `${o.id} = ${o.source ? (values[o.source] ?? 0) : "not connected"}`).join(", ")}.`}
        />
        <p className="mt-2 text-xs text-ink-subtle md:hidden">Swipe sideways to see the whole circuit.</p>
        {!compact && PRESETS[preset] ? <p className="mt-2 text-sm text-ink-muted">{PRESETS[preset].note}</p> : null}
        {floating.length ? (
          <p className="mt-2 flex items-center gap-2 text-sm text-amber">
            <TriangleAlert className="size-4 shrink-0" aria-hidden="true" />
            {floating.join(", ")} {floating.length === 1 ? "has" : "have"} an unconnected input, which reads as 0 here. (Real floating inputs are unpredictable — always connect them.)
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-px border-t border-line bg-line lg:grid-cols-[1.4fr_1fr]">
        {/* Editor */}
        <div className="bg-surface-raised p-4 sm:p-5">
          <p className="eyebrow text-ink-subtle">Add a gate ({gates.length}/{MAX_GATES})</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {GATE_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                disabled={gates.length >= MAX_GATES}
                onClick={() => addGate(type)}
                aria-label={`Add ${GATE_INFO[type].name}`}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-line-strong px-3 font-mono text-sm font-semibold text-ink hover:border-logic/60 hover:text-logic disabled:opacity-40"
              >
                <Plus className="size-3.5" aria-hidden="true" />
                {type}
              </button>
            ))}
            <button type="button" onClick={() => loadPreset("blank")} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm text-ink-muted hover:text-ink">
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Clear
            </button>
          </div>
          <ul className="mt-4 space-y-2">
            <AnimatePresence initial={false}>
              {gates.map((gate, index) => (
                <motion.li key={gate.id} layout initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-wrap items-center gap-2 rounded-xl border border-line bg-void/30 p-2.5">
                  <span className="w-8 font-mono text-sm font-bold text-clock">{gate.id}</span>
                  <label className="sr-only" htmlFor={`${gate.id}-type`}>
                    {gate.id} gate type
                  </label>
                  <select
                    id={`${gate.id}-type`}
                    value={gate.type}
                    onChange={(e) => setGate(index, { type: e.target.value as GateType })}
                    className="h-10 rounded-lg border border-line-strong bg-surface px-2 font-mono text-sm text-ink"
                  >
                    {GATE_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                  <span className="text-xs text-ink-subtle">inputs:</span>
                  {Array.from({ length: pinCount(gate) }, (_, slot) => (
                    <span key={slot}>
                      <label className="sr-only" htmlFor={`${gate.id}-in-${slot}`}>
                        {gate.id} input {slot + 1}
                      </label>
                      <select
                        id={`${gate.id}-in-${slot}`}
                        value={gate.inputs[slot] ?? ""}
                        onChange={(e) => setGate(index, { inputs: Array.from({ length: pinCount(gate) }, (_, j) => (j === slot ? e.target.value || null : (gate.inputs[j] ?? null))) })}
                        className="h-10 rounded-lg border border-line-strong bg-surface px-2 font-mono text-sm text-ink"
                      >
                        <option value="">—</option>
                        {sourceOptions(index).map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </span>
                  ))}
                  <span className={cn("ml-auto font-mono text-lg font-bold", values[gate.id] ? "text-logic" : "text-ink-subtle")} aria-label={`${gate.id} output ${values[gate.id] ?? 0}`}>
                    {values[gate.id] ?? 0}
                  </span>
                  <button type="button" onClick={() => removeGate(index)} className="flex size-10 items-center justify-center rounded-lg text-ink-subtle hover:bg-negative/10 hover:text-negative" aria-label={`Remove ${gate.id}`}>
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          <div className="mt-4 flex flex-wrap gap-3">
            {OUTPUT_IDS.map((id) => (
              <label key={id} className="flex items-center gap-2 text-sm text-ink">
                Output <span className="font-mono font-bold">{id}</span> ←
                <select
                  value={outputs[id] ?? ""}
                  onChange={(e) => update({ ...circuit, outputs: { ...outputs, [id]: e.target.value || null } })}
                  className="h-10 rounded-lg border border-line-strong bg-surface px-2 font-mono text-sm text-ink"
                >
                  <option value="">not connected</option>
                  {[...INPUT_IDS, ...gates.map((g) => g.id)].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <p className="mt-3 text-xs text-ink-subtle">A gate can take its inputs from A, B, C or any gate above it in the list, so signals always flow left to right.</p>
        </div>
        {/* Live truth table */}
        <div className="bg-surface-raised p-4 sm:p-5">
          <p className="eyebrow text-ink-subtle">Truth table of your circuit</p>
          {connectedOutputs.length ? (
            <TruthTable
              inputLabels={tableInputs}
              outputLabels={connectedOutputs.map((o) => o.id)}
              rows={rows}
              activeRow={rowIndex(tableInputs.map((id) => inputs[id]!))}
              onSelectRow={(bits) => setInputs((v) => ({ ...v, ...Object.fromEntries(tableInputs.map((id, i) => [id, bits[i]!])) }))}
              caption="Truth table of the playground circuit"
              className="mt-2"
            />
          ) : (
            <p className="mt-2 text-sm text-ink-muted">Connect output Y or Z to see the truth table.</p>
          )}
        </div>
      </div>
    </div>
  );
}
