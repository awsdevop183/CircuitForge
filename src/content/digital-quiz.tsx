import { GateSymbolVisual, MysteryGate, PredictCircuit } from "@/components/digital/QuizVisuals";
import { TruthTable } from "@/components/digital/TruthTable";
import { evaluateGate, truthTable, type GateType } from "@/lib/logic";
import type { QuestionType, QuizQuestion } from "./lessons/types";

const LETTERS = ["a", "b", "c", "d"] as const;

/** Build a question whose first option is correct (the quiz engine shuffles options). */
function q(id: string, topic: string, type: QuestionType, prompt: string, options: string[], explanation: string, visual?: QuizQuestion["visual"]): QuizQuestion {
  return { id, topic, type, prompt, visual, options: options.map((label, i) => ({ id: LETTERS[i]!, label })), correctOptionId: "a", explanation };
}

const tf = (id: string, topic: string, prompt: string, answer: boolean, explanation: string): QuizQuestion => ({
  id,
  topic,
  type: "true-false",
  prompt,
  options: [
    { id: "true", label: "True" },
    { id: "false", label: "False" },
  ],
  correctOptionId: answer ? "true" : "false",
  explanation,
});

function maskedTable(type: GateType, row: number) {
  return (
    <TruthTable
      inputLabels={["A", "B"]}
      outputLabels={[type]}
      rows={truthTable(2, (bits) => evaluateGate(type, bits))}
      masked={[[row, 0]]}
      caption={`${type} truth table with one output missing`}
      className="w-full max-w-xs"
    />
  );
}

