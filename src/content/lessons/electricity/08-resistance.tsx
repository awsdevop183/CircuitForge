import { Flame, Lightbulb, Sliders, Cable } from "lucide-react";
import { ComponentSymbol } from "@/components/explorer/ComponentSymbol";
import { ConceptCard, ConceptGrid, KeyIdea, Prose, RealWorldCard, VisualStage } from "@/components/lesson/LessonBlocks";
import { ResistanceExplorer, WireResistanceFactors } from "@/components/simulations/ResistanceExplorer";
import { Callout } from "@/components/ui/Callout";
import type { LessonContent } from "../types";

export const resistance: LessonContent = {
  moduleSlug: "electricity",
  lessonSlug: "resistance",
  objective: "Explain resistance as opposition to current, and predict how changing resistance changes current.",
  objectives: ["Use the unit ohm (Ω)", "Describe what makes a wire more or less resistive"],
  buildsOn: ["Voltage", "Current"],
  sections: [
    {
      id: "opposition",
      stage: "concept",
      title: "Resistance opposes current",
      content: (
        <>
          <Prose>
            <p>
              Everything a current flows through pushes back a little. That opposition is called <strong>resistance</strong>, measured in{" "}
              <strong>ohms (Ω)</strong>. A <strong>resistor</strong> is a component made to have a specific resistance.
            </p>
          </Prose>
          <ConceptGrid columns={3}>
            <ConceptCard title="Low resistance" visual={<span className="font-mono text-2xl text-cyan">≈ 0 Ω</span>}>
              Copper wire. Current flows very easily.
            </ConceptCard>
            <ConceptCard title="Resistor" accent="amber" visual={<ComponentSymbol slug="resistor" name="Resistor" className="h-10 w-auto" />}>
              100 Ω, 1 kΩ, 10 kΩ… chosen to set the current.
            </ConceptCard>
            <ConceptCard title="Very high" visual={<span className="font-mono text-2xl text-ink-muted">≈ ∞ Ω</span>}>
              Insulators like plastic. Almost no current.
            </ConceptCard>
          </ConceptGrid>
          <KeyIdea>Resistance ↑ → current ↓. Resistance ↓ → current ↑ (for the same voltage).</KeyIdea>
        </>
      ),
    },
    {
      id: "what-sets-resistance",
      stage: "visual",
      title: "What makes something resistive?",
      content: (
        <>
          <Prose>
            <p>
              Material matters most (copper is far less resistive than carbon). But shape matters too: a <strong>longer</strong> wire has more
              resistance, and a <strong>thicker</strong> wire has less.
            </p>
          </Prose>
          <VisualStage>
            <WireResistanceFactors />
          </VisualStage>
        </>
      ),
    },
    {
      id: "resistance-experiment",
      stage: "experiment",
      title: "Resistance vs current",
      content: (
        <>
          <Prose>
            <p>
              Drag the resistance slider and watch the passage narrow, the charge slow down, and the ammeter drop. Then try the voltage slider.
            </p>
          </Prose>
          <Callout kind="try" className="mt-6">
            <p>Set 6 V. Now multiply the resistance by 10 (for example 100 Ω → 1 kΩ). What happens to the current — exactly?</p>
          </Callout>
          <VisualStage caption="The calculation behind this experiment is Ohm's law — the subject of the next lesson.">
            <ResistanceExplorer />
          </VisualStage>
        </>
      ),
    },
    {
      id: "real-world",
      stage: "real-world",
      title: "Resistance at work",
      content: (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <RealWorldCard icon={Lightbulb} title="Protecting an LED">
            A resistor in series limits the current so the LED doesn&apos;t burn out.
          </RealWorldCard>
          <RealWorldCard icon={Flame} title="Toasters and heaters">
            High-resistance wire turns current into heat on purpose.
          </RealWorldCard>
          <RealWorldCard icon={Sliders} title="Volume and dimmer knobs">
            A variable resistor changes its resistance as you turn it.
          </RealWorldCard>
          <RealWorldCard icon={Cable} title="Thick cables">
            High-current cables (like jump leads) are thick to keep resistance — and heating — low.
          </RealWorldCard>
        </div>
      ),
    },
  ],
  analogy: {
    title: "A narrow section of pipe",
    content: (
      <p>
        Pushing water through a pipe with a narrow section: the narrower it is, the less water gets through each second for the same push.
        A resistor is like that narrow section, and the current is the flow.
      </p>
    ),
    limits: [
      "Water speeds up through a narrow section; in a wire, the current is the same throughout the loop.",
      "Resistance turns electrical energy into heat — a narrow pipe doesn't warm up the same way.",
    ],
  },
  keyTakeaway: "Resistance opposes current: with the same voltage, more resistance means less current, and less resistance means more.",
  takeaways: [
    "Resistance is measured in ohms (Ω).",
    "A resistor is a component with a chosen resistance.",
    "Longer or thinner conductors have more resistance.",
    "Resistance turns some electrical energy into heat.",
  ],
  quickCheck: [
    {
      id: "r-up",
      type: "predict",
      prompt: "The voltage stays at 6 V, but you swap a 100 Ω resistor for a 1,000 Ω one. What happens to the current?",
      options: [
        { id: "down", label: "It drops (to one tenth)" },
        { id: "up", label: "It rises (ten times)" },
        { id: "same", label: "It stays the same" },
      ],
      correctOptionId: "down",
      explanation: "More resistance means less current. Ten times the resistance with the same voltage gives one tenth of the current: 60 mA → 6 mA.",
    },
    {
      id: "unit",
      type: "multiple-choice",
      prompt: "What unit is resistance measured in?",
      options: [
        { id: "ohm", label: "Ohms (Ω)" },
        { id: "amp", label: "Amps (A)" },
        { id: "volt", label: "Volts (V)" },
        { id: "watt", label: "Watts (W)" },
      ],
      correctOptionId: "ohm",
      explanation: "Resistance is measured in ohms, written with the Greek letter omega: Ω.",
    },
    {
      id: "thicker",
      type: "true-false",
      prompt: "A thicker wire of the same length has more resistance.",
      options: [
        { id: "true", label: "True" },
        { id: "false", label: "False" },
      ],
      correctOptionId: "false",
      explanation: "A thicker wire gives charge more room to flow, so it has less resistance. Longer wires have more.",
    },
  ],
  next: {
    title: "Put a number on it",
    description: "Voltage, current and resistance are linked by one simple rule. Next: Ohm's law — and a calculator lab to master it.",
    href: "/learn/electricity/ohms-law",
    cta: "Continue to Lesson 9",
  },
};
