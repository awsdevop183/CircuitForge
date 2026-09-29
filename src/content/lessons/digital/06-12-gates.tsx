import { AlarmSmoke, Calculator, DoorOpen, Lamp, LampCeiling, Lightbulb, Scale, ShieldAlert, ToggleLeft, Vote } from "lucide-react";
import { GateComposition } from "@/components/digital/GateComposition";
import { NandUniversal } from "@/components/digital/NandUniversal";
import { KeyIdea, Prose, VisualStage } from "@/components/lesson/LessonBlocks";
import type { LessonContent } from "../types";
import { gateLesson } from "./gate-lesson";

const tf = (answer: boolean) => ({
  options: [
    { id: "true", label: "True" },
    { id: "false", label: "False" },
  ],
  correctOptionId: answer ? "true" : "false",
});
const bits = [
  { id: "0", label: "0" },
  { id: "1", label: "1" },
];

export const notGate: LessonContent = gateLesson({
  type: "NOT",
  lessonSlug: "not-gate",
  buildsOn: ["Logic gates"],
  intro: (
    <p>
      The <strong>NOT gate</strong>, or <strong>inverter</strong>, has one input and one output. Whatever goes in, the opposite comes out:
      0 → 1 and 1 → 0. The small bubble on its symbol is the mark of inversion you&apos;ll see on other gates too.
    </p>
  ),
  tryIt: <p>Click the input switch and watch the signal pass through the gate — and come out flipped.</p>,
  analogy: {
    title: "An “opposite day” sign",
    content: <p>A NOT gate is like a friend who always says the opposite: you say “yes”, they say “no”. (An analogy — electrically, a HIGH input voltage makes the output LOW and vice versa.)</p>,
    limits: ["A NOT gate never gets tired or makes exceptions: it always inverts.", "Inside, the inverter uses transistors to connect the output to 0 V or to the supply."],
  },
  whereFound: [
    { icon: ToggleLeft, place: "Active-LOW signals", detail: "Many chips are enabled by a LOW signal; a NOT gate converts between the two." },
    { icon: Lamp, place: "Night lights", detail: "Light sensor says “bright” → NOT → lamp off." },
  ],
  mistakes: [{ mistake: "Forgetting the bubble", fix: "The triangle alone is a buffer (output = input). The bubble makes it NOT." }],
  keyTakeaway: "A NOT gate outputs the opposite of its single input: 0 → 1, 1 → 0.",
  takeaways: ["One input, one output.", "0 → 1, 1 → 0.", "The bubble symbol means inversion."],
  quickCheck: [
    { id: "not-1", type: "predict", prompt: "The input of a NOT gate is 1. What is the output?", options: bits, correctOptionId: "0", explanation: "NOT flips the input: 1 becomes 0." },
    { id: "not-2", type: "predict", prompt: "Two NOT gates are connected in a row. The input is 0. What comes out of the second gate?", options: bits, correctOptionId: "0", explanation: "The first flips 0 to 1; the second flips 1 back to 0. Two NOTs cancel out." },
  ],
  next: { title: "The AND gate", description: "Two inputs — and both must agree.", href: "/learn/digital-electronics/and-gate", cta: "Try AND" },
});

export const andGate: LessonContent = gateLesson({
  type: "AND",
  lessonSlug: "and-gate",
  buildsOn: ["The NOT gate"],
  intro: (
    <p>
      The <strong>AND gate</strong> outputs 1 only when <strong>input A AND input B</strong> are both 1. If either input is 0, the output is
      0. Of its four input combinations, only one — 1 and 1 — turns it on.
    </p>
  ),
  tryIt: <p>Toggle A and B. Find every combination that turns the output on. How many are there?</p>,
  analogy: {
    title: "A door with a key AND a code",
    content: <p>A secure door opens only when you have the key <strong>AND</strong> you type the correct code. Either one alone isn&apos;t enough. This is an analogy to help you remember the rule — the electrical definition is: the output is HIGH only when every input is HIGH.</p>,
    limits: ["The gate doesn't “know” about doors — it just compares voltages.", "An AND gate can have more than two inputs; the rule is the same: all must be 1."],
  },
  whereFound: [
    { icon: DoorOpen, place: "Safety interlocks", detail: "A machine runs only when the guard is closed AND start is pressed." },
    { icon: Calculator, place: "Adders", detail: "AND works out the carry when adding binary numbers." },
  ],
  mistakes: [{ mistake: "Thinking AND means “add”", fix: "AND is a decision (both must be 1), not arithmetic. 1 AND 1 is 1, not 2." }],
  keyTakeaway: "An AND gate outputs 1 only when all of its inputs are 1.",
  takeaways: ["0 0 → 0, 0 1 → 0, 1 0 → 0, 1 1 → 1.", "Any 0 input forces the output to 0."],
  quickCheck: [
    { id: "and-1", type: "predict", prompt: "A = 1, B = 0. What does an AND gate output?", options: bits, correctOptionId: "0", explanation: "Both inputs must be 1. B is 0, so the output is 0." },
    { id: "and-2", type: "true-false", prompt: "An AND gate has exactly one input combination that outputs 1.", ...tf(true), explanation: "Only A = 1, B = 1 gives 1." },
  ],
  next: { title: "The OR gate", description: "Any one input is enough.", href: "/learn/digital-electronics/or-gate", cta: "Try OR" },
});

