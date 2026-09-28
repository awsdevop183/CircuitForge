import { ChevronRight } from "lucide-react";
import type { LessonStage } from "@/content/lessons/types";
import { STAGES, STAGE_ORDER } from "./stages";

/**
 * The six-stage learning loop, linking to the first section of each stage.
 * Scrolls horizontally on small screens.
 */
export function StageStepper({ anchors }: { anchors: Partial<Record<LessonStage, string>> }) {
  return (
    <nav aria-label="Lesson stages" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ol className="flex min-w-max items-center gap-1">
        {STAGE_ORDER.map((stage, index) => {
          const { label, icon: Icon } = STAGES[stage];
          const anchor = anchors[stage];
          return (
            <li key={stage} className="flex items-center gap-1">
              <a
                href={anchor ? `#${anchor}` : undefined}
                className="flex items-center gap-2 rounded-lg border border-line bg-surface/70 px-2.5 py-1.5 text-xs text-ink-muted transition-colors hover:border-cyan/50 hover:text-ink"
              >
                <Icon className="size-3.5 text-cyan" aria-hidden="true" />
                <span>
                  <span className="sr-only">Stage {index + 1}: </span>
                  {label}
                </span>
              </a>
              {index < STAGE_ORDER.length - 1 ? <ChevronRight className="size-3.5 text-ink-subtle" aria-hidden="true" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
