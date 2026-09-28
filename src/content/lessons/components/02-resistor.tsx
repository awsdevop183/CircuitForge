import { Cpu, Lightbulb, Thermometer, Volume2 } from "lucide-react";
import { ComponentIntro } from "@/components/component-lab/ComponentIntro";
import { ResistorLab } from "@/components/component-lab/ResistorLab";
import { VoltageDivider } from "@/components/component-lab/VoltageDivider";
import { ResistorColorCodeReader } from "@/components/explorer/deep-dives/ResistorDeepDive";
import { KeyIdea, Prose, VisualStage } from "@/components/lesson/LessonBlocks";
import { Callout } from "@/components/ui/Callout";
import type { LessonContent } from "../types";
import { mistakesFor } from "./shared";

export const resistorLesson: LessonContent = {
  moduleSlug: "components",
  lessonSlug: "resistor",
  objective: "Use a resistor to set a current, read its value from the colour bands, and use two resistors to divide a voltage.",
  objectives: ["Predict current with I = V ÷ R", "Read a 4-band colour code", "Check a resistor's power rating"],
  buildsOn: ["Resistance", "Ohm's law"],
  sections: [
    {
      id: "see-it",
      stage: "concept",
      title: "See the resistor",
      content: (
        <>
          <ComponentIntro slug="resistor" showSpecs />
          <KeyIdea>Same voltage, more resistance → less current. A resistor lets you choose the current.</KeyIdea>
        </>
      ),
    },
    {
      id: "resistance-vs-current",
      stage: "experiment",
      title: "Resistance vs current",
      content: (
        <>
          <Prose>
            <p>
              Change the resistance and watch the current. The bars compare 100 Ω, 1 kΩ and 10 kΩ at the same voltage: each ×10 in resistance
              gives ÷10 in current.
            </p>
          </Prose>
          <VisualStage>
            <ResistorLab />
          </VisualStage>
        </>
      ),
    },
    {
      id: "colour-code",
      stage: "visual",
      title: "Read the colour bands",
      content: (
        <>
          <Prose>
            <p>
              Resistors are too small for printed numbers, so their value is painted on as bands. Brown–black–red means 1, 0, × 100 ={" "}
              <strong>1 kΩ</strong>. Pick colours and watch the value change.
            </p>
          </Prose>
          <VisualStage>
            <ResistorColorCodeReader />
          </VisualStage>
        </>
      ),
    },
    {
      id: "voltage-divider",
      stage: "experiment",
      title: "Two resistors divide a voltage",
      content: (
        <>
          <Prose>
            <p>
              Put two resistors in series across a battery and the voltage between them is a fraction of the supply:{" "}
              <strong>Vout = Vin × R2 ÷ (R1 + R2)</strong>. Sensors and volume knobs use this idea.
            </p>
          </Prose>
          <Callout kind="try" className="mt-6">
            <p>Make R1 and R2 equal. What fraction of 9 V do you get? Now make R2 ten times bigger than R1.</p>
          </Callout>
          <VisualStage>
            <VoltageDivider />
          </VisualStage>
        </>
      ),
    },
  ],
  analogy: {
    title: "A narrow section of pipe",
    content: <p>A resistor is like a narrow section in a water pipe: for the same push (pressure), a narrower section lets less water through each second.</p>,
    limits: ["In a series circuit the current is the same everywhere — it doesn't “speed up” through the resistor.", "A resistor turns electrical energy into heat; a narrow pipe barely warms."],
  },
  whereFound: [
    { icon: Lightbulb, place: "LED indicators", detail: "Every indicator LED has a resistor in series to limit its current." },
    { icon: Cpu, place: "Computer boards", detail: "Pull-up and pull-down resistors hold digital inputs at a known level." },
    { icon: Thermometer, place: "Sensors", detail: "A sensor and a fixed resistor form a voltage divider a microcontroller can read." },
    { icon: Volume2, place: "Audio", detail: "Resistors set the gain of amplifiers and the tone of filters." },
  ],
  mistakes: mistakesFor("resistor"),
  safety: ["ratings"],
  keyTakeaway: "A resistor sets the current in a circuit (I = V ÷ R), its value is read from colour bands, and two resistors in series divide a voltage.",
  takeaways: ["×10 resistance → ÷10 current at the same voltage.", "Brown–black–red = 1 kΩ.", "Check the power rating: P = V × I.", "Vout = Vin × R2 ÷ (R1 + R2)."],
  quickCheck: [
    {
      id: "current",
      type: "multiple-choice",
      prompt: "A 9 V battery is connected across a 1 kΩ resistor. What current flows?",
      options: [
        { id: "9ma", label: "9 mA" },
        { id: "9a", label: "9 A" },
        { id: "90ma", label: "90 mA" },
        { id: "0.9ma", label: "0.9 mA" },
      ],
      correctOptionId: "9ma",
      explanation: "I = V ÷ R = 9 V ÷ 1000 Ω = 0.009 A = 9 mA.",
    },
    {
      id: "bands",
      type: "identify",
      prompt: "A resistor's bands read yellow, violet, brown, gold. What is its value? (yellow = 4, violet = 7, brown = ×10)",
      options: [
        { id: "470", label: "470 Ω" },
        { id: "47", label: "47 Ω" },
        { id: "4k7", label: "4.7 kΩ" },
        { id: "471", label: "471 Ω" },
      ],
      correctOptionId: "470",
      explanation: "4 and 7 give 47, and the brown multiplier is × 10, so 470 Ω. The gold band means ±5% tolerance.",
    },
    {
      id: "divider",
      type: "predict",
      prompt: "Two equal resistors are in series across 9 V. What voltage is at the point between them?",
      options: [
        { id: "4.5", label: "4.5 V" },
        { id: "9", label: "9 V" },
        { id: "0", label: "0 V" },
        { id: "18", label: "18 V" },
      ],
      correctOptionId: "4.5",
      explanation: "Equal resistors share the voltage equally: 9 × R ÷ (R + R) = 4.5 V.",
    },
  ],
  next: {
    title: "The LED",
    description: "Put your resistor to work: light an LED safely, and see what happens without one.",
    href: "/learn/components/led",
    cta: "Light an LED",
  },
};
