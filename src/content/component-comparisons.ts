/**
 * Side-by-side comparisons of components that beginners often mix up. Neither
 * side is "better" — each suits different jobs.
 */
export interface ComparisonSide {
  slug: string;
  purpose: string;
  control: string;
  applications: string[];
  advantages: string[];
  limitations: string[];
}

export interface ComponentComparisonPair {
  id: string;
  title: string;
  /** The one-line takeaway. */
  summary: string;
  sides: [ComparisonSide, ComparisonSide];
}

export const COMPARISONS: readonly ComponentComparisonPair[] = [
  {
    id: "resistor-vs-potentiometer",
    title: "Resistor vs Potentiometer",
    summary: "Both resist current. A resistor's value is fixed; a potentiometer lets you change it — or pick off any voltage along its track.",
    sides: [
      {
        slug: "resistor",
        purpose: "Set one fixed resistance",
        control: "None — the value is chosen when you design the circuit",
        applications: ["LED current limiting", "Pull-up / pull-down resistors", "Fixed voltage dividers"],
        advantages: ["Tiny and very cheap", "Stable, precise value", "Nothing to wear out"],
        limitations: ["Can't be adjusted after building", "Changing it means swapping the part"],
      },
      {
        slug: "potentiometer",
        purpose: "Provide an adjustable resistance or voltage",
        control: "By hand — turning a knob or sliding a slider",
        applications: ["Volume and tone knobs", "Brightness controls", "Joysticks and position sensing"],
        advantages: ["Adjustable while running", "Acts as a user input", "Built-in voltage divider"],
        limitations: ["Bigger and more expensive", "Moving wiper can wear and crackle", "Usually low power ratings"],
      },
    ],
  },
  {
    id: "diode-vs-led",
    title: "Diode vs LED",
    summary: "Both let current flow one way only. An LED is a diode designed to turn some of that energy into light.",
    sides: [
      {
        slug: "diode",
        purpose: "Let current flow in one direction and block it in the other",
        control: "Automatic — depends on the direction of the voltage",
        applications: ["Rectifying AC into DC", "Reverse-polarity protection", "Flyback protection across motors and relays"],
        advantages: ["Small forward drop (≈ 0.7 V for silicon)", "Can handle large currents", "Very robust"],
        limitations: ["Produces no light", "Wastes a little voltage as heat", "Breaks down if the reverse voltage is too high"],
      },
      {
        slug: "led",
        purpose: "Produce light when current flows the right way",
        control: "The current through it — set by a series resistor or driver",
        applications: ["Indicator lights", "Displays and screens", "Lighting and torches"],
        advantages: ["Very efficient light source", "Long life", "Many colours"],
        limitations: ["Larger forward voltage (≈ 2–3 V)", "Low current rating (≈ 20 mA for small ones)", "Needs a current limit or it burns out"],
      },
    ],
  },
  {
    id: "transistor-vs-mosfet",
    title: "Transistor vs MOSFET",
    summary: "Both are electronic switches with no moving parts. A bipolar transistor is controlled by a small current; a MOSFET by a voltage on its gate.",
    sides: [
      {
        slug: "transistor",
        purpose: "Switch or amplify with a small base current",
        control: "Current into the base (needs a base resistor)",
        applications: ["Switching small loads like LEDs and buzzers", "Audio amplifiers", "Signal processing"],
        advantages: ["Cheap and widely available", "Great for small signals and amplification", "Works at low voltages"],
        limitations: ["Base draws current all the time it's on", "Loses more power when switching big currents", "Limited current rating in small packages"],
      },
      {
        slug: "mosfet",
        purpose: "Switch heavy loads with a gate voltage",
        control: "Voltage on the gate (almost no steady current)",
        applications: ["Motor drivers", "LED strips", "Power supplies and battery switching"],
        advantages: ["Handles large currents with little heat", "Almost no drive current once switched", "Very fast switching"],
        limitations: ["Needs enough gate voltage (check 'logic-level')", "Gate is sensitive to static", "Gate needs a pull-down so it doesn't float"],
      },
    ],
  },
  {
    id: "transistor-vs-relay",
    title: "Transistor vs Relay",
    summary: "Both let a small signal control a bigger circuit. A transistor does it electronically; a relay moves real metal contacts with a magnet.",
    sides: [
      {
        slug: "transistor",
        purpose: "Electronic switching with no moving parts",
        control: "A small base current",
        applications: ["Fast switching of DC loads", "LEDs, buzzers, small motors", "Amplifiers"],
        advantages: ["Silent", "Switches millions of times per second", "Doesn't wear out"],
        limitations: ["DC only (in simple circuits)", "Control and load share a connection (not isolated)", "Small voltage drop when on"],
      },
      {
        slug: "relay",
        purpose: "Mechanical switching of a separate circuit",
        control: "Current through a coil (usually via a transistor)",
        applications: ["Switching AC or DC loads", "Isolating a controller from another circuit", "Automotive and industrial control"],
        advantages: ["Full electrical isolation between coil and contacts", "Can switch AC or DC", "Almost no voltage drop across closed contacts"],
        limitations: ["Slow (milliseconds) and clicks", "Contacts wear out over time", "Coil needs a flyback diode and a driver"],
      },
    ],
  },
];
