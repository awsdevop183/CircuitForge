import { Camera, Cpu, Keyboard, Timer } from "lucide-react";
import { ComponentIntro } from "@/components/component-lab/ComponentIntro";
import { RcChargingComparison } from "@/components/component-lab/RcChargingComparison";
import { ComponentSymbol } from "@/components/explorer/ComponentSymbol";
import { ConceptCard, ConceptGrid, KeyIdea, Prose, VisualStage } from "@/components/lesson/LessonBlocks";
import { Callout } from "@/components/ui/Callout";
import type { LessonContent } from "../types";
import { mistakesFor } from "./shared";

export const capacitorLesson: LessonContent = {
  moduleSlug: "components",
  lessonSlug: "capacitor",
  objective: "Describe how a capacitor charges through a resistor, and use the time constant τ = R × C to predict how long it takes.",
  objectives: ["Explain what capacitance measures", "Connect an electrolytic capacitor the right way round", "Estimate stored energy ½CV²"],
  buildsOn: ["The resistor"],
  sections: [
    {
      id: "see-it",
      stage: "concept",
      title: "See the capacitor",
      content: (
        <>
          <ComponentIntro slug="capacitor" />
          <Prose>
            <p>
              A capacitor is two metal plates separated by an insulator. Current can&apos;t cross the gap, but charge can pile up on one plate
              while leaving the other — so the capacitor <strong>stores charge</strong>, and with it a voltage and some energy. Capacitance is
              measured in <strong>farads (F)</strong>; real parts are usually microfarads (µF) or smaller.
            </p>
          </Prose>
        </>
      ),
    },
    {
      id: "charging-curve",
      stage: "experiment",
      title: "Watch it charge",
      content: (
        <>
          <Prose>
            <p>
              Charging through a resistor, the voltage rises quickly at first, then more and more slowly. After one{" "}
              <strong>time constant τ = R × C</strong> it reaches about 63% of the supply; after 5τ it&apos;s effectively full.
            </p>
          </Prose>
          <Callout kind="try" className="mt-6">
            <p>Pin a curve, then double the resistance. How does the new curve compare? Now double the capacitance instead.</p>
          </Callout>
          <VisualStage>
            <RcChargingComparison />
          </VisualStage>
          <KeyIdea>Bigger R or bigger C → slower charging. That delay is how capacitors make timers and smooth out supplies.</KeyIdea>
        </>
      ),
    },
    {
      id: "polarity",
      stage: "visual",
      title: "Electrolytic capacitors have a + and a −",
      content: (
        <ConceptGrid columns={2}>
          <ConceptCard title="Ceramic (non-polarized)" visual={<ComponentSymbol slug="capacitor" className="h-14 w-auto" />}>
            Small values (pF–µF). Either way round is fine.
          </ConceptCard>
          <ConceptCard title="Electrolytic (polarized)" accent="amber" visual={<ComponentSymbol slug="capacitor-polarized" className="h-14 w-auto" />}>
            Large values (µF–mF). The stripe marks the − leg. Backwards, it can overheat and burst.
          </ConceptCard>
        </ConceptGrid>
      ),
    },
  ],
  analogy: {
    title: "Filling a bucket through a hose",
    content: (
      <p>
        Charging a capacitor is like filling a bucket through a narrow hose (the resistor). A thin hose fills it slowly; a bigger bucket (more
        capacitance) takes longer to fill. As the bucket fills, the water pushes back and the flow slows down.
      </p>
    ),
    limits: ["A capacitor stores separated charge, not a “substance” — the total charge in the circuit doesn't change.", "No current actually crosses the insulating gap."],
  },
  whereFound: [
    { icon: Cpu, place: "Next to every chip", detail: "Small “decoupling” capacitors supply quick bursts of current and filter noise." },
    { icon: Camera, place: "Camera flashes", detail: "A capacitor charges slowly, then dumps its energy into the flash in an instant." },
    { icon: Timer, place: "Timers", detail: "The RC delay sets how long an LED blinks or a light stays on." },
    { icon: Keyboard, place: "Touchscreens", detail: "Your finger changes a tiny capacitance the screen can detect." },
  ],
  mistakes: mistakesFor("capacitor"),
  safety: ["capacitors", "polarity"],
  keyTakeaway: "A capacitor stores charge. Through a resistor it charges gradually: τ = R × C sets the pace, and it is essentially full after 5τ.",
  takeaways: ["Capacitance is measured in farads (µF is common).", "τ = R × C; 63% after 1τ, ~99% after 5τ.", "Electrolytic capacitors are polarized: stripe = −.", "Stored energy = ½CV²."],
  quickCheck: [
    {
      id: "tau",
      type: "multiple-choice",
      prompt: "R = 10 kΩ and C = 100 µF. What is the time constant?",
      options: [
        { id: "1s", label: "1 second" },
        { id: "0.1s", label: "0.1 second" },
        { id: "10s", label: "10 seconds" },
        { id: "1ms", label: "1 millisecond" },
      ],
      correctOptionId: "1s",
      explanation: "τ = R × C = 10,000 Ω × 0.0001 F = 1 s. It will be about 63% charged after 1 s and full after about 5 s.",
    },
    {
      id: "bigger-c",
      type: "predict",
      prompt: "You swap the capacitor for one with twice the capacitance. What happens to the charging time?",
      options: [
        { id: "double", label: "It doubles" },
        { id: "half", label: "It halves" },
        { id: "same", label: "It stays the same" },
      ],
      correctOptionId: "double",
      explanation: "τ = R × C, so doubling C doubles τ — the curve stretches out to twice as long.",
    },
    {
      id: "polarity",
      type: "true-false",
      prompt: "An electrolytic capacitor can be connected either way round.",
      options: [
        { id: "true", label: "True" },
        { id: "false", label: "False" },
      ],
      correctOptionId: "false",
      explanation: "Electrolytics are polarized. The stripe marks the negative leg; reversed, they can overheat, bulge or burst.",
    },
  ],
  next: {
    title: "The diode",
    description: "A one-way valve for current — and the reason an LED only works one way round.",
    href: "/learn/components/diode",
    cta: "Meet the diode",
  },
};
