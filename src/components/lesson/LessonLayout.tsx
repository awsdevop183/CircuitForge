import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { lessonHref, lessonKey, type LessonLocation } from "@/content/curriculum";
import type { LessonContent, LessonStage } from "@/content/lessons/types";
import { AnalogyCard } from "./AnalogyCard";
import { BeginnerMistakes, WhereYoullFindIt } from "./ComponentLessonBlocks";
import { KeyTakeaway } from "./KeyTakeaway";
import { LessonCompletion } from "./LessonCompletion";
import { LessonHeader } from "./LessonHeader";
import { LessonOutline, type OutlineItem } from "./LessonOutline";
import { LessonSectionBlock } from "./LessonSectionBlock";
import { LessonVisitTracker } from "./LessonVisitTracker";
import { ModuleLessonList } from "./ModuleLessonList";
import { ModuleProgress } from "./ModuleProgress";
import { NextLesson } from "./NextLesson";
import { ReadingProgress } from "./ReadingProgress";
import { STAGES } from "./stages";

const WHERE_ID = "where-youll-find-it";
const MISTAKES_ID = "beginner-mistakes";
const TAKEAWAY_ID = "key-takeaway";
const QUICK_CHECK_ID = "knowledge-check";
const NEXT_ID = "next-lesson";

interface LessonLayoutProps {
  location: LessonLocation;
  content: LessonContent;
}

/**
 * Shared shell for every lesson: header and objective, the learning-loop
 * sections (with the analogy after the first concept), knowledge check,
 * key takeaway, next lesson and pager.
 */
export function LessonLayout({ location, content }: LessonLayoutProps) {
  const { module, lesson, previous, next } = location;
  const progressKey = lessonKey(module.slug, lesson.slug);

  const outline: OutlineItem[] = [
    ...content.sections.map((section) => ({ id: section.id, title: section.title, label: STAGES[section.stage].label })),
    ...(content.whereFound?.length ? [{ id: WHERE_ID, title: "Where you'll find it", label: STAGES["real-world"].label }] : []),
    ...(content.mistakes?.length ? [{ id: MISTAKES_ID, title: "Common beginner mistakes", label: "Avoid" }] : []),
    { id: QUICK_CHECK_ID, title: "Knowledge check", label: STAGES["quick-check"].label },
    { id: TAKEAWAY_ID, title: "Key takeaway", label: "Summary" },
    { id: NEXT_ID, title: content.next.title, label: STAGES.next.label },
  ];

  const stageAnchors: Partial<Record<LessonStage, string>> = { "quick-check": QUICK_CHECK_ID, next: NEXT_ID };
  for (const section of content.sections) {
    stageAnchors[section.stage] ??= section.id;
  }
  if (content.whereFound?.length) stageAnchors["real-world"] ??= WHERE_ID;

  return (
    <>
      <LessonVisitTracker progressKey={progressKey} />
      <ReadingProgress />
      <LessonHeader location={location} content={content} stageAnchors={stageAnchors} />

      <Container className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_16rem] xl:grid-cols-[minmax(0,1fr)_18rem]">
        <article aria-labelledby="lesson-title" className="min-w-0">
          <h2 id="lesson-title" className="sr-only">
            {lesson.title}
          </h2>
          {content.sections.map((section, index) => (
            <LessonSectionBlock key={section.id} id={section.id} stage={section.stage} title={section.title}>
              {section.content}
              {/* The analogy follows the first concept, while the idea is fresh. */}
              {index === 0 ? <AnalogyCard analogy={content.analogy} /> : null}
            </LessonSectionBlock>
          ))}

          {content.whereFound?.length ? (
            <LessonSectionBlock id={WHERE_ID} stage="real-world" title="Where you'll find it">
              <WhereYoullFindIt places={content.whereFound} />
            </LessonSectionBlock>
          ) : null}

          {content.mistakes?.length ? <BeginnerMistakes id={MISTAKES_ID} mistakes={content.mistakes} safety={content.safety} /> : null}

          <LessonSectionBlock id={QUICK_CHECK_ID} stage="quick-check" title="Knowledge check">
            <LessonCompletion progressKey={progressKey} questions={content.quickCheck} />
          </LessonSectionBlock>

          <section id={TAKEAWAY_ID} aria-labelledby={`${TAKEAWAY_ID}-heading`} className="border-t border-line py-12 sm:py-14">
            <p className="eyebrow text-amber">Summary</p>
            <h2 id={`${TAKEAWAY_ID}-heading`} className="mt-3 text-2xl font-semibold text-ink sm:text-3xl">
              What to remember
            </h2>
            <div className="mt-6">
              <KeyTakeaway headline={content.keyTakeaway} items={content.takeaways} />
            </div>
          </section>

          <LessonSectionBlock id={NEXT_ID} stage="next" title={content.next.title}>
            <NextLesson next={content.next} />
          </LessonSectionBlock>

          <nav aria-label="Lesson pagination" className="mt-4 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
            {previous ? (
              <PagerLink href={lessonHref(previous.module.slug, previous.lesson.slug)} label="Previous lesson" title={previous.lesson.title} direction="previous" />
            ) : (
              <PagerLink href={`/learn/${module.slug}`} label="Back to" title="Module overview" direction="previous" />
            )}
            {next ? (
              <PagerLink href={lessonHref(next.module.slug, next.lesson.slug)} label="Next lesson" title={next.lesson.title} direction="next" />
            ) : (
              <PagerLink href="/lab" label="Keep going" title="Practise in the Interactive Lab" direction="next" />
            )}
          </nav>
        </article>

        <aside className="hidden lg:block" aria-label="Lesson navigation">
          <div className="sticky top-24 max-h-[calc(100dvh-7rem)] space-y-8 overflow-y-auto pb-6 pr-1">
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

function PagerLink({ href, label, title, direction }: { href: string; label: string; title: string; direction: "previous" | "next" }) {
  const next = direction === "next";
  return (
    <Link href={href} className={`panel group rounded-xl p-4 transition-colors hover:border-cyan/45 ${next ? "text-right sm:col-start-2" : ""}`}>
      <span className={`flex items-center gap-1.5 text-xs text-ink-subtle ${next ? "justify-end" : ""}`}>
        {next ? null : <ArrowLeft className="size-3.5" aria-hidden="true" />}
        {label}
        {next ? <ArrowRight className="size-3.5" aria-hidden="true" /> : null}
      </span>
      <span className="mt-1 block font-semibold text-ink group-hover:text-cyan">{title}</span>
    </Link>
  );
}
