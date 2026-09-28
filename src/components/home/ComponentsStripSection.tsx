import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ComponentSymbol } from "@/components/explorer/ComponentSymbol";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { COMPONENTS } from "@/content/component-library";

export function ComponentsStripSection() {
  return (
    <section aria-labelledby="components-strip-heading" className="py-16 sm:py-24">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="components-strip-heading"
            eyebrow="Component Explorer"
            title="Learn the visual language of circuits."
            description="Every schematic is built from a small alphabet of symbols. Learn each one next to the real part it represents."
          />
          <ButtonLink href="/components" variant="secondary" className="self-start md:self-auto">
            Browse all components
            <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
        </div>
        <ul className="mt-12 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
          {COMPONENTS.map((component) => (
            <li key={component.slug}>
              <Link
                href={`/components/${component.slug}`}
                className="panel group flex h-full flex-col items-center gap-3 rounded-xl px-2 py-5 transition-[border-color,transform] hover:-translate-y-0.5 hover:border-cyan/45"
              >
                <ComponentSymbol slug={component.slug} name={component.name} className="h-10 w-auto max-w-full" />
                <span className="text-center text-xs font-medium text-ink-muted group-hover:text-ink">{component.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
