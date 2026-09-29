import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import { ExperimentVisitTracker } from "@/components/lab/ExperimentVisitTracker";
import { EXPERIMENT_COMPONENTS } from "@/components/lab/experiments";
import { DifficultyBadge, DurationBadge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { ModelNote } from "@/components/ui/InteractivePanel";
import { EXPERIMENTS, LAB_CATEGORIES, getExperiment } from "@/content/experiments";

interface ExperimentPageProps {
  params: Promise<{ experimentSlug: string }>;
}

export const dynamicParams = false;

/** Experiments embedded in a lab hub page (with an href) don't get their own route. */
export function generateStaticParams() {
  return EXPERIMENTS.filter((e) => !e.href && EXPERIMENT_COMPONENTS[e.slug]).map((e) => ({ experimentSlug: e.slug }));
}

export async function generateMetadata({ params }: ExperimentPageProps): Promise<Metadata> {
  const { experimentSlug } = await params;
  const experiment = getExperiment(experimentSlug);
  return experiment ? { title: `${experiment.title} · Lab`, description: experiment.summary } : {};
}

export default async function ExperimentPage({ params }: ExperimentPageProps) {
  const { experimentSlug } = await params;
  const experiment = getExperiment(experimentSlug);
  const Experiment = EXPERIMENT_COMPONENTS[experimentSlug];
  if (!experiment || experiment.href || !Experiment) notFound();

  const category = LAB_CATEGORIES[experiment.category];
  const siblings = EXPERIMENTS.filter((e) => e.category === experiment.category);
  const index = siblings.findIndex((e) => e.slug === experiment.slug);
  const digital = experiment.category === "digital";

  return (
    <div className="relative">
      <ExperimentVisitTracker slug={experiment.slug} />
      <div className="bg-circuit-grid pointer-events-none absolute inset-x-0 top-0 h-96 [mask-image:linear-gradient(black,transparent)]" aria-hidden="true" />
      <Container className="relative py-8 sm:py-12">
        <nav aria-label="Breadcrumb">
          <Link href={category.href} className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-cyan">
            <ArrowLeft className="size-4" aria-hidden="true" />
            {category.title}
          </Link>
        </nav>
        <header className="mb-8 mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className={digital ? "eyebrow text-logic" : "eyebrow text-cyan"}>
              {category.title} · Experiment {String(index + 1).padStart(2, "0")}
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">{experiment.title}</h1>
            <p className="mt-3 max-w-2xl text-ink-muted">{experiment.summary}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <DifficultyBadge difficulty={experiment.difficulty} />
            <DurationBadge minutes={experiment.estimatedMinutes} />
            {experiment.lessonHref ? (
              <Link href={experiment.lessonHref} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-line-strong px-3 text-sm text-ink hover:border-cyan/50">
                <BookOpen className="size-4" aria-hidden="true" />
                Learn the idea
              </Link>
            ) : null}
          </div>
        </header>
        <Experiment />
        {experiment.model ? <ModelNote className="mt-6 rounded-xl border border-line px-4">{experiment.model}</ModelNote> : null}
      </Container>
    </div>
  );
}
