"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { fromBits, fullAdder, halfAdder, invert, rowIndex, toBits, truthTable, type Bit } from "@/lib/logic";
import { cn } from "@/lib/cn";
import { GateInput } from "./GateInput";
import { GateOutput } from "./GateOutput";
import { LogicCircuitView } from "./LogicCircuitView";
import { TruthTable } from "./TruthTable";

function BitSum({ terms, carry, sum }: { terms: { label: string; value: Bit }[]; carry: Bit; sum: Bit }) {
  const total = terms.reduce((n, t) => n + t.value, 0);
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-2xl sm:text-3xl" aria-live="polite">
      {terms.map((t, i) => (
        <span key={t.label} className="flex items-center gap-2">
          {i > 0 ? <span className="text-ink-subtle">+</span> : null}
          <span className="flex flex-col items-center">
            <span className="text-xs text-ink-subtle">{t.label}</span>
            <span className={t.value ? "font-bold text-logic" : "text-ink-subtle"}>{t.value}</span>
          </span>
        </span>
      ))}
      <span className="text-ink-subtle">=</span>
      <span className="flex flex-col items-center">
        <span className="text-xs text-ink-subtle">binary</span>
        <span className="font-bold">
          <span className="text-amber">{carry}</span>
          <span className="text-logic">{sum}</span>
        </span>
      </span>
      <span className="text-base text-ink-muted">({total} in decimal)</span>
      <span className="sr-only">
        Carry {carry}, sum {sum}.
      </span>
    </div>
  );
}

/** Adds two bits: SUM = A XOR B, CARRY = A AND B. */
export function HalfAdder() {
  const [a, setA] = useState<Bit>(1);
  const [b, setB] = useState<Bit>(1);
  const { sum, carry } = halfAdder(a, b);
  const toggle = (id: string) => (id === "A" ? setA(invert) : setB(invert));

  return (
    <div>
      <div className="grid grid-cols-1 gap-px bg-line lg:grid-cols-[1.5fr_1fr]">
        <div className="bg-logic-grid p-3 sm:p-5">
          <LogicCircuitView
            inputs={[
              { id: "A", label: "A", x: 50, y: 50 },
              { id: "B", label: "B", x: 50, y: 150 },
            ]}
            gates={[
              { id: "xor", type: "XOR", x: 240, y: 60, inputs: ["A", "B"] },
              { id: "and", type: "AND", x: 240, y: 150, inputs: ["A", "B"] },
            ]}
            outputs={[
              { id: "sum", label: "SUM", x: 380, y: 60, source: "xor" },
              { id: "carry", label: "CARRY", x: 380, y: 150, source: "and" },
            ]}
            values={{ A: a, B: b, xor: sum, and: carry }}
            onToggleInput={toggle}
            width={480}
            height={200}
            minWidth={400}
            title="Half adder: an XOR gate and an AND gate"
            description={`A = ${a}, B = ${b}. SUM = ${sum}, CARRY = ${carry}.`}
          />
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            <GateInput label="A" value={a} onToggle={() => setA(invert)} />
            <GateInput label="B" value={b} onToggle={() => setB(invert)} />
            <GateOutput label="Sum" value={sum} />
            <GateOutput label="Carry" value={carry} />
          </div>
        </div>
        <div className="space-y-4 bg-surface-raised p-4 sm:p-5">
          <BitSum terms={[{ label: "A", value: a }, { label: "B", value: b }]} carry={carry} sum={sum} />
          <TruthTable
            inputLabels={["A", "B"]}
            outputLabels={["CARRY", "SUM"]}
            rows={truthTable(2, ([x, y]) => {
              const r = halfAdder(x!, y!);
              return [r.carry, r.sum];
            })}
            activeRow={rowIndex([a, b])}
            onSelectRow={([x, y]) => {
              setA(x!);
              setB(y!);
            }}
            caption="Half adder truth table"
          />
          <p className="text-sm text-ink-muted">
            {a && b ? "1 + 1 = 2, which is 10 in binary: SUM 0, CARRY 1 — like carrying the 1 in ordinary addition." : "SUM follows XOR (1 when the bits differ); CARRY follows AND (1 only when both are 1)."}
          </p>
        </div>
      </div>
    </div>
  );
}

