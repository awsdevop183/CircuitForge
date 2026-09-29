import { Calculator, Clock, Cpu, Gamepad2, HardDrive, Keyboard, MemoryStick, Microchip, Smartphone, ToggleRight, Vote, Watch } from "lucide-react";
import Link from "next/link";
import { FullAdder, HalfAdder, RippleAdder } from "@/components/digital/Adders";
import { ComputerStack } from "@/components/digital/ComputerStack";
import { LogicPlayground } from "@/components/digital/LogicPlayground";
import { DFlipFlopDemo, MemoryDemo, RegisterDemo, SrLatchDemo } from "@/components/digital/Memory";
import { TruthTableBuilder } from "@/components/digital/TruthTableBuilder";
import { ConceptCard, ConceptGrid, KeyIdea, Prose, VisualStage } from "@/components/lesson/LessonBlocks";
import { Callout } from "@/components/ui/Callout";
import type { LessonContent } from "../types";

const bits = [
  { id: "0", label: "0" },
  { id: "1", label: "1" },
];

export const truthTables: LessonContent = {
  moduleSlug: "digital-electronics",
  lessonSlug: "truth-tables",
  objective: "Build a truth table for any gate with 1, 2 or 3 inputs, and explain why n inputs give 2ⁿ rows.",
  buildsOn: ["All seven gates"],
  sections: [
    {
      id: "every-combination",
      stage: "concept",
      title: "Every combination, every output",
      content: (
        <Prose>
          <p>
            A <strong>truth table</strong> lists every possible combination of inputs and the output for each. The rows count up in binary
            (00, 01, 10, 11), so nothing is missed. Each extra input <strong>doubles</strong> the number of rows: 1 input → 2 rows, 2 → 4, 3 →
            8.
          </p>
        </Prose>
      ),
    },
    {
      id: "builder",
      stage: "experiment",
      title: "Truth Table Builder",
      content: (
        <>
          <Callout kind="try">
            <p>Choose 3 inputs and the AND gate. How many rows give 1? Now try OR, then XOR — XOR with 3 inputs has a surprise.</p>
          </Callout>
          <VisualStage>
            <TruthTableBuilder />
          </VisualStage>
          <KeyIdea>A truth table completely describes a logic circuit. Two circuits with the same truth table behave identically — however they are built.</KeyIdea>
        </>
      ),
    },
  ],
  analogy: {
    title: "A times table for logic",
    content: <p>Just as a times table lists every answer for multiplying small numbers, a truth table lists every answer a gate can give. (An analogy — there are far fewer entries, because inputs are only 0 or 1.)</p>,
    limits: ["Truth tables grow fast: 10 inputs need 1,024 rows, so engineers also use equations and software."],
  },
  mistakes: [
    { mistake: "Missing a combination", fix: "Count up in binary down the rows and you can't miss one." },
    { mistake: "Forgetting that rows double", fix: "n inputs → 2ⁿ rows. Three inputs is 8 rows, not 6." },
  ],
  keyTakeaway: "A truth table lists the output for all 2ⁿ input combinations, and fully describes a logic circuit's behaviour.",
  takeaways: ["Rows = 2ⁿ for n inputs.", "Count up in binary to list the rows.", "Same truth table = same behaviour."],
  quickCheck: [
    {
      id: "rows",
      type: "multiple-choice",
      prompt: "How many rows does a truth table with 4 inputs have?",
      options: [
        { id: "16", label: "16" },
        { id: "8", label: "8" },
        { id: "4", label: "4" },
        { id: "12", label: "12" },
      ],
      correctOptionId: "16",
      explanation: "2⁴ = 16 combinations, from 0000 to 1111.",
    },
    {
      id: "and3",
      type: "predict",
      prompt: "A 3-input AND gate: how many of its 8 rows output 1?",
      options: [
        { id: "1", label: "1" },
        { id: "3", label: "3" },
        { id: "7", label: "7" },
      ],
      correctOptionId: "1",
      explanation: "Only 111 has every input at 1.",
    },
  ],
  next: { title: "Combining logic gates", description: "Connect gates together to build real decisions.", href: "/learn/digital-electronics/combining-gates", cta: "Wire up gates" },
};

