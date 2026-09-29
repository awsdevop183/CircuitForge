import { Cloud, CloudLightning, Shirt, Wind } from "lucide-react";
import { ConceptCard, ConceptGrid, KeyIdea, Prose, RealWorldCard, VisualStage } from "@/components/lesson/LessonBlocks";
import { ChargeInteraction } from "@/components/electricity/ChargeInteraction";
import { ChargeDots } from "@/components/simulations/ChargeDots";
import { MatterZoom } from "@/components/simulations/MatterZoom";
import { Callout } from "@/components/ui/Callout";
import type { LessonContent } from "../types";

export const matterAndCharge: LessonContent = {
  moduleSlug: "electricity",
  lessonSlug: "matter-and-charge",
  objective: "Explain that everything is made of atoms, and that atoms contain positive and negative electric charge.",
  objectives: ["Name the two kinds of electric charge", "Predict whether two charges attract or repel"],
  sections: [
    {
      id: "matter",
      stage: "concept",
      title: "Everything is made of matter",
      content: (
        <>
          <Prose>
            <p>
              <strong>Matter</strong> is anything that takes up space: a wire, your desk, the air, you. Zoom into any piece of matter and you
              find the same thing — incredibly tiny building blocks called <strong>atoms</strong>.
            </p>
            <p>Use the zoom controls to travel from a copper wire down into a single atom.</p>
          </Prose>
          <VisualStage caption="Each step zooms in thousands or millions of times.">
            <MatterZoom />
          </VisualStage>
          <KeyIdea>Inside every atom are particles that carry electric charge. That&apos;s where all of electronics begins.</KeyIdea>
        </>
      ),
    },
    {
      id: "two-charges",
      stage: "visual",
      title: "Two kinds of electric charge",
      content: (
        <>
          <Prose>
            <p>
              <strong>Electric charge</strong> is a property some particles have — like mass, but it can be one of two kinds. Scientists call
              them <strong>positive (+)</strong> and <strong>negative (−)</strong>.
            </p>
          </Prose>
          <ConceptGrid columns={3}>
            <ConceptCard title="Positive charge" accent="amber" visual={<ChargeDots sign="+" />}>
              Carried by protons, in the centre of every atom.
            </ConceptCard>
            <ConceptCard title="Negative charge" visual={<ChargeDots sign="−" />}>
              Carried by electrons, around the outside of every atom.
            </ConceptCard>
            <ConceptCard title="Neutral" visual={<span className="flex gap-2"><ChargeDots sign="+" count={2} /><ChargeDots sign="−" count={2} /></span>}>
              Equal amounts of + and − cancel out. Most everyday objects are neutral.
            </ConceptCard>
          </ConceptGrid>
        </>
      ),
    },
    {
      id: "attract-repel",
      stage: "experiment",
      title: "Like charges repel, opposites attract",
      content: (
        <>
          <Prose>
            <p>Charges push or pull on each other — even without touching. Set each charge to + or − and watch what happens.</p>
          </Prose>
          <Callout kind="try" className="mt-6">
            <p>Try all four combinations: + +, − −, + −, − +. Can you find a rule that predicts every result?</p>
          </Callout>
          <VisualStage>
            <ChargeInteraction />
          </VisualStage>
          <ConceptGrid columns={2}>
            <ConceptCard title="Opposite charges attract">A + and a − pull towards each other.</ConceptCard>
            <ConceptCard title="Like charges repel" accent="amber">
              Two + charges, or two − charges, push each other away.
            </ConceptCard>
          </ConceptGrid>
        </>
      ),
    },
    {
      id: "static",
      stage: "real-world",
      title: "Where you've already seen charge",
      content: (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <RealWorldCard icon={Wind} title="A balloon on your hair">
            Rubbing moves electrons from your hair onto the balloon. Now they have opposite charges — so your hair stands up towards it.
          </RealWorldCard>
          <RealWorldCard icon={Shirt} title="Clothes from the dryer">
            Tumbling fabrics swap electrons. Oppositely charged socks cling together; like-charged ones push apart.
          </RealWorldCard>
          <RealWorldCard icon={CloudLightning} title="Lightning">
            Storm clouds build up huge separated charges. Lightning is those charges rushing to balance out.
          </RealWorldCard>
          <RealWorldCard icon={Cloud} title="A tiny shock from a door handle">
            You pick up extra charge walking on carpet; it jumps to the metal handle with a little spark.
          </RealWorldCard>
        </div>
      ),
    },
  ],
  analogy: {
    title: "Charges behave a bit like magnets",
    content: (
      <p>
        Hold two magnets together: matching ends push apart, opposite ends snap together. Electric charges follow the same{" "}
        <strong>like-repel, opposites-attract</strong> pattern.
      </p>
    ),
    limits: [
      "Magnetism and electric charge are different effects — a magnet won't pick up a charged balloon the way it picks up iron.",
      "A magnet always has both a north and a south end. A single electron is just negative — it has no “other end”.",
    ],
  },
  keyTakeaway: "All matter is made of atoms, and atoms contain positive and negative charges: like charges repel, opposite charges attract.",
  takeaways: [
    "Matter is anything that takes up space; it's made of atoms.",
    "Protons carry positive charge; electrons carry negative charge.",
    "Equal + and − cancel out, so most objects are neutral.",
    "Opposite charges attract; like charges repel.",
  ],
  quickCheck: [
    {
      id: "matter-made-of",
      type: "multiple-choice",
      prompt: "What is all matter made of?",
      options: [
        { id: "atoms", label: "Atoms" },
        { id: "electricity", label: "Electricity" },
        { id: "light", label: "Light" },
        { id: "magnets", label: "Tiny magnets" },
      ],
      correctOptionId: "atoms",
      explanation: "Every material — metal, plastic, air, you — is built from atoms. The charged particles inside atoms are what electronics is all about.",
    },
    {
      id: "two-negatives",
      type: "true-false",
      prompt: "Two negative charges attract each other.",
      options: [
        { id: "true", label: "True" },
        { id: "false", label: "False" },
      ],
      correctOptionId: "false",
      explanation: "Like charges repel. Two negatives push each other apart — only opposite charges attract.",
    },
    {
      id: "predict-opposites",
      type: "predict",
      prompt: "A positive charge is placed near a negative charge and both are free to move. What happens?",
      options: [
        { id: "together", label: "They move towards each other" },
        { id: "apart", label: "They move apart" },
        { id: "nothing", label: "Nothing — they must touch first" },
        { id: "vanish", label: "Both charges disappear" },
      ],
      correctOptionId: "together",
      explanation: "Opposite charges attract, and the force works across a gap without touching — so they pull towards each other.",
    },
  ],
  next: {
    title: "Meet the electron",
    description: "Negative charge is carried by a tiny, light, mobile particle. Next, look inside the atom to see why that particle — the electron — makes electricity possible.",
    href: "/learn/electricity/the-electron",
    cta: "Continue to Lesson 2",
  },
};
