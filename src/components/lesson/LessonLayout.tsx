import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight, Target } from "lucide-react";
import { DifficultyBadge, DurationBadge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { lessonHref, lessonKey, type LessonLocation } from "@/content/curriculum";
import type { LessonContent, LessonStage } from "@/content/lessons/types";
import { KeyTakeaways } from "./KeyTakeaways";
import { LessonCompletion } from "./LessonCompletion";
import { LessonOutline, type OutlineItem } from "./LessonOutline";
import { LessonSectionBlock } from "./LessonSectionBlock";
import { ModuleLessonList } from "./ModuleLessonList";
import { ModuleProgress } from "./ModuleProgress";
import { ReadingProgress } from "./ReadingProgress";
import { StageStepper } from "./StageStepper";
import { STAGES } from "./stages";

const TAKEAWAYS_ID = "key-takeaways";
const QUICK_CHECK_ID = "quick-check";
const NEXT_ID = "next-concept";

interface LessonLayoutProps {
  location: LessonLocation;
  content: LessonContent;
}

/**
 * Shared shell for every lesson: header, stage stepper, the learning-loop
 * sections, takeaways, quick check, next concept and pager.
 */
export function LessonLayout({ location, content }: LessonLayoutProps) {
  const { module, lesson, index, previous, next } = location;
  const progressKey = lessonKey(module.slug, lesson.slug);

  const outline: OutlineItem[] = [
    ...content.sections.map((section) => ({ id: section.id, title: section.title, label: STAGES[section.stage].label })),
    { id: TAKEAWAYS_ID, title: "Key takeaways", label: "Summary" },
    { id: QUICK_CHECK_ID, title: "Check your understanding", label: STAGES["quick-check"].label },
    { id: NEXT_ID, title: content.next.title, label: STAGES.next.label },
  ];

  const stageAnchors: Partial<Record<LessonStage, string>> = { "quick-check": QUICK_CHECK_ID, next: NEXT_ID };
  for (const section of content.sections) {
    stageAnchors[section.stage] ??= section.id;
  }

  return (
    <>
      <ReadingProgress />
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

          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-end">
            <div>
              <p className="eyebrow text-cyan">
                Lesson {index + 1} of {module.lessons.length}
              </p>
              <h1 className="mt-3 text-balance text-4xl font-semibold text-ink sm:text-5xl">{lesson.title}</h1>
              <p className="mt-4 max-w-2xl text-lg text-ink-muted">{lesson.summary}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <DurationBadge minutes={lesson.estimatedMinutes} />
                <DifficultyBadge difficulty={lesson.difficulty} />
              </div>
            </div>
            <div className="panel rounded-2xl p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Target className="size-4 text-amber" aria-hidden="true" />
                You will be able to
              </p>
              <ul className="mt-3 space-y-2">
                {content.objectives.map((objective) => (
                  <li key={objective} className="flex gap-2 text-sm text-ink-muted">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-cyan" aria-hidden="true" />
                    {objective}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <StageStepper anchors={stageAnchors} />
          </div>
        </Container>
      </header>

      <Container className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_16rem] xl:grid-cols-[minmax(0,1fr)_18rem]">
        <article aria-labelledby="lesson-title" className="min-w-0">
          <h2 id="lesson-title" className="sr-only">
            {lesson.title}
          </h2>
          {content.sections.map((section) => (
            <LessonSectionBlock key={section.id} id={section.id} stage={section.stage} title={section.title}>
              {section.content}
            </LessonSectionBlock>
          ))}

          <section id={TAKEAWAYS_ID} aria-labelledby={`${TAKEAWAYS_ID}-heading`} className="border-t border-line py-12 sm:py-14">
            <p className="eyebrow text-amber">Summary</p>
            <h2 id={`${TAKEAWAYS_ID}-heading`} className="mt-3 text-2xl font-semibold text-ink sm:text-3xl">
              Key takeaways
            </h2>
            <div className="mt-6">
              <KeyTakeaways items={content.takeaways} />
            </div>
          </section>

          <LessonSectionBlock id={QUICK_CHECK_ID} stage="quick-check" title="Check your understanding">
            <LessonCompletion progressKey={progressKey} questions={content.quickCheck} />
          </LessonSectionBlock>

          <LessonSectionBlock id={NEXT_ID} stage="next" title={content.next.title}>
            <div className="panel-raised relative overflow-hidden rounded-2xl p-6 sm:p-8">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-cyan via-amber to-transparent" aria-hidden="true" />
              <p className="max-w-xl text-ink-muted">{content.next.description}</p>
              <ButtonLink href={content.next.href} className="mt-6">
                {content.next.cta}
                <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
            </div>
          </LessonSectionBlock>

          <nav aria-label="Lesson pagination" className="mt-4 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
            {previous ? (
              <Link
                href={lessonHref(previous.module.slug, previous.lesson.slug)}
                className="panel group rounded-xl p-4 transition-colors hover:border-cyan/45"
              >
                <span className="flex items-center gap-1.5 text-xs text-ink-subtle">
                  <ArrowLeft className="size-3.5" aria-hidden="true" /> Previous lesson
                </span>
                <span className="mt-1 block font-semibold text-ink group-hover:text-cyan">{previous.lesson.title}</span>
              </Link>
            ) : (
              <Link href="/learn" className="panel group rounded-xl p-4 transition-colors hover:border-cyan/45">
                <span className="flex items-center gap-1.5 text-xs text-ink-subtle">
                  <ArrowLeft className="size-3.5" aria-hidden="true" /> Back to
                </span>
                <span className="mt-1 block font-semibold text-ink group-hover:text-cyan">Learning dashboard</span>
              </Link>
            )}
            {next ? (
              <Link
                href={lessonHref(next.module.slug, next.lesson.slug)}
                className="panel group rounded-xl p-4 text-right transition-colors hover:border-cyan/45"
              >
                <span className="flex items-center justify-end gap-1.5 text-xs text-ink-subtle">
                  Next lesson <ArrowRight className="size-3.5" aria-hidden="true" />
                </span>
                <span className="mt-1 block font-semibold text-ink group-hover:text-cyan">{next.lesson.title}</span>
              </Link>
            ) : (
              <Link href="/lab" className="panel group rounded-xl p-4 text-right transition-colors hover:border-cyan/45">
                <span className="flex items-center justify-end gap-1.5 text-xs text-ink-subtle">
                  Keep going <ArrowRight className="size-3.5" aria-hidden="true" />
                </span>
                <span className="mt-1 block font-semibold text-ink group-hover:text-cyan">Practise in the Interactive Lab</span>
              </Link>
            )}
          </nav>
        </article>

        <aside className="hidden lg:block" aria-label="Lesson navigation">
          <div className="sticky top-24 space-y-8">
            <ModuleProgress module={module} />
            <LessonOutline items={outline} />
            <ModuleLessonList module={module} currentLessonSlug={lesson.slug} />
          </div>
        </aside>
      </Container>

      {/* Module lessons for small screens (the sidebar is hidden there). */}
      <Container className="lg:hidden">
        <div className="panel rounded-2xl p-5">
          <ModuleProgress module={module} className="mb-6" />
          <ModuleLessonList module={module} currentLessonSlug={lesson.slug} />
        </div>
      </Container>
    </>
  );
}
