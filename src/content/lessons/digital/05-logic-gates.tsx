import { Cpu, ShieldCheck, WashingMachine } from "lucide-react";
import { GateExplorer, SameInputsAllGates } from "@/components/digital/GateExplorer";
import { KeyIdea, Prose, VisualStage } from "@/components/lesson/LessonBlocks";
import { Callout } from "@/components/ui/Callout";
import type { LessonContent } from "../types";

export const logicGatesLesson: LessonContent = {
  moduleSlug: "digital-electronics",
  lessonSlug: "logic-gates",
  objective: "Describe a logic gate as a circuit that makes a decision from its inputs, and explore all seven common gates.",
  objectives: ["Read a gate symbol, its inputs and output", "Use a truth table"],
  buildsOn: ["Logic HIGH and LOW", "The transistor (Module 02)"],
  sections: [
    {
      id: "what-is-a-gate",
      stage: "concept",
      title: "Circuits that decide",
      content: (
        <Prose>
          <p>
            A <strong>logic gate</strong> is a small circuit with one or more inputs and one output. It looks at its inputs (0s and 1s) and
            produces an output according to a fixed rule. Inside, it is built from a few transistors working as switches.
          </p>
          <p>
            Every gate has a <strong>symbol</strong>, and a <strong>truth table</strong> listing the output for every possible combination of
            inputs.
          </p>
        </Prose>
      ),
    },
    {
      id: "explorer",
      stage: "experiment",
      title: "The gate explorer",
      content: (
        <>
          <Callout kind="try">
            <p>Pick a gate, click the input switches (in the diagram or below), and watch the signal travel to the output. Click a row in the truth table to jump to it.</p>
          </Callout>
          <VisualStage>
            <GateExplorer />
          </VisualStage>
        </>
      ),
    },
    {
      id: "same-inputs",
      stage: "visual",
      title: "Same inputs, seven decisions",
      content: (
        <>
          <VisualStage>
            <SameInputsAllGates />
          </VisualStage>
          <KeyIdea>A gate&apos;s whole behaviour is its rule. Learn the seven rules and you can read any logic diagram.</KeyIdea>
        </>
      ),
    },
  ],
  analogy: {
    title: "A decision-maker with a rulebook",
    content: <p>A gate is like a security guard with a one-line rulebook: &ldquo;let people through only if they have a ticket AND an ID&rdquo;. It never thinks — it just applies the rule. (An analogy: a real gate applies its rule to voltages, in billionths of a second.)</p>,
    limits: ["A gate has no memory: its output depends only on its inputs right now.", "Gates do take a tiny time to respond (propagation delay) — usually nanoseconds or less."],
  },
  whereFound: [
    { icon: Cpu, place: "Every processor", detail: "Billions of gates make every decision a computer takes." },
    { icon: WashingMachine, place: "Appliances", detail: "“Only start if the door is closed AND water is on.”" },
    { icon: ShieldCheck, place: "Safety interlocks", detail: "Machines stop if a guard is open OR the stop button is pressed." },
  ],
  mistakes: [
    { mistake: "Thinking gates store answers", fix: "A gate only reacts to its current inputs. Remembering needs extra circuitry — you'll meet it in lesson 17." },
    { mistake: "Confusing the symbol shapes", fix: "Flat back = AND family. Curved back = OR family. A bubble means NOT (inverted)." },
  ],
  keyTakeaway: "A logic gate applies a fixed rule to its 0/1 inputs to produce a 0/1 output; its truth table lists the output for every input combination.",
  takeaways: ["Seven gates: NOT, AND, OR, NAND, NOR, XOR, XNOR.", "A bubble on a symbol means the output is inverted.", "Gates are built from transistor switches."],
  quickCheck: [
    {
      id: "bubble",
      type: "multiple-choice",
      prompt: "What does a small circle (bubble) on a gate's output mean?",
      options: [
        { id: "not", label: "The output is inverted (NOT)" },
        { id: "power", label: "It connects to power" },
        { id: "led", label: "An LED is attached" },
      ],
      correctOptionId: "not",
      explanation: "The bubble means NOT: NAND is AND with a bubble, NOR is OR with a bubble.",
    },
    {
      id: "memory",
      type: "true-false",
      prompt: "A logic gate's output depends only on its inputs right now.",
      options: [
        { id: "true", label: "True" },
        { id: "false", label: "False" },
      ],
      correctOptionId: "true",
      explanation: "Gates have no memory. Circuits that remember need feedback — that's memory, later in this module.",
    },
  ],
  next: { title: "The NOT gate", description: "The simplest gate of all: one input, flipped.", href: "/learn/digital-electronics/not-gate", cta: "Flip a bit" },
};
