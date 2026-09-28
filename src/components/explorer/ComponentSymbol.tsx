"use client";

import type { ReactNode } from "react";
import { Battery, Capacitor, CircuitCanvas, Diode, Led, Mosfet, Relay, Resistor, Switch, Transistor } from "@/components/circuit";

const TWO_TERMINAL_VIEWBOX = "-56 -40 112 80";
const THREE_TERMINAL_VIEWBOX = "-52 -50 104 100";

const SYMBOLS: Record<string, { viewBox: string; render: () => ReactNode }> = {
  resistor: { viewBox: TWO_TERMINAL_VIEWBOX, render: () => <Resistor x={0} y={0} focusable={false} /> },
  capacitor: { viewBox: TWO_TERMINAL_VIEWBOX, render: () => <Capacitor x={0} y={0} focusable={false} /> },
  led: { viewBox: TWO_TERMINAL_VIEWBOX, render: () => <Led x={0} y={0} brightness={0.5} color="#fb7185" focusable={false} /> },
  diode: { viewBox: TWO_TERMINAL_VIEWBOX, render: () => <Diode x={0} y={0} focusable={false} /> },
  battery: { viewBox: TWO_TERMINAL_VIEWBOX, render: () => <Battery x={0} y={0} focusable={false} /> },
  switch: { viewBox: TWO_TERMINAL_VIEWBOX, render: () => <Switch x={0} y={0} closed={false} focusable={false} /> },
  transistor: { viewBox: THREE_TERMINAL_VIEWBOX, render: () => <Transistor x={0} y={0} focusable={false} /> },
  mosfet: { viewBox: THREE_TERMINAL_VIEWBOX, render: () => <Mosfet x={0} y={0} focusable={false} /> },
  relay: { viewBox: THREE_TERMINAL_VIEWBOX, render: () => <Relay x={0} y={0} focusable={false} /> },
};

/** Schematic symbol for a component in the library. */
export function ComponentSymbol({ slug, name, className }: { slug: string; name: string; className?: string }) {
  const symbol = SYMBOLS[slug];
  if (!symbol) return null;
  return (
    <CircuitCanvas viewBox={symbol.viewBox} title={`${name} circuit symbol`} className={className} background="transparent">
      {symbol.render()}
    </CircuitCanvas>
  );
}
