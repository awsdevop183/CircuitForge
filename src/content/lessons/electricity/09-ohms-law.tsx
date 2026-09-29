import { Calculator, Lightbulb, Search } from "lucide-react";
import { ConceptCard, ConceptGrid, KeyIdea, Prose, RealWorldCard, VisualStage } from "@/components/lesson/LessonBlocks";
import { OhmsGraphExplorer } from "@/components/simulations/OhmsGraphExplorer";
import { OhmsLawCalculator } from "@/components/simulations/OhmsLawCalculator";
import { Callout } from "@/components/ui/Callout";
import { SafetyNotice } from "@/components/ui/SafetyNotice";
import type { LessonContent } from "../types";

export const ohmsLaw: LessonContent = {
  moduleSlug: "electricity",
  lessonSlug: "ohms-law",
  objective: "Use Ohm's law (V = I × R) to calculate voltage, current or resistance when the other two are known.",
  objectives: ["Rearrange V = I × R into I = V / R and R = V / I", "Spot when a result is unrealistic or unsafe"],
  buildsOn: ["Voltage", "Current", "Resistance"],
  sections: [
    {
      id: "the-law",
      stage: "concept",
      title: "One rule connects V, I and R",
      content: (
        <>
          <Prose>
            <p>
              You&apos;ve seen that more voltage means more current, and more resistance means less. <strong>Ohm&apos;s law</strong> turns that into
              one exact rule:
            </p>
          </Prose>
          <p className="my-8 text-center font-mono text-4xl font-semibold text-ink sm:text-5xl" aria-label="V equals I times R">
            <span className="text-amber">V</span> = <span className="text-cyan">I</span> × <span className="text-electric">R</span>
          </p>
          <ConceptGrid columns={3}>
            <ConceptCard title="V = I × R" accent="amber">
              Find the <strong>voltage</strong>. 0.02 A × 450 Ω = 9 V.
            </ConceptCard>
            <ConceptCard title="I = V ÷ R">
              Find the <strong>current</strong>. 10 V ÷ 100 Ω = 0.1 A.
            </ConceptCard>
            <ConceptCard title="R = V ÷ I" accent="amber">
              Find the <strong>resistance</strong>. 5 V ÷ 0.05 A = 100 Ω.
            </ConceptCard>
          </ConceptGrid>
          <KeyIdea>Know any two of voltage, current and resistance, and Ohm&apos;s law gives you the third.</KeyIdea>
        </>
      ),
    },
    {
      id: "straight-line",
      stage: "visual",
      title: "Ohm's law is a straight line",
      content: (
        <>
          <Prose>
            <p>
              For a resistor, plotting current against voltage gives a straight line: double the voltage, double the current. The resistance
              sets how steep the line is.
            </p>
          </Prose>
          <VisualStage>
            <OhmsGraphExplorer />
          </VisualStage>
        </>
      ),
    },
    {
      id: "calculator-lab",
      stage: "experiment",
      title: "The Ohm's Law Lab",
      content: (
        <>
          <Prose>
            <p>
              Choose what to find by tapping the triangle (or the V / I / R buttons). Set the other two with the sliders or type exact values.
              The circuit, the working and the warnings all update live.
            </p>
          </Prose>
          <Callout kind="try" className="mt-6">
            <p>
              Run experiments A, B and C. Which one would be safe on your desk? Then find the resistance that makes exactly 20 mA flow from
              9 V (solve for R).
            </p>
          </Callout>
          <div className="my-8">
            <OhmsLawCalculator />
          </div>
        </>
      ),
    },
    {
      id: "real-world",
      stage: "real-world",
      title: "Ohm's law in real projects",
      content: (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <RealWorldCard icon={Lightbulb} title="Choosing an LED resistor">
              9 V supply, LED uses 2 V, you want 15 mA: R = 7 V ÷ 0.015 A ≈ 470 Ω.
            </RealWorldCard>
            <RealWorldCard icon={Search} title="Troubleshooting">
              Measure the voltage across a resistor to work out the current through it without breaking the circuit.
            </RealWorldCard>
            <RealWorldCard icon={Calculator} title="Checking your design">
              Before you build, a quick V = I × R tells you if anything will get too hot.
            </RealWorldCard>
          </div>
          <SafetyNotice topic="high-current" className="mt-6" />
        </>
      ),
    },
  ],
  analogy: {
    title: "A garden hose",
    content: (
      <p>
        Turn the tap up (<strong>more voltage</strong>) and more water flows (<strong>more current</strong>). Squeeze the hose (
        <strong>more resistance</strong>) and less flows. Ohm&apos;s law is the exact recipe for how those three trade off.
      </p>
    ),
    limits: [
      "Water flow in a hose isn't perfectly proportional to pressure; current through a resistor is (that's why the graph is a straight line).",
      "Some components — LEDs, lamps, diodes — don't follow Ohm's law exactly. It's perfect for resistors.",
    ],
  },
  keyTakeaway: "V = I × R. Rearranged: I = V ÷ R and R = V ÷ I. Know any two, calculate the third.",
  takeaways: [
    "Current = voltage ÷ resistance.",
    "Double the voltage → double the current (same R).",
    "Double the resistance → half the current (same V).",
    "Beginner circuits usually carry milliamps — amps mean heat and danger.",
  ],
  quickCheck: [
    {
      id: "ten-volt-hundred-ohm",
      type: "multiple-choice",
      prompt: "A 10 V source is connected to a 100 Ω resistor. What is the current?",
      options: [
        { id: "0.01", label: "A. 0.01 A" },
        { id: "0.1", label: "B. 0.1 A" },
        { id: "1", label: "C. 1 A" },
        { id: "10", label: "D. 10 A" },
      ],
      correctOptionId: "0.1",
      explanation: "I = V ÷ R = 10 V ÷ 100 Ω = 0.1 A (100 mA). Dividing volts by ohms gives amps.",
    },
    {
      id: "find-r",
      type: "multiple-choice",
      prompt: "A 9 V battery drives 0.03 A (30 mA) through a resistor. What is its resistance?",
      options: [
        { id: "300", label: "300 Ω" },
        { id: "0.27", label: "0.27 Ω" },
        { id: "30", label: "30 Ω" },
        { id: "3000", label: "3,000 Ω" },
      ],
      correctOptionId: "300",
      explanation: "R = V ÷ I = 9 V ÷ 0.03 A = 300 Ω.",
    },
    {
      id: "double-r",
      type: "true-false",
      prompt: "With the same voltage, doubling the resistance doubles the current.",
      options: [
        { id: "true", label: "True" },
        { id: "false", label: "False" },
      ],
      correctOptionId: "false",
      explanation: "I = V ÷ R, so doubling R halves the current.",
    },
    {
      id: "predict-low-r",
      type: "predict",
      prompt: "You connect 5 V across just 10 Ω. What should worry you?",
      options: [
        { id: "heat", label: "0.5 A flows and the resistor must shed 2.5 W — it will get very hot" },
        { id: "nothing", label: "Nothing — 5 V is always safe" },
        { id: "no-current", label: "No current will flow" },
      ],
      correctOptionId: "heat",
      explanation: "I = 5 ÷ 10 = 0.5 A and P = 5 × 0.5 = 2.5 W — ten times a small ¼ W resistor's rating. Low voltage doesn't guarantee low current.",
    },
  ],
  next: {
    title: "How much energy?",
    description: "Current flowing through a resistor makes heat — that's power. Next: watts, and P = V × I.",
    href: "/learn/electricity/electrical-power",
    cta: "Continue to Lesson 10",
  },
};
