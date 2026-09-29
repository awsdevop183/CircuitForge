import { AnonymousSymbol } from "@/components/explorer/ComponentSymbol";
import { ComponentIllustration } from "@/components/illustrations/ComponentIllustration";
import type { QuizQuestion } from "./lessons/types";

/* ------------------------------------------------------------------ */
/* Symbol Trainer                                                      */
/* ------------------------------------------------------------------ */

interface SymbolFact {
  /** Id in SYMBOL_LIBRARY. */
  symbol: string;
  answer: string;
  distractors: [string, string, string];
  explanation: string;
}

const SYMBOL_FACTS: readonly SymbolFact[] = [
  { symbol: "resistor", answer: "Resistor", distractors: ["Fuse", "Capacitor", "Battery"], explanation: "A zig-zag (or a plain rectangle in European drawings) is a resistor. It limits current." },
  { symbol: "capacitor", answer: "Capacitor", distractors: ["Battery", "Switch", "Resistor"], explanation: "Two parallel plates with a gap: a capacitor stores charge between them. Both plates are the same length — a battery's are not." },
  { symbol: "capacitor-polarized", answer: "Polarized (electrolytic) capacitor", distractors: ["Battery", "Diode", "Non-polarized capacitor"], explanation: "One curved plate (often with a + mark on the other side) means the capacitor is polarized: it must go in the right way round." },
  { symbol: "led", answer: "LED", distractors: ["Diode", "Lamp", "Transistor"], explanation: "A diode triangle with arrows pointing outwards: light is coming out. That's a light-emitting diode." },
  { symbol: "diode", answer: "Diode", distractors: ["LED", "Transistor", "Fuse"], explanation: "A triangle pointing at a bar. Current flows in the direction of the arrow and is blocked the other way." },
  { symbol: "battery", answer: "Battery", distractors: ["Capacitor", "Ground", "AC source"], explanation: "Long and short plates: the long plate is +, the short plate is −. Two or more pairs mean several cells." },
  { symbol: "switch", answer: "Switch", distractors: ["Relay", "Fuse", "Push button"], explanation: "A lever that can lift away from a contact: a simple on/off switch, drawn open here." },
  { symbol: "push-no", answer: "Push button (normally open)", distractors: ["Push button (normally closed)", "Toggle switch", "Fuse"], explanation: "The bar sits above the contacts, so the circuit is open until you press it down. Like a doorbell." },
  { symbol: "push-nc", answer: "Push button (normally closed)", distractors: ["Push button (normally open)", "Toggle switch", "Relay"], explanation: "The bar touches the contacts until pressed, so pressing it breaks the circuit. Used for stop buttons." },
  { symbol: "transistor", answer: "NPN transistor", distractors: ["MOSFET", "Diode", "Relay"], explanation: "A circle with a base line, and an arrow on the emitter pointing out: an NPN bipolar transistor." },
  { symbol: "mosfet", answer: "N-channel MOSFET", distractors: ["NPN transistor", "Relay", "Capacitor"], explanation: "The gate is drawn separate from the channel — a small gap, because the gate is insulated. That gap is the MOSFET's giveaway." },
  { symbol: "relay", answer: "Relay", distractors: ["Transistor", "Motor", "Switch"], explanation: "A coil drawn next to a switch contact: energising the coil moves the switch." },
  { symbol: "potentiometer", answer: "Potentiometer", distractors: ["Resistor", "Fuse", "Switch"], explanation: "A resistor with an arrow (the wiper) pointing at it: the wiper slides along to pick off a voltage." },
  { symbol: "voltage-regulator", answer: "Voltage regulator", distractors: ["Relay", "Transistor", "Battery"], explanation: "A box with IN, OUT and GND pins: a regulator turns a higher voltage into a steady lower one." },
  { symbol: "lamp", answer: "Lamp (light bulb)", distractors: ["LED", "Motor", "Ammeter"], explanation: "A circle with a filament (or a cross) inside is a lamp — a light bulb." },
  { symbol: "motor", answer: "Motor", distractors: ["Ammeter", "Lamp", "AC source"], explanation: "A circle with an M: a motor turns electrical energy into motion." },
  { symbol: "fuse", answer: "Fuse", distractors: ["Resistor", "Switch", "Capacitor"], explanation: "A thin line through a box: the fuse wire melts and breaks the circuit if the current is too high." },
  { symbol: "ground", answer: "Ground (0 V reference)", distractors: ["Earth ground", "Battery", "Chassis ground"], explanation: "A triangle pointing down is the circuit's 0 V reference — the point we measure voltages from." },
  { symbol: "earth", answer: "Earth ground", distractors: ["Ground (0 V reference)", "Chassis ground", "Capacitor"], explanation: "Three shrinking lines: a real connection to the Earth, used for safety in mains equipment." },
  { symbol: "ac-source", answer: "AC source", distractors: ["Motor", "Battery", "Lamp"], explanation: "A circle with a wave inside: a source whose voltage swings back and forth (alternating current)." },
  { symbol: "ammeter", answer: "Ammeter", distractors: ["Motor", "Lamp", "Voltmeter"], explanation: "A circle with an A: an ammeter measures current, so it goes in series with the circuit." },
];

