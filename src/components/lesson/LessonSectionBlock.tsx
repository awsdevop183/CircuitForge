import type { ReactNode } from "react";
import type { LessonStage } from "@/content/lessons/types";
import { STAGES, STAGE_ORDER } from "./stages";

interface LessonSectionBlockProps {
  id: string;
  stage: LessonStage;
  title: string;
  children: ReactNode;
}

/** One step of the learning loop, labelled with its stage. */
export function LessonSectionBlock({ id, stage, title, children }: LessonSectionBlockProps) {
  const { label, icon: Icon } = STAGES[stage];
  const stepNumber = STAGE_ORDER.indexOf(stage) + 1;
  const headingId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={headingId} className="relative border-t border-line py-12 first:border-t-0 first:pt-0 sm:py-14">
      <p className="eyebrow flex items-center gap-2 text-cyan">
        <span className="flex size-6 items-center justify-center rounded-md border border-cyan/40 bg-cyan/10">
          <Icon className="size-3.5" aria-hidden="true" />
        </span>
        <span className="text-ink-subtle">0{stepNumber}</span>
        {label}
      </p>
      <h2 id={headingId} className="mt-3 text-balance text-2xl font-semibold text-ink sm:text-3xl">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}
