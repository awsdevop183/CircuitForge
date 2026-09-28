import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Boxes, FlaskConical, Hammer, Lock } from "lucide-react";
import { ModuleCardAction } from "@/components/learn/ModuleCardAction";
import { ModuleProgress } from "@/components/lesson/ModuleProgress";
import { ComingSoonBadge, DifficultyBadge, DurationBadge, PreviewBadge, Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { MODULES, availableLessons, getModule, lessonHref } from "@/content/curriculum";
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

        <header className="mt-6 grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-end">
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
            {hasLessons ? <ModuleProgress module={learningModule} /> : null}
            <ModuleCardAction module={learningModule} />
          </div>
        </header>

        <section aria-labelledby="lessons-heading" className="mt-14">
          <h2 id="lessons-heading" className="text-2xl font-semibold text-ink">
            Lessons
          </h2>
          <ol className="mt-6 space-y-3">
            {learningModule.lessons.map((lesson, lessonIndex) => {
              const body = (
                <>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-line-strong bg-surface-high font-mono text-sm text-ink-muted">
                    {String(lessonIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-ink">{lesson.title}</span>
                    <span className="mt-0.5 block text-sm text-ink-muted">{lesson.summary}</span>
                  </span>
                  <span className="hidden shrink-0 items-center gap-2 sm:flex">
                    <DurationBadge minutes={lesson.estimatedMinutes} />
                    {lesson.available ? (
                      <ArrowRight className="size-5 text-cyan transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    ) : (
                      <ComingSoonBadge />
                    )}
                  </span>
                  {!lesson.available ? <Lock className="size-4 shrink-0 text-ink-subtle sm:hidden" aria-label="Coming soon" /> : null}
                </>
              );
              return (
                <li key={lesson.slug}>
                  {lesson.available ? (
                    <Link href={lessonHref(learningModule.slug, lesson.slug)} className="panel group flex items-center gap-4 rounded-xl p-4 transition-colors hover:border-cyan/45">
                      {body}
                    </Link>
                  ) : (
                    <div className="panel flex items-center gap-4 rounded-xl p-4 opacity-65">{body}</div>
                  )}
                </li>
              );
            })}
          </ol>
        </section>

        {learningModule.resources?.length ? (
          <section aria-labelledby="resources-heading" className="mt-14">
            <h2 id="resources-heading" className="text-2xl font-semibold text-ink">
              Explore now
            </h2>
            <p className="mt-2 text-ink-muted">Hands-on tools related to this module that you can use today.</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

        <nav aria-label="Other modules" className="mt-16 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
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