export const orGate: LessonContent = gateLesson({
  type: "OR",
  lessonSlug: "or-gate",
  buildsOn: ["The AND gate"],
  intro: (
    <p>
      The <strong>OR gate</strong> outputs 1 when <strong>at least one</strong> input is 1: A, or B, or both. Only when every input is 0 is
      the output 0.
    </p>
  ),
  tryIt: <p>Toggle A and B. How many combinations turn the output on? Compare with AND.</p>,
  analogy: {
    title: "Two buttons for one light",
    content: <p>A porch light with two push buttons: it turns on if button A <strong>OR</strong> button B is pressed — or both. (An analogy for remembering the rule. Electrically: the output is HIGH when any input is HIGH.)</p>,
    limits: ["A two-way stair light (where each switch toggles the light) actually behaves like XOR, not OR.", "Pressing both doesn't make the output “more on”: it's still just 1."],
  },
  whereFound: [
    { icon: AlarmSmoke, place: "Alarms", detail: "Sound the alarm if smoke OR heat is detected." },
    { icon: LampCeiling, place: "Car interior lights", detail: "On if any door is open." },
  ],
  mistakes: [{ mistake: "Thinking 1 OR 1 = 0", fix: "That's XOR (exclusive OR). Plain OR gives 1 when both are 1." }],
  keyTakeaway: "An OR gate outputs 1 when at least one input is 1, and 0 only when all inputs are 0.",
  takeaways: ["0 0 → 0, 0 1 → 1, 1 0 → 1, 1 1 → 1.", "Any 1 input forces the output to 1."],
  quickCheck: [
    { id: "or-1", type: "predict", prompt: "A = 1, B = 1. What does an OR gate output?", options: bits, correctOptionId: "1", explanation: "At least one input is 1 (here both are), so the output is 1." },
    { id: "or-2", type: "predict", prompt: "A = 0, B = 0. What does an OR gate output?", options: bits, correctOptionId: "0", explanation: "No input is 1, so the output is 0." },
  ],
  next: { title: "The NAND gate", description: "AND with a twist — and the most important gate in chip-making.", href: "/learn/digital-electronics/nand-gate", cta: "Try NAND" },
});

