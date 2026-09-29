import type { Difficulty, IconKey } from "./types";

export type LabCategory = "electricity" | "digital";

export const LAB_CATEGORIES: Record<LabCategory, { title: string; href: string; description: string }> = {
  electricity: {
    title: "Electricity Lab",
    href: "/lab/electronics",
    description: "Voltage, current, resistance, power, LEDs and capacitors — live circuits you can change.",
  },
  digital: {
    title: "Digital Lab",
    href: "/lab/digital",
    description: "Logic gates, truth tables, binary, adders and digital signals — toggle inputs and watch the logic.",
  },
};

export interface Experiment {
  slug: string;
  category: LabCategory;
  title: string;
  summary: string;
  concepts: string[];
  difficulty: Difficulty;
  estimatedMinutes: number;
  icon: IconKey;
  /** Where it lives if not at /lab/[slug] (e.g. embedded in the Digital Lab page). */
  href?: string;
  /** The lesson that teaches the idea behind it. */
  lessonHref?: string;
  /** Simplifications of the educational model, shown on the experiment page. */
  model?: string;
}

const SERIES_MODEL = "ideal wires and a battery with a little internal resistance; LEDs are modelled as a fixed forward voltage.";

export const EXPERIMENTS: readonly Experiment[] = [
  // Electricity
  { slug: "ohms-law", category: "electricity", title: "Ohm's Law", summary: "Solve V = I × R for any one value, run preset experiments, and watch a live circuit respond.", concepts: ["Voltage", "Current", "Resistance"], difficulty: "beginner", estimatedMinutes: 10, icon: "gauge", lessonHref: "/learn/electricity/ohms-law", model: "an ideal resistor that obeys Ohm's law exactly and ideal wires." },
  { slug: "voltage", category: "electricity", title: "Voltage", summary: "Probe two points and see voltage as the difference in electrical potential between them.", concepts: ["Voltage", "Potential difference"], difficulty: "beginner", estimatedMinutes: 8, icon: "zap", lessonHref: "/learn/electricity/voltage" },
  { slug: "current", category: "electricity", title: "Current", summary: "Count charge flowing past a point, then change the circuit and watch the current change.", concepts: ["Current", "Charge"], difficulty: "beginner", estimatedMinutes: 8, icon: "circuit", lessonHref: "/learn/electricity/current", model: SERIES_MODEL },
  { slug: "resistance", category: "electricity", title: "Resistance", summary: "Squeeze the path: more resistance, less current. Then see what length and thickness do.", concepts: ["Resistance", "Current"], difficulty: "beginner", estimatedMinutes: 8, icon: "layers", lessonHref: "/learn/electricity/resistance", model: "an idealised wire and resistor; real resistance also changes with temperature." },
  { slug: "power", category: "electricity", title: "Power", summary: "P = V × I: watch power grow as voltage and current change, and compare everyday devices.", concepts: ["Power", "Energy"], difficulty: "beginner", estimatedMinutes: 8, icon: "lightbulb", lessonHref: "/learn/electricity/electrical-power" },
  { slug: "series-parallel", category: "electricity", title: "Series vs Parallel", summary: "Wire two bulbs in series or in parallel and see how voltage and current divide between them.", concepts: ["Series", "Parallel", "Equivalent resistance"], difficulty: "beginner", estimatedMinutes: 12, icon: "git-merge", lessonHref: "/learn/electricity/series-and-parallel", model: "bulbs as fixed resistances (real bulbs' resistance rises as they heat up)." },
  { slug: "led-circuit", category: "electricity", title: "LED Circuit", summary: "Battery → resistor → LED. Adjust voltage and resistance, switch it on and off, and see why the resistor matters.", concepts: ["Forward voltage", "Current limiting"], difficulty: "beginner", estimatedMinutes: 10, icon: "lightbulb", lessonHref: "/learn/components/led", model: "the LED is a fixed 2 V drop with a 20 mA rating and 30 mA maximum; real LEDs vary by colour and part." },
  { slug: "capacitor-charging", category: "electricity", title: "Capacitor Charging", summary: "Charge and discharge a capacitor through a resistor. Stop, reset and compare the curve with the time constant τ = R × C.", concepts: ["Capacitance", "Time constant"], difficulty: "intermediate", estimatedMinutes: 12, icon: "timer", lessonHref: "/learn/components/capacitor", model: "an ideal capacitor and resistor with exact exponential charging." },
  { slug: "voltage-divider", category: "electricity", title: "Voltage Divider", summary: "Split a supply into any voltage you need with two resistors.", concepts: ["Voltage dividers", "Ratios"], difficulty: "beginner", estimatedMinutes: 8, icon: "layers", lessonHref: "/learn/components/resistor", model: "no load connected to the output (a load would pull the voltage down)." },
  { slug: "circuit-builder", category: "electricity", title: "Circuit Builder", summary: "Fill a loop with batteries, switches, resistors, LEDs, lamps, diodes and wires — the circuit engine works out what happens.", concepts: ["Series circuits", "Open circuits", "Short circuits"], difficulty: "beginner", estimatedMinutes: 15, icon: "circuit", lessonHref: "/learn/components/build-your-first-circuit" },
  // Digital
  { slug: "logic-gates", category: "digital", title: "Logic Gates", summary: "NOT, AND, OR, NAND, NOR, XOR and XNOR: clickable inputs, live outputs, symbols and truth tables.", concepts: ["Logic gates", "Truth tables"], difficulty: "beginner", estimatedMinutes: 10, icon: "binary", href: "/lab/digital#gates", lessonHref: "/learn/digital-electronics/logic-gates" },
  { slug: "logic-playground", category: "digital", title: "Logic Playground", summary: "Add gates, wire them together, toggle A, B and C and watch the signals ripple to the outputs.", concepts: ["Combining gates"], difficulty: "beginner", estimatedMinutes: 15, icon: "git-merge", href: "/lab/digital#playground", lessonHref: "/learn/digital-electronics/combining-gates" },
  { slug: "truth-tables", category: "digital", title: "Truth Table Builder", summary: "Choose a gate and 1, 2 or 3 inputs; the truth table is generated for you.", concepts: ["Truth tables"], difficulty: "beginner", estimatedMinutes: 8, icon: "layers", lessonHref: "/learn/digital-electronics/truth-tables" },
  { slug: "binary", category: "digital", title: "Binary Converter", summary: "Toggle bits and watch the decimal value, or type a number and see its binary.", concepts: ["Binary", "Bits", "Bytes"], difficulty: "beginner", estimatedMinutes: 8, icon: "binary", lessonHref: "/learn/digital-electronics/binary" },
  { slug: "half-adder", category: "digital", title: "Half Adder", summary: "Two gates that add: SUM = XOR, CARRY = AND.", concepts: ["Binary addition"], difficulty: "intermediate", estimatedMinutes: 8, icon: "cpu", lessonHref: "/learn/digital-electronics/half-adder" },
  { slug: "full-adder", category: "digital", title: "Full Adder", summary: "Add A, B and a carry in — then chain four adders to add 4-bit numbers.", concepts: ["Binary addition", "Carry"], difficulty: "intermediate", estimatedMinutes: 12, icon: "cpu", lessonHref: "/learn/digital-electronics/full-adder" },
  { slug: "digital-signal", category: "digital", title: "Digital Signal", summary: "Shape a square wave: frequency, duty cycle and voltage levels, with edges and period labelled.", concepts: ["HIGH/LOW", "Frequency", "Duty cycle"], difficulty: "beginner", estimatedMinutes: 8, icon: "radio", lessonHref: "/learn/digital-electronics/digital-signals", model: "perfectly square edges; real signals take a few nanoseconds to switch." },
  { slug: "build-the-logic", category: "digital", title: "Build the Logic", summary: "Five challenges: match a target behaviour by choosing the right gates — finishing with a half adder.", concepts: ["Logic gates", "Half adder"], difficulty: "beginner", estimatedMinutes: 12, icon: "flask" },
];

export function getExperiment(slug: string): Experiment | undefined {
  return EXPERIMENTS.find((experiment) => experiment.slug === slug);
}

export function experimentHref(experiment: Experiment): string {
  return experiment.href ?? `/lab/${experiment.slug}`;
}

export function experimentsIn(category: LabCategory): Experiment[] {
  return EXPERIMENTS.filter((e) => e.category === category);
}
