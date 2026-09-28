import type { ComponentType } from "react";
import { BatteryModel } from "@/components/component-lab/BatteryModel";
import { DiodeLab, HalfWaveRectifier } from "@/components/component-lab/DiodeLab";
import { LedCircuitLab } from "@/components/component-lab/LedCircuitLab";
import { MosfetSwitch } from "@/components/component-lab/MosfetSwitch";
import { PotentiometerLab } from "@/components/component-lab/PotentiometerLab";
import { RcChargingComparison } from "@/components/component-lab/RcChargingComparison";
import { RegulatorDemo } from "@/components/component-lab/RegulatorDemo";
import { RelayDemo } from "@/components/component-lab/RelayDemo";
import { ResistorLab } from "@/components/component-lab/ResistorLab";
import { SwitchLab } from "@/components/component-lab/SwitchLab";
import { TransistorSwitch } from "@/components/component-lab/TransistorSwitch";
import { VoltageDivider } from "@/components/component-lab/VoltageDivider";

export interface ExperimentEntry {
  title: string;
  prompt: string;
  Demo: ComponentType;
}

/**
 * The interactive demos shown on each component's page. Every component in the
 * library has at least one, so nothing is a static fact sheet.
 */
export const COMPONENT_EXPERIMENTS: Readonly<Record<string, readonly ExperimentEntry[]>> = {
  resistor: [
    { title: "Resistance vs current", prompt: "Change the resistance and watch the current bar.", Demo: ResistorLab },
    { title: "Voltage divider", prompt: "Two resistors split a voltage.", Demo: VoltageDivider },
  ],
  led: [{ title: "Battery → resistor → LED", prompt: "Find a safe, bright setting — then remove the resistor.", Demo: LedCircuitLab }],
  capacitor: [{ title: "Charging curve", prompt: "Bigger R or C means slower charging.", Demo: RcChargingComparison }],
  diode: [
    { title: "One-way valve", prompt: "Reverse the diode and watch the current stop.", Demo: DiodeLab },
    { title: "Rectification", prompt: "What does a diode do to AC?", Demo: HalfWaveRectifier },
  ],
  battery: [{ title: "Voltage, capacity and current", prompt: "The circuit — not the battery — sets the current.", Demo: BatteryModel }],
  switch: [{ title: "Switches in a circuit", prompt: "Try a toggle, a push-to-make and a push-to-break.", Demo: SwitchLab }],
  transistor: [{ title: "NPN switch", prompt: "Set the input HIGH and LOW.", Demo: TransistorSwitch }],
  mosfet: [{ title: "MOSFET motor driver", prompt: "A tiny gate signal switches a big load.", Demo: MosfetSwitch }],
  relay: [{ title: "Relay: control vs load", prompt: "Energise the coil and watch the contact move.", Demo: RelayDemo }],
  potentiometer: [{ title: "Turn the knob", prompt: "Drag the knob or use the arrow keys.", Demo: PotentiometerLab }],
  "voltage-regulator": [{ title: "12 V in, 5 V out", prompt: "Lower the input until it stops regulating.", Demo: RegulatorDemo }],
};