export const combiningGates: LessonContent = {
  moduleSlug: "digital-electronics",
  lessonSlug: "combining-gates",
  objective: "Connect gates so the output of one feeds another, and work out the output of a combined circuit.",
  objectives: ["Trace a signal from inputs to output", "Read the truth table of a gate network"],
  buildsOn: ["Truth tables"],
  sections: [
    {
      id: "chains",
      stage: "concept",
      title: "Outputs can feed inputs",
      content: (
        <Prose>
          <p>
            A gate&apos;s output is just another 0 or 1, so it can become the input of another gate. By chaining gates you can build any rule
            you like — for example: &ldquo;Y is on when <strong>A and B</strong> are on, <strong>or</strong> whenever C is on&rdquo;:
          </p>
          <pre className="overflow-x-auto rounded-xl border border-line bg-void/60 p-4 font-mono text-sm text-logic-soft" aria-label="A and B feed an AND gate; its output and C feed an OR gate, which drives the output.">
{`Input A ─────┐
             AND ─────┐
Input B ─────┘        │
                      OR ───── Output
Input C ──────────────┘`}
          </pre>
        </Prose>
      ),
    },
    {
      id: "playground",
      stage: "experiment",
      title: "Build it in the playground",
      content: (
        <>
          <Callout kind="try">
            <p>Toggle A, B and C and watch the signal ripple through G1 then G2. Then change G1 to XOR — which rows of the truth table change?</p>
          </Callout>
          <VisualStage>
            <LogicPlayground compact />
          </VisualStage>
          <p className="text-sm text-ink-muted">
            Want more room? Open the full{" "}
            <Link href="/lab/digital" className="text-logic underline underline-offset-2 hover:text-logic-soft">
              Logic Gate Playground
            </Link>{" "}
            with more examples.
          </p>
          <KeyIdea>Work from the inputs to the output, one gate at a time. Each gate only cares about its own inputs.</KeyIdea>
        </>
      ),
    },
  ],
  analogy: {
    title: "A decision flowchart",
    content: <p>Combining gates is like a flowchart: first decide whether A and B are both true, then combine that answer with C. (An analogy: in the circuit, all the gates work at the same time, and a change ripples through in nanoseconds.)</p>,
    limits: ["There are no steps in time like a flowchart — every gate reacts continuously.", "Each gate adds a tiny delay, so very long chains are slower."],
  },
  whereFound: [
    { icon: Vote, place: "Voting and majority circuits", detail: "Output 1 when most inputs are 1 — try the Majority example in the playground." },
    { icon: Gamepad2, place: "Game controllers", detail: "Button combinations are decoded with gate logic." },
  ],
  mistakes: [
    { mistake: "Evaluating gates in the wrong order", fix: "A gate can only be worked out once you know all its inputs: start from the inputs." },
    { mistake: "Leaving a gate input unconnected", fix: "Real floating inputs are unpredictable. Every input needs a source." },
  ],
  keyTakeaway: "Gates can be chained — one gate's output becomes another's input — to build any logical rule; trace from inputs to output.",
  takeaways: ["Outputs can drive other inputs.", "Trace from the inputs, gate by gate.", "The whole circuit has its own truth table."],
  quickCheck: [
    { id: "trace", type: "predict", prompt: "A = 0, B = 1, C = 1 in (A AND B) OR C. What is the output?", options: bits, correctOptionId: "1", explanation: "A AND B = 0; then 0 OR C = 0 OR 1 = 1." },
    { id: "trace2", type: "predict", prompt: "A = 1, B = 1 into a NAND, whose output goes into a NOT. What comes out?", options: bits, correctOptionId: "1", explanation: "NAND(1, 1) = 0; NOT 0 = 1. NAND followed by NOT is just AND." },
  ],
  next: { title: "The half adder", description: "Two gates that can add.", href: "/learn/digital-electronics/half-adder", cta: "Add with logic" },
};

