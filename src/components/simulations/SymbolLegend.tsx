"use client";

import type { ReactNode } from "react";
import { Battery, CircuitCanvas, Ground, Led, Resistor, Switch, Wire } from "@/components/circuit";

const SYMBOLS: { name: string; job: string; render: () => ReactNode; viewBox?: string }[] = [
  { name: "Battery", job: "Source: provides the voltage. Long plate = +", render: () => <Battery x={0} y={0} focusable={false} /> },
  { name: "Wire", job: "Path: connects parts with (almost) no resistance", render: () => <Wire points={[[-40, 0], [40, 0]]} /> },
  { name: "Switch", job: "Control: opens or closes the path", render: () => <Switch x={0} y={0} closed={false} focusable={false} /> },
  { name: "Resistor", job: "Limits how much current flows", render: () => <Resistor x={0} y={0} focusable={false} /> },
  { name: "LED", job: "Load: turns electrical energy into light", render: () => <Led x={0} y={0} brightness={0.5} color="#fb7185" focusable={false} /> },
  { name: "Ground", job: "The 0 V reference point (Lesson 14)", render: () => <Ground x={0} y={-14} focusable={false} />, viewBox: "-50 -30 100 60" },
];

/** The visual alphabet of circuit diagrams. */
export function SymbolLegend() {
  return (
    <ul className="grid grid-cols-2 gap-px bg-line sm:grid-cols-3">
      {SYMBOLS.map((symbol) => (
        <li key={symbol.name} className="flex flex-col items-center gap-2 bg-surface-raised p-4 text-center">
          <CircuitCanvas viewBox={symbol.viewBox ?? "-50 -30 100 60"} title={`${symbol.name} symbol`} background="transparent" className="h-14 w-auto max-w-full">
            {symbol.render()}
          </CircuitCanvas>
          <p className="font-semibold text-ink">{symbol.name}</p>
          <p className="text-xs text-ink-muted">{symbol.job}</p>
        </li>
      ))}
    </ul>
  );
}