export const nandGate: LessonContent = gateLesson({
  type: "NAND",
  lessonSlug: "nand-gate",
  buildsOn: ["The AND gate", "The NOT gate"],
  intro: (
    <p>
      <strong>NAND</strong> means NOT-AND: an AND gate followed by a NOT. It outputs 0 only when all inputs are 1 — exactly the opposite of
      AND on every row. The bubble on the symbol is that NOT.
    </p>
  ),
  tryIt: <p>Toggle A and B and compare each output with what AND would give.</p>,
  extraSections: [
    {
      id: "composition",
      stage: "visual",
      title: "NAND = AND + NOT",
      content: (
        <>
          <Prose>
            <p>Here is the recipe: an AND gate feeding a NOT gate, next to a single NAND symbol. Both get the same inputs — and always agree.</p>
          </Prose>
          <VisualStage>
            <GateComposition type="NAND" />
          </VisualStage>
        </>
      ),
    },
    {
      id: "universal",
      stage: "experiment",
      title: "The universal gate",
      content: (
        <>
          <Prose>
            <p>
              NAND is called a <strong>universal gate</strong>: NOT, AND and OR — and therefore <em>any</em> logic circuit — can be built from
              NAND gates alone. Chip designers love this: one simple, fast gate, repeated.
            </p>
          </Prose>
          <VisualStage>
            <NandUniversal />
          </VisualStage>
          <KeyIdea>With enough NAND gates you can build any digital circuit. (NOR is universal too.)</KeyIdea>
        </>
      ),
    },
  ],
  analogy: {
    title: "“Unless both”",
    content: <p>A NAND gate is like a light that stays on <strong>unless</strong> two people both press their buttons at once. (An analogy; electrically the output is LOW only when every input is HIGH.)</p>,
    limits: ["There's no “unless” inside a chip — just transistors that pull the output LOW when both are on."],
  },
  whereFound: [
    { icon: Scale, place: "Chip design", detail: "Standard cell libraries are built heavily on NAND and NOR gates." },
    { icon: Calculator, place: "Flash memory", detail: "“NAND flash” in USB sticks and SSDs is named after its NAND-like cell arrangement." },
  ],
  mistakes: [{ mistake: "Thinking NAND is (NOT A) AND (NOT B)", fix: "NAND is NOT(A AND B): do the AND first, then invert. (NOT A) AND (NOT B) is actually NOR." }],
  keyTakeaway: "NAND = NOT(AND): its output is 0 only when all inputs are 1, and it is universal — any circuit can be built from NANDs.",
  takeaways: ["0 0 → 1, 0 1 → 1, 1 0 → 1, 1 1 → 0.", "NAND = AND then NOT.", "Universal: NOT, AND and OR can be made from NANDs."],
  quickCheck: [
    { id: "nand-1", type: "predict", prompt: "A = 1, B = 1. What does a NAND gate output?", options: bits, correctOptionId: "0", explanation: "AND gives 1; NOT flips it to 0." },
    { id: "nand-2", type: "multiple-choice", prompt: "Why is NAND called a universal gate?", options: [{ id: "any", label: "Any logic circuit can be built from NAND gates alone" }, { id: "voltage", label: "It works at every voltage" }, { id: "inputs", label: "It accepts any number of inputs" }], correctOptionId: "any", explanation: "NOT, AND and OR can all be made from NANDs — so everything else can be too." },
  ],
  next: { title: "The NOR gate", description: "OR with a twist.", href: "/learn/digital-electronics/nor-gate", cta: "Try NOR" },
});

export const norGate: LessonContent = gateLesson({
  type: "NOR",
  lessonSlug: "nor-gate",
  buildsOn: ["The OR gate", "The NAND gate"],
  intro: (
    <p>
      <strong>NOR</strong> means NOT-OR: an OR gate followed by a NOT. It outputs 1 only when <strong>every input is 0</strong> — if any
      input is 1, the output is 0.
    </p>
  ),
  tryIt: <p>Find the one combination that turns the NOR gate&apos;s output on.</p>,
  extraSections: [
    {
      id: "composition",
      stage: "visual",
      title: "NOR = OR + NOT",
      content: (
        <VisualStage>
          <GateComposition type="NOR" />
        </VisualStage>
      ),
    },
  ],
  analogy: {
    title: "“Neither… nor…”",
    content: <p>“The room is quiet only if <strong>neither</strong> the TV <strong>nor</strong> the radio is on.” Quiet = 1 only when both are off. (An analogy; electrically the output is HIGH only when every input is LOW.)</p>,
    limits: ["Like NAND, NOR is also a universal gate — every other gate can be built from NORs."],
  },
  whereFound: [
    { icon: ShieldAlert, place: "“All clear” signals", detail: "Ready only when no fault input is active." },
    { icon: Lightbulb, place: "Latches", detail: "Two cross-connected NOR gates make a simple memory cell." },
  ],
  mistakes: [{ mistake: "Mixing up NOR and NAND", fix: "NOR is based on OR (curved back); NAND on AND (flat back). Both have the bubble." }],
  keyTakeaway: "NOR = NOT(OR): its output is 1 only when every input is 0.",
  takeaways: ["0 0 → 1, 0 1 → 0, 1 0 → 0, 1 1 → 0.", "NOR = OR then NOT.", "NOR is also universal."],
  quickCheck: [
    { id: "nor-1", type: "predict", prompt: "A = 0, B = 1. What does a NOR gate output?", options: bits, correctOptionId: "0", explanation: "OR gives 1; NOT flips it to 0." },
    { id: "nor-2", type: "predict", prompt: "A = 0, B = 0. What does a NOR gate output?", options: bits, correctOptionId: "1", explanation: "OR gives 0; NOT flips it to 1. This is NOR's only 1." },
  ],
  next: { title: "The XOR gate", description: "One or the other — but not both.", href: "/learn/digital-electronics/xor-gate", cta: "Try XOR" },
});

