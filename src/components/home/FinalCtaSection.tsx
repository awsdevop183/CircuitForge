import { ArrowRight, Map as MapIcon } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FIRST_LESSON_HREF } from "@/content/curriculum";

export function FinalCtaSection() {
  return (
    <section aria-labelledby="final-cta-heading" className="pb-8 pt-12">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-cyan/25 bg-surface px-6 py-14 text-center sm:px-12 sm:py-20">
          <div className="bg-circuit-grid absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" aria-hidden="true" />
          <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan to-transparent" aria-hidden="true" />
          <div className="relative">
            <p className="eyebrow text-amber">Lesson 01 · 12 minutes</p>
            <h2 id="final-cta-heading" className="mx-auto mt-4 max-w-2xl text-balance text-3xl font-semibold text-ink sm:text-5xl">
              Your first circuit is one click away.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-muted">
              Start with what electricity actually is — then close the switch and watch it flow.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href={FIRST_LESSON_HREF} size="lg">
                Start Learning
                <ArrowRight className="size-5" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/roadmap" size="lg" variant="secondary">
                <MapIcon className="size-5 text-amber" aria-hidden="true" />
                See the full roadmap
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
