import { Drone, Laptop, LampDesk, Zap } from "lucide-react";
import { ComponentIntro } from "@/components/component-lab/ComponentIntro";
import { MosfetSwitch } from "@/components/component-lab/MosfetSwitch";
import { ConceptCard, ConceptGrid, KeyIdea, Prose, VisualStage } from "@/components/lesson/LessonBlocks";
import { Callout } from "@/components/ui/Callout";
import type { LessonContent } from "../types";
import { mistakesFor } from "./shared";

export const mosfetLesson: LessonContent = {
  moduleSlug: "components",
  lessonSlug: "mosfet",
  objective: "Use an N-channel MOSFET to let a microcontroller switch a motor, and explain the gate, drain and source.",
  objectives: ["Explain why the gate needs a pull-down", "Add a flyback diode across a motor", "Know what to check when choosing a MOSFET"],
  buildsOn: ["The transistor", "The diode"],
  sections: [
    {
      id: "see-it",
      stage: "concept",
      title: "See the MOSFET",
      content: (
        <>
          <ComponentIntro slug="mosfet" />
          <ConceptGrid columns={3}>
            <ConceptCard title="Gate (G)">The control input. A voltage here — not a current — switches the MOSFET.</ConceptCard>
            <ConceptCard title="Drain (D)" accent="amber">Connects to the load (the motor). The big current flows in here.</ConceptCard>
            <ConceptCard title="Source (S)">Connects to 0 V (ground). The big current flows out here.</ConceptCard>
          </ConceptGrid>
        </>
      ),
    },
    {
      id: "motor-driver",
      stage: "experiment",
      title: "Microcontroller → MOSFET → motor",
      content: (
        <>
          <Callout kind="try">
            <p>Set the GPIO pin HIGH and LOW. Notice how little current the gate takes compared with the motor.</p>
          </Callout>
          <VisualStage>
            <MosfetSwitch />
          </VisualStage>
          <KeyIdea>The gate is insulated, so once it is charged it draws almost no current. A 3.3 V pin can switch amps.</KeyIdea>
        </>
      ),
    },
    {
      id: "good-practice",
      stage: "visual",
      title: "Gate drive, protection and selection",
      content: (
        <>
          <Prose>
            <p>Three small extras make a MOSFET circuit reliable:</p>
          </Prose>
          <ConceptGrid columns={3}>
            <ConceptCard title="Gate resistor + pull-down">~100 Ω in series tames switching spikes; 10 kΩ to ground keeps the gate OFF when the pin is floating (e.g. during start-up).</ConceptCard>
            <ConceptCard title="Flyback diode" accent="amber">Across the motor, it absorbs the voltage spike the coil produces when switched off.</ConceptCard>
            <ConceptCard title="Choose it right">Check it is “logic-level” (fully on at 3.3 V or 5 V), and that its drain voltage and current ratings exceed your load.</ConceptCard>
          </ConceptGrid>
        </>
      ),
    },
  ],
  analogy: {
    title: "A drawbridge controlled by a button",
    content: <p>The gate is a button that lowers a drawbridge. Pressing it takes almost no effort, but once the bridge is down, heavy traffic (current) crosses freely from drain to source.</p>,
    limits: ["A gate that is left unconnected can “half-press” itself from stray charge — hence the pull-down resistor.", "When on, a MOSFET still has a small resistance, so large currents make heat."],
  },
  whereFound: [
    { icon: Drone, place: "Drones", detail: "MOSFETs switch the motor currents thousands of times per second." },
    { icon: LampDesk, place: "LED strips and dimmers", detail: "Rapid switching sets the brightness." },
    { icon: Laptop, place: "Laptop power circuits", detail: "Efficient switching regulators are built around MOSFETs." },
    { icon: Zap, place: "Electric vehicles", detail: "Huge MOSFET arrays drive the traction motors." },
  ],
  mistakes: mistakesFor("mosfet"),
  safety: ["heat", "ratings"],
  keyTakeaway: "A MOSFET is switched by the voltage on its gate, so a tiny control signal can switch a heavy load between its drain and source.",
  takeaways: ["Gate = control, drain = load side, source = ground.", "Voltage-controlled: almost no gate current.", "Use a pull-down on the gate and a flyback diode on motors.", "Choose a logic-level MOSFET with enough rating."],
  quickCheck: [
    {
      id: "control",
      type: "multiple-choice",
      prompt: "What switches an N-channel MOSFET on?",
      options: [
        { id: "voltage", label: "A voltage on the gate" },
        { id: "current", label: "A large current into the drain" },
        { id: "heat", label: "Heating it up" },
        { id: "light", label: "Shining light on it" },
      ],
      correctOptionId: "voltage",
      explanation: "The gate is insulated. A voltage between gate and source creates a conducting channel from drain to source.",
    },
    {
      id: "pull-down",
      type: "predict",
      prompt: "The gate pull-down resistor is removed and the microcontroller is unplugged. What might the motor do?",
      options: [
        { id: "random", label: "Twitch or turn on unexpectedly" },
        { id: "off", label: "Stay reliably off" },
        { id: "faster", label: "Run at full speed forever" },
      ],
      correctOptionId: "random",
      explanation: "A floating gate can pick up stray charge and partly turn on. The pull-down holds it firmly at 0 V.",
    },
    {
      id: "flyback",
      type: "true-false",
      prompt: "A diode across a motor protects the MOSFET from a voltage spike when the motor is switched off.",
      options: [
        { id: "true", label: "True" },
        { id: "false", label: "False" },
      ],
      correctOptionId: "true",
      explanation: "A motor's coil tries to keep current flowing when switched off. The flyback diode gives that current a safe path.",
    },
  ],
  next: {
    title: "The relay",
    description: "Switch a completely separate circuit with an electromagnet — and watch the contacts move.",
    href: "/learn/components/relay",
    cta: "Meet the relay",
  },
};
