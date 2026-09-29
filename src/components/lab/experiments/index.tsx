import type { ComponentType } from "react";
import { FullAdder, HalfAdder, RippleAdder } from "@/components/digital/Adders";
import { BinaryConverter } from "@/components/digital/BinaryConverter";
import { BuildTheLogic } from "@/components/digital/BuildTheLogic";
import { DigitalSignalExplorer } from "@/components/digital/DigitalSignalExplorer";
import { TruthTableBuilder } from "@/components/digital/TruthTableBuilder";
import { LedCircuitLab } from "@/components/component-lab/LedCircuitLab";
import { VoltageDivider } from "@/components/component-lab/VoltageDivider";
import { ChargeCounter } from "@/components/electricity/ChargeCounter";
import { VoltageExplorer } from "@/components/electricity/VoltageExplorer";
import { CapacitorLab } from "@/components/explorer/deep-dives/CapacitorDeepDive";
import { CircuitExplorer } from "@/components/simulations/CircuitExplorer";
import { PotentialDifference } from "@/components/simulations/PotentialDifference";
import { PowerVisualizer } from "@/components/simulations/PowerVisualizer";
import { ResistanceExplorer, WireResistanceFactors } from "@/components/simulations/ResistanceExplorer";
import { InteractivePanel } from "@/components/ui/InteractivePanel";
import { CircuitBuilder } from "../CircuitBuilder";
import { OhmsLawLab } from "../OhmsLawLab";
import { SeriesParallelExperiment } from "../SeriesParallelExperiment";

/** Frame for simulations that don't bring their own panel. */
function Panel({ title, prompt, children }: { title: string; prompt?: string; children: React.ReactNode }) {
  return (
    <InteractivePanel title={title} prompt={prompt} experiment bodyClassName="p-0">
      {children}
    </InteractivePanel>
  );
}

function VoltageLab() {
  return (
    <div className="space-y-8">
      <Panel title="Two points, one difference" prompt="Move the probes: voltage is always measured between two points.">
        <PotentialDifference />
      </Panel>
      <Panel title="Voltage in a circuit" prompt="Change the battery and see where the voltage goes.">
        <VoltageExplorer />
      </Panel>
    </div>
  );
}

function CurrentLab() {
  return (
    <div className="space-y-8">
      <Panel title="Counting charge" prompt="Current is how much charge passes a point each second.">
        <ChargeCounter />
      </Panel>
      <Panel title="Current in a circuit" prompt="Change voltage and resistance; watch the flow and the ammeter.">
        <CircuitExplorer
          parts={{ switch: true, resistor: true, led: true }}
          initial={{ voltage: 9, resistance: 470, closed: true }}
          controls={{ voltage: [3, 12], resistance: [220, 4700], direction: true }}
          readouts
          title="Current in a battery, switch, resistor and LED circuit"
        />
      </Panel>
    </div>
  );
}

function ResistanceLab() {
  return (
    <div className="space-y-8">
      <Panel title="Resistance vs current" prompt="More resistance, less current (for the same voltage).">
        <ResistanceExplorer />
      </Panel>
      <Panel title="What makes a wire resistive?" prompt="Change the length and thickness.">
        <WireResistanceFactors />
      </Panel>
    </div>
  );
}

const single = (title: string, prompt: string, Demo: ComponentType) =>
  function SingleExperiment() {
    return (
      <Panel title={title} prompt={prompt}>
        <Demo />
      </Panel>
    );
  };

function FullAdderLab() {
  return (
    <div className="space-y-8">
      <Panel title="Full adder" prompt="Concept first, then open the gates.">
        <FullAdder />
      </Panel>
      <Panel title="4-bit ripple adder" prompt="Chain four full adders; watch the carries ripple.">
        <RippleAdder />
      </Panel>
    </div>
  );
}

/**
 * Maps experiment slugs (content/experiments.ts) to their interactive
 * implementation. Experiments reuse the same simulations as the lessons.
 */
export const EXPERIMENT_COMPONENTS: Readonly<Record<string, ComponentType>> = {
  "ohms-law": OhmsLawLab,
  voltage: VoltageLab,
  current: CurrentLab,
  resistance: ResistanceLab,
  power: single("Power", "Adjust voltage and current; the rectangle's area is the power.", PowerVisualizer),
  "series-parallel": SeriesParallelExperiment,
  "led-circuit": single("LED circuit", "Find a safe, bright setting — then remove the resistor.", LedCircuitLab),
  "capacitor-charging": CapacitorLab,
  "voltage-divider": single("Voltage divider", "Two resistors split a voltage.", VoltageDivider),
  "circuit-builder": CircuitBuilder,
  "truth-tables": single("Truth Table Builder", "Pick the number of inputs and a gate.", TruthTableBuilder),
  binary: single("Binary converter", "Tap bits, or type a decimal number.", BinaryConverter),
  "half-adder": single("Half adder", "Toggle A and B: SUM = XOR, CARRY = AND.", HalfAdder),
  "full-adder": FullAdderLab,
  "digital-signal": single("Digital signal", "Change frequency, duty cycle and voltage levels.", DigitalSignalExplorer),
  "build-the-logic": single("Build the Logic", "Choose the gates that match each target.", BuildTheLogic),
};