export const halfAdderLesson: LessonContent = {
  moduleSlug: "digital-electronics",
  lessonSlug: "half-adder",
  objective: "Explain how an XOR and an AND gate add two bits, producing a SUM and a CARRY.",
  buildsOn: ["Binary", "The XOR gate", "The AND gate"],
  sections: [
    {
      id: "logic-can-add",
      stage: "concept",
      title: "Logic that does arithmetic",
      content: (
        <>
          <Prose>
            <p>Adding two single bits has only four cases:</p>
          </Prose>
          <ConceptGrid columns={4}>
            <ConceptCard title="0 + 0 = 00">Sum 0, carry 0</ConceptCard>
            <ConceptCard title="0 + 1 = 01">Sum 1, carry 0</ConceptCard>
            <ConceptCard title="1 + 0 = 01">Sum 1, carry 0</ConceptCard>
            <ConceptCard title="1 + 1 = 10" accent="amber">
              Sum 0, carry 1 — just like carrying in normal addition
            </ConceptCard>
          </ConceptGrid>
          <KeyIdea>The SUM column is exactly XOR. The CARRY column is exactly AND. So two gates can add!</KeyIdea>
        </>
      ),
    },
    {
      id: "half-adder",
      stage: "experiment",
      title: "The interactive half adder",
      content: (
        <>
          <Callout kind="try">
            <p>Set A = 1 and B = 1. Why is SUM 0? Read the result as a two-bit binary number: CARRY then SUM.</p>
          </Callout>
          <VisualStage>
            <HalfAdder />
          </VisualStage>
        </>
      ),
    },
  ],
  analogy: {
    title: "Carrying the 1",
    content: <p>In decimal, 5 + 7 = 12: you write 2 and carry 1 to the next column. In binary, 1 + 1 = 10: write 0 (SUM) and carry 1 (CARRY). (Not really an analogy — it&apos;s the same idea in a different number system.)</p>,
    limits: ["A half adder can't accept a carry coming in from a previous column — that needs a full adder."],
  },
  whereFound: [{ icon: Calculator, place: "Every calculator and processor", detail: "Adders are at the heart of the arithmetic logic unit (ALU)." }],
  mistakes: [{ mistake: "Thinking 1 + 1 = 2 in one bit", fix: "One bit can only be 0 or 1. The 2 becomes a carry: 10." }],
  keyTakeaway: "A half adder adds two bits: SUM = A XOR B, CARRY = A AND B.",
  takeaways: ["SUM = XOR.", "CARRY = AND.", "1 + 1 = 10 in binary."],
  quickCheck: [
    {
      id: "sum",
      type: "predict",
      prompt: "A = 1, B = 0. What are SUM and CARRY?",
      options: [
        { id: "10", label: "SUM 1, CARRY 0" },
        { id: "01", label: "SUM 0, CARRY 1" },
        { id: "11", label: "SUM 1, CARRY 1" },
      ],
      correctOptionId: "10",
      explanation: "1 + 0 = 1: XOR gives 1, AND gives 0.",
    },
    {
      id: "carry-gate",
      type: "multiple-choice",
      prompt: "Which gate produces the CARRY in a half adder?",
      options: [
        { id: "and", label: "AND" },
        { id: "xor", label: "XOR" },
        { id: "or", label: "OR" },
      ],
      correctOptionId: "and",
      explanation: "A carry only happens for 1 + 1 — the only case where AND outputs 1.",
    },
  ],
  next: { title: "The full adder", description: "Add a carry in — and chain adders to add whole numbers.", href: "/learn/digital-electronics/full-adder", cta: "Build a full adder" },
};

