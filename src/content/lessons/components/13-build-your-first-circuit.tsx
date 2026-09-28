import { Flashlight, Gift, Lightbulb, ToyBrick } from "lucide-react";
import { FirstCircuitBuilder } from "@/components/component-lab/FirstCircuitBuilder";
import { ComponentSymbol } from "@/components/explorer/ComponentSymbol";
import { ConceptCard, ConceptGrid, KeyIdea, Prose } from "@/components/lesson/LessonBlocks";
import { Callout } from "@/components/ui/Callout";
import type { LessonContent } from "../types";

export const buildYourFirstCircuit: LessonContent = {
  moduleSlug: "components",
  lessonSlug: "build-your-first-circuit",
  objective: "Build and explain a complete battery → switch → resistor → LED circuit, predicting its current.",
  objectives: ["Explain each component's role", "Keep the LED current in a safe range"],
  buildsOn: ["The resistor", "The LED", "Switches", "The battery"],
  sections: [
    {
      id: "the-parts",
      stage: "concept",
      title: "Four parts, one loop",
      content: (
        <>
          <Prose>
            <p>Your first real circuit uses four components you already know. Current leaves the battery&apos;s + terminal, passes through each part in turn, and returns to −.</p>
          </Prose>
          <ConceptGrid columns={4}>
            <ConceptCard title="Battery" visual={<ComponentSymbol slug="battery" className="h-12 w-auto" />}>Provides the voltage.</ConceptCard>
            <ConceptCard title="Switch" accent="amber" visual={<ComponentSymbol slug="switch" className="h-12 w-auto" />}>Opens or closes the loop.</ConceptCard>
            <ConceptCard title="Resistor" visual={<ComponentSymbol slug="resistor" className="h-12 w-auto" />}>Limits the current.</ConceptCard>
            <ConceptCard title="LED" accent="amber" visual={<ComponentSymbol slug="led" className="h-12 w-auto" />}>Turns current into light.</ConceptCard>
          </ConceptGrid>
        </>
      ),
    },
    {
      id: "build-it",
      stage: "experiment",
      title: "Build and explore",
      content: (
        <>
          <Callout kind="try">
            <p>Work through the missions. Watch the voltage, resistance, current and LED state change together.</p>
          </Callout>
          <div className="mt-6">
            <FirstCircuitBuilder />
          </div>
          <KeyIdea>Current = (battery voltage − LED voltage) ÷ resistance. The switch decides whether any current flows at all.</KeyIdea>
        </>
      ),
    },
  ],
  analogy: {
    title: "A circular train line",
    content: <p>The battery is the station that gives trains energy, the switch is a signal that can stop the whole line, the resistor is a speed limit, and the LED is a stop where passengers get off and light up the town.</p>,
    limits: ["Charge isn't used up like passengers getting off — the same charge returns to the battery; only energy is delivered.", "Opening the switch stops current everywhere in the loop at once, not just near the switch."],
  },
  whereFound: [
    { icon: Flashlight, place: "Torches", detail: "Exactly this circuit: battery, switch, (resistor or driver) and LED." },
    { icon: ToyBrick, place: "Toys", detail: "Light-up toys use the same four parts." },
    { icon: Gift, place: "Greeting cards", detail: "A coin cell, a pressure switch and an LED." },
    { icon: Lightbulb, place: "Power indicators", detail: "The “on” light of almost every device." },
  ],
  mistakes: [
    { mistake: "Putting the LED in backwards", consequence: "Nothing lights, even with the switch closed.", fix: "Long leg (anode) towards the battery's + side." },
    { mistake: "Skipping the resistor “just to test”", consequence: "The LED can burn out instantly.", fix: "Always include the resistor — 330 Ω–1 kΩ is a safe start at 5–9 V." },
    { mistake: "Leaving a gap in the loop", consequence: "An open circuit: no current anywhere.", fix: "Trace the path with your finger from + all the way back to −." },
  ],
  safety: ["general", "short-circuit"],
  keyTakeaway: "A battery, switch, resistor and LED in one loop form a complete, safe circuit: the switch controls it, the resistor protects the LED.",
  takeaways: ["Every part has a job; all four are needed.", "The same current flows through every part of a series loop.", "Aim for 5–20 mA through a small LED."],
  quickCheck: [
    {
      id: "current",
      type: "multiple-choice",
      prompt: "9 V battery, red LED (2 V), 1 kΩ resistor, switch closed. What is the current?",
      options: [
        { id: "7", label: "About 7 mA" },
        { id: "9", label: "About 9 mA" },
        { id: "2", label: "About 2 mA" },
        { id: "70", label: "About 70 mA" },
      ],
      correctOptionId: "7",
      explanation: "(9 V − 2 V) ÷ 1000 Ω = 0.007 A = 7 mA — safe and clearly visible.",
    },
    {
      id: "order",
      type: "true-false",
      prompt: "In a single series loop, swapping the positions of the switch and the resistor changes the current.",
      options: [
        { id: "true", label: "True" },
        { id: "false", label: "False" },
      ],
      correctOptionId: "false",
      explanation: "In a series loop the order doesn't matter: the same current flows through every component.",
    },
  ],
  next: {
    title: "Component challenge",
    description: "Now build it yourself from a box of parts — with no instructions.",
    href: "/learn/components/component-challenge",
    cta: "Take the challenge",
  },
};
