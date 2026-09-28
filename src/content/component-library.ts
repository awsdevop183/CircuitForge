import type { Difficulty } from "./types";

/**
 * Component families used by the explorer filters. A component can belong to
 * several (a potentiometer is both passive and an input device).
 */
export type ComponentTag = "passive" | "active" | "electromechanical" | "power" | "input" | "output";

export const COMPONENT_TAG_LABELS: Record<ComponentTag, string> = {
  passive: "Passive",
  active: "Active",
  electromechanical: "Electromechanical",
  power: "Power",
  input: "Input",
  output: "Output",
};

export const COMPONENT_TAG_DESCRIPTIONS: Record<ComponentTag, string> = {
  passive: "Can't amplify or switch on their own — they resist, store or release energy.",
  active: "Semiconductors that control current, such as diodes, LEDs and transistors.",
  electromechanical: "Moving metal contacts, operated by hand or by a magnet.",
  power: "Supply, store or condition the energy for a circuit.",
  input: "Let a person (or the world) send a signal into the circuit.",
  output: "Produce something you can see, hear or feel.",
};

export interface ComponentSpecification {
  label: string;
  value: string;
  /** Why the learner should care about this number. */
  why: string;
}

export interface BeginnerMistake {
  mistake: string;
  /** What goes wrong. */
  consequence?: string;
  fix: string;
}

export interface ElectronicComponent {
  slug: string;
  name: string;
  /** Schematic reference designator prefix, e.g. "R" for resistors. */
  designator: string;
  tags: ComponentTag[];
  difficulty: Difficulty;
  /** Its job in a few words, for cards: "Limits current". */
  job: string;
  /** One-sentence description of what it does. */
  summary: string;
  /** Where you'll find it in everyday devices. */
  uses: string[];
  specs: ComponentSpecification[];
  mistakes: BeginnerMistake[];
  safety: string[];
  /** Slugs of related components. */
  related: string[];
  /** The Module 02 lesson that teaches it. */
  lessonSlug: string;
}

