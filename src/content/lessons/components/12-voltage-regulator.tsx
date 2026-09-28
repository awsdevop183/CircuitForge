import { Cpu, Plug, Router, Usb } from "lucide-react";
import { ComponentIntro } from "@/components/component-lab/ComponentIntro";
import { RegulatorDemo } from "@/components/component-lab/RegulatorDemo";
import { ConceptCard, ConceptGrid, KeyIdea, Prose, VisualStage } from "@/components/lesson/LessonBlocks";
import { Callout } from "@/components/ui/Callout";
import type { LessonContent } from "../types";
import { mistakesFor } from "./shared";

export const voltageRegulatorLesson: LessonContent = {
  moduleSlug: "components",
  lessonSlug: "voltage-regulator",
  objective: "Explain what a voltage regulator does, and compare linear and switching regulators.",
  objectives: ["Name the IN, OUT and GND pins", "Explain dropout and wasted heat"],
  buildsOn: ["The battery", "Electrical power"],
  sections: [
    {
      id: "see-it",
      stage: "concept",
      title: "See the regulator",
      content: (
        <>
          <ComponentIntro slug="voltage-regulator" />
          <Prose>
            <p>
              Many chips need exactly 5 V or 3.3 V, but batteries and adapters give more — and their voltage wobbles. A{" "}
              <strong>voltage regulator</strong> takes a higher input (IN) and holds its output (OUT) steady, relative to ground (GND).
            </p>
          </Prose>
        </>
      ),
    },
    {
      id: "regulate",
      stage: "experiment",
      title: "12 V in → regulator → 5 V out",
      content: (
        <>
          <Callout kind="try">
            <p>Lower the input voltage until the output drops. Then raise the load current and compare the heat for linear and switching.</p>
          </Callout>
          <VisualStage>
            <RegulatorDemo />
          </VisualStage>
          <KeyIdea>A regulator needs some headroom above its output. A linear regulator turns all the extra voltage into heat.</KeyIdea>
        </>
      ),
    },
    {
      id: "linear-vs-switching",
      stage: "visual",
      title: "Linear vs switching",
      content: (
        <ConceptGrid columns={2}>
          <ConceptCard title="Linear (e.g. 7805)">Simple, cheap, quiet. Wasted power = (Vin − Vout) × I, all as heat. Fine for small currents.</ConceptCard>
          <ConceptCard title="Switching (buck)" accent="amber">Switches on and off very fast and smooths the result. Around 85–95% efficient, so much cooler at high currents.</ConceptCard>
        </ConceptGrid>
      ),
    },
  ],
  analogy: {
    title: "A pressure-reducing valve",
    content: <p>A regulator is like the valve that lowers high mains water pressure to a steady, safe level for your taps — however the pressure outside varies.</p>,
    limits: ["A regulator can only lower a voltage (a simple one can't raise it).", "If the input drops too low, the output drops too — it can't make energy from nothing."],
  },
  whereFound: [
    { icon: Usb, place: "USB power", detail: "Boards turn 5 V USB into the 3.3 V their chips need." },
    { icon: Cpu, place: "Microcontroller boards", detail: "An on-board regulator accepts 7–12 V and supplies 5 V." },
    { icon: Plug, place: "Chargers", detail: "Switching regulators deliver steady output from mains." },
    { icon: Router, place: "Routers and TVs", detail: "Several regulators make each voltage the circuits need." },
  ],
  mistakes: mistakesFor("voltage-regulator"),
  safety: ["heat", "ratings"],
  keyTakeaway: "A voltage regulator turns a higher, varying input into a steady output voltage; linear ones waste the difference as heat, switching ones are far more efficient.",
  takeaways: ["IN, OUT and GND pins.", "Needs headroom: a 7805 needs about 7 V in.", "Linear heat = (Vin − Vout) × I.", "Switching regulators are ~90% efficient."],
  quickCheck: [
    {
      id: "heat",
      type: "multiple-choice",
      prompt: "A linear 5 V regulator is fed 12 V and supplies 0.5 A. How much power does it waste as heat?",
      options: [
        { id: "3.5", label: "3.5 W" },
        { id: "6", label: "6 W" },
        { id: "2.5", label: "2.5 W" },
        { id: "0", label: "Nothing" },
      ],
      correctOptionId: "3.5",
      explanation: "(12 V − 5 V) × 0.5 A = 3.5 W — enough to need a heatsink. A switching regulator would waste far less.",
    },
    {
      id: "dropout",
      type: "predict",
      prompt: "A 7805 linear regulator needs about 2 V of headroom. Its input falls to 6 V. What happens to the output?",
      options: [
        { id: "drops", label: "It drops below 5 V" },
        { id: "steady", label: "It stays at exactly 5 V" },
        { id: "rises", label: "It rises to 6 V" },
      ],
      correctOptionId: "drops",
      explanation: "Below about 7 V in, the regulator can't hold 5 V: the output follows the input minus the dropout (~4 V).",
    },
  ],
  next: {
    title: "Build your first circuit",
    description: "Put a battery, switch, resistor and LED together — and explore every reading.",
    href: "/learn/components/build-your-first-circuit",
    cta: "Build it",
  },
};
