import { Puzzle, Wrench } from "lucide-react";
import { ComponentChallenge } from "@/components/component-lab/ComponentChallenge";
import { KeyIdea, Prose, VisualStage } from "@/components/lesson/LessonBlocks";
import type { LessonContent } from "../types";

export const componentChallenge: LessonContent = {
  moduleSlug: "components",
  lessonSlug: "component-challenge",
  objective: "Design a working LED circuit from a box of parts, test it, and explain why it works.",
  objectives: ["Spot the component you don't need", "Debug a circuit from the test feedback"],
  buildsOn: ["Build your first circuit"],
  sections: [
    {
      id: "challenge",
      stage: "experiment",
      title: "Build a circuit that turns the LED on when the switch is closed",
      content: (
        <>
          <Prose>
            <p>You have a battery, an LED, a resistor and a switch — plus a few extra parts. Build the circuit, then test it. The solution unlocks once you&apos;ve had a go.</p>
          </Prose>
          <VisualStage>
            <ComponentChallenge />
          </VisualStage>
          <KeyIdea>Debugging is a skill: read the feedback, change one thing, and test again.</KeyIdea>
        </>
      ),
    },
  ],
  analogy: {
    title: "A recipe with the method missing",
    content: <p>You have the ingredients but not the method. Knowing what each ingredient does tells you how to combine them — and which one doesn&apos;t belong.</p>,
    limits: ["In a series loop the order barely matters; in cooking it often does."],
  },
  whereFound: [
    { icon: Wrench, place: "Real engineering", detail: "Engineers design, test, read the result and redesign — exactly this loop." },
    { icon: Puzzle, place: "Every project from now on", detail: "Future modules build on this: a microcontroller will replace your hand on the switch." },
  ],
  mistakes: [
    { mistake: "Using the capacitor as a connector", consequence: "It blocks steady DC once charged — the LED stays dark.", fix: "Use a wire where you only need a connection." },
    { mistake: "Changing several things at once", consequence: "You can't tell which change fixed (or broke) it.", fix: "Change one thing, then test." },
  ],
  safety: ["general"],
  keyTakeaway: "A working LED circuit needs a complete loop, a source, a current-limiting resistor, the LED the right way round, and a switch to control it.",
  takeaways: ["Complete loop + source + resistor + correctly oriented LED.", "The switch must be in the same loop as the LED.", "A capacitor blocks steady DC."],
  quickCheck: [
    {
      id: "capacitor",
      type: "predict",
      prompt: "You use the capacitor in place of a wire in the loop. What does the LED do?",
      options: [
        { id: "flash", label: "At most a brief flash, then dark" },
        { id: "on", label: "Stays on normally" },
        { id: "brighter", label: "Gets brighter" },
      ],
      correctOptionId: "flash",
      explanation: "Current flows only while the capacitor charges. Once it's charged, no steady DC can pass.",
    },
    {
      id: "needed",
      type: "multiple-choice",
      prompt: "Which part is NOT needed to make the LED light when the switch is closed?",
      options: [
        { id: "capacitor", label: "Capacitor" },
        { id: "resistor", label: "Resistor" },
        { id: "battery", label: "Battery" },
        { id: "switch", label: "Switch" },
      ],
      correctOptionId: "capacitor",
      explanation: "Battery (energy), switch (control), resistor (protection) and LED (output) are all needed; the capacitor isn't.",
    },
  ],
  next: {
    title: "Module complete — next: Digital Electronics",
    description: "You can now see, understand and use the core components. Keep practising with the Symbol Trainer and Identify game while the next module — Digital Electronics — is on its way.",
    href: "/components/symbol-trainer",
    cta: "Practise with the Symbol Trainer",
  },
};
