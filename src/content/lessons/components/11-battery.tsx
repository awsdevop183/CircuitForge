import { Clock, Smartphone, Tv, Watch } from "lucide-react";
import { BatteryModel } from "@/components/component-lab/BatteryModel";
import { ComponentIntro } from "@/components/component-lab/ComponentIntro";
import { ConceptCard, ConceptGrid, KeyIdea, Prose, VisualStage } from "@/components/lesson/LessonBlocks";
import { Callout } from "@/components/ui/Callout";
import type { LessonContent } from "../types";
import { mistakesFor } from "./shared";

export const batteryLesson: LessonContent = {
  moduleSlug: "components",
  lessonSlug: "battery",
  objective: "Tell voltage from capacity, and explain that the circuit — not the battery — determines the current.",
  objectives: ["Compare common battery types", "Estimate runtime from capacity and current"],
  buildsOn: ["Voltage", "Ohm's law"],
  sections: [
    {
      id: "see-it",
      stage: "concept",
      title: "See the battery",
      content: (
        <>
          <ComponentIntro slug="battery" />
          <ConceptGrid columns={2}>
            <ConceptCard title="Voltage (V)">How hard it pushes. Set by the chemistry: 1.5 V alkaline, 1.2 V NiMH, 3.7 V lithium-ion.</ConceptCard>
            <ConceptCard title="Capacity (mAh)" accent="amber">How much charge it holds — how long it lasts. 2500 mAh could supply 25 mA for about 100 hours.</ConceptCard>
          </ConceptGrid>
        </>
      ),
    },
    {
      id: "who-sets-current",
      stage: "experiment",
      title: "Who decides the current?",
      content: (
        <>
          <Prose>
            <p>
              A battery does <strong>not</strong> push out a fixed current. It provides a voltage, and the current is whatever the circuit
              allows: <strong>I = V ÷ R</strong>. Change the load and watch.
            </p>
          </Prose>
          <Callout kind="try" className="mt-6">
            <p>Keep the 9 V battery and change the load. Then keep the load and change the battery. What sets the runtime?</p>
          </Callout>
          <VisualStage>
            <BatteryModel />
          </VisualStage>
          <KeyIdea>The battery sets the voltage. The circuit&apos;s resistance sets the current. Capacity ÷ current ≈ how long it lasts.</KeyIdea>
        </>
      ),
    },
  ],
  analogy: {
    title: "A water tower",
    content: <p>A battery is like a water tower: its height sets the pressure (voltage), and its size sets how much water it holds (capacity). How fast water flows depends on the pipes you connect (the circuit).</p>,
    limits: ["A battery's voltage sags as it empties and under heavy load — its internal resistance matters.", "Batteries convert chemical energy; they don't store charge like a tank stores water."],
  },
  whereFound: [
    { icon: Tv, place: "Remote controls", detail: "AA or AAA alkaline cells: cheap and long-lasting at small currents." },
    { icon: Watch, place: "Watches", detail: "CR2032 coin cells: tiny, 3 V, for very small currents." },
    { icon: Smartphone, place: "Phones", detail: "Lithium-ion: rechargeable, high energy — must be treated with care." },
    { icon: Clock, place: "Clocks and smoke alarms", detail: "9 V and AA batteries that run for months." },
  ],
  mistakes: mistakesFor("battery"),
  safety: ["short-circuit", "batteries"],
  keyTakeaway: "A battery provides a voltage and holds a capacity; the circuit connected to it determines how much current flows.",
  takeaways: ["Voltage = push; capacity (mAh) = how long.", "Current = V ÷ R — set by the circuit.", "Runtime ≈ capacity ÷ current.", "Never short a battery or recharge a non-rechargeable one."],
  quickCheck: [
    {
      id: "current",
      type: "true-false",
      prompt: "A 9 V battery always supplies 500 mA, whatever you connect to it.",
      options: [
        { id: "true", label: "True" },
        { id: "false", label: "False" },
      ],
      correctOptionId: "false",
      explanation: "The current depends on the circuit's resistance: I = V ÷ R. A 9 V battery across 1 kΩ gives 9 mA; across 100 Ω, 90 mA.",
    },
    {
      id: "runtime",
      type: "multiple-choice",
      prompt: "A 2000 mAh battery supplies 20 mA. Roughly how long will it last?",
      options: [
        { id: "100h", label: "About 100 hours" },
        { id: "10h", label: "About 10 hours" },
        { id: "1000h", label: "About 1000 hours" },
        { id: "2h", label: "About 2 hours" },
      ],
      correctOptionId: "100h",
      explanation: "2000 mAh ÷ 20 mA = 100 hours (a rough estimate — real batteries give a bit less).",
    },
    {
      id: "capacity",
      type: "multiple-choice",
      prompt: "What does the mAh number on a battery tell you?",
      options: [
        { id: "capacity", label: "How much charge it holds — how long it lasts" },
        { id: "voltage", label: "How hard it pushes" },
        { id: "max", label: "The current it always supplies" },
      ],
      correctOptionId: "capacity",
      explanation: "Milliamp-hours measure capacity. Voltage is marked separately in volts.",
    },
  ],
  next: {
    title: "The voltage regulator",
    description: "Turn a wobbly, too-high voltage into a steady one your circuit can trust.",
    href: "/learn/components/voltage-regulator",
    cta: "Regulate a voltage",
  },
};
