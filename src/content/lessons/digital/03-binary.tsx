import { HardDrive, Image as ImageIcon, Keyboard } from "lucide-react";
import { BinaryConverter } from "@/components/digital/BinaryConverter";
import { ConceptCard, ConceptGrid, KeyIdea, Prose, VisualStage } from "@/components/lesson/LessonBlocks";
import { Callout } from "@/components/ui/Callout";
import type { LessonContent } from "../types";

export const binaryLesson: LessonContent = {
  moduleSlug: "digital-electronics",
  lessonSlug: "binary",
  objective: "Convert numbers between decimal and binary using place values, and explain bits and bytes.",
  objectives: ["Read place values 8 4 2 1", "Know that a byte is 8 bits"],
  buildsOn: ["What is a digital signal?"],
  sections: [
    {
      id: "counting-with-two",
      stage: "concept",
      title: "Counting with only two digits",
      content: (
        <>
          <Prose>
            <p>
              We count in <strong>decimal</strong>, with ten digits (0–9). Digital circuits only have two states, so they count in{" "}
              <strong>binary</strong>, with two digits: 0 and 1. Each binary digit is called a <strong>bit</strong>.
            </p>
            <p>
              In decimal each column is worth 10× the one to its right (1, 10, 100…). In binary each column is worth <strong>2×</strong>: 1, 2,
              4, 8…
            </p>
          </Prose>
          <ConceptGrid columns={3}>
            <ConceptCard title="Bit" visual={<span className="font-mono text-3xl text-logic">1</span>}>
              One binary digit: 0 or 1.
            </ConceptCard>
            <ConceptCard title="4 bits" visual={<span className="font-mono text-3xl text-logic">0101</span>}>
              16 values: 0 to 15. (Sometimes called a nibble.)
            </ConceptCard>
            <ConceptCard title="Byte" accent="amber" visual={<span className="font-mono text-2xl text-amber">01000001</span>}>
              8 bits: 256 values, 0 to 255.
            </ConceptCard>
          </ConceptGrid>
        </>
      ),
    },
    {
      id: "converter",
      stage: "experiment",
      title: "The binary converter",
      content: (
        <>
          <Callout kind="try">
            <p>Make 5, then 10, then 15. What&apos;s the biggest number 4 bits can hold? Switch to 8 bits and find 255.</p>
          </Callout>
          <VisualStage>
            <BinaryConverter />
          </VisualStage>
          <KeyIdea>Binary to decimal: add up the place values that have a 1. Decimal to binary: take away the biggest place value that fits, and repeat.</KeyIdea>
        </>
      ),
    },
  ],
  analogy: {
    title: "A row of light switches",
    content: <p>Imagine a row of four light switches labelled 8, 4, 2 and 1. The number is the total of the labels on the switches that are ON. (An analogy for how a register of bits represents a number.)</p>,
    limits: ["Binary is just a way of writing numbers — the same number, 5, is 5 whether you write it 5 or 0101.", "Bits can also mean things other than numbers: letters, colours, instructions…"],
  },
  whereFound: [
    { icon: HardDrive, place: "Storage", detail: "A 1 TB drive holds about 8 trillion bits." },
    { icon: Keyboard, place: "Text", detail: "Each letter is stored as a number — “A” is 65, or 01000001." },
    { icon: ImageIcon, place: "Images", detail: "Each pixel's colour is a few bytes." },
  ],
  mistakes: [
    { mistake: "Reading binary like a decimal number", fix: "0101 is not “one hundred and one” — it's 4 + 1 = 5." },
    { mistake: "Starting place values at the left", fix: "The rightmost bit is worth 1; values double as you move left." },
  ],
  keyTakeaway: "Binary uses place values that double (1, 2, 4, 8…); a number is the sum of the place values holding a 1. 8 bits make a byte.",
  takeaways: ["Bit = one 0 or 1.", "Place values: …8 4 2 1.", "n bits → 2ⁿ values.", "1 byte = 8 bits = 0–255."],
  quickCheck: [
    {
      id: "to-decimal",
      type: "identify",
      prompt: "What is binary 1010 in decimal?",
      options: [
        { id: "10", label: "10" },
        { id: "5", label: "5" },
        { id: "1010", label: "1010" },
        { id: "12", label: "12" },
      ],
      correctOptionId: "10",
      explanation: "8 + 0 + 2 + 0 = 10.",
    },
    {
      id: "to-binary",
      type: "identify",
      prompt: "What is decimal 9 in 4-bit binary?",
      options: [
        { id: "1001", label: "1001" },
        { id: "0110", label: "0110" },
        { id: "1100", label: "1100" },
        { id: "0011", label: "0011" },
      ],
      correctOptionId: "1001",
      explanation: "9 = 8 + 1, so the 8 and 1 bits are set: 1001.",
    },
    {
      id: "byte",
      type: "multiple-choice",
      prompt: "What is the largest number one byte can hold?",
      options: [
        { id: "255", label: "255" },
        { id: "256", label: "256" },
        { id: "8", label: "8" },
        { id: "99", label: "99" },
      ],
      correctOptionId: "255",
      explanation: "8 bits give 256 values, counting from 0 — so the largest is 255 (11111111).",
    },
  ],
  next: { title: "Logic HIGH and LOW", description: "Which voltages count as 0 and which as 1? It depends on the device.", href: "/learn/digital-electronics/logic-levels", cta: "Explore logic levels" },
};
