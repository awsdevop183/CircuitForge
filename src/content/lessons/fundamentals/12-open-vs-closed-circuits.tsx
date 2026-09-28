import { DoorClosed, Lightbulb, ShieldCheck, ToggleRight } from "lucide-react";
import { ConceptCard, ConceptGrid, KeyIdea, Prose, RealWorldCard, VisualStage } from "@/components/lesson/LessonBlocks";
import { CircuitExplorer } from "@/components/simulations/CircuitExplorer";
import { Callout } from "@/components/ui/Callout";
import type { LessonContent } from "../types";

export const openVsClosedCircuits: LessonContent = {
  moduleSlug: "fundamentals",
  lessonSlug: "open-vs-closed-circuits",
  objective: "Explain the difference between open and closed circuits and find what breaks a circuit.",
  objectives: ["Recognise the ways a circuit can open", "Explain why one gap stops current everywhere"],
  buildsOn: ["What is a circuit?", "Voltage", "Current"],
  sections: [
    {
      id: "open-closed",
      stage: "concept",
      title: "Closed means complete",
      content: (
        <>
          <Prose>
            <p>
              A <strong>closed circuit</strong> has a complete, unbroken loop: current flows. An <strong>open circuit</strong> has a gap
              somewhere: current stops — everywhere in the loop, not just after the gap.
            </p>
          </Prose>
          <ConceptGrid columns={2}>
            <ConceptCard title="Closed circuit">Complete path → current flows → the load works.</ConceptCard>
            <ConceptCard title="Open circuit" accent="amber">
              Any gap → no current anywhere → the load stops. The battery&apos;s voltage is still there, waiting across the gap.
            </ConceptCard>
          </ConceptGrid>
          <KeyIdea>“Closed” sounds like “off”, but in electronics a closed switch is ON — it closes the gap.</KeyIdea>
        </>
      ),
    },
    {
      id: "fault-finder",
      stage: "experiment",
      title: "Cut the wires",
      content: (
        <>
          <Prose>
            <p>
              This circuit has a switch — and every wire can be cut. Close the switch, then cut wires in different places and see what happens
              to the LED.
            </p>
          </Prose>
          <Callout kind="try" className="mt-6">
            <p>
              Close the switch so the LED lights. Cut the return wire at the bottom — far from the LED. Does it matter where the break is? Now
              repair it and open the switch instead.
            </p>
          </Callout>
          <VisualStage>
            <CircuitExplorer parts={{ switch: true, resistor: true, led: true }} breakable title="Circuit with breakable wires" />
          </VisualStage>
        </>
      ),
    },
    {
      id: "ways-to-open",
      stage: "visual",
      title: "Ways a circuit opens",
      content: (
        <ConceptGrid columns={4}>
          <ConceptCard title="Switch" accent="amber">
            On purpose: that&apos;s what switches are for.
          </ConceptCard>
          <ConceptCard title="Broken wire">A snapped wire or cracked circuit-board track.</ConceptCard>
          <ConceptCard title="Loose connection" accent="amber">
            A lead that isn&apos;t pushed fully into the breadboard.
          </ConceptCard>
          <ConceptCard title="Blown fuse">A safety device that opens on purpose when current is too high.</ConceptCard>
        </ConceptGrid>
      ),
    },
    {
      id: "real-world",
      stage: "real-world",
      title: "Open and closed around you",
      content: (
        <div className="grid gap-3 sm:grid-cols-2">
          <RealWorldCard icon={ToggleRight} title="Light switches">
            On = closed circuit; off = open circuit.
          </RealWorldCard>
          <RealWorldCard icon={DoorClosed} title="Door and window alarms">
            A magnet keeps a switch closed; open the door and the circuit opens, triggering the alarm.
          </RealWorldCard>
          <RealWorldCard icon={Lightbulb} title="Old fairy lights">
            Bulbs in one long loop: one failed bulb opened the circuit and the whole string went dark.
          </RealWorldCard>
          <RealWorldCard icon={ShieldCheck} title="Fuses and breakers">
            They deliberately open the circuit when something goes wrong — more on that next lesson.
          </RealWorldCard>
        </div>
      ),
    },
  ],
  analogy: {
    title: "A drawbridge on a ring road",
    content: (
      <p>
        Cars circle a ring road. Raise a <strong>drawbridge</strong> anywhere on it and the traffic stops all the way round. The switch is
        the drawbridge; lowering it (closing the circuit) lets traffic flow again.
      </p>
    ),
    limits: [
      "Cars on the far side of a raised bridge keep driving for a while; in a circuit the current stops everywhere almost instantly.",
      "A raised bridge is empty space; an open switch still has the full battery voltage across its gap.",
    ],
  },
  keyTakeaway: "A closed circuit has a complete path so current flows; any gap opens the circuit and stops current everywhere in the loop.",
  takeaways: [
    "Closed = complete loop = current flows.",
    "Open = a gap anywhere = no current anywhere.",
    "Switches, broken wires, loose connections and fuses all open circuits.",
    "An open circuit still has voltage across the gap.",
  ],
  quickCheck: [
    {
      id: "cut-far",
      type: "predict",
      prompt: "An LED circuit is working. You cut the return wire on the far side of the loop from the LED. What happens?",
      options: [
        { id: "off", label: "The LED goes off" },
        { id: "on", label: "The LED stays on — the break is far away" },
        { id: "dim", label: "The LED dims slightly" },
      ],
      correctOptionId: "off",
      explanation: "A single loop needs every part intact. A break anywhere opens the circuit, so the current — and the LED — stop.",
    },
    {
      id: "voltage-gap",
      type: "true-false",
      prompt: "In an open circuit, there can still be a voltage across the gap.",
      options: [
        { id: "true", label: "True" },
        { id: "false", label: "False" },
      ],
      correctOptionId: "true",
      explanation: "The battery's push is still there. A voltmeter across an open switch reads the full battery voltage — there's just no path for current.",
    },
    {
      id: "closed-switch",
      type: "multiple-choice",
      prompt: "A switch is “closed”. What does that mean?",
      options: [
        { id: "on", label: "Its contacts touch, so current can flow (ON)" },
        { id: "off", label: "It blocks current (OFF)" },
        { id: "broken", label: "It's broken" },
      ],
      correctOptionId: "on",
      explanation: "A closed switch closes the gap in the circuit — its contacts touch and current flows. An open switch leaves a gap.",
    },
  ],
  next: {
    title: "When the path is too easy",
    description: "A gap stops current. The opposite problem is a path with almost no resistance at all. Next: short circuits.",
    href: "/learn/fundamentals/short-circuit",
    cta: "Continue to Lesson 13",
  },
};
