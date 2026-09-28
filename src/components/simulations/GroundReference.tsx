"use client";

import { useState } from "react";
import {
  Battery,
  CircuitCanvas,
  CircuitNode,
  CurrentFlow,
  Ground,
  Resistor,
  Wire,
  rectLoop,
} from "@/components/circuit";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { solveLoop } from "@/lib/circuit-sim";
import { formatAmps, formatFixed } from "@/lib/format";

type NodeId = "A" | "B" | "C";

const SUPPLY = 9;
const R1 = 1000;
const R2 = 2000;
const LEFT = 80;
const RIGHT = 400;
const TOP = 70;
const BOTTOM = 230;
const LOOP = rectLoop(LEFT, TOP, RIGHT, BOTTOM, 14);

/** Where each node sits in the drawing. */
const NODES: Record<NodeId, { x: number; y: number; where: string }> = {
  A: { x: 150, y: TOP, where: "battery + side" },
  B: { x: 345, y: TOP, where: "between R1 and R2" },
  C: { x: 240, y: BOTTOM, where: "battery − side" },
};

/**
 * "Ground" is simply the point we agree to call 0 V. Move it and every
 * voltage label changes — but the circuit, the current and every voltage
 * *difference* stay exactly the same.
 */
export function GroundReference() {
  const [ground, setGround] = useState<NodeId>("C");
  const solution = solveLoop({ voltage: SUPPLY }, [
    { kind: "resistor", id: "R1", ohms: R1 },
    { kind: "resistor", id: "R2", ohms: R2 },
  ]);
  // Potentials measured from the battery's − terminal: [+ terminal, after R1, after R2 (= −)].
  const absolute: Record<NodeId, number> = {
    A: solution.nodePotentials[0]!,
    B: solution.nodePotentials[1]!,
    C: solution.nodePotentials[2]!,
  };
  const relative = (node: NodeId) => absolute[node] - absolute[ground];
  const signed = (v: number) => `${v > 0.001 ? "+" : v < -0.001 ? "−" : ""}${formatFixed(Math.abs(v), 1)} V`;

  return (
    <div>
      <div className="bg-breadboard px-2 py-4 sm:px-6">
        <CircuitCanvas
          viewBox="0 0 480 300"
          interactive
          title="Choosing where ground is"
          description={`A ${SUPPLY} volt battery with two resistors in a loop. Ground (0 V) is at node ${ground}. Relative to ground: A is ${signed(relative("A"))}, B is ${signed(relative("B"))}, C is ${signed(relative("C"))}.`}
          className="mx-auto max-w-2xl"
        >
          <Wire d={LOOP} energized />
          <CurrentFlow d={LOOP} active speed={40} />
          <Battery x={LEFT} y={(TOP + BOTTOM) / 2} rotation={-90} detail={`${SUPPLY} V`} energized labelPlacement="right" labelOffset={26} />
          <Resistor x={250} y={TOP} name="R1" detail="1 kΩ" energized labelPlacement="bottom" labelOffset={22} />
          <Resistor x={RIGHT} y={(TOP + BOTTOM) / 2} rotation={90} name="R2" detail="2 kΩ" energized labelPlacement="left" labelOffset={34} />
          <text x={250} y={TOP - 26} textAnchor="middle" fontSize={11} fill="#94a3b8" fontFamily="var(--font-mono)" aria-hidden="true">
            R1 1 kΩ
          </text>
          <text x={RIGHT + 26} y={(TOP + BOTTOM) / 2} dominantBaseline="central" fontSize={11} fill="#94a3b8" fontFamily="var(--font-mono)" aria-hidden="true">
            R2 2 kΩ
          </text>

          {(Object.keys(NODES) as NodeId[]).map((node) => {
            const { x, y } = NODES[node];
            const isGround = node === ground;
            const labelY = y === TOP ? y - 30 : y + (isGround ? 60 : 30);
            return (
              <g key={node}>
                <CircuitNode x={x} y={y} active radius={5} />
                {isGround ? <Ground x={x} y={y} focusable={false} /> : null}
                <g aria-hidden="true">
                  <rect x={x - 42} y={labelY - 12} width={84} height={24} rx={6} fill="#0f1621" stroke={isGround ? "#34d399" : "#2a3a50"} />
                  <text x={x} y={labelY} textAnchor="middle" dominantBaseline="central" fontSize={12} fontFamily="var(--font-mono)" fill={isGround ? "#34d399" : "#e8eef6"}>
                    {node}: {signed(relative(node))}
                  </text>
                </g>
              </g>
            );
          })}
        </CircuitCanvas>
      </div>
      <div className="grid gap-4 border-t border-line p-4 sm:p-5 md:grid-cols-[1fr_1.2fr] md:items-center">
        <SegmentedControl
          label="Place ground (0 V) at…"
          options={(Object.keys(NODES) as NodeId[]).map((node) => ({ value: node, label: `Node ${node}`, ariaLabel: `Node ${node}, ${NODES[node].where}` }))}
          value={ground}
          onChange={setGround}
        />
        <div className="grid grid-cols-3 gap-2 font-mono text-sm" aria-live="polite">
          <p className="rounded-lg border border-line bg-void/40 px-3 py-2 text-ink-muted">
            A→B <span className="block text-cyan">{formatFixed(absolute.A - absolute.B, 1)} V</span>
          </p>
          <p className="rounded-lg border border-line bg-void/40 px-3 py-2 text-ink-muted">
            B→C <span className="block text-cyan">{formatFixed(absolute.B - absolute.C, 1)} V</span>
          </p>
          <p className="rounded-lg border border-line bg-void/40 px-3 py-2 text-ink-muted">
            Current <span className="block text-cyan">{formatAmps(solution.current, 2)}</span>
          </p>
        </div>
      </div>
      <p className="border-t border-line px-4 py-3 text-sm text-ink-muted sm:px-5">
        {ground === "C"
          ? "Ground at the battery's − terminal is the usual choice, so every other point reads positive."
          : ground === "A"
            ? "With ground at the + side, the other points read negative — the circuit hasn't changed, only our reference."
            : "Ground in the middle gives both positive and negative readings. Real circuits sometimes do exactly this (a “split supply”)."}{" "}
        Notice the voltage <em>differences</em> and the current never change.
      </p>
    </div>
  );
}
