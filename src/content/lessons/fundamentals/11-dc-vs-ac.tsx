import { ConceptCard, ConceptGrid, KeyIdea, Prose, VisualStage } from "@/components/lesson/LessonBlocks";
import { AcToDcChain } from "@/components/simulations/AcToDcChain";
import { DcAcExplorer } from "@/components/simulations/DcAcExplorer";
import { WaveformVisualizer } from "@/components/simulations/WaveformVisualizer";
import { Callout } from "@/components/ui/Callout";
import { SafetyNotice } from "@/components/ui/SafetyNotice";
import type { LessonContent } from "../types";

export const dcVsAc: LessonContent = {
  moduleSlug: "fundamentals",
  lessonSlug: "dc-vs-ac",
  objective: "Distinguish direct current (one direction) from alternating current (repeatedly reversing), and say where each is used.",
  objectives: ["Read a DC and an AC waveform", "Explain frequency in hertz"],
  buildsOn: ["Voltage", "Current"],
  sections: [
    {
      id: "two-kinds",
      stage: "concept",
      title: "One way, or back and forth?",
      content: (
        <>
          <Prose>
            <p>
              Every circuit so far has used <strong>direct current (DC)</strong>: the battery&apos;s + stays +, so current always flows the same way
              round. <strong>Alternating current (AC)</strong> keeps swapping direction — the voltage rises, falls, goes negative and comes back,
              over and over.
            </p>
          </Prose>
          <ConceptGrid columns={2}>
            <ConceptCard title="DC — direct current" accent="amber">
              Constant polarity. From batteries, USB ports, power banks and solar cells.
            </ConceptCard>
            <ConceptCard title="AC — alternating current">
              Polarity reverses many times a second. It&apos;s what the power grid delivers to wall sockets.
            </ConceptCard>
          </ConceptGrid>
        </>
      ),
    },
    {
      id: "explorer",
      stage: "experiment",
      title: "Toggle between DC and AC",
      content: (
        <>
          <Prose>
            <p>Switch between DC and AC. Watch the waveform, the charges in the wire and the lamp. With AC, try changing the frequency.</p>
          </Prose>
          <Callout kind="try" className="mt-6">
            <p>
              In AC mode, watch the charges: do they travel all the way round, or just shuffle back and forth? When is the lamp darkest?
            </p>
          </Callout>
          <VisualStage caption="AC is slowed down here so you can see it. Real mains changes direction 100–120 times every second.">
            <DcAcExplorer />
          </VisualStage>
          <ConceptGrid columns={3}>
            <ConceptCard title="Direction">DC: one way. AC: reverses every half-cycle.</ConceptCard>
            <ConceptCard title="Voltage" accent="amber">
              DC: steady. AC: sweeps from + peak to − peak and back.
            </ConceptCard>
            <ConceptCard title="Frequency">Cycles per second, in hertz (Hz). Mains is 50 Hz or 60 Hz, depending on the country.</ConceptCard>
          </ConceptGrid>
        </>
      ),
    },
    {
      id: "chargers",
      stage: "visual",
      title: "Why your phone needs a charger",
      content: (
        <>
          <Prose>
            <p>
              Power stations and the grid use AC because it&apos;s easy to change its voltage with transformers and send it over long distances.
              But electronics need steady, low-voltage DC — so chargers and power adapters convert AC into DC.
            </p>
          </Prose>
          <VisualStage>
            <AcToDcChain />
          </VisualStage>
          <KeyIdea>The grid delivers AC; nearly every electronic device runs on DC inside.</KeyIdea>
        </>
      ),
    },
    {
      id: "real-world",
      stage: "real-world",
      title: "Where you find AC and DC",
      content: (
        <>
          <ConceptGrid columns={2}>
            <ConceptCard title="DC sources" accent="amber">
              Batteries, USB, power banks, solar panels, car electrics, the inside of every phone, laptop and microcontroller.
            </ConceptCard>
            <ConceptCard title="AC sources">Household sockets and the power grid. Some motors and transformers run directly on AC.</ConceptCard>
          </ConceptGrid>
          <SafetyNotice topic="ac" className="mt-2" />
        </>
      ),
    },
  ],
  analogy: {
    title: "A conveyor belt vs a saw",
    content: (
      <p>
        DC is like a <strong>conveyor belt</strong> moving steadily in one direction. AC is like a <strong>saw</strong> cutting wood: it goes
        back and forth and never gets anywhere — but it still does useful work (and a lamp still glows) on every stroke.
      </p>
    ),
    limits: [
      "A saw's strokes are separate pushes; AC voltage changes smoothly as a wave.",
      "Energy still flows from source to load with AC — charges don't need to travel round the loop to deliver it.",
    ],
  },
  keyTakeaway: "DC flows in one direction with a steady polarity; AC repeatedly reverses direction — mains AC does it 50 or 60 times a second.",
  takeaways: [
    "DC: constant polarity — batteries, USB, power banks.",
    "AC: alternating polarity — household mains.",
    "Frequency is cycles per second, measured in hertz (Hz).",
    "Chargers convert mains AC into the low-voltage DC that electronics need.",
  ],
  quickCheck: [
    {
      id: "identify-wave",
      type: "identify",
      prompt: "This oscilloscope trace is a flat line that stays above 0 V. What kind of supply is it?",
      visual: <WaveformVisualizer kind="dc" amplitude={9} frequency={1} time={0} />,
      options: [
        { id: "dc", label: "DC" },
        { id: "ac", label: "AC" },
      ],
      correctOptionId: "dc",
      explanation: "A steady line that never crosses 0 V means constant polarity — direct current, like a battery.",
    },
    {
      id: "battery-ac",
      type: "true-false",
      prompt: "A battery supplies alternating current.",
      options: [
        { id: "true", label: "True" },
        { id: "false", label: "False" },
      ],
      correctOptionId: "false",
      explanation: "A battery's + terminal always stays +, so it supplies direct current.",
    },
    {
      id: "frequency",
      type: "multiple-choice",
      prompt: "Mains electricity is 50 Hz in many countries. What does “50 Hz” mean?",
      options: [
        { id: "cycles", label: "It completes 50 back-and-forth cycles every second" },
        { id: "volts", label: "It is 50 volts" },
        { id: "amps", label: "It can supply 50 amps" },
        { id: "minutes", label: "It changes direction every 50 minutes" },
      ],
      correctOptionId: "cycles",
      explanation: "Hertz means cycles per second. At 50 Hz the voltage swings through 50 full cycles — reversing 100 times — every second.",
    },
  ],
  next: {
    title: "Back to the loop",
    description: "Whether it's AC or DC, current needs a complete path. Next, go hunting for the gaps that open a circuit.",
    href: "/learn/fundamentals/open-vs-closed-circuits",
    cta: "Continue to Lesson 12",
  },
};
