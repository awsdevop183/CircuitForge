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
    slug: "logic-gates",
    title: "Logic Gates",
    summary: "Toggle inputs and trace how AND, OR and NOT gates make decisions.",
    concepts: ["Binary", "Boolean logic"],
    difficulty: "intermediate",
    estimatedMinutes: 12,
    icon: "binary",
    available: false,
  },
];

export function getExperiment(slug: string): Experiment | undefined {
  return EXPERIMENTS.find((experiment) => experiment.slug === slug);
}
