import { ConceptCard, ConceptGrid, KeyIdea, Prose, VisualStage } from "@/components/lesson/LessonBlocks";
import { ChargeCounter } from "@/components/lessons/current/ChargeCounter";
import { FlowDirection } from "@/components/lessons/current/FlowDirection";
import { OhmsRelationship } from "@/components/lessons/current/OhmsRelationship";
import { OhmsTriangle } from "@/components/lessons/current/OhmsTriangle";
import { MagnitudeScale } from "@/components/lessons/shared/MagnitudeScale";
import { Callout } from "@/components/ui/Callout";
import type { LessonContent } from "./types";

export const current: LessonContent = {
  moduleSlug: "electricity",
  lessonSlug: "current",
  objectives: [
    "Define current as the rate of charge flow, measured in amperes",
    "Tell conventional current and electron flow apart",
    "Describe how voltage and resistance together set the current",
  ],
  sections: [
    {
      id: "what-is-current",
      stage: "concept",
      title: "Current is how much charge flows",
      content: (
        <>
          <Prose>
            <p>
              Voltage is the push. <strong>Current</strong> is what the push produces: the amount of charge flowing past a point each
              second. It&apos;s measured in <strong>amperes</strong> — amps, <strong>A</strong> for short.
            </p>
            <p>Stand at the checkpoint and count the charge going by.</p>
          </Prose>
          <VisualStage caption="1 ampere = 1 coulomb of charge per second ≈ 6.24 × 10¹⁸ electrons every second.">
            <ChargeCounter />
          </VisualStage>
          <ConceptGrid columns={3}>
            <ConceptCard title="Ampere (A)">The unit of current. 1 A is one coulomb of charge passing every second.</ConceptCard>
            <ConceptCard title="Milliamp (mA)" accent="amber">
              One thousandth of an amp. An LED runs happily on about 20 mA.
            </ConceptCard>
            <ConceptCard title="Same everywhere">In a single loop, the current is identical at every point — charge doesn&apos;t get used up.</ConceptCard>
          </ConceptGrid>
        </>
      ),
    },
    {
      id: "direction",
      stage: "visual",
      title: "Which way does it flow?",
      content: (
        <>
          <Prose>
            <p>
              There are two ways to describe the direction, and you&apos;ll meet both. <strong>Conventional current</strong> flows from + to
              −. <strong>Electron flow</strong> goes from − to +. Toggle between them.
            </p>
          </Prose>
          <VisualStage>
            <FlowDirection />
          </VisualStage>
          <KeyIdea>Circuit diagrams use conventional current (+ → −). Both describe exactly the same current.</KeyIdea>
        </>
      ),
    },
    {
      id: "voltage-current-resistance",
      stage: "experiment",
      title: "Voltage, current and resistance",
      content: (
        <>
          <Prose>
            <p>
              Current depends on two things: how hard you <strong>push</strong> (voltage) and how much the circuit <strong>opposes</strong>{" "}
              the flow (resistance). Change each one and watch the current respond.
            </p>
          </Prose>
          <Callout kind="try" className="mt-6">
            <p>Double the voltage — what happens to the current? Now double the resistance instead. Look at the ammeter each time.</p>
          </Callout>
          <VisualStage>
            <OhmsRelationship />
          </VisualStage>
          <Prose>
            <p>
              This relationship has a name: <strong>Ohm&apos;s law</strong>. You don&apos;t need to do maths with it yet — just see how the three
              quantities connect.
            </p>
          </Prose>
          <VisualStage caption="V = I × R. Choose what you want to find.">
            <OhmsTriangle />
          </VisualStage>
        </>
      ),
    },
    {
      id: "everyday-currents",
      stage: "real-world",
      title: "Currents around you",
      content: (
        <>
          <Prose>
            <p>Small electronics sip milliamps. Anything that heats or moves things needs many amps.</p>
          </Prose>
          <div className="mt-6">
            <MagnitudeScale
              label="Common currents"
              domain={[0.005, 300]}
              items={[
                { label: "Indicator LED", value: 0.02, display: "20 mA", note: "A tiny current — just enough to glow" },
                { label: "Arduino board", value: 0.05, display: "50 mA", note: "A microcontroller doing its work" },
                { label: "Phone charging", value: 2, display: "2 A", note: "Fast chargers push more current in" },
                { label: "Electric kettle", value: 10, display: "10 A", note: "Heating takes lots of current" },
                { label: "Car starter motor", value: 200, display: "200 A", note: "Thick cables for a short, huge burst", danger: true },
              ]}
            />
          </div>
        </>
      ),
    },
  ],
  takeaways: [
    "Current is the rate of charge flow, measured in amperes (A).",
    "Conventional current flows + → −; electrons actually drift − → +.",
    "More voltage means more current; more resistance means less current.",
    "Ohm's law ties them together: V = I × R.",
  ],
  quickCheck: [
    {
      id: "q-current-unit",
      prompt: "What is electric current measured in?",
      options: [
        { id: "volts", label: "Volts (V)" },
        { id: "amps", label: "Amperes (A)" },
        { id: "ohms", label: "Ohms (Ω)" },
        { id: "watts", label: "Watts (W)" },
      ],
      correctOptionId: "amps",
      explanation: "Current is measured in amperes — coulombs of charge per second.",
    },
    {
      id: "q-conventional",
      prompt: "In circuit diagrams, conventional current is drawn flowing…",
      options: [
        { id: "pos-to-neg", label: "from + to −" },
        { id: "neg-to-pos", label: "from − to +" },
        { id: "both", label: "both ways at once" },
        { id: "none", label: "it has no direction" },
      ],
      correctOptionId: "pos-to-neg",
      explanation: "Conventional current goes from positive to negative. Electrons drift the opposite way.",
    },
    {
      id: "q-resistance-effect",
      prompt: "Voltage stays the same but resistance doubles. What happens to the current?",
      options: [
        { id: "doubles", label: "It doubles" },
        { id: "halves", label: "It halves" },
        { id: "same", label: "It stays the same" },
        { id: "zero", label: "It drops to zero" },
      ],
      correctOptionId: "halves",
      explanation: "I = V ÷ R. Double R with the same V and the current halves.",
    },
  ],
  next: {
    title: "Put Ohm's law to the test",
    description:
      "You've met voltage, current and resistance. Head to the Interactive Lab to control all three and see the numbers change in real time.",
    href: "/lab/ohms-law",
    cta: "Open the Ohm's Law experiment",
  },
};
