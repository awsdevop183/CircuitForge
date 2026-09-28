import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, CircleAlert, MapPin, ShieldAlert } from "lucide-react";
import { ComponentExperiment } from "@/components/component-lab/ComponentExperiment";
import { ComponentSpecification } from "@/components/component-lab/ComponentSpecification";
import { ComponentSymbol } from "@/components/explorer/ComponentSymbol";
import { DEEP_DIVES } from "@/components/explorer/deep-dives/registry";
import { COMPONENT_EXPERIMENTS } from "@/components/explorer/experiments";
import { ComponentIllustration } from "@/components/illustrations/ComponentIllustration";
import { Badge, DifficultyBadge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { COMPONENTS, COMPONENT_TAG_LABELS, getComponent } from "@/content/component-library";
import { getModule, lessonHref } from "@/content/curriculum";

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
  const experiments = COMPONENT_EXPERIMENTS[component.slug] ?? [];
  const related = component.related.map(getComponent).filter((c) => c !== undefined);
  const componentsModule = getModule("components");
  const lesson = componentsModule?.lessons.find((l) => l.slug === component.lessonSlug);
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
              {component.designator} · {component.tags.map((tag) => COMPONENT_TAG_LABELS[tag]).join(" · ")}
            </p>
            <h1 className="mt-2 text-4xl font-semibold text-ink sm:text-5xl">{component.name}</h1>
            <p className="mt-3 text-xl font-medium text-cyan-soft">{component.job}</p>
            <p className="mt-3 text-lg leading-relaxed text-ink-muted">{component.summary}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <DifficultyBadge difficulty={component.difficulty} />
              <Badge tone="cyan">Interactive</Badge>
            </div>
            {lesson ? (
              <ButtonLink href={lessonHref("components", lesson.slug)} className="mt-6">
                <BookOpen className="size-4" aria-hidden="true" />
                Learn it: {lesson.title}
              </ButtonLink>
            ) : null}
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

        <section aria-labelledby="try-heading" className="mt-14">
          <p className="eyebrow text-cyan">Interact</p>
          <h2 id="try-heading" className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">
            See how it behaves
          </h2>
          <div className="mt-6 space-y-6">
            {experiments.map(({ title, prompt, Demo }) => (
              <ComponentExperiment key={title} title={title} prompt={prompt}>
                <Demo />
              </ComponentExperiment>
            ))}
          </div>
        </section>

        <section aria-labelledby="specs-heading" className="mt-14 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 id="specs-heading" className="eyebrow text-cyan">
              Specifications that matter
            </h2>
            <ComponentSpecification specs={component.specs} className="mt-4" />
          </div>
          <div className="panel rounded-2xl p-6">
            <h2 className="eyebrow flex items-center gap-2 text-amber">
              <MapPin className="size-4" aria-hidden="true" />
              Where you&apos;ll find it
            </h2>
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

        <section aria-labelledby="mistakes-heading" className="mt-10 rounded-2xl border border-orange/40 bg-orange/5 p-6">
          <h2 id="mistakes-heading" className="flex items-center gap-2 text-lg font-semibold text-orange">
            <CircleAlert className="size-5" aria-hidden="true" />
            Common beginner mistakes
          </h2>
          <ul className="mt-4 grid gap-3 md:grid-cols-3">
            {component.mistakes.map((m) => (
              <li key={m.mistake} className="rounded-xl border border-line bg-surface/70 p-4">
                <p className="font-medium text-ink">{m.mistake}</p>
                {m.consequence ? <p className="mt-2 text-sm text-ink-muted">{m.consequence}</p> : null}
                <p className="mt-2 text-sm text-ink-muted">
                  <span className="font-semibold text-positive">Fix: </span>
                  {m.fix}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="safety-heading" className="mt-6 rounded-2xl border border-negative/40 bg-negative/5 p-6">
          <h2 id="safety-heading" className="flex items-center gap-2 text-lg font-semibold text-negative">
            <ShieldAlert className="size-5" aria-hidden="true" />
            Safety notes
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            {component.safety.map((note) => (
              <li key={note} className="flex gap-3">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-negative" aria-hidden="true" />
                {note}
              </li>
            ))}
          </ul>
        </section>

        {DeepDive ? (
          <div className="mt-16">
            <DeepDive />
          </div>
        ) : null}

        <section aria-labelledby="related-heading" className="mt-14">
          <h2 id="related-heading" className="eyebrow text-cyan">
            Related components
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {related.map((c) => (
              <li key={c.slug}>
                <Link href={`/components/${c.slug}`} className="panel group flex items-center gap-4 rounded-xl p-4 transition-colors hover:border-cyan/45">
                  <ComponentSymbol slug={c.slug} name={c.name} className="h-10 w-16 shrink-0" />
                  <span>
                    <span className="block font-semibold text-ink group-hover:text-cyan">{c.name}</span>
                    <span className="block text-xs text-ink-muted">{c.job}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link href="/components/compare" className="text-cyan hover:underline">
              Compare similar components →
            </Link>
            <Link href="/components/symbol-trainer" className="text-cyan hover:underline">
              Practise symbols →
            </Link>
          </div>
        </section>

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
