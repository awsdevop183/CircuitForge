import { ConceptCard, ConceptGrid, KeyIdea, Prose, VisualStage } from "@/components/lesson/LessonBlocks";
import { MagnitudeScale } from "@/components/lessons/shared/MagnitudeScale";
import { TerminalProbe } from "@/components/lessons/voltage/TerminalProbe";
import { VoltageExplorer } from "@/components/lessons/voltage/VoltageExplorer";
import { WaterTankAnalogy } from "@/components/lessons/voltage/WaterTankAnalogy";
import { Callout } from "@/components/ui/Callout";
import type { LessonContent } from "./types";

export const voltage: LessonContent = {
  moduleSlug: "electricity",
  lessonSlug: "voltage",
  objectives: [
    "Explain voltage as a potential difference between two points",
    "Identify a battery's positive and negative terminals",
    "Predict how a bigger voltage changes a circuit",
  ],
  sections: [
    {
      id: "what-is-voltage",
      stage: "concept",
      title: "Voltage is the push",
      content: (
        <>
          <Prose>
            <p>
              In the last lesson, charge flowed around a closed loop. But something has to <strong>push</strong> it. That push is
              called <strong>voltage</strong>, measured in <strong>volts (V)</strong>.
            </p>
            <p>
              Voltage is a <strong>difference</strong>: how much more electrical &ldquo;pressure&rdquo; one point has than another. Think of
              two water tanks joined by a pipe.
            </p>
          </Prose>
          <Callout kind="tip" title="Analogy" className="mt-6">
            <p>Drag the slider. Water only flows when one tank is higher than the other — and flows faster the bigger the difference.</p>
          </Callout>
          <VisualStage>
            <WaterTankAnalogy />
          </VisualStage>
          <KeyIdea>Voltage is a potential difference: it always compares two points.</KeyIdea>
        </>
      ),
    },
    {
      id: "terminals",
      stage: "visual",
      title: "Positive and negative terminals",
      content: (
        <>
          <Prose>
            <p>
              A battery is a <strong>voltage source</strong>. Chemistry inside it crowds electrons at the <strong>negative (−)</strong>{" "}
              terminal and draws them away from the <strong>positive (+)</strong> terminal. That imbalance is the voltage.
            </p>
            <p>Move the voltmeter probes and see what it measures.</p>
          </Prose>
          <VisualStage>
            <TerminalProbe />
          </VisualStage>
          <ConceptGrid columns={3}>
            <ConceptCard title="Voltage source">Anything that creates a steady voltage: batteries, USB ports, solar cells, power supplies.</ConceptCard>
            <ConceptCard title="Positive (+)" accent="amber">
              The higher-potential terminal. Conventional current leaves from here.
            </ConceptCard>
            <ConceptCard title="Negative (−)">The lower-potential terminal, where electrons are crowded and ready to be pushed out.</ConceptCard>
          </ConceptGrid>
        </>
      ),
    },
    {
      id: "voltage-explorer",
      stage: "experiment",
      title: "Turn up the voltage",
      content: (
        <>
          <Prose>
            <p>
              Here&apos;s a real circuit: a battery, a switch and a 12 V bulb. Step the battery from 1 V up to 12 V and watch the
              charge speed up and the bulb brighten.
            </p>
          </Prose>
          <Callout kind="try" className="mt-6">
            <p>
              Set 12 V, then <strong>open the switch</strong>. The voltmeter still reads 12 V — but does anything flow? Voltage causes
              current <em>only when there is a path</em>.
            </p>
          </Callout>
          <VisualStage>
            <VoltageExplorer />
          </VisualStage>
          <ConceptGrid columns={2}>
            <ConceptCard title="More voltage">A harder push moves more charge through the same bulb each second: brighter light.</ConceptCard>
            <ConceptCard title="No path" accent="amber">
              The push is still there, waiting. The moment you close the circuit, current flows.
            </ConceptCard>
          </ConceptGrid>
        </>
      ),
    },
    {
      id: "everyday-voltages",
      stage: "real-world",
      title: "Voltages around you",
      content: (
        <>
          <Prose>
            <p>From a watch battery to the wall socket, voltages span a huge range. Higher voltage can push current through your body — which is what makes it dangerous.</p>
          </Prose>
          <div className="mt-6">
            <MagnitudeScale
              label="Common voltages"
              domain={[1, 400]}
              tone="amber"
              items={[
                { label: "AA battery", value: 1.5, display: "1.5 V", note: "Remote controls, toys, clocks" },
                { label: "Phone battery", value: 3.7, display: "3.7 V", note: "A lithium-ion cell" },
                { label: "USB port", value: 5, display: "5 V", note: "Also what an Arduino runs on" },
                { label: "Car battery", value: 12, display: "12 V", note: "Lights, radio and the starter motor" },
                { label: "Laptop charger", value: 20, display: "20 V", note: "USB-C power delivery" },
                { label: "Wall socket", value: 230, display: "120–230 V", note: "Never experiment with mains electricity", danger: true },
              ]}
            />
          </div>
          <Callout kind="warning" className="mt-6">
            <p>Everything in CircuitForge&apos;s early lessons uses safe, low voltages (under 12 V). Never open or experiment with mains-powered equipment.</p>
          </Callout>
        </>
      ),
    },
  ],
  takeaways: [
    "Voltage is the electrical push, measured in volts (V).",
    "Voltage is always a difference between two points — a potential difference.",
    "A battery has a positive (+) and a negative (−) terminal.",
    "Voltage causes current only when there is a complete path.",
  ],
  quickCheck: [
    {
      id: "q-voltage-meaning",
      prompt: "What does voltage describe?",
      options: [
        { id: "amount", label: "How many electrons are in a wire" },
        { id: "difference", label: "The electrical push between two points" },
        { id: "speed", label: "The speed of light in a wire" },
        { id: "heat", label: "How hot a wire gets" },
      ],
      correctOptionId: "difference",
      explanation: "Voltage is a potential difference — the push between two points.",
    },
    {
      id: "q-open-switch-voltage",
      prompt: "A 9 V battery is connected to a bulb, but the switch is open. What does a voltmeter across the battery read?",
      options: [
        { id: "zero", label: "0 V" },
        { id: "nine", label: "9 V" },
        { id: "half", label: "4.5 V" },
        { id: "unknown", label: "It can't be measured" },
      ],
      correctOptionId: "nine",
      explanation: "The battery still has its full voltage. It just has no path to push current through.",
    },
    {
      id: "q-more-voltage",
      prompt: "You swap a 5 V supply for a 12 V one in the same circuit. What happens to the current?",
      options: [
        { id: "increases", label: "It increases" },
        { id: "decreases", label: "It decreases" },
        { id: "same", label: "It stays the same" },
        { id: "stops", label: "It stops" },
      ],
      correctOptionId: "increases",
      explanation: "A bigger push through the same bulb drives more current — the bulb gets brighter.",
    },
  ],
  next: {
    title: "How much is flowing?",
    description: "Voltage is the push. Next, measure what it produces — current — and meet the one equation that ties everything together.",
    href: "/learn/electricity/current",
    cta: "Continue to Current",
  },
};
