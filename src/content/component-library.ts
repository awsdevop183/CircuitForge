import type { Difficulty } from "./types";

export type ComponentCategory = "passive" | "semiconductor" | "source" | "control";

export const COMPONENT_CATEGORY_LABELS: Record<ComponentCategory, string> = {
  passive: "Passive",
  semiconductor: "Semiconductor",
  source: "Power source",
  control: "Switching & control",
};

export interface ComponentFact {
  label: string;
  value: string;
}

export interface ElectronicComponent {
  slug: string;
  name: string;
  /** Schematic reference designator prefix, e.g. "R" for resistors. */
  designator: string;
  category: ComponentCategory;
  difficulty: Difficulty;
  /** One-line description of what the component does. */
  summary: string;
  /** Where it is commonly used. */
  uses: string[];
  facts: ComponentFact[];
  /** Whether a full interactive deep-dive page exists. */
  hasDeepDive: boolean;
}

export const COMPONENTS: readonly ElectronicComponent[] = [
  {
    slug: "resistor",
    name: "Resistor",
    designator: "R",
    category: "passive",
    difficulty: "beginner",
    summary: "Opposes the flow of current, setting how much current flows for a given voltage.",
    uses: ["Limiting LED current", "Voltage dividers", "Pull-up / pull-down on inputs", "Setting amplifier gain"],
    facts: [
      { label: "Unit", value: "Ohm (Ω)" },
      { label: "Polarised", value: "No — either way round" },
      { label: "Key rule", value: "V = I × R" },
    ],
    hasDeepDive: true,
  },
  {
    slug: "capacitor",
    name: "Capacitor",
    designator: "C",
    category: "passive",
    difficulty: "beginner",
    summary: "Stores electrical charge between two plates and releases it when needed.",
    uses: ["Smoothing power supplies", "Timing circuits", "Filtering noise", "Camera flashes"],
    facts: [
      { label: "Unit", value: "Farad (F)" },
      { label: "Polarised", value: "Electrolytics: yes" },
      { label: "Key rule", value: "τ = R × C" },
    ],
    hasDeepDive: true,
  },
  {
    slug: "led",
    name: "LED",
    designator: "D",
    category: "semiconductor",
    difficulty: "beginner",
    summary: "A diode that emits light when current flows through it in the forward direction.",
    uses: ["Indicator lights", "Displays and screens", "Lighting", "Remote controls (infrared)"],
    facts: [
      { label: "Forward voltage", value: "≈ 1.8 – 3.3 V" },
      { label: "Typical current", value: "5 – 20 mA" },
      { label: "Polarised", value: "Yes — long leg is +" },
    ],
    hasDeepDive: true,
  },
  {
    slug: "diode",
    name: "Diode",
    designator: "D",
    category: "semiconductor",
    difficulty: "beginner",
    summary: "Lets current flow in one direction only — an electrical one-way valve.",
    uses: ["Reverse-polarity protection", "Rectifying AC to DC", "Protecting circuits from coil spikes"],
    facts: [
      { label: "Forward voltage", value: "≈ 0.7 V (silicon)" },
      { label: "Polarised", value: "Yes — band marks cathode" },
      { label: "Common part", value: "1N4007" },
    ],
    hasDeepDive: false,
  },
  {
    slug: "battery",
    name: "Battery",
    designator: "BT",
    category: "source",
    difficulty: "beginner",
    summary: "Converts stored chemical energy into a steady voltage that pushes current around a circuit.",
    uses: ["Portable devices", "Backup power", "Remote sensors", "Electric vehicles"],
    facts: [
      { label: "AA cell", value: "1.5 V" },
      { label: "Li-ion cell", value: "3.7 V nominal" },
      { label: "Polarised", value: "Yes — + and − terminals" },
    ],
    hasDeepDive: false,
  },
  {
    slug: "switch",
    name: "Switch",
    designator: "S",
    category: "control",
    difficulty: "beginner",
    summary: "Opens or closes a circuit path mechanically, starting or stopping current flow.",
    uses: ["Power buttons", "Keyboard keys", "Limit sensors on machines", "User input to microcontrollers"],
    facts: [
      { label: "Common types", value: "SPST, SPDT, push-button" },
      { label: "Polarised", value: "No" },
      { label: "Watch out for", value: "Contact bounce" },
    ],
    hasDeepDive: false,
  },
  {
    slug: "transistor",
    name: "Transistor",
    designator: "Q",
    category: "semiconductor",
    difficulty: "intermediate",
    summary: "Uses a small base current to control a much larger collector current — a switch or amplifier.",
    uses: ["Switching LEDs and buzzers from a microcontroller", "Audio amplifiers", "Logic circuits"],
    facts: [
      { label: "Pins", value: "Base, Collector, Emitter" },
      { label: "Common part", value: "2N2222, BC547" },
      { label: "Types", value: "NPN, PNP" },
    ],
    hasDeepDive: false,
  },
  {
    slug: "mosfet",
    name: "MOSFET",
    designator: "Q",
    category: "semiconductor",
    difficulty: "intermediate",
    summary: "A voltage-controlled switch that can drive large currents with almost no control current.",
    uses: ["Motor drivers", "LED strips", "Power supplies", "Battery protection"],
    facts: [
      { label: "Pins", value: "Gate, Drain, Source" },
      { label: "Controlled by", value: "Gate voltage" },
      { label: "Common part", value: "IRLZ44N" },
    ],
    hasDeepDive: false,
  },
  {
    slug: "relay",
    name: "Relay",
    designator: "K",
    category: "control",
    difficulty: "intermediate",
    summary: "An electrically operated switch: a small coil current moves contacts that switch a separate circuit.",
    uses: ["Switching mains appliances", "Automotive lighting", "Industrial control panels", "Isolating circuits"],
    facts: [
      { label: "Parts", value: "Coil + contacts" },
      { label: "Contacts", value: "NO, NC, COM" },
      { label: "Needs", value: "Flyback diode on coil" },
    ],
    hasDeepDive: false,
  },
];

export function getComponent(slug: string): ElectronicComponent | undefined {
  return COMPONENTS.find((component) => component.slug === slug);
}
