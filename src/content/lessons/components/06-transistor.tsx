import { Cpu, Headphones, Radio, Smartphone } from "lucide-react";
import { ComponentIntro } from "@/components/component-lab/ComponentIntro";
import { TransistorSwitch } from "@/components/component-lab/TransistorSwitch";
import { ConceptCard, ConceptGrid, KeyIdea, Prose, VisualStage } from "@/components/lesson/LessonBlocks";
import { Callout } from "@/components/ui/Callout";
import type { LessonContent } from "../types";
import { mistakesFor } from "./shared";

export const transistorLesson: LessonContent = {
  moduleSlug: "components",
  lessonSlug: "transistor",
  objective: "Use an NPN transistor as a switch: a small input signal turns a bigger load current on and off.",
  objectives: ["Name the base, collector and emitter", "Tell switching from amplification"],
  buildsOn: ["The LED", "The diode"],
  sections: [
    {
      id: "see-it",
      stage: "concept",
      title: "See the transistor",
      content: (
        <>
          <ComponentIntro slug="transistor" />
          <Prose>
            <p>
              An NPN transistor has three legs: <strong>base (B)</strong>, <strong>collector (C)</strong> and <strong>emitter (E)</strong>. A
              small current into the base lets a much bigger current flow from collector to emitter. No moving parts — it&apos;s all done in
              silicon.
            </p>
          </Prose>
        </>
      ),
    },
    {
      id: "npn-switch",
      stage: "experiment",
      title: "Input → transistor → LED",
      content: (
        <>
          <Callout kind="try">
            <p>Set the input HIGH, then LOW. Follow the chain: Input LOW → transistor OFF → LED OFF. Input HIGH → transistor ON → LED ON.</p>
          </Callout>
          <VisualStage>
            <TransistorSwitch />
          </VisualStage>
          <KeyIdea>A microcontroller pin can only supply a few milliamps. A transistor lets that tiny signal control a load that needs much more.</KeyIdea>
        </>
      ),
    },
    {
      id: "switch-vs-amplify",
      stage: "visual",
      title: "Two jobs: switching and amplifying",
      content: (
        <ConceptGrid columns={2}>
          <ConceptCard title="Switching">Base fully on or fully off. The load is either ON or OFF — like a digital signal. This is how computers work: billions of transistor switches.</ConceptCard>
          <ConceptCard title="Amplifying" accent="amber">A small change in base current makes a bigger, matching change in collector current. Used in audio amplifiers and radios.</ConceptCard>
        </ConceptGrid>
      ),
    },
  ],
  analogy: {
    title: "A tap controlling a big pipe",
    content: <p>A transistor is like a small tap that controls a big water main. A little effort on the tap (base) controls a big flow (collector to emitter).</p>,
    limits: ["The base current and the collector current both flow out of the emitter — they combine.", "Even fully “open”, a transistor can only pass so much current before it overheats."],
  },
  whereFound: [
    { icon: Cpu, place: "Processors", detail: "Billions of microscopic transistor switches do every calculation." },
    { icon: Smartphone, place: "Phones", detail: "Transistors switch the screen, radio and power circuits." },
    { icon: Headphones, place: "Headphone amplifiers", detail: "Turn a weak audio signal into one that can drive a speaker." },
    { icon: Radio, place: "Radios", detail: "Amplify tiny signals picked up by the antenna." },
  ],
  mistakes: mistakesFor("transistor"),
  safety: ["ratings", "heat"],
  keyTakeaway: "A transistor uses a small base current to control a larger collector current — as an on/off switch or as an amplifier.",
  takeaways: ["NPN legs: base, collector, emitter.", "Input HIGH → transistor ON → load ON.", "Always use a base resistor.", "Switching = on/off; amplifying = proportional."],
  quickCheck: [
    {
      id: "low",
      type: "predict",
      prompt: "In the NPN switch circuit, the input is set LOW (0 V). What happens to the LED?",
      options: [
        { id: "off", label: "Off — the transistor is off" },
        { id: "on", label: "On — the transistor is on" },
        { id: "dim", label: "Half brightness" },
      ],
      correctOptionId: "off",
      explanation: "No base current flows at 0 V, so the transistor is off and no collector current flows through the LED.",
    },
    {
      id: "legs",
      type: "multiple-choice",
      prompt: "Which leg of an NPN transistor receives the small control current?",
      options: [
        { id: "base", label: "Base" },
        { id: "collector", label: "Collector" },
        { id: "emitter", label: "Emitter" },
      ],
      correctOptionId: "base",
      explanation: "The small control current goes into the base. The larger load current flows from collector to emitter.",
    },
    {
      id: "amplify",
      type: "true-false",
      prompt: "A transistor can be used as an amplifier as well as a switch.",
      options: [
        { id: "true", label: "True" },
        { id: "false", label: "False" },
      ],
      correctOptionId: "true",
      explanation: "Between fully off and fully on, the collector current follows the base current, multiplied — that's amplification.",
    },
  ],
  next: {
    title: "The MOSFET",
    description: "A transistor controlled by voltage — ideal for switching motors and other heavy loads.",
    href: "/learn/components/mosfet",
    cta: "Drive a motor",
  },
};
