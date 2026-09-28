import { Bird } from "lucide-react";
import { ConceptCard, ConceptGrid, KeyIdea, Prose, RealWorldCard, VisualStage } from "@/components/lesson/LessonBlocks";
import { MagnitudeScale } from "@/components/lessons/shared/MagnitudeScale";
import { TerminalProbe } from "@/components/lessons/voltage/TerminalProbe";
import { VoltageExplorer } from "@/components/lessons/voltage/VoltageExplorer";
import { WaterTankAnalogy } from "@/components/lessons/voltage/WaterTankAnalogy";
import { PotentialDifference } from "@/components/simulations/PotentialDifference";
import { Callout } from "@/components/ui/Callout";
import { SafetyNotice } from "@/components/ui/SafetyNotice";
import type { LessonContent } from "../types";

export const voltage: LessonContent = {
  moduleSlug: "fundamentals",
  lessonSlug: "voltage",
  objective: "Explain voltage as the difference in electric potential between two points, and why that difference drives current through a path.",
  objectives: ["Read a voltage between two points", "Identify a battery's + and − terminals"],
  buildsOn: ["Electric charge", "What is a circuit?"],
  sections: [
    {
      id: "potential-difference",
      stage: "concept",
      title: "Voltage is a difference between two points",
      content: (
        <>
          <Prose>
            <p>
              Every point in a circuit has an <strong>electric potential</strong> — think of it as how much energy each bit of charge has
              there. <strong>Voltage</strong> is the <strong>difference</strong> in potential between two points, measured in{" "}
              <strong>volts (V)</strong>.
            </p>
            <p>
              Charge tends to move from higher potential to lower potential, so a voltage difference is what pushes current through a path.
              Change the two points below.
            </p>
          </Prose>
          <VisualStage caption="The height of each point shows its potential. The voltmeter reads the difference.">
            <PotentialDifference />
          </VisualStage>
          <KeyIdea>Voltage is always measured between two points. “Point A is 5 V” really means “5 V higher than our reference point”.</KeyIdea>
        </>
      ),
    },
    {
      id: "terminals",
      stage: "visual",
      title: "A battery keeps a difference between its terminals",
      content: (
        <>
          <Prose>
            <p>
              A battery is a <strong>voltage source</strong>. Chemical reactions inside keep its <strong>positive (+)</strong> terminal at a
              higher potential than its <strong>negative (−)</strong> terminal — a 9 V battery keeps them 9 V apart. Move the probes.
            </p>
          </Prose>
          <VisualStage>
            <TerminalProbe />
          </VisualStage>
          <ConceptGrid columns={2}>
            <ConceptCard title="Positive terminal (+)" accent="amber">
              The higher-potential side. Marked +, often the longer battery-symbol plate.
            </ConceptCard>
            <ConceptCard title="Negative terminal (−)">The lower-potential side. Usually used as the circuit&apos;s 0 V reference.</ConceptCard>
          </ConceptGrid>
        </>
      ),
    },
    {
      id: "voltage-explorer",
      stage: "experiment",
      title: "Change the voltage",
      content: (
        <>
          <Prose>
            <p>Step a battery from 1 V to 12 V in a circuit with a 12 V bulb. A bigger difference pushes more charge through the same bulb.</p>
          </Prose>
          <Callout kind="try" className="mt-6">
            <p>
              Set 12 V, then open the switch. The voltmeter still reads 12 V — the difference is still there — but no current flows. Voltage
              causes current <em>only when there is a complete path</em>.
            </p>
          </Callout>
          <VisualStage>
            <VoltageExplorer />
          </VisualStage>
        </>
      ),
    },
    {
      id: "everyday-voltages",
      stage: "real-world",
      title: "Voltages around you",
      content: (
        <>
          <div className="mt-2">
            <MagnitudeScale
              label="Common voltages"
              domain={[1, 400]}
              tone="amber"
              items={[
                { label: "AA battery", value: 1.5, display: "1.5 V", note: "Remotes, clocks, toys" },
                { label: "Phone battery", value: 3.7, display: "3.7 V", note: "A lithium-ion cell" },
                { label: "USB port", value: 5, display: "5 V", note: "Also what many microcontrollers use" },
                { label: "Car battery", value: 12, display: "12 V", note: "Lights, radio, starter motor" },
                { label: "Wall socket", value: 230, display: "120–230 V AC", note: "Never experiment with mains", danger: true },
              ]}
            />
          </div>
          <div className="mt-6">
            <RealWorldCard icon={Bird} title="Why birds can sit on power lines">
              Both of a bird&apos;s feet touch the same wire, so they&apos;re at the same potential — a difference of 0 V, so no current flows through
              the bird. Touching the wire and the ground (or another wire) would be deadly.
            </RealWorldCard>
          </div>
          <SafetyNotice topic="mains" className="mt-6" />
        </>
      ),
    },
  ],
  analogy: {
    title: "Water tanks at different heights",
    content: (
      <>
        <p>
          Water flows from a high tank to a low one through a pipe. The <strong>difference in height</strong> is like voltage — the bigger it
          is, the harder the push. Equal heights: no flow, however high both tanks are.
        </p>
        <div className="overflow-hidden rounded-xl border border-line">
          <WaterTankAnalogy />
        </div>
      </>
    ),
    limits: [
      "Voltage isn't really “pressure”. It's energy per unit of charge — how much energy each coulomb gains or loses between two points.",
      "Water drains away and the tanks level out; a battery keeps its voltage roughly steady and charge circulates without running out.",
      "Water can flow out of an open pipe; current can't leave a broken wire — it needs a complete loop.",
    ],
  },
  keyTakeaway: "Voltage is the difference in electric potential between two points; it pushes current, but only when there's a complete path.",
  takeaways: [
    "Voltage is measured in volts (V), always between two points.",
    "Charge is pushed from higher potential towards lower potential.",
    "A battery keeps its + terminal at a higher potential than its − terminal.",
    "Voltage can exist with no current — current also needs a path.",
  ],
  quickCheck: [
    {
      id: "a-minus-b",
      type: "multiple-choice",
      prompt: "Point A is at 5 V and point B is at 0 V. What is the voltage between them?",
      options: [
        { id: "0", label: "0 V" },
        { id: "5", label: "5 V" },
        { id: "10", label: "10 V" },
        { id: "2.5", label: "2.5 V" },
      ],
      correctOptionId: "5",
      explanation: "Voltage is the difference in potential: 5 V − 0 V = 5 V.",
    },
    {
      id: "both-12",
      type: "predict",
      prompt: "Two points are both at 12 V and joined by a resistor. What current flows through it?",
      options: [
        { id: "none", label: "None" },
        { id: "lots", label: "A large current" },
        { id: "12", label: "12 A" },
      ],
      correctOptionId: "none",
      explanation: "There's no difference in potential (12 V − 12 V = 0 V), so nothing pushes charge from one to the other.",
    },
    {
      id: "one-point",
      type: "true-false",
      prompt: "You can measure a voltage by touching a single point with one probe.",
      options: [
        { id: "true", label: "True" },
        { id: "false", label: "False" },
      ],
      correctOptionId: "false",
      explanation: "Voltage is a difference, so a voltmeter always needs two points — one for each probe.",
    },
  ],
  next: {
    title: "Measure the flow",
    description: "Voltage is the push. Next, measure what it produces — current — and watch which way it flows.",
    href: "/learn/fundamentals/current",
    cta: "Continue to Lesson 7",
  },
};
