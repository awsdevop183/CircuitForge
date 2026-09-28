import { Car, Factory, House, WashingMachine } from "lucide-react";
import { ComponentIntro } from "@/components/component-lab/ComponentIntro";
import { RelayDemo } from "@/components/component-lab/RelayDemo";
import { ConceptCard, ConceptGrid, KeyIdea, Prose, VisualStage } from "@/components/lesson/LessonBlocks";
import { Callout } from "@/components/ui/Callout";
import type { LessonContent } from "../types";
import { mistakesFor } from "./shared";

export const relayLesson: LessonContent = {
  moduleSlug: "components",
  lessonSlug: "relay",
  objective: "Explain how a relay's coil moves its contacts so a low-voltage circuit can switch a completely separate load circuit.",
  objectives: ["Name the COM, NO and NC contacts", "Explain electrical isolation"],
  buildsOn: ["The transistor", "Switches"],
  sections: [
    {
      id: "see-it",
      stage: "concept",
      title: "See the relay",
      content: (
        <>
          <ComponentIntro slug="relay" />
          <Prose>
            <p>
              Inside a relay is an <strong>electromagnet (coil)</strong> and a springy metal arm. Current through the coil pulls the arm across,
              moving the common contact (<strong>COM</strong>) away from <strong>NC</strong> (normally closed) and onto{" "}
              <strong>NO</strong> (normally open).
            </p>
          </Prose>
        </>
      ),
    },
    {
      id: "two-circuits",
      stage: "experiment",
      title: "A control circuit and a load circuit",
      content: (
        <>
          <Callout kind="try">
            <p>Close the control switch and watch the armature move. Then wire the lamp to NC instead of NO — what changes?</p>
          </Callout>
          <VisualStage>
            <RelayDemo />
          </VisualStage>
          <KeyIdea>The coil circuit and the contact circuit share no wires. That separation — isolation — is the relay&apos;s superpower.</KeyIdea>
        </>
      ),
    },
    {
      id: "states",
      stage: "visual",
      title: "Coil off vs coil on",
      content: (
        <ConceptGrid columns={2}>
          <ConceptCard title="Coil OFF">Spring holds the arm: COM–NC closed, COM–NO open. A lamp on NO is off.</ConceptCard>
          <ConceptCard title="Coil ON" accent="amber">Magnet pulls the arm: COM–NO closed, COM–NC open. A lamp on NO is on.</ConceptCard>
        </ConceptGrid>
      ),
    },
  ],
  analogy: {
    title: "A remote-controlled light switch",
    content: <p>A relay is a light switch with a tiny robot finger. You send the robot a small signal; it flips a switch in a different room, on a different circuit.</p>,
    limits: ["The “finger” needs power the whole time it holds the switch on — the coil draws current continuously.", "Unlike a robot, a relay has only two positions: energised or not."],
  },
  whereFound: [
    { icon: Car, place: "Cars", detail: "Relays let small dashboard switches control headlights, horns and starter motors." },
    { icon: House, place: "Smart home plugs", detail: "A microcontroller switches the plug on and off through a relay." },
    { icon: WashingMachine, place: "Appliances", detail: "Switch heaters and pumps from the control board." },
    { icon: Factory, place: "Industry", detail: "Control panels full of relays switch machines safely." },
  ],
  mistakes: mistakesFor("relay"),
  safety: ["mains", "general"],
  keyTakeaway: "A relay uses a small current through a coil to move metal contacts, switching a separate, electrically isolated circuit.",
  takeaways: ["Coil = control side; COM/NO/NC = load side.", "NO closes when energised; NC opens.", "Needs a transistor driver and a flyback diode from a microcontroller.", "Beginners: switch only low-voltage battery loads — never mains."],
  quickCheck: [
    {
      id: "no",
      type: "predict",
      prompt: "A lamp is wired to the NO contact. The coil is energised. What does the lamp do?",
      options: [
        { id: "on", label: "Turns on" },
        { id: "off", label: "Turns off" },
        { id: "flicker", label: "Flickers" },
      ],
      correctOptionId: "on",
      explanation: "Energising the coil pulls COM onto NO, closing the lamp's circuit.",
    },
    {
      id: "isolation",
      type: "multiple-choice",
      prompt: "What is the main advantage of a relay's isolation?",
      options: [
        { id: "separate", label: "The control and load circuits share no electrical connection" },
        { id: "fast", label: "It switches faster than a transistor" },
        { id: "silent", label: "It is completely silent" },
        { id: "free", label: "The coil needs no power" },
      ],
      correctOptionId: "separate",
      explanation: "The only link between coil and contacts is magnetic, so a low-voltage controller is kept apart from the load circuit.",
    },
    {
      id: "nc",
      type: "true-false",
      prompt: "An NC contact is closed while the coil is off.",
      options: [
        { id: "true", label: "True" },
        { id: "false", label: "False" },
      ],
      correctOptionId: "true",
      explanation: "“Normally closed” means closed in the normal (unpowered) state.",
    },
  ],
  next: {
    title: "The potentiometer",
    description: "A knob you can turn to pick any voltage — an input device made from a resistor.",
    href: "/learn/components/potentiometer",
    cta: "Turn the knob",
  },
};