export const fullAdderLesson: LessonContent = {
  moduleSlug: "digital-electronics",
  lessonSlug: "full-adder",
  objective: "Describe a full adder (A, B and carry in → sum and carry out) and how chaining them adds multi-bit numbers.",
  buildsOn: ["The half adder"],
  sections: [
    {
      id: "three-bits",
      stage: "concept",
      title: "Adding three bits",
      content: (
        <>
          <Prose>
            <p>
              To add bigger numbers, each column must add <strong>A</strong>, <strong>B</strong> and the <strong>carry in</strong> from the
              column to its right. That&apos;s three bits, so the answer is 0 to 3 — which fits in two bits: <strong>Carry out</strong> and{" "}
              <strong>Sum</strong>. Start with the idea; the gates come second.
            </p>
          </Prose>
          <VisualStage>
            <FullAdder />
          </VisualStage>
        </>
      ),
    },
    {
      id: "ripple",
      stage: "experiment",
      title: "Chain four full adders",
      content: (
        <>
          <Callout kind="try">
            <p>Add 6 + 7. Watch the carries ripple from right to left. Now try 15 + 1 — where does the last carry go?</p>
          </Callout>
          <VisualStage>
            <RippleAdder />
          </VisualStage>
          <KeyIdea>One full adder per bit, each passing its carry to the next: that&apos;s how a processor adds numbers.</KeyIdea>
        </>
      ),
    },
  ],
  analogy: {
    title: "Column addition on paper",
    content: <p>A full adder is you doing one column of written addition: add the two digits plus anything carried in, write down one digit, carry one on. (A close comparison — only the digits are binary.)</p>,
    limits: ["Real processors use faster “carry-lookahead” adders so they don't wait for carries to ripple through every column."],
  },
  whereFound: [
    { icon: Cpu, place: "The ALU", detail: "The arithmetic logic unit in every processor adds with chains of adders." },
    { icon: Calculator, place: "Calculators", detail: "Every sum you type is done with adder circuits." },
  ],
  mistakes: [{ mistake: "Forgetting the carry in", fix: "Each column after the first has three inputs: A, B and the carry from the right." }],
  keyTakeaway: "A full adder adds A, B and carry in to give a sum and a carry out; chaining full adders adds multi-bit numbers.",
  takeaways: ["Inputs: A, B, carry in. Outputs: sum, carry out.", "Built from two half adders and an OR gate.", "Chain one per bit to add bigger numbers."],
  quickCheck: [
    {
      id: "fa",
      type: "predict",
      prompt: "A = 1, B = 1, carry in = 1. What are the sum and carry out?",
      options: [
        { id: "11", label: "Sum 1, carry out 1" },
        { id: "01", label: "Sum 0, carry out 1" },
        { id: "10", label: "Sum 1, carry out 0" },
      ],
      correctOptionId: "11",
      explanation: "1 + 1 + 1 = 3 = 11 in binary: carry 1, sum 1.",
    },
    {
      id: "chain",
      type: "multiple-choice",
      prompt: "How many full adders do you need to add two 8-bit numbers (one per column)?",
      options: [
        { id: "8", label: "8" },
        { id: "2", label: "2" },
        { id: "16", label: "16" },
      ],
      correctOptionId: "8",
      explanation: "One full adder per bit column. (The first could be a half adder, since nothing carries in.)",
    },
  ],
  next: { title: "What is memory?", description: "Gates calculate — but how does a circuit remember?", href: "/learn/digital-electronics/what-is-memory", cta: "Remember a bit" },
};

export const whatIsMemory: LessonContent = {
  moduleSlug: "digital-electronics",
  lessonSlug: "what-is-memory",
  objective: "Explain why memory needs feedback, and how a circuit can hold a 1 after its input goes away.",
  buildsOn: ["Combining logic gates"],
  sections: [
    {
      id: "calculate-and-remember",
      stage: "concept",
      title: "Calculating isn't enough",
      content: (
        <>
          <Prose>
            <p>
              Every circuit so far has been <strong>combinational</strong>: its output depends only on its inputs <em>right now</em>. Take the
              inputs away, and the answer is gone. A computer also needs to <strong>remember</strong> — the score in a game, the letter you
              just typed.
            </p>
          </Prose>
          <ConceptGrid columns={3}>
            <ConceptCard title="Logic gates">React to the present.</ConceptCard>
            <ConceptCard title="Sequential circuits" accent="amber">
              Feed outputs back in, so the past matters.
            </ConceptCard>
            <ConceptCard title="Memory">Holds 0s and 1s until they are changed.</ConceptCard>
          </ConceptGrid>
        </>
      ),
    },
    {
      id: "feedback",
      stage: "experiment",
      title: "The trick: feedback",
      content: (
        <>
          <Callout kind="try">
            <p>Hold BUTTON, then let go: the left circuit forgets. Now press and release SET on the right. Q stays 1 — until you press RESET.</p>
          </Callout>
          <VisualStage>
            <MemoryDemo />
          </VisualStage>
          <KeyIdea>When a circuit&apos;s output loops back to its input, it can hold its own state. That is the seed of all memory.</KeyIdea>
        </>
      ),
    },
  ],
  analogy: {
    title: "A light switch remembers",
    content: <p>A light switch &ldquo;remembers&rdquo; whether you left it ON or OFF — it stays put after you take your hand away. A doorbell button doesn&apos;t. (This is an analogy: a memory circuit holds its state electrically, using feedback, not a mechanical lever.)</p>,
    limits: ["Most electronic memory forgets when the power is switched off (it's volatile) — a light switch doesn't.", "Memory circuits change state in nanoseconds, millions of times over."],
  },
  whereFound: [
    { icon: MemoryStick, place: "RAM", detail: "Your computer's working memory." },
    { icon: Gamepad2, place: "Games", detail: "Scores, positions and lives are all stored bits." },
  ],
  mistakes: [{ mistake: "Thinking logic gates remember on their own", fix: "A single gate forgets instantly. Memory needs feedback — an output connected back to an input." }],
  keyTakeaway: "Memory needs feedback: when a circuit's output feeds back into its input, it can hold a 0 or 1 after the input that set it has gone.",
  takeaways: ["Combinational: output depends only on current inputs.", "Sequential: outputs feed back, so the past matters.", "Feedback is the basis of memory."],
  quickCheck: [
    {
      id: "hold",
      type: "predict",
      prompt: "In the feedback circuit, Q is 1. You press nothing. What is Q?",
      options: bits.slice().reverse(),
      correctOptionId: "1",
      explanation: "With neither SET nor RESET pressed, the feedback holds Q at its last value: 1.",
    },
    {
      id: "combinational",
      type: "true-false",
      prompt: "An AND gate on its own can remember its last output.",
      options: [
        { id: "true", label: "True" },
        { id: "false", label: "False" },
      ],
      correctOptionId: "false",
      explanation: "A gate's output depends only on its present inputs — it has no memory.",
    },
  ],
  next: { title: "Flip-flops", description: "Set, reset and the clock.", href: "/learn/digital-electronics/flip-flops", cta: "Flip a flip-flop" },
};

