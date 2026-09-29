import { Eye, FlaskConical, Hammer, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const PILLARS: { icon: LucideIcon; step: string; title: string; body: string }[] = [
  {
    icon: Eye,
    step: "See it",
    title: "Visual explanations",
    body: "Charge, current, voltage and logic signals are animated, so you watch what a circuit is actually doing instead of imagining it.",
  },
  {
    icon: FlaskConical,
    step: "Experiment",
    title: "Interactive simulations",
    body: "Flip switches, drag sliders, swap parts and toggle inputs. Predict, change one thing, and check the result — nothing can burn out here.",
  },
  {
    icon: Hammer,
    step: "Build it",
    title: "Practical projects",
    body: "Projects turn each idea into safe, low-voltage hardware on your desk — from a single LED to connected, intelligent devices.",
  },
];

export function PillarsSection() {
  return (
    <section aria-labelledby="pillars-heading" className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          id="pillars-heading"
          eyebrow="Why CircuitForge?"
          title="Don't just read electronics. See it. Experiment. Build it."
          description="Every concept moves through the same loop — so understanding comes from what you see and do, not from memorising definitions."
        />
        <ol className="mt-12 grid gap-4 md:grid-cols-3">
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
