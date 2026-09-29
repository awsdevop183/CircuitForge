import Link from "next/link";
import { ChevronRight, Link2 } from "lucide-react";
import { DifficultyBadge, DurationBadge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import type { LessonLocation } from "@/content/curriculum";
import type { LessonContent, LessonStage } from "@/content/lessons/types";
import { LearningObjective } from "./LearningObjective";
import { ModuleProgress } from "./ModuleProgress";
import { StageStepper } from "./StageStepper";

interface LessonHeaderProps {
  location: LessonLocation;
  content: LessonContent;
  stageAnchors: Partial<Record<LessonStage, string>>;
}

export function LessonHeader({ location, content, stageAnchors }: LessonHeaderProps) {
  const { module, lesson, index } = location;
  return (
    <header className="relative overflow-hidden border-b border-line">
      <div
        className="bg-circuit-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_left,black_10%,transparent_70%)]"
        aria-hidden="true"
      />
      <Container className="relative py-10 sm:py-14">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-subtle">
            <li>
              <Link href="/learn" className="hover:text-cyan">
                Learn
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3.5" />
            </li>
            <li>
              <Link href={`/learn/${module.slug}`} className="hover:text-cyan">
                {module.number} · {module.title}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3.5" />
            </li>
            <li aria-current="page" className="text-ink-muted">
              Lesson {index + 1}
            </li>
          </ol>
        </nav>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div>
            <p className="eyebrow text-cyan">
              Lesson {index + 1} of {module.lessons.length}
            </p>
            <h1 className="mt-3 text-balance text-4xl font-semibold text-ink sm:text-5xl">{lesson.title}</h1>
            <p className="mt-4 max-w-2xl text-lg text-ink-muted">{lesson.summary}</p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <DurationBadge minutes={lesson.estimatedMinutes} />
              <DifficultyBadge difficulty={lesson.difficulty} />
            </div>
            {content.buildsOn?.length ? (
              <p className="mt-4 flex flex-wrap items-center gap-2 text-xs text-ink-subtle">
                <Link2 className="size-3.5" aria-hidden="true" />
                Builds on:
                {content.buildsOn.map((item) => (
                  <span key={item} className="rounded-md border border-line bg-surface px-2 py-0.5 text-ink-muted">
                    {item}
                  </span>
                ))}
              </p>
            ) : null}
          </div>
          <div className="space-y-4">
            <LearningObjective objective={content.objective} supporting={content.objectives} />
            <ModuleProgress module={module} />
          </div>
        </div>

        <div className="mt-8">
          <StageStepper anchors={stageAnchors} />
        </div>
      </Container>
    </header>
  );
}
