import { ConceptCard, ConceptGrid, KeyIdea, Prose, VisualStage } from "@/components/lesson/LessonBlocks";
import { ChargeCounter } from "@/components/electricity/ChargeCounter";
import { FlowDirection } from "@/components/electricity/FlowDirection";
import { MagnitudeScale } from "@/components/electricity/MagnitudeScale";
import { CircuitExplorer } from "@/components/simulations/CircuitExplorer";
import { Callout } from "@/components/ui/Callout";
import type { LessonContent } from "../types";

export const current: LessonContent = {
  moduleSlug: "electricity",
  lessonSlug: "current",
  objective: "Describe current as the rate of charge flow in amperes, and tell conventional current from electron flow.",
  objectives: ["Read current in amps and milliamps", "See how voltage and the resistor affect current"],
  buildsOn: ["Voltage", "What is a circuit?"],
  sections: [
    {
      id: "rate-of-flow",
      stage: "concept",
      title: "Current is how much charge flows each second",
      content: (
        <>
          <Prose>
            <p>
              <strong>Current</strong> measures how much charge passes a point every second. Its unit is the <strong>ampere</strong> (amp,{" "}
              <strong>A</strong>). One amp means one coulomb — about 6 billion billion electrons — passing every second.
            </p>
          </Prose>
          <VisualStage caption="Stand at the checkpoint and count the charge going by.">
            <ChargeCounter />
          </VisualStage>
          <ConceptGrid columns={3}>
            <ConceptCard title="Ampere (A)">1 coulomb of charge per second.</ConceptCard>
            <ConceptCard title="Milliamp (mA)" accent="amber">
              1/1000 of an amp. An LED needs about 20 mA.
            </ConceptCard>
            <ConceptCard title="The same everywhere">In one loop, the current is identical at every point — charge isn&apos;t used up.</ConceptCard>
          </ConceptGrid>
        </>
      ),
    },
    {
      id: "direction",
      stage: "visual",
      title: "Conventional current vs electron flow",
      content: (
        <>
          <Prose>
            <p>
              <strong>Conventional current</strong> is drawn flowing from + to −. That was decided in the 1700s, before electrons were
              discovered. Electrons are negative, so they actually drift the <strong>opposite way</strong>, from − to +.
            </p>
          </Prose>
          <VisualStage>
            <FlowDirection />
          </VisualStage>
          <KeyIdea>Same circuit, same current — two descriptions pointing opposite ways. Circuit diagrams always use conventional current.</KeyIdea>
        </>
      ),
    },
    {
      id: "current-flow",
      stage: "experiment",
      title: "Battery → resistor → LED → battery",
      content: (
        <>
          <Prose>
            <p>
              Now watch current in a real circuit. Change the battery voltage and the resistor, and read the current. Toggle between
              conventional current and electron flow.
            </p>
          </Prose>
          <Callout kind="try" className="mt-6">
            <p>
              Raise the voltage: does current go up or down? Now raise the resistance instead. (You&apos;ll find out exactly why in the next two
              lessons.)
            </p>
          </Callout>
          <VisualStage>
            <CircuitExplorer
              parts={{ switch: false, resistor: true, led: true }}
              initial={{ voltage: 9, resistance: 470, closed: true }}
              controls={{ voltage: [3, 12], resistance: [220, 4700], direction: true }}
              readouts
              title="Current in a battery, resistor and LED circuit"
            />
          </VisualStage>
        </>
      ),
    },
    {
      id: "everyday-currents",
      stage: "real-world",
      title: "Currents around you",
      content: (
        <MagnitudeScale
          label="Common currents"
          domain={[0.005, 300]}
          items={[
            { label: "Indicator LED", value: 0.02, display: "20 mA", note: "Just enough to glow" },
            { label: "Microcontroller board", value: 0.05, display: "50 mA", note: "An Arduino doing its work" },
            { label: "Phone charging", value: 2, display: "2 A", note: "Fast chargers push more in" },
            { label: "Electric kettle", value: 10, display: "10 A", note: "Heating needs lots of current (mains)", danger: true },
            { label: "Car starter motor", value: 200, display: "200 A", note: "Thick cables, very short bursts", danger: true },
          ]}
        />
      ),
    },
  ],
  analogy: {
    title: "Cars passing a checkpoint",
    content: (
      <p>
        Current is like counting cars passing a checkpoint on a road: it&apos;s not how fast each car goes, but <strong>how many pass per
        second</strong>. A busy motorway has a high “current” of cars; a quiet lane has a low one.
      </p>
    ),
    limits: [
      "Electrons in a wire are packed nose to tail and drift very slowly — it's the sheer number that makes the current.",
      "Cars can queue and pile up; in a circuit the same current flows at every point in a loop.",
    ],
  },
  keyTakeaway: "Current is the amount of charge flowing past a point each second, measured in amperes; conventional current points + to −, electrons drift − to +.",
  takeaways: [
    "Current is measured in amps (A) or milliamps (mA).",
    "In a single loop, the current is the same everywhere.",
    "Conventional current: + → −. Electron flow: − → +.",
    "More voltage gives more current; more resistance gives less.",
  ],
  quickCheck: [
    {
      id: "unit",
      type: "multiple-choice",
      prompt: "What is current measured in?",
      options: [
        { id: "V", label: "Volts (V)" },
        { id: "A", label: "Amperes (A)" },
        { id: "Ω", label: "Ohms (Ω)" },
        { id: "W", label: "Watts (W)" },
      ],
      correctOptionId: "A",
      explanation: "Current is measured in amperes — coulombs of charge per second. Volts measure voltage, ohms resistance, watts power.",
    },
    {
      id: "same-direction",
      type: "true-false",
      prompt: "Conventional current and electron flow point in the same direction.",
      options: [
        { id: "true", label: "True" },
        { id: "false", label: "False" },
      ],
      correctOptionId: "false",
      explanation: "They point opposite ways: conventional current goes + → −, while negatively charged electrons drift − → +.",
    },
    {
      id: "more-voltage",
      type: "predict",
      prompt: "You swap a 5 V battery for a 9 V battery. The resistor and LED stay the same. What happens to the current?",
      options: [
        { id: "up", label: "It increases" },
        { id: "down", label: "It decreases" },
        { id: "same", label: "It stays the same" },
      ],
      correctOptionId: "up",
      explanation: "A bigger voltage pushes more charge through the same resistance each second, so the current goes up.",
    },
  ],
  next: {
    title: "What limits the current?",
    description: "Why doesn't a battery push unlimited current? Because everything resists it a little. Next: resistance.",
    href: "/learn/electricity/resistance",
    cta: "Continue to Lesson 8",
  },
};
