import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { EXPERIMENT_COMPONENTS } from "@/components/lab/registry";
import { DifficultyBadge, DurationBadge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { EXPERIMENTS, getExperiment } from "@/content/experiments";

interface ExperimentPageProps {
  params: Promise<{ experimentSlug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return EXPERIMENTS.filter((e) => e.available && EXPERIMENT_COMPONENTS[e.slug]).map((e) => ({
    experimentSlug: e.slug,
  }));
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
  if (!experiment || !experiment.available || !Experiment) notFound();

  const index = EXPERIMENTS.findIndex((e) => e.slug === experiment.slug);

  return (
    <div className="relative">
      <div className="bg-circuit-grid pointer-events-none absolute inset-x-0 top-0 h-96 [mask-image:linear-gradient(black,transparent)]" aria-hidden="true" />
      <Container className="relative py-8 sm:py-12">
        <Link href="/lab" className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-cyan">
          <ArrowLeft className="size-4" aria-hidden="true" />
          All experiments
        </Link>
        <header className="mb-8 mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-cyan">Experiment {String(index + 1).padStart(2, "0")}</p>
            <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">{experiment.title}</h1>
            <p className="mt-3 max-w-2xl text-ink-muted">{experiment.summary}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <DifficultyBadge difficulty={experiment.difficulty} />
            <DurationBadge minutes={experiment.estimatedMinutes} />
          </div>
        </header>
        <Experiment />
      </Container>
    </div>
  );
}
