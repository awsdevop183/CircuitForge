import { Clock, Lightbulb, Usb } from "lucide-react";
import { DigitalSignalExplorer } from "@/components/digital/DigitalSignalExplorer";
import { ConceptCard, ConceptGrid, KeyIdea, Prose, VisualStage } from "@/components/lesson/LessonBlocks";
import { Callout } from "@/components/ui/Callout";
import type { LessonContent } from "../types";

export const digitalSignals: LessonContent = {
  moduleSlug: "digital-electronics",
  lessonSlug: "digital-signals",
  objective: "Read a digital waveform: identify HIGH, LOW, rising and falling edges, the period and the frequency.",
  objectives: ["Calculate period = 1 ÷ frequency", "Explain duty cycle"],
  buildsOn: ["Analog vs digital"],
  sections: [
    {
      id: "parts-of-a-signal",
      stage: "concept",
      title: "The parts of a digital signal",
      content: (
        <>
          <Prose>
            <p>A digital signal spends its time in one of two states and jumps between them. Six words describe it:</p>
          </Prose>
          <ConceptGrid columns={3}>
            <ConceptCard title="HIGH">The upper state: logic 1.</ConceptCard>
            <ConceptCard title="LOW">The lower state: logic 0.</ConceptCard>
            <ConceptCard title="Rising edge" accent="amber">The moment it jumps LOW → HIGH.</ConceptCard>
            <ConceptCard title="Falling edge" accent="amber">The moment it drops HIGH → LOW.</ConceptCard>
            <ConceptCard title="Period (T)">The time for one complete cycle, in seconds.</ConceptCard>
            <ConceptCard title="Frequency (f)">Cycles per second, in hertz (Hz). f = 1 ÷ T.</ConceptCard>
          </ConceptGrid>
        </>
      ),
    },
    {
      id: "shape-it",
      stage: "experiment",
      title: "Shape the waveform",
      content: (
        <>
          <Callout kind="try">
            <p>Double the frequency: what happens to the period? Then set the duty cycle to 75%. Finally change the HIGH voltage — does the signal still mean the same 1s and 0s?</p>
          </Callout>
          <VisualStage>
            <DigitalSignalExplorer />
          </VisualStage>
          <KeyIdea>Frequency and period are opposites: twice the frequency means half the period. The duty cycle is the share of each period spent HIGH.</KeyIdea>
        </>
      ),
    },
  ],
  analogy: {
    title: "A blinking lighthouse",
    content: <p>A lighthouse that flashes on and off is a slow digital signal: ON is HIGH, OFF is LOW, and how many flashes per minute is its frequency. (An analogy — a real digital signal is a voltage, and usually far faster.)</p>,
    limits: ["Real edges take a tiny amount of time (nanoseconds), so they're not perfectly vertical.", "Digital data signals don't have to repeat regularly — only clock signals do."],
  },
  whereFound: [
    { icon: Clock, place: "Clock signals", detail: "A steady square wave keeps every part of a computer in step." },
    { icon: Usb, place: "USB and serial data", detail: "Bits are sent as a pattern of HIGHs and LOWs." },
    { icon: Lightbulb, place: "LED dimming (PWM)", detail: "Changing the duty cycle changes the average brightness." },
  ],
  mistakes: [
    { mistake: "Mixing up period and frequency", fix: "Period is time per cycle (s); frequency is cycles per second (Hz). f = 1 ÷ T." },
    { mistake: "Thinking duty cycle changes the frequency", fix: "Duty cycle only changes how each cycle is split between HIGH and LOW." },
  ],
  keyTakeaway: "A digital signal switches between HIGH and LOW; its edges mark the changes, its period is one cycle, and frequency = 1 ÷ period.",
  takeaways: ["Rising edge: LOW → HIGH. Falling edge: HIGH → LOW.", "f = 1 ÷ T.", "Duty cycle = % of time HIGH."],
  quickCheck: [
    {
      id: "period",
      type: "multiple-choice",
      prompt: "A clock signal has a frequency of 2 Hz. What is its period?",
      options: [
        { id: "0.5", label: "0.5 s" },
        { id: "2", label: "2 s" },
        { id: "20", label: "20 ms" },
      ],
      correctOptionId: "0.5",
      explanation: "T = 1 ÷ f = 1 ÷ 2 = 0.5 seconds.",
    },
    {
      id: "falling",
      type: "multiple-choice",
      prompt: "What do we call the moment a signal changes from HIGH to LOW?",
      options: [
        { id: "falling", label: "A falling edge" },
        { id: "rising", label: "A rising edge" },
        { id: "period", label: "The period" },
      ],
      correctOptionId: "falling",
      explanation: "HIGH → LOW is a falling edge; LOW → HIGH is a rising edge.",
    },
  ],
  next: { title: "Binary — 0 and 1", description: "With only 0 and 1, how do we represent a number like 5? Enter binary.", href: "/learn/digital-electronics/binary", cta: "Flip some bits" },
};