export const COMPONENTS: readonly ElectronicComponent[] = [
  {
    slug: "resistor",
    name: "Resistor",
    designator: "R",
    tags: ["passive"],
    difficulty: "beginner",
    job: "Limits current",
    summary: "Opposes the flow of current, setting how much current flows for a given voltage.",
    uses: ["LED circuits", "Computer and phone boards", "Sensor circuits", "Voltage dividers"],
    specs: [
      { label: "Resistance", value: "1 Ω – 10 MΩ", why: "Sets the current: I = V ÷ R." },
      { label: "Power rating", value: "¼ W (common)", why: "Heat it can shed safely. Exceed it and it burns." },
      { label: "Tolerance", value: "±1% or ±5%", why: "How far the real value may be from the printed one." },
    ],
    mistakes: [
      { mistake: "Confusing resistance with current", fix: "Resistance is the opposition (Ω). Current (A) is what flows because of voltage and resistance." },
      { mistake: "Reading the colour bands wrong way round", fix: "Start from the end furthest from the gold/silver tolerance band." },
      { mistake: "Forgetting the power rating", consequence: "It gets hot, discolours and can burn.", fix: "Check P = V × I. Over ¼ W needs a bigger resistor." },
    ],
    safety: ["Resistors turn energy into heat — too much power can make them glow or burn.", "A 'hot resistor' smell means disconnect the power."],
    related: ["potentiometer", "led", "capacitor"],
    lessonSlug: "resistor",
  },
  {
    slug: "capacitor",
    name: "Capacitor",
    designator: "C",
    tags: ["passive", "power"],
    difficulty: "beginner",
    job: "Stores charge",
    summary: "Stores electrical charge between two plates and releases it when needed.",
    uses: ["Power supplies", "Motherboards", "Audio circuits", "Motor systems", "Timing circuits"],
    specs: [
      { label: "Capacitance", value: "pF – thousands of µF", why: "How much charge it holds per volt." },
      { label: "Voltage rating", value: "e.g. 16 V, 25 V", why: "Never exceed it — use one rated well above your supply." },
      { label: "Polarity", value: "Electrolytics: yes", why: "Electrolytics must be fitted the right way round." },
    ],
    mistakes: [
      { mistake: "Reversing an electrolytic capacitor", consequence: "It can overheat, bulge or burst.", fix: "The stripe marks the − leg (the shorter one). Reversed, it can bulge or burst." },
      { mistake: "Exceeding the voltage rating", consequence: "The insulator breaks down and the capacitor fails — sometimes violently.", fix: "Pick a rating comfortably above the circuit's voltage." },
      { mistake: "Assuming it's empty when unplugged", fix: "Capacitors can hold charge after power is removed." },
    ],
    safety: [
      "Large capacitors in mains equipment (TVs, microwaves, power supplies) can stay dangerously charged — never open them.",
      "Stick to small, low-voltage capacitors for experiments.",
    ],
    related: ["resistor", "battery", "voltage-regulator"],
    lessonSlug: "capacitor",
  },
  {
    slug: "led",
    name: "LED",
    designator: "D",
    tags: ["active", "output"],
    difficulty: "beginner",
    job: "Makes light",
    summary: "A diode that emits light when current flows through it in the forward direction.",
    uses: ["Indicator lights", "Screens and displays", "Torches and lamps", "Remote controls (infrared)"],
    specs: [
      { label: "Forward voltage", value: "≈ 1.8 – 3.3 V", why: "Voltage it needs before it lights; depends on colour." },
      { label: "Max current", value: "≈ 20 – 30 mA (small LEDs)", why: "More than this and it overheats." },
      { label: "Polarity", value: "Yes", why: "Long leg (anode) towards +. Backwards, it stays dark." },
    ],
    mistakes: [
      { mistake: "Connecting it without a resistor", consequence: "A huge current flows — the LED flashes and dies.", fix: "Always add a series resistor to limit the current." },
      { mistake: "Reversing the polarity", fix: "Long leg = anode (+). Flat edge on the rim = cathode (−)." },
      { mistake: "Exceeding the rated current", fix: "Aim for 5–20 mA. Brighter isn't worth a dead LED." },
    ],
    safety: ["High-power LEDs are extremely bright — don't stare into them.", "Overdriven LEDs get hot quickly."],
    related: ["diode", "resistor", "transistor"],
    lessonSlug: "led",
  },
  {
    slug: "diode",
    name: "Diode",
    designator: "D",
    tags: ["active", "power"],
    difficulty: "beginner",
    job: "One-way valve",
    summary: "Lets current flow in one direction only — an electrical one-way valve.",
    uses: ["Power supplies (rectifiers)", "Reverse-polarity protection", "Relay and motor protection", "Signal circuits"],
    specs: [
      { label: "Forward voltage", value: "≈ 0.7 V (silicon)", why: "Voltage it uses up while conducting." },
      { label: "Current rating", value: "e.g. 1 A (1N4007)", why: "Maximum forward current." },
      { label: "Reverse voltage", value: "e.g. 1000 V (1N4007)", why: "How much reverse voltage it can block." },
    ],
    mistakes: [
      { mistake: "Fitting it backwards", fix: "The band marks the cathode — current flows towards the band." },
      { mistake: "Forgetting the 0.7 V drop", fix: "A diode takes about 0.7 V, so the load gets a little less." },
    ],
    safety: ["Diodes carrying large currents get hot.", "Exceeding the reverse voltage destroys the diode."],
    related: ["led", "voltage-regulator", "relay"],
    lessonSlug: "diode",
  },
  {
    slug: "battery",
    name: "Battery",
    designator: "BT",
    tags: ["power"],
    difficulty: "beginner",
    job: "Supplies voltage",
    summary: "Converts stored chemical energy into a voltage that pushes current around a circuit.",
    uses: ["Phones and laptops", "Remote controls", "Torches", "Backup and remote sensors"],
    specs: [
      { label: "Voltage", value: "e.g. 1.5 V, 3.7 V, 9 V", why: "The push it provides." },
      { label: "Capacity", value: "e.g. 2500 mAh", why: "How much charge it can deliver before it's flat." },
      { label: "Type", value: "Alkaline, Li-ion, NiMH…", why: "Some are rechargeable; some must never be recharged." },
    ],
    mistakes: [
      { mistake: "Thinking a battery sets the current", consequence: "A bigger battery of the same voltage doesn't push more current — it just lasts longer.", fix: "The battery sets the voltage; the circuit's resistance sets the current." },
      { mistake: "Confusing voltage and capacity", fix: "Voltage = how hard it pushes. Capacity (mAh) = how long it lasts." },
      { mistake: "Shorting the terminals", consequence: "Wires and the battery get hot enough to burn; lithium cells can catch fire.", fix: "Never connect + directly to −. Cover terminals when storing." },
    ],
    safety: [
      "Short-circuited batteries get hot fast; lithium batteries can catch fire.",
      "Never recharge non-rechargeable batteries, or puncture any battery.",
    ],
    related: ["voltage-regulator", "switch", "capacitor"],
    lessonSlug: "battery",
  },
  {
    slug: "switch",
    name: "Switch",
    designator: "S",
    tags: ["electromechanical", "input"],
    difficulty: "beginner",
    job: "Opens / closes a path",
    summary: "Opens or closes a circuit path mechanically, starting or stopping current flow.",
    uses: ["Power buttons", "Keyboards", "Door and limit sensors", "Microcontroller inputs"],
    specs: [
      { label: "Type", value: "Toggle, push button, slide", why: "Latching (stays) or momentary (springs back)." },
      { label: "Contacts", value: "NO or NC", why: "Normally open or normally closed when not pressed." },
      { label: "Current rating", value: "e.g. 50 mA – 10 A", why: "Tiny tactile buttons can't switch big loads." },
    ],
    mistakes: [
      { mistake: "Mixing up NO and NC", fix: "NO = open until pressed. NC = closed until pressed." },
      { mistake: "Using a tiny button for a big load", fix: "Check the current rating, or switch a transistor or relay instead." },
    ],
    safety: ["Only use switches rated for your circuit's voltage and current."],
    related: ["relay", "transistor", "potentiometer"],
    lessonSlug: "switches",
  },
  {
    slug: "transistor",
    name: "Transistor",
    designator: "Q",
    tags: ["active"],
    difficulty: "intermediate",
    job: "Electronic switch / amplifier",
    summary: "Uses a small base current to control a much larger collector current — a switch or an amplifier.",
    uses: ["CPUs (billions of them)", "Amplifiers", "Switching circuits", "Power electronics"],
    specs: [
      { label: "Pins", value: "Base, Collector, Emitter", why: "Base controls; collector–emitter carries the load." },
      { label: "Gain (β / hFE)", value: "≈ 100", why: "Collector current ≈ β × base current (until fully on)." },
      { label: "Max collector current", value: "e.g. 100 mA (BC547)", why: "The load it can switch." },
    ],
    mistakes: [
      { mistake: "Confusing the terminals", fix: "Check the datasheet pinout — E, B, C order varies between parts." },
      { mistake: "Leaving out the base resistor", consequence: "Too much base current can destroy the transistor and the microcontroller pin.", fix: "Always limit base current with a resistor (e.g. 1 kΩ)." },
    ],
    safety: ["Transistors switching large loads get hot — check the ratings."],
    related: ["mosfet", "relay", "led"],
    lessonSlug: "transistor",
  },
  {
    slug: "mosfet",
    name: "MOSFET",
    designator: "Q",
    tags: ["active", "power"],
    difficulty: "intermediate",
    job: "Voltage-controlled switch",
    summary: "A voltage-controlled switch that can drive large currents with almost no control current.",
    uses: ["Motor drivers", "LED strips", "Power supplies", "Battery protection"],
    specs: [
      { label: "Pins", value: "Gate, Drain, Source", why: "Gate voltage controls the drain–source path." },
      { label: "Gate threshold", value: "e.g. 1–2 V (logic-level)", why: "Needs a gate voltage well above this to fully switch on." },
      { label: "Max drain current", value: "e.g. 30 A+", why: "Large loads — with suitable cooling." },
    ],
    mistakes: [
      { mistake: "Using a non-logic-level MOSFET with 3.3 V", fix: "Choose a 'logic-level' MOSFET for microcontroller pins." },
      { mistake: "Leaving the gate floating", consequence: "Stray charge can switch the load on unexpectedly.", fix: "Add a pull-down resistor so it stays off when unconnected." },
      { mistake: "No flyback diode on a motor", consequence: "A voltage spike at switch-off can destroy the MOSFET.", fix: "Put a diode across motors and coils to absorb voltage spikes." },
    ],
    safety: ["Big loads mean big currents — use proper wiring, fusing and heatsinks.", "Keep to low-voltage supplies."],
    related: ["transistor", "relay", "diode"],
    lessonSlug: "mosfet",
  },
  {
    slug: "relay",
    name: "Relay",
    designator: "K",
    tags: ["electromechanical", "output"],
    difficulty: "intermediate",
    job: "Coil-operated switch",
    summary: "An electrically operated switch: a small coil current moves contacts that switch a separate circuit.",
    uses: ["Car lights and horns", "Industrial control panels", "Home automation modules", "Isolating two circuits"],
    specs: [
      { label: "Coil voltage", value: "e.g. 5 V, 12 V", why: "The control voltage needed to pull the contacts over." },
      { label: "Contacts", value: "COM, NO, NC", why: "Which way the load is switched when the coil is energised." },
      { label: "Contact rating", value: "e.g. 10 A", why: "Maximum load current through the contacts." },
    ],
    mistakes: [
      { mistake: "Driving the coil straight from a microcontroller pin", consequence: "The pin is overloaded and can be damaged.", fix: "Use a transistor driver — the coil needs more current than a pin can give." },
      { mistake: "No flyback diode across the coil", fix: "Add a diode to absorb the spike when the coil switches off." },
    ],
    safety: [
      "Relays are often rated for mains loads — but mains wiring is for qualified people only.",
      "For learning, switch a battery-powered lamp or motor.",
    ],
    related: ["transistor", "mosfet", "switch"],
    lessonSlug: "relay",
  },
  {
    slug: "potentiometer",
    name: "Potentiometer",
    designator: "RV",
    tags: ["passive", "input"],
    difficulty: "beginner",
    job: "Adjustable resistor",
    summary: "A resistor with a movable wiper, used to adjust a voltage or a resistance by turning a knob.",
    uses: ["Volume knobs", "Dimmers", "Joysticks", "Adjusting sensor thresholds"],
    specs: [
      { label: "Total resistance", value: "e.g. 10 kΩ", why: "Resistance between the two end pins." },
      { label: "Taper", value: "Linear or log", why: "How resistance changes as you turn it." },
      { label: "Pins", value: "End, wiper, end", why: "The middle pin is the wiper." },
    ],
    mistakes: [
      { mistake: "Using the wiper as the only current limit", consequence: "At one end of the track the resistance is 0 Ω, so an LED gets no protection.", fix: "Add a fixed resistor so turning to 0 Ω can't short anything." },
      { mistake: "Mixing up the middle pin", fix: "The middle pin is the wiper; the outer pins are the track ends." },
    ],
    safety: ["Small potentiometers can only handle low power — don't use them to control big currents."],
    related: ["resistor", "switch"],
    lessonSlug: "potentiometer",
  },
  {
    slug: "voltage-regulator",
    name: "Voltage Regulator",
    designator: "U",
    tags: ["power", "active"],
    difficulty: "intermediate",
    job: "Keeps voltage steady",
    summary: "Takes a higher, possibly wobbly input voltage and produces a steady, lower output voltage.",
    uses: ["Microcontroller boards", "Phone chargers", "USB power", "Sensor modules"],
    specs: [
      { label: "Output voltage", value: "e.g. 5 V, 3.3 V", why: "The steady voltage it produces." },
      { label: "Dropout", value: "e.g. 2 V (7805)", why: "Input must be at least this much above the output." },
      { label: "Type", value: "Linear or switching", why: "Linear: simple but wastes heat. Switching: efficient." },
    ],
    mistakes: [
      { mistake: "Feeding it too little input voltage", consequence: "The output drops and the circuit may reset or misbehave.", fix: "Allow for the dropout: a 7805 needs about 7 V in for 5 V out." },
      { mistake: "Ignoring heat in linear regulators", fix: "Heat = (Vin − Vout) × current. Use a heatsink or a switching regulator." },
      { mistake: "Forgetting the capacitors", fix: "Most regulators need small capacitors on input and output." },
    ],
    safety: ["Linear regulators can get too hot to touch.", "Only feed them from low-voltage DC sources."],
    related: ["battery", "capacitor", "diode"],
    lessonSlug: "voltage-regulator",
  },
];

export function getComponent(slug: string): ElectronicComponent | undefined {
  return COMPONENTS.find((component) => component.slug === slug);
}