const LETTERS = ["a", "b", "c", "d"] as const;

function options(answer: string, distractors: readonly string[]) {
  return [answer, ...distractors].map((label, i) => ({ id: LETTERS[i]!, label }));
}

export const SYMBOL_TRAINER_QUESTIONS: readonly QuizQuestion[] = SYMBOL_FACTS.map((fact) => ({
  id: `symbol-${fact.symbol}`,
  type: "identify",
  prompt: "Which component does this symbol represent?",
  visual: <AnonymousSymbol slug={fact.symbol} className="h-28 w-auto max-w-full" />,
  options: options(fact.answer, fact.distractors),
  correctOptionId: "a",
  explanation: fact.explanation,
}));

/* ------------------------------------------------------------------ */
/* Identify the Component                                              */
/* ------------------------------------------------------------------ */

interface IdentifyFact {
  slug: string;
  answer: string;
  distractors: [string, string, string];
  explanation: string;
}

const IDENTIFY_FACTS: readonly IdentifyFact[] = [
  { slug: "resistor", answer: "Limiting current", distractors: ["Storing energy for later", "Making light", "Switching a separate circuit"], explanation: "That's a resistor — the coloured bands give its value. It limits current, for example to protect an LED." },
  { slug: "led", answer: "Producing light", distractors: ["Limiting current", "Measuring temperature", "Storing charge"], explanation: "That's an LED: a diode that glows when current flows through it the right way. It always needs a current-limiting resistor." },
  { slug: "capacitor", answer: "Storing and releasing charge", distractors: ["Making sound", "Blocking current in one direction", "Turning a knob into a voltage"], explanation: "That's an electrolytic capacitor. It stores charge, smooths supplies and sets timing. Mind the stripe: it marks the − leg." },
  { slug: "diode", answer: "Letting current flow one way only", distractors: ["Making light", "Adjusting volume", "Stepping down voltage"], explanation: "That's a diode. The band marks the cathode. It's used to rectify AC and to protect circuits from reverse polarity." },
  { slug: "battery", answer: "Supplying energy (a voltage)", distractors: ["Limiting current", "Switching a load", "Storing a program"], explanation: "That's a battery. It provides the push (voltage); the circuit's resistance decides how much current flows." },
  { slug: "switch", answer: "Opening and closing a circuit by hand", distractors: ["Amplifying a signal", "Storing charge", "Regulating voltage"], explanation: "That's a toggle switch. It connects or breaks the path for current." },
  { slug: "transistor", answer: "Using a small current to switch a bigger one", distractors: ["Producing light", "Measuring current", "Storing energy"], explanation: "That's a small bipolar transistor (TO-92 package). A tiny base current switches or amplifies a larger collector current." },
  { slug: "mosfet", answer: "Switching a heavy load with a small voltage", distractors: ["Making sound", "Letting current flow one way", "Setting a fixed resistance"], explanation: "That's a power MOSFET (TO-220 package). A voltage on its gate switches big loads like motors and LED strips." },
  { slug: "relay", answer: "Switching a separate circuit with an electromagnet", distractors: ["Limiting current", "Rectifying AC", "Storing charge"], explanation: "That's a relay. A small current through its coil pulls a metal contact across, switching a completely separate circuit." },
  { slug: "potentiometer", answer: "Adjusting a voltage or resistance with a knob", distractors: ["Storing charge", "Blocking reverse current", "Making light"], explanation: "That's a potentiometer. Turning the shaft moves a wiper along a resistive track — volume knobs work this way." },
  { slug: "voltage-regulator", answer: "Keeping a voltage steady", distractors: ["Making light", "Switching a motor on and off by hand", "Storing charge for later"], explanation: "That's a voltage regulator (like the 7805). It turns a higher, wobbly voltage into a steady one — for example 12 V into 5 V." },
];

