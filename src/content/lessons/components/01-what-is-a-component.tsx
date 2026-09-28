import { Car, Gamepad2, Smartphone, Tv } from "lucide-react";
import { ComponentJobs } from "@/components/component-lab/ComponentJobs";
import { ComponentSorter } from "@/components/component-lab/ComponentSorter";
import { ComponentSymbol } from "@/components/explorer/ComponentSymbol";
import { ConceptCard, ConceptGrid, KeyIdea, Prose, VisualStage } from "@/components/lesson/LessonBlocks";
import { Callout } from "@/components/ui/Callout";
import type { LessonContent } from "../types";

export const whatIsAComponent: LessonContent = {
  moduleSlug: "components",
  lessonSlug: "what-is-a-component",
  objective: "Explain what an electronic component is, and tell passive, active and electromechanical components apart.",
  objectives: ["Describe the job of each part in a simple circuit", "Sort components into families"],
  buildsOn: ["What is a circuit?", "Voltage, current and resistance"],
  sections: [
    {
      id: "parts-with-jobs",
      stage: "concept",
      title: "Every part has a job",
      content: (
        <>
          <Prose>
            <p>
              An <strong>electronic component</strong> is a part that does one job to the electricity flowing through it: it limits current,
              stores charge, makes light, switches something on… Circuits are built by combining components, the same way sentences are built
              from words.
            </p>
          </Prose>
          <ConceptGrid columns={3}>
            <ConceptCard title="Passive" visual={<ComponentSymbol slug="resistor" className="h-12 w-auto" />}>
              Can&apos;t amplify or control current by themselves. They resist, store or release energy. Resistors, capacitors.
            </ConceptCard>
            <ConceptCard title="Active" accent="amber" visual={<ComponentSymbol slug="transistor" className="h-14 w-auto" />}>
              Semiconductors that control current — a small signal can switch or amplify a bigger one. Diodes, LEDs, transistors.
            </ConceptCard>
            <ConceptCard title="Electromechanical" visual={<ComponentSymbol slug="relay" className="h-14 w-auto" />}>
              Moving metal parts, moved by a hand or a magnet. Switches, relays, motors.
            </ConceptCard>
          </ConceptGrid>
          <KeyIdea>A component is defined by what it does to current and voltage — its job — not by what it looks like.</KeyIdea>
        </>
      ),
    },
    {
      id: "working-together",
      stage: "visual",
      title: "Components working together",
      content: (
        <>
          <Prose>
            <p>Here is a tiny, real circuit. Select each component to see its job — and what would happen without it.</p>
          </Prose>
          <VisualStage>
            <ComponentJobs />
          </VisualStage>
        </>
      ),
    },
    {
      id: "sort-them",
      stage: "experiment",
      title: "Sort the components",
      content: (
        <>
          <Callout kind="try">
            <p>Put each component into its family. You&apos;ll get feedback on every choice.</p>
          </Callout>
          <VisualStage>
            <ComponentSorter />
          </VisualStage>
        </>
      ),
    },
  ],
  analogy: {
    title: "A team with different roles",
    content: (
      <p>
        A circuit is like a football team: the battery is the one who provides the energy, the resistor is the defender who holds things back,
        the switch is the referee who starts and stops play, and the LED is the striker everyone watches. No single player wins the game alone.
      </p>
    ),
    limits: ["Team players can change roles; a component always does the same job — it can't decide to do something else.", "In a series circuit, every “player” gets exactly the same current."],
  },
  whereFound: [
    { icon: Smartphone, place: "Phones", detail: "Thousands of tiny resistors, capacitors and transistors on one board." },
    { icon: Tv, place: "TVs and chargers", detail: "Big capacitors, diodes and regulators turn mains power into steady DC." },
    { icon: Gamepad2, place: "Game controllers", detail: "Push buttons, potentiometer joysticks and a motor for vibration." },
    { icon: Car, place: "Cars", detail: "Relays switch headlights and starter motors; sensors feed microcontrollers." },
  ],
  mistakes: [
    { mistake: "Thinking a component works on its own", consequence: "An LED on its own does nothing.", fix: "Components only do their job as part of a complete circuit with a source." },
    { mistake: "Judging a part by its size", consequence: "A resistor and a diode can look almost identical.", fix: "Check its markings, its symbol on the diagram, or measure it." },
    { mistake: "Thinking “passive” means “unimportant”", fix: "Passive components set currents, timing and voltages — most circuits wouldn't work without them." },
  ],
  safety: ["general"],
  keyTakeaway: "Electronic components each do one job to electricity — passive parts resist or store, active parts control current, electromechanical parts move.",
  takeaways: [
    "A component is a part with a specific electrical job.",
    "Passive: resistors, capacitors. Active: diodes, LEDs, transistors. Electromechanical: switches, relays, motors.",
    "Circuits combine components; each relies on the others.",
  ],
  quickCheck: [
    {
      id: "passive",
      type: "multiple-choice",
      prompt: "Which of these is a passive component?",
      options: [
        { id: "resistor", label: "Resistor" },
        { id: "transistor", label: "Transistor" },
        { id: "led", label: "LED" },
        { id: "relay", label: "Relay" },
      ],
      correctOptionId: "resistor",
      explanation: "A resistor can only oppose current — it can't switch or amplify. Transistors and LEDs are active (semiconductors); a relay is electromechanical.",
    },
    {
      id: "no-resistor",
      type: "predict",
      prompt: "In the battery–switch–resistor–LED circuit, what happens if you replace the resistor with a plain wire?",
      options: [
        { id: "burn", label: "Too much current — the LED can burn out" },
        { id: "dim", label: "The LED gets dimmer" },
        { id: "nothing", label: "Nothing changes" },
      ],
      correctOptionId: "burn",
      explanation: "The resistor's job is to limit current. Without it, only the tiny resistance of the wires and battery limits the current — far too much for an LED.",
    },
    {
      id: "relay-type",
      type: "true-false",
      prompt: "A relay is an electromechanical component because it has moving metal contacts.",
      options: [
        { id: "true", label: "True" },
        { id: "false", label: "False" },
      ],
      correctOptionId: "true",
      explanation: "A relay's coil pulls a metal arm to open or close contacts — electrical and mechanical at once.",
    },
  ],
  next: {
    title: "The resistor",
    description: "Start with the most common component of all — and see exactly how it controls current.",
    href: "/learn/components/resistor",
    cta: "Meet the resistor",
  },
};
