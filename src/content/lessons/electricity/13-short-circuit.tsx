import { Cable, Coins, Flame, ShieldCheck } from "lucide-react";
import { ConceptCard, ConceptGrid, KeyIdea, Prose, RealWorldCard, VisualStage } from "@/components/lesson/LessonBlocks";
import { ShortCircuitDemo } from "@/components/simulations/ShortCircuitDemo";
import { Callout } from "@/components/ui/Callout";
import { SafetyNotice } from "@/components/ui/SafetyNotice";
import type { LessonContent } from "../types";

export const shortCircuit: LessonContent = {
  moduleSlug: "electricity",
  lessonSlug: "short-circuit",
  objective: "Explain what a short circuit is, why bypassing the load causes a very high current, and how fuses protect against it.",
  objectives: ["Use Ohm's law to see why tiny resistance means huge current", "Recognise accidental shorts"],
  buildsOn: ["Resistance", "Ohm's law", "Power", "Open circuits"],
  sections: [
    {
      id: "bypass",
      stage: "concept",
      title: "A short cut around the load",
      content: (
        <>
          <Prose>
            <p>
              Normally current flows through a <strong>load</strong> (a lamp, LED or motor) whose resistance limits it. A{" "}
              <strong>short circuit</strong> is an accidental path with almost <strong>no resistance</strong> that lets current bypass the
              load.
            </p>
          </Prose>
          <ConceptGrid columns={2}>
            <ConceptCard title="Normal">
              <span className="block font-mono text-ink">Battery → Load → Battery</span>
              The load&apos;s resistance keeps the current sensible.
            </ConceptCard>
            <ConceptCard title="Short circuit" accent="amber">
              <span className="block font-mono text-ink">Battery ─────────── Battery</span>
              Nearly zero resistance, so the current shoots up.
            </ConceptCard>
          </ConceptGrid>
          <KeyIdea>I = V ÷ R. When R gets close to zero, I gets enormous — limited only by the battery itself.</KeyIdea>
        </>
      ),
    },
    {
      id: "short-demo",
      stage: "experiment",
      title: "Watch a short circuit (safely)",
      content: (
        <>
          <Prose>
            <p>
              Switch between normal operation and a short. Watch the current, the lamp, the battery&apos;s voltage and the heat. Then fit a fuse
              and try again.
            </p>
          </Prose>
          <Callout kind="try" className="mt-6">
            <p>How many times bigger is the short-circuit current? What happens to the voltage at the battery&apos;s terminals — and why?</p>
          </Callout>
          <VisualStage caption="This is a simulation. Never short-circuit a real battery.">
            <ShortCircuitDemo />
          </VisualStage>
        </>
      ),
    },
    {
      id: "why-dangerous",
      stage: "visual",
      title: "Why shorts are dangerous",
      content: (
        <>
          <ConceptGrid columns={3}>
            <ConceptCard title="Huge current">Several amps — or hundreds, for car batteries — instead of milliamps.</ConceptCard>
            <ConceptCard title="Intense heat" accent="amber">
              Power = V × I. The wire and battery turn it all into heat: burns, melting insulation, fire.
            </ConceptCard>
            <ConceptCard title="Damaged batteries">Lithium batteries can swell, vent or catch fire when shorted.</ConceptCard>
          </ConceptGrid>
          <SafetyNotice topic="short-circuit" />
        </>
      ),
    },
    {
      id: "real-world",
      stage: "real-world",
      title: "Shorts in the real world",
      content: (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <RealWorldCard icon={Coins} title="Batteries in a pocket">
              Keys or coins bridging a 9 V battery&apos;s terminals can make it hot enough to burn.
            </RealWorldCard>
            <RealWorldCard icon={Cable} title="Damaged cables">
              Worn insulation lets two conductors touch, creating a short inside the cable.
            </RealWorldCard>
            <RealWorldCard icon={ShieldCheck} title="Fuses and circuit breakers">
              They open the circuit the moment current gets too high — protecting wiring from overheating.
            </RealWorldCard>
            <RealWorldCard icon={Flame} title="Solder bridges">
              A tiny blob of solder joining two pins on a board is a classic beginner short.
            </RealWorldCard>
          </div>
          <SafetyNotice topic="batteries" className="mt-6" />
        </>
      ),
    },
  ],
  analogy: {
    title: "A burst pipe at the bottom of a water tower",
    content: (
      <p>
        Water normally leaves a tower through taps that limit the flow. A burst pipe at the base offers almost no resistance, so water
        gushes out far faster than any tap — until the tower is empty or someone shuts a valve (the fuse).
      </p>
    ),
    limits: [
      "Water pours out and is lost; in a short, charge still goes round the loop — the danger is the heat from the huge current.",
      "A real battery's own internal resistance limits the current; a water tower has no equivalent.",
    ],
  },
  keyTakeaway: "A short circuit bypasses the load with an almost resistance-free path, so current becomes dangerously large — fuses and breakers exist to stop it.",
  takeaways: [
    "A short is a very low-resistance path that bypasses the load.",
    "Tiny resistance → huge current → intense heat.",
    "The shorted load goes dark: current takes the easy path.",
    "Fuses and breakers open the circuit when current is too high.",
  ],
  quickCheck: [
    {
      id: "why-high",
      type: "multiple-choice",
      prompt: "Why is the current so large in a short circuit?",
      options: [
        { id: "low-r", label: "The resistance is almost zero, so I = V ÷ R becomes very large" },
        { id: "high-v", label: "The battery's voltage increases" },
        { id: "extra", label: "Extra electrons are added to the wire" },
      ],
      correctOptionId: "low-r",
      explanation: "The voltage stays about the same, but dividing by a tiny resistance gives a huge current. Only the battery's internal resistance limits it.",
    },
    {
      id: "brighter",
      type: "true-false",
      prompt: "Shorting across a lamp makes the lamp glow brighter.",
      options: [
        { id: "true", label: "True" },
        { id: "false", label: "False" },
      ],
      correctOptionId: "false",
      explanation: "The current takes the easy, resistance-free path around the lamp, so the lamp goes dark while the wire and battery heat up.",
    },
    {
      id: "fuse",
      type: "predict",
      prompt: "A circuit has a 1 A fuse. A short makes the current try to jump to 6 A. What happens?",
      options: [
        { id: "blows", label: "The fuse melts, the circuit opens and the current stops" },
        { id: "limits", label: "The fuse lets exactly 1 A through" },
        { id: "nothing", label: "Nothing — fuses only work with AC" },
      ],
      correctOptionId: "blows",
      explanation: "A fuse's thin wire melts when current exceeds its rating, opening the circuit. It doesn't limit current — it cuts it off.",
    },
  ],
  next: {
    title: "What is “ground”?",
    description: "You've seen the ground symbol in diagrams. Next: what it really means — and why it doesn't always mean the Earth.",
    href: "/learn/electricity/ground",
    cta: "Continue to Lesson 14",
  },
};
