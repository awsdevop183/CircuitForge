import { Gamepad2, LampDesk, Speaker, Thermometer } from "lucide-react";
import { ComponentIntro } from "@/components/component-lab/ComponentIntro";
import { PotentiometerLab } from "@/components/component-lab/PotentiometerLab";
import { KeyIdea, Prose, VisualStage } from "@/components/lesson/LessonBlocks";
import { Callout } from "@/components/ui/Callout";
import type { LessonContent } from "../types";
import { mistakesFor } from "./shared";

export const potentiometerLesson: LessonContent = {
  moduleSlug: "components",
  lessonSlug: "potentiometer",
  objective: "Use a potentiometer as an adjustable voltage divider and as a brightness control.",
  objectives: ["Identify the three pins", "Relate knob position to output voltage"],
  buildsOn: ["The resistor (voltage dividers)"],
  sections: [
    {
      id: "see-it",
      stage: "concept",
      title: "See the potentiometer",
      content: (
        <>
          <ComponentIntro slug="potentiometer" />
          <Prose>
            <p>
              A potentiometer (&ldquo;pot&rdquo;) is a resistive track with a sliding contact, the <strong>wiper</strong>. The two outer pins
              connect to the ends of the track; the middle pin is the wiper. Turning the knob moves the wiper — making an adjustable voltage
              divider.
            </p>
          </Prose>
        </>
      ),
    },
    {
      id: "turn-the-knob",
      stage: "experiment",
      title: "Turn the knob",
      content: (
        <>
          <Callout kind="try">
            <p>Drag the knob (or use the arrow keys). At 50%, what is the output voltage? Then switch to the LED dimmer.</p>
          </Callout>
          <VisualStage>
            <PotentiometerLab />
          </VisualStage>
          <KeyIdea>Output voltage = supply × knob position. At 0% you get 0 V; at 100% the full supply.</KeyIdea>
        </>
      ),
    },
  ],
  analogy: {
    title: "A slide on a hill",
    content: <p>Imagine the track as a hill from 9 V at the top to 0 V at the bottom. The wiper is where you stand: the higher you stand, the more voltage you pick off.</p>,
    limits: ["Drawing a lot of current from the wiper changes the voltage — the divider only works well with a light load.", "A pot is a resistor, so it wastes energy as heat; it's not a good way to control big loads."],
  },
  whereFound: [
    { icon: Speaker, place: "Volume knobs", detail: "The classic potentiometer: turn to set the signal level." },
    { icon: Gamepad2, place: "Joysticks", detail: "Two pots measure the stick's X and Y position." },
    { icon: LampDesk, place: "Dimmers", detail: "Set the brightness of a lamp or LED driver." },
    { icon: Thermometer, place: "Thermostats", detail: "Set the target temperature." },
  ],
  mistakes: mistakesFor("potentiometer"),
  safety: ["ratings"],
  keyTakeaway: "A potentiometer is a resistor with a moving wiper — an adjustable voltage divider that turns a knob position into a voltage.",
  takeaways: ["Three pins: two ends and the wiper.", "Vout = Vsupply × position.", "Keep a fixed resistor in series with an LED.", "Great as an input; not for switching big loads."],
  quickCheck: [
    {
      id: "half",
      type: "multiple-choice",
      prompt: "A pot is connected across 5 V. The knob is at 50%. What is the wiper voltage?",
      options: [
        { id: "2.5", label: "2.5 V" },
        { id: "5", label: "5 V" },
        { id: "0", label: "0 V" },
        { id: "1", label: "1 V" },
      ],
      correctOptionId: "2.5",
      explanation: "Halfway along the track, the wiper sits halfway between 0 V and 5 V.",
    },
    {
      id: "wiper",
      type: "identify",
      prompt: "Which pin of a potentiometer is the wiper?",
      options: [
        { id: "middle", label: "The middle pin" },
        { id: "left", label: "The left pin" },
        { id: "right", label: "The right pin" },
      ],
      correctOptionId: "middle",
      explanation: "The outer pins go to the ends of the track; the middle pin is the moving wiper.",
    },
  ],
  next: {
    title: "Switches",
    description: "Toggle, push-to-make and push-to-break — the simplest input of all.",
    href: "/learn/components/switches",
    cta: "Try the switches",
  },
};