export const flipFlops: LessonContent = {
  moduleSlug: "digital-electronics",
  lessonSlug: "flip-flops",
  objective: "Describe a flip-flop's state, how SET and RESET change it, and how a clock controls when a D flip-flop updates.",
  buildsOn: ["What is memory?", "What is a digital signal?"],
  sections: [
    {
      id: "sr-latch",
      stage: "concept",
      title: "State, SET and RESET",
      content: (
        <>
          <Prose>
            <p>
              A <strong>latch</strong> or <strong>flip-flop</strong> stores one bit. Its output <strong>Q</strong> is its{" "}
              <strong>state</strong>. The simplest, the SR latch, has two inputs:
            </p>
          </Prose>
          <pre className="rounded-xl border border-line bg-void/60 p-4 font-mono text-sm text-logic-soft">{`SET   → Q = 1
RESET → Q = 0
neither → Q stays the same`}</pre>
          <VisualStage>
            <SrLatchDemo />
          </VisualStage>
        </>
      ),
    },
    {
      id: "clock",
      stage: "experiment",
      title: "Add a clock",
      content: (
        <>
          <Prose>
            <p>
              In a computer, millions of flip-flops must change <em>together</em>. So most use a <strong>clock</strong>: a steady square wave.
              A <strong>D flip-flop</strong> copies its input D to Q only at the <strong>rising edge</strong> of the clock, and ignores D the
              rest of the time.
            </p>
          </Prose>
          <Callout kind="try" className="mt-6">
            <p>Flip D several times without clocking: Q doesn&apos;t move. Now send a clock pulse. Then run the clock and toggle D between edges.</p>
          </Callout>
          <VisualStage>
            <DFlipFlopDemo />
          </VisualStage>
          <KeyIdea>The clock decides <em>when</em>; D decides <em>what</em>. Everything in a processor steps forward on the clock&apos;s edges.</KeyIdea>
        </>
      ),
    },
  ],
  analogy: {
    title: "A camera shutter",
    content: <p>A D flip-flop is like a camera: the scene (D) can change all the time, but the photo (Q) only captures it at the instant the shutter clicks (the clock edge). (An analogy — no image is stored, just one bit.)</p>,
    limits: ["D must be steady for a tiny moment around the clock edge, or the result can be unreliable.", "Real flip-flops are built from gates and transistors; we're treating them as blocks here."],
  },
  whereFound: [
    { icon: Clock, place: "Processor clocks", detail: "A 3 GHz processor's flip-flops update 3 billion times a second." },
    { icon: Watch, place: "Counters and timers", detail: "Chains of flip-flops count clock pulses." },
  ],
  mistakes: [
    { mistake: "Expecting Q to follow D instantly", fix: "A D flip-flop only updates on the clock edge." },
    { mistake: "Pressing SET and RESET together", fix: "For an SR latch that combination isn't allowed — the result is undefined." },
  ],
  keyTakeaway: "A flip-flop stores one bit (its state Q); SET/RESET change it directly, and a clocked D flip-flop copies D to Q only at the clock edge.",
  takeaways: ["State = the stored bit, Q.", "SET → 1, RESET → 0, neither → hold.", "D flip-flop: Q ← D at the rising clock edge."],
  quickCheck: [
    {
      id: "edge",
      type: "predict",
      prompt: "Q = 0, D = 1, and the clock stays LOW. What is Q?",
      options: bits,
      correctOptionId: "0",
      explanation: "No rising edge, no update: Q keeps its value until the next clock edge.",
    },
    {
      id: "set",
      type: "predict",
      prompt: "An SR latch receives a SET pulse. What is Q afterwards?",
      options: bits,
      correctOptionId: "1",
      explanation: "SET makes Q = 1, and the latch holds it after the pulse ends.",
    },
  ],
  next: { title: "Registers", description: "Store several bits together.", href: "/learn/digital-electronics/registers", cta: "Load a register" },
};