const NAMES: Record<string, { name: string; distractors: [string, string, string]; clue: string }> = {
  resistor: { name: "Resistor", distractors: ["Capacitor", "Diode", "Fuse"], clue: "Coloured bands painted around a small body are the giveaway: they encode its resistance." },
  led: { name: "LED", distractors: ["Lamp", "Diode", "Capacitor"], clue: "A clear or coloured dome with one long and one short leg. The long leg is the anode (+)." },
  capacitor: { name: "Electrolytic capacitor", distractors: ["Battery", "Resistor", "Relay"], clue: "A can shape with its value (µF) printed on, and a stripe marking the negative leg." },
  diode: { name: "Diode", distractors: ["Resistor", "Fuse", "LED"], clue: "A small cylinder with a single band — the band marks the cathode." },
  battery: { name: "Battery", distractors: ["Capacitor", "Voltage regulator", "Relay"], clue: "Marked + and − terminals and a voltage rating, like 1.5 V or 9 V." },
  switch: { name: "Toggle switch", distractors: ["Potentiometer", "Relay", "Push button"], clue: "A lever you flip that stays where you leave it." },
  transistor: { name: "Transistor", distractors: ["Voltage regulator", "Diode", "Capacitor"], clue: "A small black half-cylinder (TO-92) with three legs: collector, base and emitter." },
  mosfet: { name: "MOSFET", distractors: ["Relay", "Resistor", "Battery"], clue: "A black body with a metal tab (TO-220) and three legs: gate, drain and source." },
  relay: { name: "Relay", distractors: ["Battery", "Transistor", "Capacitor"], clue: "A box with a coil rating printed on it (e.g. 5 VDC) and contact ratings." },
  potentiometer: { name: "Potentiometer", distractors: ["Switch", "Capacitor", "Motor"], clue: "A round body with a shaft to turn and three pins." },
  "voltage-regulator": { name: "Voltage regulator", distractors: ["Transistor", "Relay", "Diode"], clue: "Looks like a power transistor, but it's marked with a voltage (like 7805 → 5 V) and its pins are IN, GND and OUT." },
};

const mystery = (slug: string) => (
  <div role="img" aria-label="Illustration of a mystery component">
    <ComponentIllustration slug={slug} className="h-36 w-auto max-w-full" />
  </div>
);

/** Identify the Component: for each part, "what is it used for?" and "what is it called?" — 22 questions. */
export const IDENTIFY_QUESTIONS: readonly QuizQuestion[] = IDENTIFY_FACTS.flatMap((fact) => {
  const naming = NAMES[fact.slug]!;
  return [
    {
      id: `identify-${fact.slug}`,
      type: "identify" as const,
      prompt: "What does this component primarily do?",
      visual: mystery(fact.slug),
      options: options(fact.answer, fact.distractors),
      correctOptionId: "a",
      explanation: fact.explanation,
    },
    {
      id: `name-${fact.slug}`,
      type: "identify" as const,
      prompt: "Which component is this?",
      visual: mystery(fact.slug),
      options: options(naming.name, naming.distractors),
      correctOptionId: "a",
      explanation: `That is the ${naming.name}. ${naming.clue}`,
    },
  ];
});
