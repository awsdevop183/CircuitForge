import { Cpu, FileText } from "lucide-react";
import { LogicLevelsExplorer } from "@/components/digital/LogicLevelsExplorer";
import { KeyIdea, Prose, VisualStage } from "@/components/lesson/LessonBlocks";
import { Callout } from "@/components/ui/Callout";
import type { LessonContent } from "../types";

export const logicLevels: LessonContent = {
  moduleSlug: "digital-electronics",
  lessonSlug: "logic-levels",
  objective: "Explain that logic HIGH and LOW are voltage ranges, and that the ranges depend on the technology and device.",
  objectives: ["Describe the undefined region between LOW and HIGH"],
  buildsOn: ["Voltage", "What is a digital signal?"],
  sections: [
    {
      id: "voltages-mean-bits",
      stage: "concept",
      title: "Voltages that mean 0 and 1",
      content: (
        <Prose>
          <p>
            A digital circuit reads a voltage and decides: is this a <strong>0</strong> or a <strong>1</strong>? A low voltage means LOW (0); a
            voltage near the supply means HIGH (1).
          </p>
          <p>
            But &ldquo;HIGH&rdquo; is <strong>not</strong> one exact voltage. It is a <strong>range</strong>, and the range depends on the
            technology: many chips run from 3.3 V, older ones from 5 V, and modern processors from 1 V or less.
          </p>
        </Prose>
      ),
    },
    {
      id: "ranges",
      stage: "experiment",
      title: "Simple picture, then real ranges",
      content: (
        <>
          <Callout kind="try">
            <p>Open the real view. Slide the input voltage slowly from 0 V upwards. Where does it stop being a guaranteed 0? Where does it become a guaranteed 1?</p>
          </Callout>
          <VisualStage>
            <LogicLevelsExplorer />
          </VisualStage>
          <KeyIdea>HIGH and LOW are ranges, with a gap between them. The exact thresholds come from each device&apos;s datasheet.</KeyIdea>
        </>
      ),
    },
  ],
  analogy: {
    title: "Shouting vs whispering",
    content: <p>If someone shouts, you know they said “yes”; if they whisper, “no”. Anything in between, and you can&apos;t be sure what you heard. (An analogy: a logic input listens to a voltage, not a voice.)</p>,
    limits: ["Thresholds are precise numbers in a datasheet, not a matter of opinion.", "Connecting a 5 V output to an input made for 3.3 V can damage it — ranges also have maximums."],
  },
  whereFound: [
    { icon: Cpu, place: "Microcontroller pins", detail: "Each pin has specified HIGH and LOW input ranges." },
    { icon: FileText, place: "Datasheets", detail: "Look for values like V_IH (input HIGH) and V_IL (input LOW)." },
  ],
  mistakes: [
    { mistake: "Assuming HIGH always means 5 V", fix: "HIGH is a range that depends on the device: 3.3 V, 5 V, 1.8 V logic and more." },
    { mistake: "Leaving an input unconnected", consequence: "A floating input can drift into the undefined region and flicker between 0 and 1.", fix: "Always tie unused inputs to a definite level." },
    { mistake: "Mixing 5 V and 3.3 V devices directly", fix: "Check both datasheets; you may need a level shifter." },
  ],
  keyTakeaway: "Digital circuits treat ranges of voltage as 0 or 1; the exact thresholds depend on the technology and device, with an undefined gap between them.",
  takeaways: ["LOW → 0, HIGH → 1 (the simple picture).", "Each is a voltage range, not an exact value.", "The gap between them is not guaranteed.", "Check the device's datasheet."],
  quickCheck: [
    {
      id: "exact",
      type: "true-false",
      prompt: "On every device, logic HIGH is exactly 5 V.",
      options: [
        { id: "true", label: "True" },
        { id: "false", label: "False" },
      ],
      correctOptionId: "false",
      explanation: "HIGH is a range, and it depends on the technology — 3.3 V and lower-voltage logic are very common.",
    },
    {
      id: "gap",
      type: "predict",
      prompt: "A 3.3 V logic input with thresholds 0.8 V (LOW max) and 2.0 V (HIGH min) receives 1.4 V. How is it read?",
      options: [
        { id: "undefined", label: "Not guaranteed — it might be 0 or 1" },
        { id: "high", label: "Always HIGH" },
        { id: "low", label: "Always LOW" },
      ],
      correctOptionId: "undefined",
      explanation: "1.4 V is between the thresholds, in the undefined region.",
    },
  ],
  next: { title: "Logic gates", description: "Now use 0s and 1s to make decisions.", href: "/learn/digital-electronics/logic-gates", cta: "Meet the gates" },
};
