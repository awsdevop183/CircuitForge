import { Bell, Car, Flashlight, ToggleRight } from "lucide-react";
import { ConceptCard, ConceptGrid, KeyIdea, Prose, RealWorldCard, VisualStage } from "@/components/lesson/LessonBlocks";
import { ComponentSymbol } from "@/components/explorer/ComponentSymbol";
import { CircuitExplorer } from "@/components/simulations/CircuitExplorer";
import { SymbolLegend } from "@/components/simulations/SymbolLegend";
import { Callout } from "@/components/ui/Callout";
import type { LessonContent } from "../types";

export const whatIsACircuit: LessonContent = {
  moduleSlug: "electricity",
  lessonSlug: "what-is-a-circuit",
  objective: "Identify the parts of a simple circuit and explain why current only flows around a complete loop.",
  objectives: ["Name the source, path, load and control", "Read the basic circuit symbols"],
  buildsOn: ["Conductors", "Electricity is moving charge"],
  sections: [
    {
      id: "complete-loop",
      stage: "concept",
      title: "A circuit is a complete loop",
      content: (
        <>
          <Prose>
            <p>
              Charge can only keep flowing if it has a <strong>complete path</strong> — out of the battery, through the parts, and back into the
              battery. That loop is called a <strong>circuit</strong> (like a racing circuit: you end where you started).
            </p>
            <p>Every working circuit has four jobs covered. Select each one to find it in the diagram.</p>
          </Prose>
          <VisualStage>
            <CircuitExplorer parts={{ switch: true, resistor: true, led: true }} initial={{ closed: true }} anatomy title="Parts of a circuit" />
          </VisualStage>
          <ConceptGrid columns={4}>
            <ConceptCard title="Source">Provides the push and energy — a battery.</ConceptCard>
            <ConceptCard title="Path" accent="amber">
              Conductors (wires) out and back.
            </ConceptCard>
            <ConceptCard title="Load">Uses the energy — here the LED (with its resistor).</ConceptCard>
            <ConceptCard title="Control" accent="amber">
              Turns it on and off — a switch.
            </ConceptCard>
          </ConceptGrid>
        </>
      ),
    },
    {
      id: "symbols",
      stage: "visual",
      title: "The language of circuit diagrams",
      content: (
        <>
          <Prose>
            <p>
              Engineers draw circuits with simple <strong>symbols</strong> instead of pictures. A diagram shows how parts connect, not what
              they look like. Learn these six and you can read the circuits in this module.
            </p>
          </Prose>
          <VisualStage>
            <SymbolLegend />
          </VisualStage>
        </>
      ),
    },
    {
      id: "explorer",
      stage: "experiment",
      title: "Switch it on and off",
      content: (
        <>
          <Prose>
            <p>
              Here&apos;s a complete circuit: battery → switch → resistor → LED → back to the battery. The ground symbol marks the 0 V reference
              point (you&apos;ll learn exactly what that means in Lesson 14).
            </p>
          </Prose>
          <Callout kind="try" className="mt-6">
            <p>
              Flip the switch — with the button or by clicking the switch in the diagram. Watch the chain below the circuit:{" "}
              <strong>path → current → LED</strong>.
            </p>
          </Callout>
          <VisualStage>
            <CircuitExplorer parts={{ switch: true, resistor: true, led: true, ground: true }} title="Battery, switch, resistor and LED" />
          </VisualStage>
          <KeyIdea>No complete path → no current → LED off. Complete path → current flows → LED on.</KeyIdea>
        </>
      ),
    },
    {
      id: "real-world",
      stage: "real-world",
      title: "Circuits you use every day",
      content: (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <RealWorldCard icon={Flashlight} title="A torch">
            Batteries (source), metal strips (path), bulb (load) and a slide switch (control) — the same four parts.
          </RealWorldCard>
          <RealWorldCard icon={Bell} title="A doorbell">
            Pressing the button closes the circuit so current can reach the chime.
          </RealWorldCard>
          <RealWorldCard icon={Car} title="Car headlights">
            The dashboard switch completes a circuit from the car battery to the lamps.
          </RealWorldCard>
          <RealWorldCard icon={ToggleRight} title="Light switches">
            Every light switch in a home is the “control” part of a circuit.
          </RealWorldCard>
        </div>
      ),
    },
  ],
  analogy: {
    title: "A toy train on a loop of track",
    content: (
      <p>
        A train set only works if the track makes a complete loop. Lift out one piece of track and the train stops — anywhere on the loop.
        In a circuit, the <strong>track is the wire</strong>, the <strong>trains are the charges</strong> and a <strong>switch</strong> is a
        piece of track you can lift in and out.
      </p>
    ),
    limits: [
      "A train can still roll up to the gap; in a circuit, current stops everywhere in the loop at once.",
      "Trains are few and far apart; a wire is packed full of electrons all the way round.",
    ],
  },
  keyTakeaway: "A circuit is a complete loop: source, path, load and control. Current only flows when the loop is unbroken.",
  takeaways: [
    "Source: provides the push and energy (a battery).",
    "Path: conducting wires out and back.",
    "Load: uses the energy (an LED, lamp or motor).",
    "Control: a switch opens or closes the loop.",
  ],
  quickCheck: [
    {
      id: "identify-symbol",
      type: "identify",
      prompt: "What does this circuit symbol represent?",
      visual: <ComponentSymbol slug="resistor" name="Mystery component" className="h-14 w-auto" />,
      options: [
        { id: "battery", label: "Battery" },
        { id: "resistor", label: "Resistor" },
        { id: "switch", label: "Switch" },
        { id: "led", label: "LED" },
      ],
      correctOptionId: "resistor",
      explanation: "The zig-zag line is a resistor. (A battery is long and short plates; an LED is a triangle and bar with little arrows.)",
    },
    {
      id: "switch-open",
      type: "predict",
      prompt: "In the battery → switch → resistor → LED circuit, you open the switch. What happens?",
      options: [
        { id: "off", label: "The LED turns off" },
        { id: "dim", label: "The LED dims a little" },
        { id: "on", label: "The LED stays on" },
      ],
      correctOptionId: "off",
      explanation: "Opening the switch breaks the loop. No complete path means no current, so the LED goes off.",
    },
    {
      id: "four-parts",
      type: "multiple-choice",
      prompt: "Which part of a circuit provides the push and the energy?",
      options: [
        { id: "source", label: "The source (battery)" },
        { id: "load", label: "The load (LED)" },
        { id: "control", label: "The control (switch)" },
        { id: "path", label: "The path (wires)" },
      ],
      correctOptionId: "source",
      explanation: "The source — here a battery — provides the push that moves charge and the energy the load uses.",
    },
  ],
  next: {
    title: "What is that push?",
    description: "The battery pushes charge around the loop. That push has a name and a unit — voltage. Next, measure it between two points.",
    href: "/learn/electricity/voltage",
    cta: "Continue to Lesson 6",
  },
};