/** Adds three bits (A, B and a carry in). Concept first, then the gates inside. */
export function FullAdder() {
  const [bits, setBits] = useState<Bit[]>([1, 0, 1]);
  const [showGates, setShowGates] = useState(false);
  const [a, b, cin] = bits as [Bit, Bit, Bit];
  const result = fullAdder(a, b, cin);
  const toggle = (i: number) => setBits((prev) => prev.map((v, j) => (j === i ? invert(v) : v)));
  const names = ["A", "B", "Carry in"];
  const ones = a + b + cin;

  return (
    <div>
      <div className="bg-logic-grid p-4 sm:p-6">
        <p className="eyebrow text-ink-subtle">Step 1 · The idea: count the 1s</p>
        <div className="mt-3 flex flex-wrap justify-center gap-3">
          {names.map((name, i) => (
            <GateInput key={name} label={name} value={bits[i]!} onToggle={() => toggle(i)} />
          ))}
        </div>
        <div className="mt-5 flex justify-center gap-3" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <motion.span key={i} animate={{ scale: i < ones ? 1 : 0.7, opacity: i < ones ? 1 : 0.25 }} className="size-8 rounded-full border-2 border-logic bg-logic/40 shadow-[0_0_16px_rgb(163_230_53/0.6)]" />
          ))}
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <BitSum terms={[{ label: "A", value: a }, { label: "B", value: b }, { label: "Cin", value: cin }]} carry={result.carryOut} sum={result.sum} />
          <div className="flex justify-center gap-3">
            <GateOutput label="Sum" value={result.sum} />
            <GateOutput label="Carry out" value={result.carryOut} />
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-ink-muted">
          {ones} one{ones === 1 ? "" : "s"} → {["00", "01", "10", "11"][ones]} in binary. <span className="text-logic">Sum</span> is the right-hand bit; <span className="text-amber">Carry out</span> is the left-hand bit, passed on to the next column.
        </p>
      </div>

      <div className="border-t border-line">
        <button
          type="button"
          aria-expanded={showGates}
          onClick={() => setShowGates((s) => !s)}
          className="flex min-h-12 w-full items-center justify-between gap-3 px-4 text-left font-semibold text-ink hover:text-logic sm:px-5"
        >
          Step 2 · Show the logic gates inside
          <ChevronDown className={cn("size-5 transition-transform", showGates && "rotate-180")} aria-hidden="true" />
        </button>
        <AnimatePresence initial={false}>
          {showGates ? (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="grid grid-cols-1 gap-px bg-line lg:grid-cols-[1.6fr_1fr]">
                <div className="bg-logic-grid p-3 sm:p-5">
                  <LogicCircuitView
                    inputs={[
                      { id: "A", label: "A", x: 60, y: 40 },
                      { id: "B", label: "B", x: 60, y: 110 },
                      { id: "C", label: "Cin", x: 60, y: 210 },
                    ]}
                    gates={[
                      { id: "x1", type: "XOR", x: 190, y: 60, inputs: ["A", "B"] },
                      { id: "a1", type: "AND", x: 190, y: 140, inputs: ["A", "B"] },
                      { id: "x2", type: "XOR", x: 350, y: 80, inputs: ["x1", "C"] },
                      { id: "a2", type: "AND", x: 350, y: 190, inputs: ["x1", "C"] },
                      { id: "o1", type: "OR", x: 500, y: 200, inputs: ["a2", "a1"] },
                    ]}
                    outputs={[
                      { id: "sum", label: "SUM", x: 590, y: 80, source: "x2" },
                      { id: "cout", label: "COUT", x: 590, y: 200, source: "o1" },
                    ]}
                    values={{ A: a, B: b, C: cin, x1: result.internal.xorAB, a1: result.internal.andAB, x2: result.sum, a2: result.internal.andCarry, o1: result.carryOut }}
                    onToggleInput={(id) => toggle(["A", "B", "C"].indexOf(id))}
                    width={680}
                    height={250}
                    minWidth={560}
                    title="Full adder: two half adders and an OR gate"
                    description={`A ${a}, B ${b}, carry in ${cin}: sum ${result.sum}, carry out ${result.carryOut}.`}
                  />
                  <p className="mt-2 text-sm text-ink-muted">
                    The first XOR/AND pair is a half adder for A + B. The second pair adds the carry in. If either pair makes a carry, the OR gate passes it on as Carry out.
                  </p>
                </div>
                <div className="bg-surface-raised p-4 sm:p-5">
                  <TruthTable
                    inputLabels={["A", "B", "Cin"]}
                    outputLabels={["COUT", "SUM"]}
                    rows={truthTable(3, ([x, y, z]) => {
                      const r = fullAdder(x!, y!, z!);
                      return [r.carryOut, r.sum];
                    })}
                    activeRow={rowIndex(bits)}
                    onSelectRow={setBits}
                    caption="Full adder truth table"
                  />
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Four full adders in a chain add two 4-bit numbers; each carry ripples to the next column. */
export function RippleAdder() {
  const [a, setA] = useState(6);
  const [b, setB] = useState(7);
  const aBits = toBits(a, 4);
  const bBits = toBits(b, 4);
  // Work right to left, like column addition.
  const sums: Bit[] = [0, 0, 0, 0];
  const carries: Bit[] = [0, 0, 0, 0, 0]; // carries[i] = carry INTO column i (index 4 = rightmost input carry)
  for (let i = 3; i >= 0; i--) {
    const r = fullAdder(aBits[i]!, bBits[i]!, carries[i + 1]!);
    sums[i] = r.sum;
    carries[i] = r.carryOut;
  }
  const total = fromBits([carries[0]!, ...sums]);
  const flip = (which: "a" | "b", i: number) => {
    const bitsNow = which === "a" ? aBits : bBits;
    const next = fromBits(bitsNow.map((v, j) => (j === i ? invert(v) : v)));
    if (which === "a") setA(next);
    else setB(next);
  };

  const row = (label: string, bitsRow: Bit[], which: "a" | "b") => (
    <tr key={label}>
      <th scope="row" className="pr-3 text-right font-mono text-sm text-ink-muted">
        {label}
      </th>
      <td />
      {bitsRow.map((v, i) => (
        <td key={i} className="p-1">
          <button
            type="button"
            role="switch"
            aria-checked={v === 1}
            aria-label={`${label}, bit worth ${2 ** (3 - i)}`}
            onClick={() => flip(which, i)}
            className={cn("size-11 rounded-lg border-2 font-mono text-xl font-bold", v ? "border-logic bg-logic/15 text-logic" : "border-line-strong text-ink-subtle")}
          >
            {v}
          </button>
        </td>
      ))}
      <td className="pl-3 font-mono text-ink-muted">= {which === "a" ? a : b}</td>
    </tr>
  );

  return (
    <div className="overflow-x-auto p-4 sm:p-5">
      <table className="mx-auto border-separate border-spacing-0 text-center">
        <caption className="sr-only">Four-bit ripple-carry adder</caption>
        <tbody>
          <tr aria-label="Carries">
            <th scope="row" className="pr-3 text-right font-mono text-xs text-amber">
              carry
            </th>
            <td />
            {carries.slice(1).map((c, i) => (
              <td key={i} className={cn("font-mono text-sm", c ? "text-amber" : "text-ink-subtle/50")}>
                {c}
              </td>
            ))}
            <td />
          </tr>
          {row("A", aBits, "a")}
          {row("B", bBits, "b")}
          <tr className="border-t">
            <th scope="row" className="pr-3 pt-2 text-right font-mono text-sm text-logic">
              A + B
            </th>
            <td className="pt-2 font-mono text-xl font-bold text-amber">{carries[0]}</td>
            {sums.map((s, i) => (
              <td key={i} className={cn("pt-2 font-mono text-xl font-bold", s ? "text-logic" : "text-ink-subtle")}>
                {s}
              </td>
            ))}
            <td className="pl-3 pt-2 font-mono text-ink" aria-live="polite">
              = {total}
            </td>
          </tr>
        </tbody>
      </table>
      <p className="mt-4 text-center text-sm text-ink-muted">
        Each column is one full adder. Its carry out becomes the next column&apos;s carry in — it &ldquo;ripples&rdquo; from right to left. {a} + {b} = {total}.
      </p>
    </div>
  );
}
