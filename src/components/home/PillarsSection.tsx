import { Eye, FlaskConical, Hammer, MousePointerClick, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const PILLARS: { icon: LucideIcon; step: string; title: string; body: string }[] = [
  {
    icon: Eye,
    step: "See it",
    title: "Watch the invisible",
    body: "Charge, current and voltage are animated so you can watch what a circuit is actually doing.",
  },
  {
    icon: MousePointerClick,
    step: "Interact",
    title: "Touch every idea",
    body: "Flip switches, drag sliders and swap parts. Every concept responds to you in real time.",
  },
  {
    icon: FlaskConical,
    step: "Experiment",
    title: "Test it in the lab",
    body: "Form a prediction, change one variable, and check the readout. Real physics, real numbers.",
  },
  {
    icon: Hammer,
    step: "Build",
    title: "Make it physical",
    body: "Projects turn each concept into hardware on your bench — from a single LED to edge AI.",
  },
];

export function PillarsSection() {
  return (
    <section aria-labelledby="pillars-heading" className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          id="pillars-heading"
          eyebrow="The CircuitForge method"
          title="Don't just read electronics."
          description="Every concept moves through the same loop — so understanding comes from what you see and do, not from memorising definitions."
        />
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar, index) => (
            <li key={pillar.step}>
              <Reveal delay={index * 0.08} className="h-full">
                <article className="panel group relative h-full overflow-hidden rounded-2xl p-6 transition-colors hover:border-cyan/40">
                  <div
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden="true"
                  />
                  <div className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-xl border border-line-strong bg-surface-high text-cyan">
                      <pillar.icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-xs text-ink-subtle">0{index + 1}</span>
                  </div>
                  <p className="eyebrow mt-6 text-amber">{pillar.step}</p>
                  <h3 className="mt-2 text-xl font-semibold text-ink">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{pillar.body}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