/** The Digital Electronics quiz: 36 questions across every lesson of the module. */
export const DIGITAL_QUIZ: readonly QuizQuestion[] = [
  // Analog vs digital
  q("ad-1", "Analog vs digital", "multiple-choice", "Which of these is naturally an analog quantity?", ["Room temperature", "A bit stored in memory", "Data sent over USB", "A microcontroller pin set HIGH"], "Temperature can take any value in a range (21.3 °C, 21.35 °C…), so it is analog. The others are represented with discrete states."),
  q("ad-2", "Analog vs digital", "multiple-choice", "What makes a signal digital?", ["It uses a small number of discrete states, usually two", "It changes very quickly", "It is measured with a computer", "It always uses exactly 5 V"], "Digital signals represent information with discrete states — usually two, LOW (0) and HIGH (1). Speed and exact voltages don't define it."),
  tf("ad-3", "Analog vs digital", "Many real-world physical quantities, like sound and light, are analog — digital electronics represents them using discrete states.", true, "Sound pressure and brightness vary continuously. To process them digitally, they are measured and turned into numbers made of bits."),

  // Digital signals
  q("ds-1", "Digital signals", "multiple-choice", "A signal repeats 4 times every second. What is its frequency?", ["4 Hz", "0.25 Hz", "4 seconds", "40 Hz"], "Frequency is cycles per second: 4 cycles per second = 4 Hz. Its period is 1 ÷ 4 = 0.25 s."),
  q("ds-2", "Digital signals", "multiple-choice", "What is a rising edge?", ["The moment a signal changes from LOW to HIGH", "The moment a signal changes from HIGH to LOW", "The highest voltage in a signal", "A signal that stays HIGH"], "A rising edge is the LOW → HIGH transition. HIGH → LOW is a falling edge. Many circuits act exactly at an edge."),
  q("ds-3", "Digital signals", "multiple-choice", "A square wave is HIGH for 25% of each cycle. What is its duty cycle?", ["25%", "75%", "50%", "4 Hz"], "Duty cycle is the percentage of each period spent HIGH."),

  // Binary
  q("bin-1", "Binary", "identify", "What is the binary number 0101 in decimal?", ["5", "101", "10", "3"], "Place values 8 4 2 1: 0×8 + 1×4 + 0×2 + 1×1 = 5."),
  q("bin-2", "Binary", "identify", "What is decimal 6 in 4-bit binary?", ["0110", "0101", "1100", "0011"], "6 = 4 + 2, so the 4 and 2 bits are 1: 0110."),
  q("bin-3", "Binary", "identify", "What is the binary number 1111 in decimal?", ["15", "16", "4", "1111"], "8 + 4 + 2 + 1 = 15, the largest number 4 bits can hold."),
  q("bin-4", "Binary", "multiple-choice", "How many bits are in one byte?", ["8", "4", "2", "10"], "A byte is 8 bits, which can represent 2⁸ = 256 different values (0–255)."),
  q("bin-5", "Binary", "multiple-choice", "How many different values can 3 bits represent?", ["8", "3", "6", "9"], "Each extra bit doubles the possibilities: 2 × 2 × 2 = 2³ = 8 (000 to 111)."),

  // Logic levels
  tf("lv-1", "Logic levels", "Logic HIGH always means exactly 5 V.", false, "HIGH is a range of voltages, and the range depends on the technology: many devices use 3.3 V logic, others 5 V or lower. Check the device's datasheet."),
  q("lv-2", "Logic levels", "multiple-choice", "An input is given a voltage between its LOW and HIGH thresholds. What happens?", ["It is not guaranteed to read as 0 or 1", "It always reads as 1", "It always reads as 0", "It reads as 0.5"], "Between the thresholds the result is undefined. Good designs keep signals clearly in the LOW or HIGH range."),
  q("lv-3", "Logic levels", "multiple-choice", "Why do digital circuits use voltage ranges instead of exact voltages?", ["So small noise or variations don't change a 0 into a 1", "Because voltages can't be measured exactly", "To use less current", "So signals travel faster"], "A range gives a safety margin: a slightly noisy 3.1 V still reads as HIGH."),

  // Logic gates
  q("g-1", "Logic gates", "identify", "Which gate is this symbol?", ["AND", "OR", "NAND", "XOR"], "The D shape with a flat back is AND. (With a bubble on the output it would be NAND.)", <GateSymbolVisual type="AND" />),
  q("g-2", "Logic gates", "identify", "Which gate is this symbol?", ["NOR", "OR", "NAND", "XNOR"], "The curved OR shape with a bubble (NOT) on the output: NOR.", <GateSymbolVisual type="NOR" />),
  q("g-3", "Logic gates", "identify", "Which gate is this symbol?", ["NOT", "Buffer", "AND", "Diode"], "A triangle with a bubble on its output is a NOT gate (inverter).", <GateSymbolVisual type="NOT" />),
  q("g-4", "Logic gates", "predict", "A = 1 and B = 0 go into an AND gate. What is the output?", ["0", "1"], "AND needs every input to be 1. B is 0, so the output is 0.", <PredictCircuit inputs={{ A: 1, B: 0 }} gates={[{ id: "g", type: "AND", inputs: ["A", "B"] }]} outputGate="g" />),
  q("g-5", "Logic gates", "predict", "A = 0 and B = 0 go into an OR gate. What is the output?", ["0", "1"], "OR needs at least one 1. Both inputs are 0, so the output is 0.", <PredictCircuit inputs={{ A: 0, B: 0 }} gates={[{ id: "g", type: "OR", inputs: ["A", "B"] }]} outputGate="g" />),
  q("g-6", "Logic gates", "multiple-choice", "Toggle A and B to investigate the mystery gate. Which gate is it?", ["NAND", "AND", "OR", "XOR"], "Its output is 1 for every combination except A = 1, B = 1 — the opposite of AND. That's NAND.", <MysteryGate type="NAND" />),
  q("g-7", "Logic gates", "multiple-choice", "Why is NAND called a universal gate?", ["Any other logic function can be built from NAND gates alone", "It works at any voltage", "It is used in every computer ever made", "It has no truth table"], "NOT, AND, OR — and so every logic circuit — can be built using only NAND gates. The same is true of NOR."),
  q("g-8", "Logic gates", "predict", "What is the output of this circuit?", ["1", "0"], "Work left to right: A AND B = 1 AND 1 = 1. Then 1 OR C = 1 OR 0 = 1.", <PredictCircuit inputs={{ A: 1, B: 1, C: 0 }} gates={[{ id: "g1", type: "AND", inputs: ["A", "B"] }, { id: "g2", type: "OR", inputs: ["g1", "C"] }]} outputGate="g2" />),

  // Truth tables
  q("tt-1", "Truth tables", "identify", "Complete the truth table: what goes in the ? cell?", ["1", "0"], "This is OR: with A = 0 and B = 1, at least one input is 1, so the output is 1.", maskedTable("OR", 1)),
  q("tt-2", "Truth tables", "identify", "Complete the truth table: what goes in the ? cell?", ["0", "1"], "This is NAND: only when both inputs are 1 is the output 0.", maskedTable("NAND", 3)),
  q("tt-3", "Truth tables", "multiple-choice", "How many rows does the truth table of a 3-input gate have?", ["8", "6", "3", "9"], "Each input doubles the rows: 2³ = 8 combinations, from 000 to 111."),
  q("tt-4", "Truth tables", "multiple-choice", "A gate's truth table output column reads 1, 0, 0, 0 (for AB = 00, 01, 10, 11). Which gate is it?", ["NOR", "NAND", "AND", "XNOR"], "The output is 1 only when both inputs are 0: NOT (A OR B) — NOR."),

  // XOR / XNOR
  q("x-1", "XOR / XNOR", "predict", "A = 1 and B = 1 go into an XOR gate. What is the output?", ["0", "1"], "XOR outputs 1 only when the inputs are different. 1 and 1 are the same, so the output is 0.", <PredictCircuit inputs={{ A: 1, B: 1 }} gates={[{ id: "g", type: "XOR", inputs: ["A", "B"] }]} outputGate="g" />),
  q("x-2", "XOR / XNOR", "multiple-choice", "When does an XNOR gate output 1?", ["When its inputs are the same", "When its inputs are different", "When both inputs are 1 only", "Never"], "XNOR is NOT XOR: 1 for 00 and 11, the \"same\" rows. It is sometimes called an equality detector."),
  q("x-3", "XOR / XNOR", "multiple-choice", "Toggle the inputs to investigate. Which gate is hidden?", ["XOR", "OR", "XNOR", "AND"], "The output is 1 for 01 and 10, but 0 for 11 — so it isn't OR. Output 1 when the inputs differ: XOR.", <MysteryGate type="XOR" />),

  // Half adder
  q("ha-1", "Half adder", "multiple-choice", "In a half adder, which gate produces the SUM?", ["XOR", "AND", "OR", "NOT"], "SUM = A XOR B: 0 + 1 = 1 and 1 + 0 = 1, but 1 + 1 = 10 has a 0 in the 1s place."),
  q("ha-2", "Half adder", "predict", "A half adder has A = 1 and B = 1. What are SUM and CARRY?", ["SUM 0, CARRY 1", "SUM 1, CARRY 0", "SUM 1, CARRY 1", "SUM 0, CARRY 0"], "1 + 1 = 2, which is 10 in binary: SUM (1s bit) = 0, CARRY (2s bit) = 1."),
  q("ha-3", "Half adder", "multiple-choice", "What does a full adder add that a half adder can't?", ["A carry in from the previous column", "Decimal numbers", "Numbers bigger than 1000", "Negative numbers"], "A full adder adds three bits — A, B and a carry in — so full adders can be chained to add multi-bit numbers."),

  // Flip-flops
  q("ff-1", "Flip-flops", "predict", "An SR latch has Q = 0. You press SET, then release it. What is Q now?", ["1", "0", "It switches back to 0 immediately", "Undefined"], "SET makes Q = 1, and with nothing pressed the latch holds its state. That is memory."),
  q("ff-2", "Flip-flops", "multiple-choice", "When does a D flip-flop copy D to Q?", ["At the rising edge of the clock", "Whenever D changes", "When the power is switched on", "Every second"], "An edge-triggered D flip-flop only samples D at the clock edge; between edges Q holds its value."),

  // Registers
  q("rg-1", "Registers", "multiple-choice", "What is a 4-bit register?", ["Four flip-flops sharing a clock that store 4 bits together", "A chip that adds 4 numbers", "Four logic gates in a row", "A 4-volt power supply"], "A register stores several bits at once — one flip-flop per bit, all loaded on the same clock pulse."),
  q("rg-2", "Registers", "identify", "A 4-bit register stores 1011. What decimal number is that?", ["11", "13", "1011", "7"], "8 + 0 + 2 + 1 = 11."),
];
