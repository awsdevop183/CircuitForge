import { Car, Gauge, Plug, Usb } from "lucide-react";
import { ConceptCard, ConceptGrid, KeyIdea, Prose, RealWorldCard, VisualStage } from "@/components/lesson/LessonBlocks";
import { GroundReference } from "@/components/simulations/GroundReference";
import { GroundTypes } from "@/components/simulations/GroundTypes";
import { Callout } from "@/components/ui/Callout";
import { SafetyNotice } from "@/components/ui/SafetyNotice";
import type { LessonContent } from "../types";

function EarthSymbol() {
  return (
    <svg viewBox="-24 -6 48 40" className="h-12 w-auto" role="img" aria-label="Ground symbol with three horizontal lines getting shorter">
      <g stroke="#cbd5e1" strokeWidth={2.75} strokeLinecap="round">
        <line x1={0} y1={-4} x2={0} y2={16} />
        <line x1={-15} y1={16} x2={15} y2={16} />
        <line x1={-9} y1={22} x2={9} y2={22} />
        <line x1={-3.5} y1={28} x2={3.5} y2={28} />
      </g>
    </svg>
  );
}

export const ground: LessonContent = {
  moduleSlug: "electricity",
  lessonSlug: "ground",
  objective: "Explain that ground is a chosen 0 V reference point, and distinguish circuit reference, earth ground and chassis ground.",
  objectives: ["Measure voltages relative to ground", "Recognise the three ground symbols"],
  buildsOn: ["Voltage is a difference", "Circuits", "Short circuits"],
  sections: [
    {
      id: "reference",
      stage: "concept",
      title: "Ground is a reference, not a place",
      content: (
        <>
          <Prose>
            <p>
              Voltage is always a difference between two points. To avoid saying “between here and there” every time, we pick one point in the
              circuit and call it <strong>0 V</strong>. That point is called <strong>ground</strong> (or “common”, or GND). Every other voltage
              is measured from it.
            </p>
            <p>
              A very common mistake is to think ground <em>always</em> means a wire into the Earth. Sometimes it does — but in most electronics
              it doesn&apos;t. The word means different things in different systems.
            </p>
          </Prose>
          <ConceptGrid columns={3}>
            <ConceptCard title="Circuit reference">The 0 V point of a circuit — usually the battery&apos;s − terminal.</ConceptCard>
            <ConceptCard title="Earth ground" accent="amber">
              A real connection to the soil, used for safety in buildings.
            </ConceptCard>
            <ConceptCard title="Chassis ground">The metal frame or case of a device or vehicle.</ConceptCard>
          </ConceptGrid>
        </>
      ),
    },
    {
      id: "move-ground",
      stage: "experiment",
      title: "Move the ground",
      content: (
        <>
          <Prose>
            <p>
              Here&apos;s a 9 V battery with two resistors. Put ground at different points. Every voltage label changes — but does anything about
              the circuit itself change?
            </p>
          </Prose>
          <Callout kind="try" className="mt-6">
            <p>Put ground at node A. Why do the other points now read negative? Check the current and the differences — did they move?</p>
          </Callout>
          <VisualStage>
            <GroundReference />
          </VisualStage>
          <KeyIdea>Moving ground changes the numbers we write, not the physics: currents and voltage differences stay the same.</KeyIdea>
        </>
      ),
    },
    {
      id: "three-grounds",
      stage: "visual",
      title: "Three meanings of ground",
      content: (
        <>
          <Prose>
            <p>Select each kind of ground to see a diagram of where it&apos;s used and the symbol engineers draw for it.</p>
          </Prose>
          <VisualStage caption="Symbol conventions vary — many schematics use the three-line symbol for plain circuit 0 V too. Read the labels.">
            <GroundTypes />
          </VisualStage>
          <SafetyNotice topic="mains">Earth ground is part of mains safety wiring. Look at the diagram — never at the real thing.</SafetyNotice>
        </>
      ),
    },
    {
      id: "real-world",
      stage: "real-world",
      title: "Ground around you",
      content: (
        <div className="grid gap-3 sm:grid-cols-2">
          <RealWorldCard icon={Usb} title="USB cables">
            One of the pins is labelled GND — the 0 V reference shared by your computer and the device.
          </RealWorldCard>
          <RealWorldCard icon={Gauge} title="Multimeters">
            The black “COM” probe is the reference. You usually clip it to your circuit&apos;s ground.
          </RealWorldCard>
          <RealWorldCard icon={Car} title="Cars">
            The metal body is chassis ground — the return path for lights and radio. It isn&apos;t connected to the Earth.
          </RealWorldCard>
          <RealWorldCard icon={Plug} title="Three-pin plugs">
            The earth pin connects metal cases to earth ground for safety in a fault.
          </RealWorldCard>
        </div>
      ),
    },
  ],
  analogy: {
    title: "Sea level for heights",
    content: (
      <p>
        Mountain heights are measured from <strong>sea level</strong>. Sea level isn&apos;t special in itself — it&apos;s just an agreed reference so
        everyone&apos;s numbers match. Ground is the circuit&apos;s “sea level”: we call it 0 V and measure everything else from it.
      </p>
    ),
    limits: [
      "Everyone on Earth shares one sea level; every circuit can choose its own ground.",
      "Earth ground is a real physical connection that carries fault current — more than just a label.",
    ],
  },
  keyTakeaway: "Ground is the point we choose to call 0 V. Depending on the system it may be a circuit reference, a connection to the Earth, or a metal chassis.",
  takeaways: [
    "Voltages are measured relative to ground (0 V).",
    "Circuit ground is usually the battery's − terminal.",
    "Earth ground connects to the soil for safety; chassis ground is a metal frame.",
    "Moving the reference changes the numbers, not the circuit's behaviour.",
  ],
  quickCheck: [
    {
      id: "always-earth",
      type: "true-false",
      prompt: "“Ground” always means a wire connected to the Earth.",
      options: [
        { id: "true", label: "True" },
        { id: "false", label: "False" },
      ],
      correctOptionId: "false",
      explanation: "Often it's just the circuit's 0 V reference (a phone has no connection to the soil), or a metal chassis like a car body. Earth ground is only one meaning.",
    },
    {
      id: "move-reference",
      type: "predict",
      prompt: "In a working circuit, you move the ground symbol to a different point. What happens to the current?",
      options: [
        { id: "same", label: "Nothing — it stays the same" },
        { id: "zero", label: "It drops to zero" },
        { id: "doubles", label: "It doubles" },
      ],
      correctOptionId: "same",
      explanation: "Ground is just a reference for labelling voltages. The components and connections are unchanged, so the current is too.",
    },
    {
      id: "identify-earth",
      type: "identify",
      prompt: "Which kind of ground is this symbol most often used for?",
      visual: <EarthSymbol />,
      options: [
        { id: "earth", label: "Earth ground" },
        { id: "battery", label: "A battery" },
        { id: "resistor", label: "A resistor" },
      ],
      correctOptionId: "earth",
      explanation: "Three lines getting shorter is the earth-ground symbol — though many schematics also use it for plain 0 V, so check the labels.",
    },
  ],
  next: {
    title: "Connect more than one component",
    description: "Last lesson: two ways to wire several components together — series and parallel — and how current and voltage share out.",
    href: "/learn/electricity/series-and-parallel",
    cta: "Continue to Lesson 15",
  },
};