export const registers: LessonContent = {
  moduleSlug: "digital-electronics",
  lessonSlug: "registers",
  objective: "Explain how a register stores several bits together, and how memory is many addressed registers.",
  buildsOn: ["Flip-flops", "Binary"],
  sections: [
    {
      id: "bits-together",
      stage: "concept",
      title: "Storing several bits at once",
      content: (
        <>
          <Prose>
            <p>
              One flip-flop stores one bit. Put four side by side, sharing one clock, and you have a <strong>4-bit register</strong>: it stores
              a whole binary number in one go.
            </p>
          </Prose>
          <pre className="overflow-x-auto rounded-xl border border-line bg-void/60 p-4 font-mono text-lg text-logic-soft" aria-label="Four boxes holding 1, 0, 1, 1: a 4-bit register">{`┌───┐ ┌───┐ ┌───┐ ┌───┐
│ 1 │ │ 0 │ │ 1 │ │ 1 │   = 11
└───┘ └───┘ └───┘ └───┘`}</pre>
        </>
      ),
    },
    {
      id: "register-lab",
      stage: "experiment",
      title: "Load, write and read",
      content: (
        <>
          <Callout kind="try">
            <p>Set the data inputs and send a clock pulse. Change the inputs — the register doesn&apos;t change until the next pulse. Then write it into memory at address 10.</p>
          </Callout>
          <VisualStage>
            <RegisterDemo />
          </VisualStage>
          <KeyIdea>Bit → register → memory → computer. Memory is a large set of storage locations, each picked out by its address.</KeyIdea>
        </>
      ),
    },
  ],
  analogy: {
    title: "Mailboxes",
    content: <p>Memory is like a wall of numbered mailboxes. Each box (address) holds one register&apos;s worth of bits, and you can put a value in or read it out by number. (An analogy for addressing.)</p>,
    limits: ["Reading memory doesn't remove the value — it copies it.", "Main memory (DRAM) stores bits in tiny capacitors that must be refreshed, not flip-flops."],
  },
  whereFound: [
    { icon: Cpu, place: "Processor registers", detail: "A 64-bit processor's registers each hold 64 bits." },
    { icon: HardDrive, place: "Memory", detail: "Billions of addressed locations, each holding a byte." },
    { icon: Keyboard, place: "Keyboards", detail: "Shift registers read many keys over a few wires." },
  ],
  mistakes: [{ mistake: "Thinking a register updates as soon as its inputs change", fix: "It loads only on the clock pulse — that's what lets a computer work in orderly steps." }],
  keyTakeaway: "A register is a group of flip-flops that store several bits together on one clock pulse; memory is many registers selected by address.",
  takeaways: ["n flip-flops → n-bit register.", "All bits load on the same clock edge.", "Memory = many addressed storage locations."],
  quickCheck: [
    {
      id: "value",
      type: "identify",
      prompt: "A 4-bit register holds 0110. What number is that?",
      options: [
        { id: "6", label: "6" },
        { id: "110", label: "110" },
        { id: "3", label: "3" },
      ],
      correctOptionId: "6",
      explanation: "4 + 2 = 6.",
    },
    {
      id: "8bit",
      type: "multiple-choice",
      prompt: "How many flip-flops are in an 8-bit register?",
      options: [
        { id: "8", label: "8" },
        { id: "1", label: "1" },
        { id: "256", label: "256" },
      ],
      correctOptionId: "8",
      explanation: "One flip-flop per bit.",
    },
  ],
  next: { title: "Digital circuits in computers", description: "Put it all together: from a transistor to a computer.", href: "/learn/digital-electronics/digital-circuits-in-computers", cta: "Climb the stack" },
};

