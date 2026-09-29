import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Boxes, FlaskConical, Hammer } from "lucide-react";
import { ModuleCardAction } from "@/components/learn/ModuleCardAction";
import { ModuleActivities } from "@/components/learn/ModuleActivities";
import { ModuleLessonPath } from "@/components/learn/ModuleLessonPath";
import { SafetyNotice } from "@/components/ui/SafetyNotice";
import { ModuleProgress } from "@/components/lesson/ModuleProgress";
import { ComingSoonBadge, DifficultyBadge, PreviewBadge, Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { MODULES, availableLessons, getModule } from "@/content/curriculum";
import type { ResourceLink } from "@/content/types";

interface ModulePageProps {
  params: Promise<{ moduleSlug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return MODULES.map((module) => ({ moduleSlug: module.slug }));
}

export async function generateMetadata({ params }: ModulePageProps): Promise<Metadata> {
  const { moduleSlug } = await params;
  const learningModule = getModule(moduleSlug);
  return learningModule
    ? { title: `${learningModule.number} ${learningModule.title}`, description: learningModule.description }
    : {};
}

const RESOURCE_ICONS: Record<ResourceLink["kind"], typeof FlaskConical> = {
  lab: FlaskConical,
  component: Boxes,
  project: Hammer,
  lesson: ArrowRight,
};

export default async function ModulePage({ params }: ModulePageProps) {
  const { moduleSlug } = await params;
  const learningModule = getModule(moduleSlug);
  if (!learningModule) notFound();

  const index = MODULES.indexOf(learningModule);
  const previous = MODULES[index - 1];
  const next = MODULES[index + 1];
  const hasLessons = availableLessons(learningModule).length > 0;

  return (
    <div className="relative">
      <div className="bg-circuit-grid pointer-events-none absolute inset-x-0 top-0 h-96 [mask-image:linear-gradient(black,transparent)]" aria-hidden="true" />
      <Container className="relative py-8 sm:py-12">
        <Link href="/learn" className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-cyan">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Learning dashboard
        </Link>

        <header className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-xl border border-cyan/40 bg-cyan/10 text-cyan">
                <Icon name={learningModule.icon} className="size-6" />
              </span>
              <span className="font-mono text-sm text-ink-subtle">Module {learningModule.number}</span>
              {learningModule.status === "available" ? <Badge tone="positive">Available</Badge> : learningModule.status === "preview" ? <PreviewBadge /> : <ComingSoonBadge />}
            </div>
            <h1 className="mt-5 text-4xl font-semibold text-ink sm:text-5xl">{learningModule.title}</h1>
            <p className="mt-4 max-w-2xl text-lg text-ink-muted">{learningModule.description}</p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Topics">
              {learningModule.topics.map((topic) => (
                <li key={topic} className="rounded-md border border-line bg-surface px-2.5 py-1 text-xs text-ink-muted">
                  {topic}
                </li>
              ))}
            </ul>
          </div>
          <div className="panel space-y-4 rounded-2xl p-5">
            <DifficultyBadge difficulty={learningModule.difficulty} />
            {hasLessons ? <ModuleProgress module={learningModule} variant="full" /> : null}
            <ModuleCardAction module={learningModule} />
          </div>
        </header>

        <section aria-labelledby="lessons-heading" className="mt-14">
          <h2 id="lessons-heading" className="text-2xl font-semibold text-ink">
            Lessons
          </h2>
          {hasLessons ? (
            <>
              <p className="mt-2 text-ink-muted">Each lesson builds on the one before it — work through them in order.</p>
              <div className="mt-6">
                <ModuleLessonPath module={learningModule} />
              </div>
            </>
          ) : (
            <div className="panel mt-6 rounded-2xl p-6">
              <ComingSoonBadge />
              <p className="mt-3 text-ink">This module is coming soon. Its lessons haven&apos;t been written yet.</p>
              <p className="mt-1 text-sm text-ink-muted">
                Planned topics: {learningModule.topics.join(", ")}. In the meantime, the first three modules build everything you&apos;ll need.
              </p>
              <Link href="/learn" className="mt-4 inline-flex text-sm font-medium text-cyan underline underline-offset-2">
                Back to the learning path
              </Link>
            </div>
          )}
        </section>

        {learningModule.activities?.length ? (
          <section aria-labelledby="activities-heading" className="mt-14">
            <h2 id="activities-heading" className="text-2xl font-semibold text-ink">
              Challenges and games
            </h2>
            <p className="mt-2 text-ink-muted">Put the module into practice. Your results are saved on this device.</p>
            <div className="mt-6">
              <ModuleActivities activities={learningModule.activities} />
            </div>
          </section>
        ) : null}

        {hasLessons ? <SafetyNotice topic="general" className="mt-14" /> : null}

        {learningModule.resources?.length ? (
          <section aria-labelledby="resources-heading" className="mt-14">
            <h2 id="resources-heading" className="text-2xl font-semibold text-ink">
              Explore now
            </h2>
            <p className="mt-2 text-ink-muted">Hands-on tools related to this module that you can use today.</p>
            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {learningModule.resources.map((resource) => {
                const ResourceIcon = RESOURCE_ICONS[resource.kind];
                return (
                  <li key={resource.href}>
                    <Link href={resource.href} className="panel group flex items-center gap-3 rounded-xl p-4 transition-colors hover:border-cyan/45">
                      <ResourceIcon className="size-5 text-amber" aria-hidden="true" />
                      <span className="flex-1 font-medium text-ink">{resource.label}</span>
                      <ArrowRight className="size-4 text-ink-subtle group-hover:text-cyan" aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        <nav aria-label="Other modules" className="mt-16 grid grid-cols-1 gap-3 border-t border-line pt-8 sm:grid-cols-2">
          {previous ? (
            <Link href={`/learn/${previous.slug}`} className="panel group rounded-xl p-4 transition-colors hover:border-cyan/45">
              <span className="flex items-center gap-1.5 text-xs text-ink-subtle">
                <ArrowLeft className="size-3.5" aria-hidden="true" /> Module {previous.number}
              </span>
              <span className="mt-1 block font-semibold text-ink group-hover:text-cyan">{previous.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/learn/${next.slug}`} className="panel group rounded-xl p-4 text-right transition-colors hover:border-cyan/45">
              <span className="flex items-center justify-end gap-1.5 text-xs text-ink-subtle">
                Module {next.number} <ArrowRight className="size-3.5" aria-hidden="true" />
              </span>
              <span className="mt-1 block font-semibold text-ink group-hover:text-cyan">{next.title}</span>
            </Link>
          ) : null}
        </nav>
      </Container>
    </div>
  );
}
