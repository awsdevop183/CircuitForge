import { Flashlight, House, Lightbulb } from "lucide-react";
import { ConceptCard, ConceptGrid, KeyIdea, Prose, RealWorldCard, VisualStage } from "@/components/lesson/LessonBlocks";
import { SeriesParallelExperiment } from "@/components/lab/SeriesParallelExperiment";
import { SeriesParallelWorkedExample } from "@/components/simulations/SeriesParallelWorkedExample";
import { Callout } from "@/components/ui/Callout";
import type { LessonContent } from "../types";

export const seriesAndParallel: LessonContent = {
  moduleSlug: "fundamentals",
  lessonSlug: "series-and-parallel",
  objective: "Compare series and parallel circuits: how current, voltage and resistance behave, and what happens when one part fails.",
  objectives: ["Add resistances in series", "Explain why homes are wired in parallel"],
  buildsOn: ["Ohm's law", "Open circuits", "Voltage", "Current"],
  sections: [
    {
      id: "two-ways",
      stage: "concept",
      title: "Two ways to connect components",
      content: (
        <>
          <Prose>
            <p>
              In <strong>series</strong>, components sit one after another on a single path. In <strong>parallel</strong>, each component gets
              its own branch between the same two points.
            </p>
          </Prose>
          <ConceptGrid columns={2}>
            <ConceptCard title="Series" accent="amber">
              <span className="block font-mono text-ink">Battery → R1 → R2 → Battery</span>
              One path. Same current through everything.
            </ConceptCard>
            <ConceptCard title="Parallel">
              <span className="block font-mono text-ink">Battery ─┬─ R1 ─┬─ Battery</span>
              <span className="block font-mono text-ink">          └─ R2 ─┘</span>
              Separate paths. Same voltage across each branch.
            </ConceptCard>
          </ConceptGrid>
        </>
      ),
    },
    {
      id: "worked-example",
      stage: "visual",
      title: "The same two resistors, both ways",
      content: (
        <>
          <Prose>
            <p>Take a 9 V battery, a 100 Ω resistor and a 200 Ω resistor. Here&apos;s what happens each way — every number comes from Ohm&apos;s law.</p>
          </Prose>
          <VisualStage>
            <SeriesParallelWorkedExample />
          </VisualStage>
          <ConceptGrid columns={4}>
            <ConceptCard title="Current">Series: the same everywhere. Parallel: splits between branches.</ConceptCard>
            <ConceptCard title="Voltage" accent="amber">
              Series: shared out. Parallel: the full voltage across each branch.
            </ConceptCard>
            <ConceptCard title="Resistance">Series: adds up. Parallel: total is less than the smallest branch.</ConceptCard>
            <ConceptCard title="If one fails" accent="amber">
              Series: everything stops. Parallel: the others keep working.
            </ConceptCard>
          </ConceptGrid>
        </>
      ),
    },
    {
      id: "experiment",
      stage: "experiment",
      title: "Switch between series and parallel",
      content: (
        <>
          <Prose>
            <p>Two bulbs, one battery. Wire them in series or parallel, change their resistance, and try removing one.</p>
          </Prose>
          <Callout kind="try" className="mt-6">
            <p>
              In series, remove bulb 2 — what happens to bulb 1? Try the same in parallel. Which wiring makes both bulbs brighter, and which
              draws more current from the battery?
            </p>
          </Callout>
          <div className="my-8">
            <SeriesParallelExperiment />
          </div>
          <KeyIdea>Series shares the voltage and stops together. Parallel shares the current and keeps going.</KeyIdea>
        </>
      ),
    },
    {
      id: "real-world",
      stage: "real-world",
      title: "Series and parallel around you",
      content: (
        <div className="grid gap-3 sm:grid-cols-3">
          <RealWorldCard icon={Flashlight} title="Batteries in a torch">
            Cells stacked in series add their voltages: two 1.5 V cells make 3 V.
          </RealWorldCard>
          <RealWorldCard icon={House} title="Home wiring">
            Sockets and lights are in parallel, so each gets full voltage and one switched off doesn&apos;t affect the rest.
          </RealWorldCard>
          <RealWorldCard icon={Lightbulb} title="Old fairy lights">
            Wired in series: one failed bulb opened the loop and the whole string went dark.
          </RealWorldCard>
        </div>
      ),
    },
  ],
  analogy: {
    title: "One road vs several lanes",
    content: (
      <p>
        <strong>Series</strong> is a single road through several toll booths: every car passes every booth, and one closed booth blocks
        everyone. <strong>Parallel</strong> is a motorway with several lanes: traffic splits between lanes, and closing one lane leaves the
        others open.
      </p>
    ),
    limits: [
      "Adding lanes makes a road carry more cars; adding parallel branches draws more current from the battery — it doesn't make the battery stronger.",
      "In circuits, the current in each branch depends on its resistance — not on drivers choosing lanes.",
    ],
  },
  keyTakeaway: "Series: one path, the same current, voltages add up, one failure stops all. Parallel: separate paths, the same voltage, currents add up, one failure leaves the rest working.",
  takeaways: [
    "Series resistances add: 100 Ω + 200 Ω = 300 Ω.",
    "In series, the current is the same through every component.",
    "In parallel, every branch gets the full supply voltage.",
    "Homes use parallel wiring so devices work independently.",
  ],
  quickCheck: [
    {
      id: "series-total",
      type: "multiple-choice",
      prompt: "A 100 Ω and a 200 Ω resistor are connected in series. What is the total resistance?",
      options: [
        { id: "300", label: "300 Ω" },
        { id: "100", label: "100 Ω" },
        { id: "66", label: "66.7 Ω" },
        { id: "20000", label: "20,000 Ω" },
      ],
      correctOptionId: "300",
      explanation: "In series, resistances simply add: 100 Ω + 200 Ω = 300 Ω. (66.7 Ω is what you'd get in parallel.)",
    },
    {
      id: "series-fail",
      type: "predict",
      prompt: "Two bulbs are in series. One bulb burns out. What happens to the other?",
      options: [
        { id: "off", label: "It goes out too" },
        { id: "brighter", label: "It gets brighter" },
        { id: "same", label: "It carries on as before" },
      ],
      correctOptionId: "off",
      explanation: "Series has only one path. A burnt-out bulb opens the circuit, so no current flows through either bulb.",
    },
    {
      id: "parallel-voltage",
      type: "true-false",
      prompt: "In a parallel circuit, every branch has the full supply voltage across it.",
      options: [
        { id: "true", label: "True" },
        { id: "false", label: "False" },
      ],
      correctOptionId: "true",
      explanation: "Each branch connects directly across the same two points as the battery, so each gets the full voltage.",
    },
    {
      id: "home",
      type: "multiple-choice",
      prompt: "Why are homes wired in parallel?",
      options: [
        { id: "independent", label: "Each device gets full voltage and works independently" },
        { id: "cheaper", label: "It uses less electricity" },
        { id: "series-dangerous", label: "Series wiring is illegal" },
      ],
      correctOptionId: "independent",
      explanation: "Parallel wiring gives every socket and light the full supply voltage, and switching one off doesn't open the circuit for the others.",
    },
  ],
  next: {
    title: "Module complete — meet the components",
    description:
      "You've finished Electronics Fundamentals. Next, meet the parts that circuits are built from — resistors, LEDs, capacitors, transistors and more — and use each one in a working circuit.",
    href: "/learn/components/what-is-a-component",
    cta: "Start Module 02: Electronic Components",
  },
};