export const digitalInComputers: LessonContent = {
  moduleSlug: "digital-electronics",
  lessonSlug: "digital-circuits-in-computers",
  objective: "Describe how computers are built up, layer by layer, from huge numbers of tiny transistor switches.",
  buildsOn: ["Everything in this module"],
  sections: [
    {
      id: "the-stack",
      stage: "concept",
      title: "From switch to computer",
      content: (
        <>
          <Prose>
            <p>
              You&apos;ve now seen every layer: transistors make gates; gates make adders and flip-flops; flip-flops make registers; registers
              make memory; and a processor combines them all, stepping forward with every clock edge.
            </p>
          </Prose>
          <VisualStage>
            <ComputerStack />
          </VisualStage>
          <KeyIdea>Computers are ultimately built from enormous numbers of tiny electronic switches — organised in layers, each built from the one below.</KeyIdea>
        </>
      ),
    },
    {
      id: "an-honest-note",
      stage: "visual",
      title: "A foundational abstraction",
      content: (
        <Callout kind="info" title="How far does this picture go?">
          <p>
            This layered view is the foundation of computer engineering, and it is accurate. But a modern computer isn&apos;t understood only
            by staring at gates: designers also rely on analog effects (timing, power, signal integrity), clever architectures (caches,
            pipelines, many cores) and millions of lines of software. Each layer hides the detail below so people can work on the layer above.
          </p>
        </Callout>
      ),
    },
    {
      id: "practice",
      stage: "experiment",
      title: "Test yourself",
      content: (
        <Prose>
          <p>
            Put the whole module to work: try the{" "}
            <Link href="/lab/build-the-logic" className="text-logic underline underline-offset-2 hover:text-logic-soft">
              Build the Logic challenge
            </Link>
            , experiment in the{" "}
            <Link href="/lab/digital" className="text-logic underline underline-offset-2 hover:text-logic-soft">
              Logic Gate Playground
            </Link>
            , and take the{" "}
            <Link href="/quiz/digital-electronics" className="text-logic underline underline-offset-2 hover:text-logic-soft">
              Digital Electronics quiz
            </Link>
            .
          </p>
        </Prose>
      ),
    },
  ],
  analogy: {
    title: "Letters, words, books",
    content: <p>Transistors are like letters, gates like words, circuits like sentences and a computer like a library of books. (An analogy for layers of building blocks — each layer has rules of its own.)</p>,
    limits: ["Unlike letters, transistors switch billions of times per second and must be powered and cooled."],
  },
  whereFound: [
    { icon: Smartphone, place: "Phones", detail: "A phone processor contains billions of transistors." },
    { icon: Microchip, place: "Microcontrollers", detail: "Tiny computers on one chip — the next module." },
    { icon: ToggleRight, place: "Everything digital", detail: "Watches, cars, TVs and washing machines are full of digital logic." },
  ],
  mistakes: [{ mistake: "Thinking a computer is “just” gates", fix: "Gates are the foundation, but architecture, timing, memory technology and software all matter too." }],
  keyTakeaway: "Computers are built in layers — transistors → gates → circuits → adders and registers → memory → CPU → computer — all from enormous numbers of tiny switches.",
  takeaways: ["Each layer is built from the layer below.", "The clock keeps everything in step.", "It's a foundational abstraction, not the whole story."],
  quickCheck: [
    {
      id: "bottom",
      type: "multiple-choice",
      prompt: "What are logic gates built from?",
      options: [
        { id: "transistors", label: "Transistors working as switches" },
        { id: "registers", label: "Registers" },
        { id: "software", label: "Software" },
      ],
      correctOptionId: "transistors",
      explanation: "A few transistors wired as switches make each gate.",
    },
    {
      id: "memory",
      type: "multiple-choice",
      prompt: "Which part stores the numbers a processor is working on right now?",
      options: [
        { id: "registers", label: "Registers" },
        { id: "adders", label: "Adders" },
        { id: "gates", label: "Single logic gates" },
      ],
      correctOptionId: "registers",
      explanation: "Registers — groups of flip-flops — hold the values the processor is currently using.",
    },
  ],
  next: {
    title: "Module complete — take the quiz",
    description: "You've gone from electricity to 0s and 1s, gates, adders and memory. Test yourself, then get ready for Microcontrollers: real programmable hardware.",
    href: "/quiz/digital-electronics",
    cta: "Take the Digital Electronics quiz",
  },
};