export const xorGate: LessonContent = gateLesson({
  type: "XOR",
  lessonSlug: "xor-gate",
  buildsOn: ["The OR gate"],
  intro: (
    <p>
      <strong>XOR</strong> (exclusive OR) outputs 1 when its inputs are <strong>different</strong>. 0 and 1, or 1 and 0, give 1; two 0s or
      two 1s give 0. It&apos;s OR, except when both are 1. Look for the extra curved line on the symbol.
    </p>
  ),
  tryIt: <p>Toggle A and B. When exactly does the output light up? What happens when both are 1?</p>,
  analogy: {
    title: "Exactly one",
    content: <p>“You may have cake <strong>or</strong> ice cream — but not both.” Exactly one condition is true → yes. (This is an analogy, not the electrical definition: electrically, the output is HIGH when the inputs differ.)</p>,
    limits: ["With more than two inputs, XOR outputs 1 for an odd number of 1s — not “exactly one”.", "A two-way stair light (switch at top and bottom) behaves like XOR: flipping either switch changes the light."],
  },
  whereFound: [
    { icon: Calculator, place: "Adders", detail: "XOR gives the sum bit when adding binary numbers." },
    { icon: LampCeiling, place: "Two-way stair lights", detail: "Either switch toggles the light — XOR behaviour." },
    { icon: ShieldAlert, place: "Error checking", detail: "XOR computes parity bits that detect transmission errors." },
  ],
  mistakes: [{ mistake: "Treating XOR like OR", fix: "The difference is the 1 1 row: OR gives 1, XOR gives 0." }],
  keyTakeaway: "XOR outputs 1 when its inputs are different, and 0 when they are the same.",
  takeaways: ["0 0 → 0, 0 1 → 1, 1 0 → 1, 1 1 → 0.", "Different → 1, same → 0.", "XOR makes the sum bit in an adder."],
  quickCheck: [
    { id: "xor-1", type: "predict", prompt: "A = 1, B = 1. What does an XOR gate output?", options: bits, correctOptionId: "0", explanation: "The inputs are the same, so XOR outputs 0." },
    { id: "xor-2", type: "predict", prompt: "A = 0, B = 1. What does an XOR gate output?", options: bits, correctOptionId: "1", explanation: "The inputs are different, so XOR outputs 1." },
  ],
  next: { title: "The XNOR gate", description: "The equality detector.", href: "/learn/digital-electronics/xnor-gate", cta: "Try XNOR" },
});

export const xnorGate: LessonContent = gateLesson({
  type: "XNOR",
  lessonSlug: "xnor-gate",
  buildsOn: ["The XOR gate"],
  intro: (
    <p>
      <strong>XNOR</strong> is XOR followed by NOT. It outputs 1 when its inputs are the <strong>same</strong> — both 0 or both 1 — which
      makes it an <strong>equality detector</strong>.
    </p>
  ),
  tryIt: <p>Toggle A and B. Check the rule: 0 0 → 1, 0 1 → 0, 1 0 → 0, 1 1 → 1.</p>,
  extraSections: [
    {
      id: "composition",
      stage: "visual",
      title: "XNOR = XOR + NOT",
      content: (
        <VisualStage>
          <GateComposition type="XNOR" />
        </VisualStage>
      ),
    },
  ],
  analogy: {
    title: "Do they match?",
    content: <p>Two friends each pick heads or tails. If they chose the <strong>same</strong>, they win. (An analogy: electrically, the output is HIGH when both inputs are at the same level.)</p>,
    limits: ["Comparing whole numbers needs one XNOR per bit, then an AND to check that every bit matched."],
  },
  whereFound: [
    { icon: Scale, place: "Comparators", detail: "Checking whether two binary numbers are equal, bit by bit." },
    { icon: Vote, place: "Error detection", detail: "Parity checks use XOR/XNOR." },
  ],
  mistakes: [{ mistake: "Thinking XNOR is “not either”", fix: "That's NOR. XNOR means “the same”: 0 0 and 1 1 both give 1." }],
  keyTakeaway: "XNOR outputs 1 when its inputs are the same, and 0 when they differ — the opposite of XOR.",
  takeaways: ["0 0 → 1, 0 1 → 0, 1 0 → 0, 1 1 → 1.", "XNOR = XOR then NOT.", "Used to test equality."],
  quickCheck: [
    { id: "xnor-1", type: "predict", prompt: "A = 1, B = 1. What does an XNOR gate output?", options: bits, correctOptionId: "1", explanation: "The inputs are the same, so XNOR outputs 1." },
    { id: "xnor-2", type: "true-false", prompt: "XNOR's output is always the opposite of XOR's output for the same inputs.", ...tf(true), explanation: "XNOR = NOT XOR, so every row is flipped." },
  ],
  next: { title: "Truth tables", description: "Generate the truth table for any gate with 1, 2 or 3 inputs.", href: "/learn/digital-electronics/truth-tables", cta: "Build truth tables" },
});
