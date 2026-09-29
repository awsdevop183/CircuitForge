import { BatteryCharging, Flame, Plug } from "lucide-react";
import { ConceptCard, ConceptGrid, KeyIdea, Prose, RealWorldCard, VisualStage } from "@/components/lesson/LessonBlocks";
import { PowerRectangles } from "@/components/simulations/PowerRectangles";
import { PowerVisualizer } from "@/components/simulations/PowerVisualizer";
import { Callout } from "@/components/ui/Callout";
import { SafetyNotice } from "@/components/ui/SafetyNotice";
import type { LessonContent } from "../types";

export const electricalPower: LessonContent = {
  moduleSlug: "electricity",
  lessonSlug: "electrical-power",
  objective: "Calculate electrical power with P = V × I and compare the power of everyday devices in watts.",
  objectives: ["Explain what a watt means", "Connect power to heat, light and battery life"],
  buildsOn: ["Voltage", "Current", "Ohm's law"],
  sections: [
    {
      id: "watts",
      stage: "concept",
      title: "Power is energy per second",
      content: (
        <>
          <Prose>
            <p>
              <strong>Power</strong> tells you how fast energy is being delivered or used. It&apos;s measured in <strong>watts (W)</strong>: one watt
              means one joule of energy every second.
            </p>
            <p>
              In a circuit, power is simply voltage times current: <strong className="font-mono">P = V × I</strong>. More push, or more flow,
              means more energy each second.
            </p>
          </Prose>
          <ConceptGrid columns={3}>
            <ConceptCard title="Milliwatts (mW)">An LED: about 0.06 W.</ConceptCard>
            <ConceptCard title="Watts (W)" accent="amber">
              A phone charger: about 20 W.
            </ConceptCard>
            <ConceptCard title="Kilowatts (kW)">A kettle or heater: 2,000 W = 2 kW.</ConceptCard>
          </ConceptGrid>
        </>
      ),
    },
    {
      id: "area",
      stage: "visual",
      title: "Same power, different shapes",
      content: (
        <>
          <Prose>
            <p>Because P = V × I, you can picture power as the area of a rectangle: voltage across, current up.</p>
          </Prose>
          <VisualStage>
            <PowerRectangles />
          </VisualStage>
          <KeyIdea>A low-voltage device can still be powerful if it draws a large current — and large currents need thick wires.</KeyIdea>
        </>
      ),
    },
    {
      id: "power-lab",
      stage: "experiment",
      title: "Turn up the power",
      content: (
        <>
          <Prose>
            <p>Change the voltage and current. Watch the load glow, the power meter fill, and see which real device your circuit matches.</p>
          </Prose>
          <Callout kind="try" className="mt-6">
            <p>Find two different settings that both give 12 W. Then find the lowest current that still reaches “high power” at 24 V.</p>
          </Callout>
          <VisualStage>
            <PowerVisualizer />
          </VisualStage>
        </>
      ),
    },
    {
      id: "real-world",
      stage: "real-world",
      title: "Watts in everyday life",
      content: (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <RealWorldCard icon={Plug} title="Charger labels">
              “5 V ⎓ 3 A” on a charger means it can deliver up to 5 × 3 = 15 W.
            </RealWorldCard>
            <RealWorldCard icon={Flame} title="Warm electronics">
              Power that isn&apos;t turned into light or motion usually ends up as heat — that&apos;s why chargers get warm.
            </RealWorldCard>
            <RealWorldCard icon={BatteryCharging} title="Battery life">
              A higher-power device drains the same battery faster.
            </RealWorldCard>
          </div>
          <SafetyNotice topic="high-current" className="mt-6" />
        </>
      ),
    },
  ],
  analogy: {
    title: "Lifting boxes up the stairs",
    content: (
      <p>
        Voltage is like how high each box is lifted; current is how many boxes you carry per second. Power is the total effort per second:
        lifting a few boxes very high can take as much power as lifting lots of boxes a little way.
      </p>
    ),
    limits: [
      "Boxes are separate objects you can count one by one; charge flows continuously.",
      "Electrical power doesn't disappear — it becomes light, heat, motion or sound in the load.",
    ],
  },
  keyTakeaway: "Power is energy per second, measured in watts: P = V × I.",
  takeaways: [
    "1 watt = 1 joule of energy per second.",
    "P = V × I: double either one and the power doubles.",
    "An LED uses milliwatts; a heater uses kilowatts.",
    "Wasted power becomes heat — watch for hot parts.",
  ],
  quickCheck: [
    {
      id: "calc",
      type: "multiple-choice",
      prompt: "A device runs from 12 V and draws 2 A. What power does it use?",
      options: [
        { id: "24", label: "24 W" },
        { id: "6", label: "6 W" },
        { id: "14", label: "14 W" },
        { id: "0.17", label: "0.17 W" },
      ],
      correctOptionId: "24",
      explanation: "P = V × I = 12 V × 2 A = 24 W.",
    },
    {
      id: "watt-meaning",
      type: "true-false",
      prompt: "A watt is one joule of energy per second.",
      options: [
        { id: "true", label: "True" },
        { id: "false", label: "False" },
      ],
      correctOptionId: "true",
      explanation: "Power measures how fast energy flows. One watt is one joule every second, so a 60 W bulb uses 60 joules each second.",
    },
    {
      id: "highest",
      type: "identify",
      prompt: "Which device typically uses the most power?",
      options: [
        { id: "led", label: "Indicator LED" },
        { id: "phone", label: "Phone charger" },
        { id: "laptop", label: "Laptop" },
        { id: "heater", label: "Electric heater" },
      ],
      correctOptionId: "heater",
      explanation: "Heaters use around 2,000 W — heating takes a lot of energy. A laptop uses tens of watts and an LED a tiny fraction of one.",
    },
  ],
  next: {
    title: "Two kinds of current",
    description: "So far all our current has flowed one way. The socket in your wall is different. Next: DC vs AC.",
    href: "/learn/electricity/dc-vs-ac",
    cta: "Continue to Lesson 11",
  },
};
