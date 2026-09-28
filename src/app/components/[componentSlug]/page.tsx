import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Construction, FlaskConical } from "lucide-react";
import { ComponentSymbol } from "@/components/explorer/ComponentSymbol";
import { DEEP_DIVES } from "@/components/explorer/deep-dives/registry";
import { ComponentIllustration } from "@/components/illustrations/ComponentIllustration";
import { Badge, DifficultyBadge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { COMPONENTS, COMPONENT_CATEGORY_LABELS, getComponent } from "@/content/component-library";

interface ComponentPageProps {
  params: Promise<{ componentSlug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return COMPONENTS.map((component) => ({ componentSlug: component.slug }));
}

export async function generateMetadata({ params }: ComponentPageProps): Promise<Metadata> {
  const { componentSlug } = await params;
  const component = getComponent(componentSlug);
  return component ? { title: `${component.name} · Components`, description: component.summary } : {};
}

export default async function ComponentPage({ params }: ComponentPageProps) {
  const { componentSlug } = await params;
  const component = getComponent(componentSlug);
  if (!component) notFound();

  const DeepDive = DEEP_DIVES[component.slug];
  const index = COMPONENTS.findIndex((c) => c.slug === component.slug);
  const previous = COMPONENTS[index - 1];
  const next = COMPONENTS[index + 1];

  return (
    <div className="relative">
      <div className="bg-circuit-grid pointer-events-none absolute inset-x-0 top-0 h-[32rem] [mask-image:linear-gradient(black,transparent)]" aria-hidden="true" />
      <Container className="relative py-8 sm:py-12">
        <nav aria-label="Breadcrumb">
          <Link href="/components" className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-cyan">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Component Explorer
          </Link>
        </nav>

        <header className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="font-mono text-sm text-ink-subtle">
              {component.designator} · {COMPONENT_CATEGORY_LABELS[component.category]}
            </p>
            <h1 className="mt-2 text-4xl font-semibold text-ink sm:text-5xl">{component.name}</h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-muted">{component.summary}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <DifficultyBadge difficulty={component.difficulty} />
              {DeepDive ? <Badge tone="cyan">Interactive deep-dive</Badge> : <Badge>Overview</Badge>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <figure className="panel-raised flex flex-col items-center justify-center rounded-2xl p-6">
              <ComponentSymbol slug={component.slug} name={component.name} className="h-28 w-auto max-w-full" />
              <figcaption className="eyebrow mt-4 text-ink-subtle">Circuit symbol</figcaption>
            </figure>
            <figure className="panel-raised flex flex-col items-center justify-center rounded-2xl p-6">
              <ComponentIllustration slug={component.slug} className="h-28 w-auto max-w-full" />
              <figcaption className="eyebrow mt-4 text-ink-subtle">Real world</figcaption>
            </figure>
          </div>
        </header>

        <section aria-labelledby="facts-heading" className="mt-12 grid gap-4 md:grid-cols-[1fr_1fr]">
          <div className="panel rounded-2xl p-6">
            <h2 id="facts-heading" className="eyebrow text-cyan">
              Key facts
            </h2>
            <dl className="mt-4 divide-y divide-line">
              {component.facts.map((fact) => (
                <div key={fact.label} className="flex justify-between gap-4 py-3 text-sm">
                  <dt className="text-ink-subtle">{fact.label}</dt>
                  <dd className="text-right font-mono text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="panel rounded-2xl p-6">
            <h2 className="eyebrow text-cyan">Where it&apos;s used</h2>
            <ul className="mt-4 space-y-3">
              {component.uses.map((use) => (
                <li key={use} className="flex items-center gap-3 text-sm text-ink-muted">
                  <span className="size-1.5 shrink-0 rounded-full bg-amber" aria-hidden="true" />
                  {use}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="mt-16">
          {DeepDive ? (
            <DeepDive />
          ) : (
            <section className="panel-raised flex flex-col items-start gap-5 rounded-2xl p-6 sm:flex-row sm:items-center sm:p-8">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-amber/40 bg-amber/10 text-amber">
                <Construction className="size-6" aria-hidden="true" />
              </span>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-ink">Interactive deep-dive coming soon</h2>
                <p className="mt-1 text-sm text-ink-muted">
                  We&apos;re building a hands-on simulation for the {component.name.toLowerCase()}. In the meantime, practise the
                  fundamentals it relies on in the lab.
                </p>
              </div>
              <ButtonLink href="/lab" variant="secondary">
                <FlaskConical className="size-4 text-amber" aria-hidden="true" />
                Open the lab
              </ButtonLink>
            </section>
          )}
        </div>

        <nav aria-label="More components" className="mt-16 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
          {previous ? (
            <Link href={`/components/${previous.slug}`} className="panel group rounded-xl p-4 transition-colors hover:border-cyan/45">
              <span className="flex items-center gap-1.5 text-xs text-ink-subtle">
                <ArrowLeft className="size-3.5" aria-hidden="true" /> Previous
              </span>
              <span className="mt-1 block font-semibold text-ink group-hover:text-cyan">{previous.name}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/components/${next.slug}`} className="panel group rounded-xl p-4 text-right transition-colors hover:border-cyan/45">
              <span className="flex items-center justify-end gap-1.5 text-xs text-ink-subtle">
                Next <ArrowRight className="size-3.5" aria-hidden="true" />
              </span>
              <span className="mt-1 block font-semibold text-ink group-hover:text-cyan">{next.name}</span>
            </Link>
          ) : null}
        </nav>
      </Container>
    </div>
  );
}
