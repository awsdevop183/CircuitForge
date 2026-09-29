import { CloudLightning, Flashlight, Smartphone, Speaker } from "lucide-react";
import { ConceptCard, ConceptGrid, KeyIdea, Prose, RealWorldCard, VisualStage } from "@/components/lesson/LessonBlocks";
import { ElectronChain } from "@/components/electricity/ElectronChain";
import { ElectronDrift } from "@/components/simulations/ElectronDrift";
import { Callout } from "@/components/ui/Callout";
import type { LessonContent } from "../types";

export const whatIsElectricity: LessonContent = {
  moduleSlug: "electricity",
  lessonSlug: "what-is-electricity",
  objective: "Explain electricity as the movement of electric charge that carries energy from a source to a device.",
  objectives: ["Describe the difference between random motion and drift", "Explain why a lamp lights instantly"],
  buildsOn: ["The electron", "Conductors"],
  sections: [
    {
      id: "moving-charge",
      stage: "concept",
      title: "Electricity is moving charge",
      content: (
        <>
          <Prose>
            <p>
              When we say &ldquo;electricity&rdquo; in a circuit, we mean <strong>electric charge on the move</strong> — in wires, that&apos;s free
              electrons drifting through the metal. That flow carries <strong>energy</strong> from a source (like a battery) to something that
              uses it.
            </p>
          </Prose>
          <ConceptGrid columns={4}>
            <ConceptCard title="Light">LEDs and lamps</ConceptCard>
            <ConceptCard title="Heat" accent="amber">
              Kettles and heaters
            </ConceptCard>
            <ConceptCard title="Motion">Motors and fans</ConceptCard>
            <ConceptCard title="Sound" accent="amber">
              Speakers and buzzers
            </ConceptCard>
          </ConceptGrid>
          <KeyIdea>Electricity is a way of moving energy: charge picks it up at the source and delivers it wherever it&apos;s used.</KeyIdea>
        </>
      ),
    },
    {
      id: "drift",
      stage: "experiment",
      title: "Jiggle vs drift",
      content: (
        <>
          <Prose>
            <p>
              Free electrons are never still — they jiggle about randomly. But random jiggling goes nowhere on average. Connect a battery and
              every electron gains a small push in one direction. That steady <strong>drift</strong> is an electric current.
            </p>
          </Prose>
          <Callout kind="try" className="mt-6">
            <p>Watch the electrons with no battery. Then connect one. Do they stop jiggling — or keep jiggling while drifting?</p>
          </Callout>
          <VisualStage caption="The drift is exaggerated here. In a real wire it's typically less than a millimetre per second!">
            <ElectronDrift />
          </VisualStage>
        </>
      ),
    },
    {
      id: "instant",
      stage: "visual",
      title: "Slow electrons, instant light",
      content: (
        <>
          <Prose>
            <p>
              If electrons drift so slowly, why does a lamp light the moment you flip the switch? Because the wire is <strong>already full</strong>{" "}
              of free electrons. Push one in at one end and the push passes along the whole line at once.
            </p>
          </Prose>
          <VisualStage>
            <ElectronChain />
          </VisualStage>
          <KeyIdea>A battery doesn&apos;t supply the electrons — they&apos;re already in the wire. It supplies the push and the energy.</KeyIdea>
        </>
      ),
    },
    {
      id: "real-world",
      stage: "real-world",
      title: "Electricity in action",
      content: (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <RealWorldCard icon={Flashlight} title="A torch">
            Charge carries chemical energy from the batteries to the bulb, where it becomes light.
          </RealWorldCard>
          <RealWorldCard icon={Speaker} title="A speaker">
            Changing current moves a coil and cone, turning electrical energy into sound.
          </RealWorldCard>
          <RealWorldCard icon={Smartphone} title="Charging a phone">
            Moving charge carries energy into the phone&apos;s battery, where it&apos;s stored chemically for later.
          </RealWorldCard>
          <RealWorldCard icon={CloudLightning} title="Lightning">
            A huge, sudden flow of charge through the air — electricity without any wires.
          </RealWorldCard>
        </div>
      ),
    },
  ],
  analogy: {
    title: "A bicycle chain",
    content: (
      <p>
        Press a pedal and the back wheel turns instantly, even though each chain link moves slowly. The <strong>pedals</strong> are like
        the battery, the <strong>chain</strong> is like the electrons already in the wire, and the <strong>wheel</strong> is the lamp that uses
        the energy.
      </p>
    ),
    limits: [
      "Chain links are rigidly joined; electrons are separate and jiggle randomly while they drift.",
      "A chain can be pulled from one side; electric current needs a complete loop, as you'll see in the next lesson.",
    ],
  },
  keyTakeaway: "Electricity is the flow of electric charge — usually electrons drifting through a conductor — carrying energy from a source to a load.",
  takeaways: [
    "Free electrons jiggle randomly all the time.",
    "A battery adds a steady drift in one direction: that's a current.",
    "Electrons drift slowly, but the effect travels along the wire almost instantly.",
    "The moving charge delivers energy as light, heat, motion or sound.",
  ],
  quickCheck: [
    {
      id: "define",
      type: "multiple-choice",
      prompt: "In a wire, what is electricity?",
      options: [
        { id: "moving-charge", label: "Electric charge (electrons) moving through it" },
        { id: "heat", label: "Heat travelling along the metal" },
        { id: "light", label: "Light shining inside the wire" },
        { id: "air", label: "Air flowing through the wire" },
      ],
      correctOptionId: "moving-charge",
      explanation: "Electricity in a circuit is moving charge — in metal wires, that means free electrons drifting in one direction.",
    },
    {
      id: "battery-electrons",
      type: "true-false",
      prompt: "A battery works by filling empty wires with new electrons.",
      options: [
        { id: "true", label: "True" },
        { id: "false", label: "False" },
      ],
      correctOptionId: "false",
      explanation: "The wire is already full of free electrons. The battery provides the push (and energy) that makes them drift.",
    },
    {
      id: "instant",
      type: "predict",
      prompt: "Electrons drift at under a millimetre per second. When you flip a switch, when does a lamp 2 metres away light up?",
      options: [
        { id: "instant", label: "Almost instantly" },
        { id: "hour", label: "After about an hour" },
        { id: "minute", label: "After about a minute" },
        { id: "never", label: "Never — it's too far" },
      ],
      correctOptionId: "instant",
      explanation: "The wire is full of electrons, so the push travels along it almost instantly — like pedalling a bike moves the chain everywhere at once.",
    },
  ],
  next: {
    title: "Give the charge a path",
    description: "Charge will only keep flowing if it has a complete loop to travel around. Next: build and control your first circuit.",
    href: "/learn/electricity/what-is-a-circuit",
    cta: "Continue to Lesson 5",
  },
};
