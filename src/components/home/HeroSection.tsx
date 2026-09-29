import { ArrowRight, FlaskConical } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FIRST_LESSON_HREF, MODULES } from "@/content/curriculum";
import { EXPERIMENTS } from "@/content/experiments";
import { SITE } from "@/lib/navigation";
import { CircuitTraces } from "./CircuitTraces";
import { HeroCircuit } from "./HeroCircuit";

const HERO_FACTS = [
  { value: String(MODULES.filter((m) => m.status === "available").length), label: "modules ready to learn" },
  { value: String(EXPERIMENTS.length), label: "live lab experiments" },
  { value: "0", label: "walls of text" },
];

export function HeroSection() {
  return (
    <section aria-labelledby="hero-heading" className="relative isolate -mt-16 overflow-hidden pt-16">
      <CircuitTraces className="absolute inset-0 -z-10 h-full w-full opacity-70 [mask-image:linear-gradient(to_right,transparent_5%,black_55%)]" />
      <div
        className="bg-circuit-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]"
        aria-hidden="true"
      />
      <div className="absolute left-[-10%] top-[-20%] -z-10 h-[36rem] w-[36rem] rounded-full bg-cyan/10 blur-[120px]" aria-hidden="true" />
      <div className="absolute bottom-[-30%] right-[-10%] -z-10 h-[30rem] w-[30rem] rounded-full bg-amber/[0.06] blur-[120px]" aria-hidden="true" />

      <Container className="grid grid-cols-1 items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-28">
        <div>
          <p className="eyebrow mb-6 inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/5 px-3 py-1.5 text-cyan-soft">
            <span className="size-1.5 rounded-full bg-cyan shadow-[0_0_8px_#22d3ee]" aria-hidden="true" />
            Interactive electronics laboratory
          </p>
          <h1
            id="hero-heading"
            className="text-balance text-[2.6rem] font-semibold leading-[1.05] text-ink sm:text-6xl lg:text-[4.1rem]"
          >
            Learn Electronics by <span className="text-cyan">Seeing</span> How It Works.
          </h1>
          <p className="mt-5 font-display text-2xl font-medium text-cyan-soft sm:text-3xl">{SITE.tagline}</p>
          <p className="mt-4 max-w-xl text-pretty text-lg leading-relaxed text-ink-muted">
            Watch current flow, flip switches, toggle logic gates and build circuits — then learn the words for what you just saw. Built for
            curious students aged 10 and up.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={FIRST_LESSON_HREF} size="lg">
              Start Learning
              <ArrowRight className="size-5" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/lab" size="lg" variant="secondary">
              <FlaskConical className="size-5 text-amber" aria-hidden="true" />
              Open Interactive Lab
            </ButtonLink>
          </div>
          <dl className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
            {HERO_FACTS.map((fact) => (
              <div key={fact.label}>
                <dt className="sr-only">{fact.label}</dt>
                <dd>
                  <span className="block font-mono text-2xl font-semibold text-ink">{fact.value}</span>
                  <span className="mt-1 block text-xs leading-snug text-ink-subtle">{fact.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 -z-10 rounded-3xl bg-cyan/5 blur-2xl" aria-hidden="true" />
          <HeroCircuit />
        </div>
      </Container>
    </section>
  );
}
