import { Flashlight, Plug, ShieldAlert, ToggleRight } from "lucide-react";
import { ConceptCard, ConceptGrid, KeyIdea, Prose, RealWorldCard, VisualStage } from "@/components/lesson/LessonBlocks";
import { AtomModel } from "@/components/lessons/electricity/AtomModel";
import { ChargeInteraction } from "@/components/lessons/electricity/ChargeInteraction";
import { ElectronChain } from "@/components/lessons/electricity/ElectronChain";
import { MaterialTester } from "@/components/lessons/electricity/MaterialTester";
import { OpenClosedCircuit } from "@/components/lessons/electricity/OpenClosedCircuit";
import { Callout } from "@/components/ui/Callout";
import type { LessonContent } from "./types";

export const whatIsElectricity: LessonContent = {
  moduleSlug: "electricity",
  lessonSlug: "what-is-electricity",
  objectives: [
    "Describe electric charge and the electron",
    "Tell conductors and insulators apart",
    "Explain why a circuit must be closed for current to flow",
  ],
  sections: [
    {
      id: "charge",
      stage: "concept",
      title: "Everything is made of charged particles",
      content: (
        <>
          <Prose>
            <p>
              Every material is built from atoms. Inside each atom are tiny particles that carry <strong>electric charge</strong>:
              positive <strong>protons</strong> in the centre and negative <strong>electrons</strong> around the outside.
            </p>
            <p>Change the number of electrons below and watch the atom&apos;s overall charge change.</p>
          </Prose>
          <VisualStage caption="Protons (+) are fixed in the nucleus. Electrons (−) can be added or removed.">
            <AtomModel />
          </VisualStage>
          <KeyIdea>Electricity is what happens when electric charge — usually electrons — moves.</KeyIdea>
        </>
      ),
    },
    {
      id: "attraction",
      stage: "visual",
      title: "Charges push and pull",
      content: (
        <>
          <Prose>
            <p>Charges affect each other without touching. Flip the charges and watch what they do.</p>
          </Prose>
          <VisualStage>
            <ChargeInteraction />
          </VisualStage>
          <Prose>
            <p>
              This push and pull is what moves electrons around a circuit. A battery piles up electrons at one end and
              pulls them in at the other.
            </p>
          </Prose>
        </>
      ),
    },
    {
      id: "conductors",
      stage: "visual",
      title: "Conductors and insulators",
      content: (
        <>
          <Prose>
            <p>
              In some materials, electrons can drift freely from atom to atom. These are <strong>conductors</strong>. In others,
              every electron is held tightly — these are <strong>insulators</strong>. Test each material in the gap.
            </p>
          </Prose>
          <VisualStage caption="Left: a battery and bulb with a gap. Right: what the material looks like up close.">
            <MaterialTester />
          </VisualStage>
          <ConceptGrid columns={2}>
            <ConceptCard title="Conductors">
              Let charge flow easily. Metals like copper, aluminium and gold. Used for wires and circuit-board traces.
            </ConceptCard>
            <ConceptCard title="Insulators" accent="amber">
              Block the flow of charge. Rubber, plastic, glass and dry wood. Used to keep electricity where it belongs.
            </ConceptCard>
          </ConceptGrid>
        </>
      ),
    },
    {
      id: "closed-circuit",
      stage: "experiment",
      title: "Close the loop",
      content: (
        <>
          <Prose>
            <p>
              A <strong>circuit</strong> is a complete loop: from the battery, through wires and a bulb, and back to the battery.
              Charge can only flow if the loop has no gaps.
            </p>
          </Prose>
          <Callout kind="try" className="mt-6">
            <p>
              Close the circuit with the button — or click the switch itself in the diagram. Then open it again. What changes, and
              what stays the same?
            </p>
          </Callout>
          <VisualStage>
            <OpenClosedCircuit />
          </VisualStage>
          <ConceptGrid columns={2}>
            <ConceptCard title="Closed circuit">The path is complete. Charge flows all the way round, so the bulb lights.</ConceptCard>
            <ConceptCard title="Open circuit" accent="amber">
              There is a gap. Even one tiny break stops the flow everywhere in the loop.
            </ConceptCard>
          </ConceptGrid>
        </>
      ),
    },
    {
      id: "instant-flow",
      stage: "visual",
      title: "Why the bulb lights instantly",
      content: (
        <>
          <Prose>
            <p>
              Electrons actually drift slowly — millimetres per second. But a wire is already packed with free electrons. Push one
              in at one end and one leaves the other end straight away, like marbles in a full tube.
            </p>
          </Prose>
          <VisualStage>
            <ElectronChain />
          </VisualStage>
          <KeyIdea>The battery doesn&apos;t supply electrons — it pushes the ones already in the wire.</KeyIdea>
        </>
      ),
    },
    {
      id: "real-world",
      stage: "real-world",
      title: "You use open and closed circuits all day",
      content: (
        <div className="grid gap-3 sm:grid-cols-2">
          <RealWorldCard icon={ToggleRight} title="Light switches">
            Flipping a switch closes the circuit to the lamp. Flip it back and you open a gap in the loop.
          </RealWorldCard>
          <RealWorldCard icon={Flashlight} title="Torches">
            Batteries, a switch and a bulb in one loop — exactly the circuit you just built.
          </RealWorldCard>
          <RealWorldCard icon={Plug} title="Cables">
            Copper conductors inside, plastic insulation outside. Both jobs in one cable.
          </RealWorldCard>
          <RealWorldCard icon={ShieldAlert} title="Fuses">
            A thin wire that melts if too much current flows — deliberately opening the circuit to keep you safe.
          </RealWorldCard>
        </div>
      ),
    },
  ],
  takeaways: [
    "Electric charge comes in two kinds: positive (protons) and negative (electrons).",
    "Opposite charges attract; like charges repel.",
    "Conductors let electrons move freely; insulators hold them in place.",
    "Current only flows around a closed circuit — any gap stops it everywhere.",
  ],
  quickCheck: [
    {
      id: "q-electron-charge",
      prompt: "Which particle usually moves to carry electricity through a wire?",
      options: [
        { id: "proton", label: "Proton" },
        { id: "electron", label: "Electron" },
        { id: "neutron", label: "Neutron" },
        { id: "atom", label: "Whole atoms" },
      ],
      correctOptionId: "electron",
      explanation: "Electrons are free to drift in metals. Protons stay locked in the nucleus.",
    },
    {
      id: "q-insulator",
      prompt: "Which of these is an insulator?",
      options: [
        { id: "copper", label: "Copper" },
        { id: "foil", label: "Aluminium foil" },
        { id: "rubber", label: "Rubber" },
        { id: "salt-water", label: "Salt water" },
      ],
      correctOptionId: "rubber",
      explanation: "Rubber holds its electrons tightly, so charge can't flow through it.",
    },
    {
      id: "q-open-circuit",
      prompt: "A switch in a loop is opened. What happens to the current?",
      options: [
        { id: "stops", label: "It stops everywhere in the loop" },
        { id: "half", label: "It stops only after the switch" },
        { id: "same", label: "Nothing changes" },
        { id: "faster", label: "It flows faster" },
      ],
      correctOptionId: "stops",
      explanation: "A circuit is a single loop. Break it anywhere and the flow stops everywhere.",
    },
  ],
  next: {
    title: "What pushes the charge?",
    description: "You've seen charge flow around a loop. Next: the push behind it — voltage — and why a bigger push means more current.",
    href: "/learn/electricity/voltage",
    cta: "Continue to Voltage",
  },
};
