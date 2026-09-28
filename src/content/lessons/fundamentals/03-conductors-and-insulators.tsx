import { Cable, Cpu, Hand, RadioTower } from "lucide-react";
import { ConceptCard, ConceptGrid, KeyIdea, Prose, RealWorldCard, VisualStage } from "@/components/lesson/LessonBlocks";
import { MaterialTester } from "@/components/simulations/MaterialTester";
import { Callout } from "@/components/ui/Callout";
import type { LessonContent } from "../types";

export const conductorsAndInsulators: LessonContent = {
  moduleSlug: "fundamentals",
  lessonSlug: "conductors-and-insulators",
  objective: "Tell conductors and insulators apart, and explain the difference using free electrons.",
  objectives: ["Classify common materials", "Explain why wires use both kinds of material"],
  buildsOn: ["Electric charge", "The electron"],
  sections: [
    {
      id: "free-electrons",
      stage: "concept",
      title: "Can the electrons move?",
      content: (
        <>
          <Prose>
            <p>
              Every material is full of electrons. What matters is whether some of them are <strong>free</strong> to wander from atom to atom.
            </p>
          </Prose>
          <ConceptGrid columns={3}>
            <ConceptCard title="Conductors">
              Have lots of free electrons. Charge flows through them easily. Copper, aluminium, silver, gold.
            </ConceptCard>
            <ConceptCard title="Insulators" accent="amber">
              Hold every electron tightly. Charge can&apos;t flow. Rubber, plastic, glass, dry wood.
            </ConceptCard>
            <ConceptCard title="In between">
              Conduct a little. Graphite, salt water — and semiconductors like silicon, which you&apos;ll meet later.
            </ConceptCard>
          </ConceptGrid>
          <KeyIdea>Conductor or insulator comes down to one question: are there electrons free to move?</KeyIdea>
        </>
      ),
    },
    {
      id: "material-tester",
      stage: "experiment",
      title: "Test the materials",
      content: (
        <>
          <Prose>
            <p>
              This tester has a battery, a bulb and a gap. Put a material in the gap: if it conducts, the circuit is completed and the bulb lights.
              The right-hand panel zooms in to show what the electrons are doing.
            </p>
          </Prose>
          <Callout kind="try" className="mt-6">
            <p>Test all three metals, then all three insulators. Which in-between material makes the dimmest glow?</p>
          </Callout>
          <VisualStage caption="Left: the tester circuit. Right: free electrons drifting (conductors) vs electrons held in place (insulators).">
            <MaterialTester />
          </VisualStage>
        </>
      ),
    },
    {
      id: "why-both",
      stage: "visual",
      title: "Why we need both",
      content: (
        <>
          <Prose>
            <p>
              Conductors guide electricity where we want it. Insulators stop it going anywhere else. Almost every cable is both: a copper
              core inside a plastic jacket.
            </p>
          </Prose>
          <VisualStage>
            <svg viewBox="0 0 480 140" className="h-auto w-full" role="img" aria-label="Cross-section of a cable: a copper conductor core surrounded by plastic insulation.">
              <rect x={40} y={40} width={400} height={60} rx={30} fill="#a78bfa" fillOpacity={0.35} stroke="#a78bfa" />
              <rect x={40} y={58} width={430} height={24} rx={12} fill="#d08a4f" />
              <text x={240} y={30} textAnchor="middle" fontSize={12} fill="#c4b5fd" fontFamily="var(--font-mono)">
                PLASTIC INSULATION — keeps current in
              </text>
              <text x={240} y={122} textAnchor="middle" fontSize={12} fill="#f0b27a" fontFamily="var(--font-mono)">
                COPPER CONDUCTOR — carries the current
              </text>
            </svg>
          </VisualStage>
        </>
      ),
    },
    {
      id: "real-world",
      stage: "real-world",
      title: "Conductors and insulators around you",
      content: (
        <div className="grid gap-3 sm:grid-cols-2">
          <RealWorldCard icon={Cable} title="Charging cables">
            Copper strands to carry current; soft plastic around them so you can hold the cable safely.
          </RealWorldCard>
          <RealWorldCard icon={Cpu} title="Circuit boards">
            Thin copper tracks (conductors) printed on a fibreglass board (insulator).
          </RealWorldCard>
          <RealWorldCard icon={RadioTower} title="Power lines">
            Aluminium wires hang from glass or ceramic insulators so current can&apos;t leak into the tower.
          </RealWorldCard>
          <RealWorldCard icon={Hand} title="Electricians' gloves">
            Thick rubber insulates the hands — but only professionals should ever work near live wiring.
          </RealWorldCard>
        </div>
      ),
    },
  ],
  analogy: {
    title: "A crowd in a building",
    content: (
      <p>
        In a <strong>conductor</strong>, people (electrons) are free to wander between rooms, so a crowd can easily flow through the
        building. In an <strong>insulator</strong>, everyone is buckled into a seat in their own room — nobody can move, however hard
        you push.
      </p>
    ),
    limits: [
      "Real electrons are identical and far more numerous — a speck of copper has more free electrons than there are people on Earth, many times over.",
      "Insulators aren't perfect: a large enough voltage can force current through almost anything (that's how lightning crosses air).",
    ],
  },
  keyTakeaway: "Conductors have free electrons, so charge flows easily through them; insulators hold their electrons tightly, so charge can't flow.",
  takeaways: [
    "Metals like copper, aluminium and silver are good conductors.",
    "Rubber, plastic and glass are insulators.",
    "Some materials, like graphite and salt water, conduct a little.",
    "Cables use both: a conductor inside, an insulator outside.",
  ],
  quickCheck: [
    {
      id: "pick-conductor",
      type: "identify",
      prompt: "Which of these is a conductor?",
      options: [
        { id: "rubber", label: "Rubber" },
        { id: "glass", label: "Glass" },
        { id: "copper", label: "Copper" },
        { id: "plastic", label: "Plastic" },
      ],
      correctOptionId: "copper",
      explanation: "Copper is a metal with plenty of free electrons — that's why it's used for almost every wire.",
    },
    {
      id: "coating",
      type: "true-false",
      prompt: "The plastic coating on a wire is there to carry the current.",
      options: [
        { id: "true", label: "True" },
        { id: "false", label: "False" },
      ],
      correctOptionId: "false",
      explanation: "The copper inside carries the current. The plastic is an insulator that keeps the current in the wire and away from you.",
    },
    {
      id: "rubber-gap",
      type: "predict",
      prompt: "In the tester, you swap the copper sample for rubber. What happens to the bulb?",
      options: [
        { id: "off", label: "It goes out" },
        { id: "brighter", label: "It gets brighter" },
        { id: "same", label: "It stays the same" },
      ],
      correctOptionId: "off",
      explanation: "Rubber holds its electrons tightly, so charge can't cross the gap. With no complete conducting path, no current flows.",
    },
  ],
  next: {
    title: "So what is electricity?",
    description: "You know electrons can move through conductors. Next: what happens when they do — and why that moving charge carries energy.",
    href: "/learn/fundamentals/what-is-electricity",
    cta: "Continue to Lesson 4",
  },
};
