import type { Difficulty, IconKey } from "./types";

export interface Experiment {
  slug: string;
  title: string;
  summary: string;
  concepts: string[];
  difficulty: Difficulty;
  estimatedMinutes: number;
  icon: IconKey;
  available: boolean;
}

export const EXPERIMENTS: readonly Experiment[] = [
  {
    slug: "ohms-law",
    title: "Ohm's Law",
    summary: "Solve for voltage, current or resistance, run preset experiments, and watch a live circuit respond to every change.",
    concepts: ["Voltage", "Current", "Resistance", "Power"],
    difficulty: "beginner",
    estimatedMinutes: 10,
    icon: "gauge",
    available: true,
  },
  {
    slug: "series-parallel",
    title: "Series vs Parallel",
    summary: "Wire two bulbs in series or in parallel and see how voltage and current divide between them.",
    concepts: ["Series circuits", "Parallel circuits", "Equivalent resistance"],
    difficulty: "beginner",
    estimatedMinutes: 12,
    icon: "git-merge",
    available: true,
  },
  {
    slug: "voltage-divider",
    title: "Voltage Divider",
    summary: "Split a supply into any voltage you need with two resistors.",
    concepts: ["Voltage dividers", "Ratios"],
    difficulty: "beginner",
    estimatedMinutes: 10,
    icon: "layers",
    available: false,
  },
  {
    slug: "rc-charging",
    title: "RC Charging",
    summary: "Watch a capacitor charge and discharge through a resistor in real time.",
    concepts: ["Capacitance", "Time constant"],
    difficulty: "intermediate",
    estimatedMinutes: 12,
    icon: "timer",
    available: false,
  },
  {
    slug: "led-driver",
    title: "LED Driver",
    summary: "Pick a supply and LED colour, then find a safe series resistor.",
    concepts: ["Forward voltage", "Current limiting"],
    difficulty: "beginner",
    estimatedMinutes: 8,
    icon: "lightbulb",
    available: false,
  },
  {
    slug: "digital",
    title: "Logic Gate Playground",
    summary: "Add NOT, AND, OR, NAND, NOR, XOR and XNOR gates, wire them together, toggle the inputs and watch signals ripple to the outputs.",
    concepts: ["Logic gates", "Truth tables", "Combinational logic"],
    difficulty: "beginner",
    estimatedMinutes: 15,
    icon: "binary",
    available: true,
  },
  {
    slug: "build-the-logic",
    title: "Build the Logic",
    summary: "Five challenges: match a target behaviour by choosing the right gates — finishing with a half adder.",
    concepts: ["Logic gates", "Truth tables", "Half adder"],
    difficulty: "beginner",
    estimatedMinutes: 12,
    icon: "layers",
    available: true,
  },
];

export function getExperiment(slug: string): Experiment | undefined {
  return EXPERIMENTS.find((experiment) => experiment.slug === slug);
}
