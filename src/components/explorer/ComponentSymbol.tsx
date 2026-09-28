"use client";

import type { ReactNode } from "react";
import {
  AcSource,
  Ammeter,
  Battery,
  Capacitor,
  CircuitCanvas,
  Diode,
  Fuse,
  Ground,
  Lamp,
  Led,
  Mosfet,
  Motor,
  Potentiometer,
  PushButton,
  Relay,
  Resistor,
  Switch,
  Transistor,
  VoltageRegulator,
} from "@/components/circuit";

const TWO_TERMINAL_VIEWBOX = "-56 -40 112 80";
const THREE_TERMINAL_VIEWBOX = "-52 -50 104 100";
const GROUND_VIEWBOX = "-30 -6 60 42";

export interface SymbolEntry {
  /** What the symbol represents, e.g. "Polarized capacitor". */
  name: string;
  viewBox: string;
  render: () => ReactNode;
}

/**
 * Every schematic symbol CircuitForge can draw on its own, keyed by id. Used by
 * the component library and the Symbol Trainer.
 */
export const SYMBOL_LIBRARY: Readonly<Record<string, SymbolEntry>> = {
  resistor: { name: "Resistor", viewBox: TWO_TERMINAL_VIEWBOX, render: () => <Resistor x={0} y={0} focusable={false} /> },
  capacitor: { name: "Capacitor", viewBox: TWO_TERMINAL_VIEWBOX, render: () => <Capacitor x={0} y={0} focusable={false} /> },
  "capacitor-polarized": {
    name: "Polarized (electrolytic) capacitor",
    viewBox: TWO_TERMINAL_VIEWBOX,
    render: () => <Capacitor x={0} y={0} polarized focusable={false} />,
  },
  led: { name: "LED", viewBox: TWO_TERMINAL_VIEWBOX, render: () => <Led x={0} y={0} brightness={0.5} color="#fb7185" focusable={false} /> },
  diode: { name: "Diode", viewBox: TWO_TERMINAL_VIEWBOX, render: () => <Diode x={0} y={0} focusable={false} /> },
  battery: { name: "Battery", viewBox: TWO_TERMINAL_VIEWBOX, render: () => <Battery x={0} y={0} focusable={false} /> },
  switch: { name: "Switch", viewBox: TWO_TERMINAL_VIEWBOX, render: () => <Switch x={0} y={0} closed={false} focusable={false} /> },
  "push-no": {
    name: "Push button (normally open)",
    viewBox: TWO_TERMINAL_VIEWBOX,
    render: () => <PushButton x={0} y={0} kind="no" pressed={false} focusable={false} />,
  },
  "push-nc": {
    name: "Push button (normally closed)",
    viewBox: TWO_TERMINAL_VIEWBOX,
    render: () => <PushButton x={0} y={0} kind="nc" pressed={false} focusable={false} />,
  },
  transistor: { name: "NPN transistor", viewBox: THREE_TERMINAL_VIEWBOX, render: () => <Transistor x={0} y={0} focusable={false} /> },
  mosfet: { name: "N-channel MOSFET", viewBox: THREE_TERMINAL_VIEWBOX, render: () => <Mosfet x={0} y={0} focusable={false} /> },
  relay: { name: "Relay", viewBox: THREE_TERMINAL_VIEWBOX, render: () => <Relay x={0} y={0} focusable={false} /> },
  potentiometer: {
    name: "Potentiometer",
    viewBox: "-56 -46 112 80",
    render: () => <Potentiometer x={0} y={0} position={0.5} focusable={false} />,
  },
  "voltage-regulator": {
    name: "Voltage regulator",
    viewBox: "-50 -30 100 76",
    render: () => <VoltageRegulator x={0} y={0} focusable={false} />,
  },
  lamp: { name: "Lamp (light bulb)", viewBox: TWO_TERMINAL_VIEWBOX, render: () => <Lamp x={0} y={0} focusable={false} /> },
  motor: { name: "Motor", viewBox: TWO_TERMINAL_VIEWBOX, render: () => <Motor x={0} y={0} focusable={false} /> },
  fuse: { name: "Fuse", viewBox: TWO_TERMINAL_VIEWBOX, render: () => <Fuse x={0} y={0} focusable={false} /> },
  ground: { name: "Ground (0 V reference)", viewBox: GROUND_VIEWBOX, render: () => <Ground x={0} y={0} focusable={false} /> },
  earth: { name: "Earth ground", viewBox: GROUND_VIEWBOX, render: () => <Ground x={0} y={0} kind="earth" focusable={false} /> },
  chassis: { name: "Chassis ground", viewBox: GROUND_VIEWBOX, render: () => <Ground x={0} y={0} kind="chassis" focusable={false} /> },
  "ac-source": { name: "AC source", viewBox: TWO_TERMINAL_VIEWBOX, render: () => <AcSource x={0} y={0} focusable={false} /> },
  ammeter: { name: "Ammeter", viewBox: TWO_TERMINAL_VIEWBOX, render: () => <Ammeter x={0} y={0} focusable={false} /> },
};

/** Schematic symbol for a component (or any entry of the symbol library). */
export function ComponentSymbol({ slug, name, className }: { slug: string; name?: string; className?: string }) {
  const symbol = SYMBOL_LIBRARY[slug];
  if (!symbol) return null;
  return (
    <CircuitCanvas viewBox={symbol.viewBox} title={`${name ?? symbol.name} circuit symbol`} className={className} background="transparent">
      {symbol.render()}
    </CircuitCanvas>
  );
}

/** A symbol drawn without an accessible name — for quizzes where the name is the answer. */
export function AnonymousSymbol({ slug, className, label = "Mystery circuit symbol" }: { slug: string; className?: string; label?: string }) {
  const symbol = SYMBOL_LIBRARY[slug];
  if (!symbol) return null;
  return (
    <CircuitCanvas viewBox={symbol.viewBox} title={label} className={className} background="transparent">
      {symbol.render()}
    </CircuitCanvas>
  );
}
