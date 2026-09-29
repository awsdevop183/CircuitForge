import { Headphones, Mic, Smartphone, Thermometer } from "lucide-react";
import { AnalogVsDigital } from "@/components/digital/AnalogVsDigital";
import { ConceptCard, ConceptGrid, KeyIdea, Prose, VisualStage } from "@/components/lesson/LessonBlocks";
import { Callout } from "@/components/ui/Callout";
import type { LessonContent } from "../types";

export const analogVsDigital: LessonContent = {
  moduleSlug: "digital-electronics",
  lessonSlug: "analog-vs-digital",
  objective: "Tell an analog signal (continuously varying) from a digital one (discrete states), with real examples of each.",
  objectives: ["Explain why digital electronics uses two states"],
  buildsOn: ["Voltage", "DC vs AC"],
  sections: [
    {
      id: "two-kinds",
      stage: "concept",
      title: "Two ways to carry information",
      content: (
        <>
          <Prose>
            <p>
              Electricity can carry <strong>information</strong> as well as energy. The information lives in how a voltage changes over time
              — the <strong>signal</strong>. There are two main kinds.
            </p>
          </Prose>
          <ConceptGrid columns={2}>
            <ConceptCard title="Analog" accent="amber" visual={<span className="font-mono text-3xl text-amber">∿</span>}>
              Continuously varying. The voltage can be any value in a range, and every tiny change carries meaning.
            </ConceptCard>
            <ConceptCard title="Digital" visual={<span className="font-mono text-3xl text-logic">⎍⎍</span>}>
              Discrete states. The voltage is treated as one of a few levels — usually just two: LOW (0) and HIGH (1).
            </ConceptCard>
          </ConceptGrid>
        </>
      ),
    },
    {
      id: "compare",
      stage: "experiment",
      title: "Switch between analog and digital",
      content: (
        <>
          <Callout kind="try">
            <p>Watch the analog readout for a few seconds — how many different values do you see? Now switch to digital and count the states.</p>
          </Callout>
          <VisualStage>
            <AnalogVsDigital />
          </VisualStage>
          <KeyIdea>Real-world physical quantities are often analog. Digital electronics represents information using discrete states — and that makes it reliable and easy to copy, store and process.</KeyIdea>
        </>
      ),
    },
    {
      id: "why-digital",
      stage: "visual",
      title: "Why use only two states?",
      content: (
        <ConceptGrid columns={3}>
          <ConceptCard title="Noise doesn't matter">A HIGH that wobbles a little is still HIGH. An analog signal is changed by every bit of noise.</ConceptCard>
          <ConceptCard title="Perfect copies" accent="amber">Copy a digital file a million times and it stays identical — 0s stay 0s, 1s stay 1s.</ConceptCard>
          <ConceptCard title="Simple switches">Transistors are excellent switches: fully on or fully off. Two states match them perfectly.</ConceptCard>
        </ConceptGrid>
      ),
    },
  ],
  analogy: {
    title: "A dimmer vs a light switch",
    content: <p>An analog signal is like a dimmer knob: the light can be at any brightness. A digital signal is like an ordinary light switch: it is either off or on. (This is an analogy — the signals themselves are voltages that change over time.)</p>,
    limits: ["Real digital signals do take a short time to change between LOW and HIGH; they aren't perfectly instant.", "A digital system can still represent “in-between” values — by using many bits to make a number."],
  },
  whereFound: [
    { icon: Mic, place: "Microphones (analog)", detail: "The voltage follows the sound wave." },
    { icon: Thermometer, place: "Sensors (both)", detail: "Some output a smooth voltage, others send the reading as bits." },
    { icon: Smartphone, place: "Phones (digital)", detail: "Everything — calls, photos, apps — is processed as 0s and 1s." },
    { icon: Headphones, place: "Headphones (back to analog)", detail: "Digital music is turned back into a smooth signal to drive the speaker." },
  ],
  mistakes: [
    { mistake: "Thinking digital means “modern” or “better”", fix: "Both have jobs. Sound, light and temperature are analog; digital is a way of representing and processing them." },
    { mistake: "Thinking a digital signal has no voltage", fix: "It's still a voltage — it's just interpreted as one of two states." },
  ],
  keyTakeaway: "Analog signals vary continuously; digital signals use discrete states — usually just two, 0 and 1 — which makes them robust against noise.",
  takeaways: ["Analog: any value in a range.", "Digital: discrete states, usually LOW (0) and HIGH (1).", "Physical quantities are often analog; digital electronics represents information with 0s and 1s."],
  quickCheck: [
    {
      id: "which-analog",
      type: "multiple-choice",
      prompt: "Which of these is an analog signal?",
      options: [
        { id: "mic", label: "The voltage from a microphone" },
        { id: "usb", label: "Data on a USB cable" },
        { id: "gpio", label: "A microcontroller pin switching on and off" },
      ],
      correctOptionId: "mic",
      explanation: "A microphone's voltage follows the sound wave smoothly — it can be any value in its range.",
    },
    {
      id: "states",
      type: "true-false",
      prompt: "A typical digital signal uses two states: LOW (0) and HIGH (1).",
      options: [
        { id: "true", label: "True" },
        { id: "false", label: "False" },
      ],
      correctOptionId: "true",
      explanation: "Two states are the most common choice — they are simple and robust. (Some systems use more levels, but the idea is the same: discrete states.)",
    },
  ],
  next: { title: "What is a digital signal?", description: "Look closely at a digital waveform: HIGH, LOW, edges and frequency.", href: "/learn/digital-electronics/digital-signals", cta: "Shape a digital signal" },
};
