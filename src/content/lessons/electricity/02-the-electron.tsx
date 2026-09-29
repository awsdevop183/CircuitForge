import { Atom, Monitor, Smartphone, Zap } from "lucide-react";
import { ConceptCard, ConceptGrid, KeyIdea, Prose, RealWorldCard, VisualStage } from "@/components/lesson/LessonBlocks";
import { AtomExplorer } from "@/components/simulations/AtomExplorer";
import { Callout } from "@/components/ui/Callout";
import type { LessonContent } from "../types";

export const theElectron: LessonContent = {
  moduleSlug: "electricity",
  lessonSlug: "the-electron",
  objective: "Describe the three particles in an atom and explain why the electron is the one that moves in electricity.",
  objectives: ["Compare the charge and mass of protons, neutrons and electrons", "Explain what an ion is"],
  buildsOn: ["Matter & charge"],
  sections: [
    {
      id: "three-particles",
      stage: "concept",
      title: "Three particles inside every atom",
      content: (
        <>
          <Prose>
            <p>
              In the last lesson you saw that atoms contain charge. Now let&apos;s meet the particles that carry it. There are three, and
              each has a different job.
            </p>
          </Prose>
          <ConceptGrid columns={3}>
            <ConceptCard title="Proton" accent="amber">
              Positive (+). Heavy. Sits in the nucleus at the centre and stays put.
            </ConceptCard>
            <ConceptCard title="Neutron" accent="amber">
              No charge. Heavy. Also in the nucleus, helping hold it together.
            </ConceptCard>
            <ConceptCard title="Electron">
              Negative (−). About 1,836 times lighter than a proton. Found around the nucleus — and able to move.
            </ConceptCard>
          </ConceptGrid>
          <KeyIdea>Protons are locked in place. Electrons can move. So when charge flows, it&apos;s almost always electrons doing the moving.</KeyIdea>
        </>
      ),
    },
    {
      id: "atom-explorer",
      stage: "experiment",
      title: "Explore an atom",
      content: (
        <>
          <Prose>
            <p>
              This is a <strong>lithium</strong> atom: 3 protons, 4 neutrons and 3 electrons. Tap each particle to learn about it. Then add
              and remove electrons.
            </p>
          </Prose>
          <Callout kind="try" className="mt-6">
            <p>
              Remove one electron. The atom now has more + than −, so it becomes a <strong>positive ion</strong>. Add two and it becomes a{" "}
              <strong>negative ion</strong>. Finally, switch to the electron-cloud picture.
            </p>
          </Callout>
          <VisualStage>
            <AtomExplorer />
          </VisualStage>
        </>
      ),
    },
    {
      id: "model",
      stage: "visual",
      title: "Simple model vs the real thing",
      content: (
        <>
          <Prose>
            <p>
              Drawings of electrons circling like planets are a <strong>simplified model</strong>. They&apos;re useful because they get the
              important parts right: a tiny, heavy, positive centre and light, negative electrons around it.
            </p>
            <p>
              Physicists describe electrons with <strong>quantum mechanics</strong>: an electron doesn&apos;t follow a track, it has a spread-out
              &ldquo;cloud&rdquo; of places it&apos;s likely to be. You don&apos;t need that level of detail to build circuits — but it&apos;s good to know the
              picture is a simplification.
            </p>
          </Prose>
          <ConceptGrid columns={2}>
            <ConceptCard title="Useful for electronics">Electrons are negative, light and — in metals — free to move between atoms.</ConceptCard>
            <ConceptCard title="Not literally true" accent="amber">
              Electrons don&apos;t orbit in circles, and atoms are mostly empty space, not solid balls.
            </ConceptCard>
          </ConceptGrid>
        </>
      ),
    },
    {
      id: "electrons-everywhere",
      stage: "real-world",
      title: "Electrons at work",
      content: (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <RealWorldCard icon={Smartphone} title="Every wire in your phone">
            Billions of electrons shuffle through copper traces each second to run the screen and radio.
          </RealWorldCard>
          <RealWorldCard icon={Zap} title="Static shocks">
            Walking on carpet can pull extra electrons onto you. The shock is them jumping off again.
          </RealWorldCard>
          <RealWorldCard icon={Monitor} title="Old TV tubes">
            Classic TVs fired a beam of electrons at the screen to make it glow — the electron was the paintbrush.
          </RealWorldCard>
          <RealWorldCard icon={Atom} title="Ions in batteries">
            Inside a battery, charged ions move through a chemical paste while electrons travel through your circuit.
          </RealWorldCard>
        </div>
      ),
    },
  ],
  analogy: {
    title: "An atom is like a tiny solar system",
    content: (
      <p>
        The heavy nucleus sits in the middle like the Sun, and light electrons are found around it like planets. It&apos;s a handy
        picture for remembering where each particle lives.
      </p>
    ),
    limits: [
      "Planets follow exact orbits; electrons don't — they're better described as a fuzzy cloud of likely positions.",
      "Gravity holds planets; electric attraction between + protons and − electrons holds atoms together.",
      "An atom is almost entirely empty space — far emptier than even the solar system looks in drawings.",
    ],
  },
  keyTakeaway: "Electrons are tiny, negatively charged and mobile — which is why moving electrons carry electricity through wires.",
  takeaways: [
    "Protons (+) and neutrons (0) sit in the heavy nucleus.",
    "Electrons (−) are light and found around the nucleus.",
    "Gaining or losing electrons makes an ion with an overall charge.",
    "The orbit picture is a simplified model; real electrons form a probability cloud.",
  ],
  quickCheck: [
    {
      id: "which-negative",
      type: "identify",
      prompt: "Which particle carries negative charge?",
      options: [
        { id: "proton", label: "Proton" },
        { id: "neutron", label: "Neutron" },
        { id: "electron", label: "Electron" },
      ],
      correctOptionId: "electron",
      explanation: "Electrons are negative, protons are positive, and neutrons have no charge at all.",
    },
    {
      id: "lose-electron",
      type: "predict",
      prompt: "A neutral atom loses one electron. What is its overall charge now?",
      options: [
        { id: "positive", label: "Positive" },
        { id: "negative", label: "Negative" },
        { id: "neutral", label: "Still neutral" },
      ],
      correctOptionId: "positive",
      explanation: "It still has all its protons but one fewer electron, so there's more + than −. It becomes a positive ion.",
    },
    {
      id: "protons-flow",
      type: "true-false",
      prompt: "In a copper wire, electricity is carried by protons moving along the wire.",
      options: [
        { id: "true", label: "True" },
        { id: "false", label: "False" },
      ],
      correctOptionId: "false",
      explanation: "Protons are locked inside each atom's nucleus. In metal wires, it's the free electrons that move.",
    },
  ],
  next: {
    title: "Why do some materials let electrons move?",
    description: "Electrons can move — but not through everything. Next, test materials to find out which are conductors and which are insulators.",
    href: "/learn/electricity/conductors-and-insulators",
    cta: "Continue to Lesson 3",
  },
};
