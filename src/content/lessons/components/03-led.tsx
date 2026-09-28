import { Car, Flashlight, MonitorSmartphone, TrafficCone } from "lucide-react";
import { ComponentIntro } from "@/components/component-lab/ComponentIntro";
import { LedCircuitLab } from "@/components/component-lab/LedCircuitLab";
import { LedAnatomy } from "@/components/explorer/deep-dives/LedDeepDive";
import { KeyIdea, Prose, VisualStage } from "@/components/lesson/LessonBlocks";
import { FormulaDisplay } from "@/components/lab/FormulaDisplay";
import { Callout } from "@/components/ui/Callout";
import type { LessonContent } from "../types";
import { mistakesFor } from "./shared";

export const ledLesson: LessonContent = {
  moduleSlug: "components",
  lessonSlug: "led",
  objective: "Light an LED safely by choosing a series resistor, and explain why an LED without one burns out.",
  objectives: ["Identify the anode and cathode", "Calculate R = (Vsupply − Vf) ÷ I"],
  buildsOn: ["The resistor"],
  sections: [
    {
      id: "see-it",
      stage: "concept",
      title: "See the LED",
      content: (
        <>
          <ComponentIntro slug="led" />
          <Prose>
            <p>
              An LED (light-emitting diode) only works one way round. Current goes <strong>in at the anode</strong> (long leg) and{" "}
              <strong>out at the cathode</strong> (short leg, flat edge). It also uses up a fixed-ish voltage — about 2 V for red.
            </p>
          </Prose>
          <VisualStage>
            <LedAnatomy />
          </VisualStage>
        </>
      ),
    },
    {
      id: "led-circuit",
      stage: "experiment",
      title: "Battery → resistor → LED",
      content: (
        <>
          <Prose>
            <p>Change the voltage and the resistor. Watch the brightness, the current and the safety meter. Then remove the resistor.</p>
          </Prose>
          <Callout kind="try" className="mt-6">
            <p>Find a setting that gives 10–20 mA. Then press “Remove the resistor” — what happens to the current?</p>
          </Callout>
          <VisualStage>
            <LedCircuitLab />
          </VisualStage>
        </>
      ),
    },
    {
      id: "choose-resistor",
      stage: "visual",
      title: "Choosing the resistor",
      content: (
        <>
          <Prose>
            <p>
              The resistor gets whatever voltage the LED doesn&apos;t use. For a red LED (2 V) on 9 V, aiming for 20 mA:
            </p>
          </Prose>
          <div className="panel my-6 rounded-2xl p-6">
            <FormulaDisplay
              label="Series resistor for an LED"
              result={{ symbol: "R", value: "350 Ω → use 390 Ω", tone: "amber" }}
              expression={["(", { symbol: "V", value: "9 V", tone: "electric" }, "−", { symbol: "Vf", value: "2 V", tone: "electric" }, ")", "÷", { symbol: "I", value: "0.02 A", tone: "cyan" }]}
            />
            <p className="mt-4 text-center text-sm text-ink-muted">Round up to the next standard value (390 Ω) so the current stays a little under 20 mA.</p>
          </div>
          <KeyIdea>Too little resistance means too much current. An LED with no resistor is almost like a short circuit.</KeyIdea>
        </>
      ),
    },
  ],
  analogy: {
    title: "A one-way turnstile that glows",
    content: <p>An LED is like a turnstile that only turns one way and lights up when people pass through. Push too many people through at once and it breaks.</p>,
    limits: ["An LED needs a minimum voltage (its forward voltage) before any current flows at all.", "Above that, current rises very steeply — that's why a resistor is essential."],
  },
  whereFound: [
    { icon: MonitorSmartphone, place: "Screens", detail: "Phone and TV backlights use many white LEDs." },
    { icon: Flashlight, place: "Torches and bulbs", detail: "LED bulbs use far less power than old filament bulbs." },
    { icon: TrafficCone, place: "Traffic lights", detail: "Bright, efficient, and last for years." },
    { icon: Car, place: "Car lights", detail: "Indicators, brake lights and dashboards." },
  ],
  mistakes: mistakesFor("led"),
  safety: ["polarity", "ratings"],
  keyTakeaway: "An LED needs current to flow the right way through it, and a series resistor to limit that current to a safe value (about 5–20 mA).",
  takeaways: ["Long leg = anode (+), flat edge = cathode (−).", "Red LEDs use about 2 V; blue and white about 3 V.", "R = (Vsupply − Vf) ÷ I.", "No resistor = burnt LED."],
  quickCheck: [
    {
      id: "no-resistor",
      type: "predict",
      prompt: "You connect a red LED directly to a 9 V battery with no resistor. What happens?",
      options: [
        { id: "burn", label: "Far too much current — it burns out" },
        { id: "bright", label: "It is just a bit brighter" },
        { id: "off", label: "It stays off" },
      ],
      correctOptionId: "burn",
      explanation: "Nothing limits the current except tiny wire and battery resistance, so the current rises far past the LED's ~30 mA limit.",
    },
    {
      id: "calc",
      type: "multiple-choice",
      prompt: "A 5 V supply, a red LED (2 V) and a target of 10 mA. Which resistor?",
      options: [
        { id: "300", label: "300 Ω" },
        { id: "500", label: "500 Ω" },
        { id: "30", label: "30 Ω" },
        { id: "3000", label: "3 kΩ" },
      ],
      correctOptionId: "300",
      explanation: "(5 − 2) V ÷ 0.01 A = 300 Ω. The nearest common value is 330 Ω — slightly less current, which is fine.",
    },
    {
      id: "reversed",
      type: "true-false",
      prompt: "If an LED is put in backwards, it still lights, just more dimly.",
      options: [
        { id: "true", label: "True" },
        { id: "false", label: "False" },
      ],
      correctOptionId: "false",
      explanation: "A reversed LED blocks current like any diode, so it stays completely dark.",
    },
  ],
  next: {
    title: "The capacitor",
    description: "A component that stores charge — and takes time to fill up.",
    href: "/learn/components/capacitor",
    cta: "Charge a capacitor",
  },
};
