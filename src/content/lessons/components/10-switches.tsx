import { BellRing, Keyboard, LampCeiling, Refrigerator } from "lucide-react";
import { ComponentIntro } from "@/components/component-lab/ComponentIntro";
import { SwitchLab } from "@/components/component-lab/SwitchLab";
import { ComponentSymbol } from "@/components/explorer/ComponentSymbol";
import { ConceptCard, ConceptGrid, KeyIdea, VisualStage } from "@/components/lesson/LessonBlocks";
import { Callout } from "@/components/ui/Callout";
import type { LessonContent } from "../types";
import { mistakesFor } from "./shared";

export const switchesLesson: LessonContent = {
  moduleSlug: "components",
  lessonSlug: "switches",
  objective: "Describe open and closed switches, and choose between toggle, normally-open and normally-closed switches.",
  objectives: ["Read NO and NC symbols", "Tell latching from momentary switches"],
  buildsOn: ["Open vs closed circuits"],
  sections: [
    {
      id: "see-it",
      stage: "concept",
      title: "See the switch",
      content: (
        <>
          <ComponentIntro slug="switch" />
          <ConceptGrid columns={3}>
            <ConceptCard title="Toggle" visual={<ComponentSymbol slug="switch" className="h-12 w-auto" />}>
              Latching: stays where you put it.
            </ConceptCard>
            <ConceptCard title="Push, normally open" accent="amber" visual={<ComponentSymbol slug="push-no" className="h-12 w-auto" />}>
              Momentary: closed only while pressed.
            </ConceptCard>
            <ConceptCard title="Push, normally closed" visual={<ComponentSymbol slug="push-nc" className="h-12 w-auto" />}>
              Momentary: open only while pressed.
            </ConceptCard>
          </ConceptGrid>
        </>
      ),
    },
    {
      id: "switch-lab",
      stage: "experiment",
      title: "Put each switch in the circuit",
      content: (
        <>
          <Callout kind="try">
            <p>Try all three switches. Which one turns the LED <em>off</em> while you hold it?</p>
          </Callout>
          <VisualStage>
            <SwitchLab />
          </VisualStage>
          <KeyIdea>Closed = complete path = current flows. Open = gap = no current. Every switch is just a controllable gap.</KeyIdea>
        </>
      ),
    },
  ],
  analogy: {
    title: "A drawbridge",
    content: <p>A switch is like a drawbridge on the only road around a loop: down (closed), traffic flows; up (open), nothing gets round.</p>,
    limits: ["Real contacts “bounce” for a few milliseconds when they close — important for digital circuits.", "Switches have current and voltage ratings; exceed them and the contacts can arc and weld."],
  },
  whereFound: [
    { icon: LampCeiling, place: "Light switches", detail: "Toggle switches: they stay on or off." },
    { icon: BellRing, place: "Doorbells", detail: "Push-to-make: rings only while pressed." },
    { icon: Refrigerator, place: "Fridge lights", detail: "Push-to-break: the closed door presses the switch open." },
    { icon: Keyboard, place: "Keyboards", detail: "Every key is a tiny momentary switch." },
  ],
  mistakes: mistakesFor("switch"),
  safety: ["short-circuit"],
  keyTakeaway: "A switch opens or closes a gap in a circuit. Toggles latch; push buttons are momentary — normally open or normally closed.",
  takeaways: ["Closed = current flows; open = no current.", "Toggle = latching; push button = momentary.", "NO closes when pressed; NC opens when pressed.", "Never wire a switch straight across a battery."],
  quickCheck: [
    {
      id: "doorbell",
      type: "multiple-choice",
      prompt: "Which switch suits a doorbell?",
      options: [
        { id: "no", label: "Push button, normally open" },
        { id: "nc", label: "Push button, normally closed" },
        { id: "toggle", label: "Toggle switch" },
      ],
      correctOptionId: "no",
      explanation: "The bell should ring only while pressed: a normally-open push button closes the circuit only while held.",
    },
    {
      id: "nc-press",
      type: "predict",
      prompt: "An LED is wired through a normally-closed push button. You press and hold the button. What happens?",
      options: [
        { id: "off", label: "The LED turns off" },
        { id: "on", label: "The LED turns on" },
        { id: "blink", label: "The LED blinks" },
      ],
      correctOptionId: "off",
      explanation: "An NC button is closed until pressed. Pressing it opens the circuit, so the LED goes out.",
    },
    {
      id: "short",
      type: "true-false",
      prompt: "Wiring a switch directly across a battery's terminals (with nothing else) is safe.",
      options: [
        { id: "true", label: "True" },
        { id: "false", label: "False" },
      ],
      correctOptionId: "false",
      explanation: "Closing it would short-circuit the battery: a huge current, hot wires and a possible fire. Always switch a load.",
    },
  ],
  next: {
    title: "The battery",
    description: "Voltage, capacity — and why the battery doesn't decide the current.",
    href: "/learn/components/battery",
    cta: "Explore batteries",
  },
};
