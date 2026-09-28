import { BatteryCharging, Car, Plug, Zap } from "lucide-react";
import { ComponentIntro } from "@/components/component-lab/ComponentIntro";
import { DiodeLab, HalfWaveRectifier } from "@/components/component-lab/DiodeLab";
import { ConceptCard, ConceptGrid, KeyIdea, Prose, VisualStage } from "@/components/lesson/LessonBlocks";
import { Callout } from "@/components/ui/Callout";
import type { LessonContent } from "../types";
import { mistakesFor } from "./shared";

export const diodeLesson: LessonContent = {
  moduleSlug: "components",
  lessonSlug: "diode",
  objective: "Explain forward and reverse bias, and describe how diodes rectify AC and protect circuits.",
  objectives: ["Find the cathode band", "Use the 0.7 V forward drop"],
  buildsOn: ["The LED"],
  sections: [
    {
      id: "see-it",
      stage: "concept",
      title: "See the diode",
      content: (
        <>
          <ComponentIntro slug="diode" />
          <Prose>
            <p>
              A diode lets current flow in <strong>one direction only</strong> — from anode to cathode, in the direction the symbol&apos;s
              triangle points. The band painted on the body marks the cathode.
            </p>
          </Prose>
        </>
      ),
    },
    {
      id: "reverse-it",
      stage: "experiment",
      title: "Forward vs reverse",
      content: (
        <>
          <Callout kind="try">
            <p>Press “Reverse the diode” and compare the two current bars.</p>
          </Callout>
          <VisualStage>
            <DiodeLab />
          </VisualStage>
          <ConceptGrid columns={2}>
            <ConceptCard title="Forward bias">Anode more positive than cathode by ~0.7 V: the diode conducts, like a closed switch with a small voltage drop.</ConceptCard>
            <ConceptCard title="Reverse bias" accent="amber">Cathode more positive: the diode blocks, like an open switch. Only a tiny leakage current flows.</ConceptCard>
          </ConceptGrid>
        </>
      ),
    },
    {
      id: "rectification",
      stage: "visual",
      title: "Rectification: AC in, DC out",
      content: (
        <>
          <Prose>
            <p>
              AC swings positive and negative. A diode lets only one half through, so the output always flows the same way. Chargers use four
              diodes (a bridge) plus a capacitor to make smooth DC.
            </p>
          </Prose>
          <VisualStage>
            <HalfWaveRectifier />
          </VisualStage>
          <KeyIdea>Diodes also protect: one in series stops damage if a battery goes in backwards, and one across a motor or relay coil absorbs the voltage spike when it switches off.</KeyIdea>
        </>
      ),
    },
  ],
  analogy: {
    title: "A one-way valve",
    content: <p>A diode is like a non-return valve in a pipe: water pushes it open one way, and pushes it shut the other.</p>,
    limits: ["A real valve needs no pressure to open; a silicon diode needs about 0.7 V before it conducts.", "Push hard enough the wrong way and a diode breaks down — valves just leak."],
  },
  whereFound: [
    { icon: Plug, place: "Phone chargers", detail: "A bridge rectifier turns mains AC into DC." },
    { icon: BatteryCharging, place: "Battery devices", detail: "Protect against batteries inserted backwards." },
    { icon: Zap, place: "Motor and relay circuits", detail: "Flyback diodes absorb the voltage spike from coils." },
    { icon: Car, place: "Cars", detail: "The alternator's diodes charge the battery with DC." },
  ],
  mistakes: mistakesFor("diode"),
  safety: ["polarity", "mains"],
  keyTakeaway: "A diode conducts in one direction (anode → cathode, with about 0.7 V drop) and blocks the other, which is used for rectifying AC and protecting circuits.",
  takeaways: ["The band marks the cathode.", "Forward bias: conducts with ~0.7 V drop.", "Reverse bias: blocks.", "Uses: rectifiers, reverse-polarity and flyback protection."],
  quickCheck: [
    {
      id: "band",
      type: "identify",
      prompt: "Which end of a diode does the painted band mark?",
      options: [
        { id: "cathode", label: "The cathode" },
        { id: "anode", label: "The anode" },
        { id: "neither", label: "Neither — it's decoration" },
      ],
      correctOptionId: "cathode",
      explanation: "The band matches the bar in the symbol: the cathode, where conventional current leaves the diode.",
    },
    {
      id: "reverse",
      type: "predict",
      prompt: "A diode and a lamp are in series with a 9 V battery. You turn the diode around. What happens?",
      options: [
        { id: "off", label: "The lamp goes out" },
        { id: "brighter", label: "The lamp gets brighter" },
        { id: "same", label: "Nothing changes" },
      ],
      correctOptionId: "off",
      explanation: "Reversed, the diode is reverse-biased and blocks the current, so the whole series loop stops.",
    },
    {
      id: "drop",
      type: "multiple-choice",
      prompt: "Roughly how much voltage does a conducting silicon diode use?",
      options: [
        { id: "0.7", label: "About 0.7 V" },
        { id: "0", label: "0 V" },
        { id: "5", label: "About 5 V" },
        { id: "all", label: "The full supply voltage" },
      ],
      correctOptionId: "0.7",
      explanation: "A silicon diode drops about 0.6–0.7 V when conducting. The rest of the supply is left for the load.",
    },
  ],
  next: {
    title: "The transistor",
    description: "The component that made computers possible: a tiny signal switching a bigger current.",
    href: "/learn/components/transistor",
    cta: "Switch with a transistor",
  },
};
