import { Lightbulb, TriangleAlert } from "lucide-react";
import type { LessonAnalogy } from "@/content/lessons/types";

/** A real-world analogy, with an honest note about where it breaks down. */
export function AnalogyCard({ analogy }: { analogy: LessonAnalogy }) {
  return (
    <aside aria-label={`Analogy: ${analogy.title}`} className="my-8 overflow-hidden rounded-2xl border border-amber/35 bg-amber/[0.05]">
      <div className="p-5 sm:p-6">
        <p className="eyebrow flex items-center gap-2 text-amber">
          <Lightbulb className="size-4" aria-hidden="true" />
          Real-world analogy
        </p>
        <p className="mt-2 font-display text-lg font-semibold text-ink">{analogy.title}</p>
        <div className="mt-2 space-y-3 text-sm leading-relaxed text-ink-muted sm:text-base [&_strong]:text-ink">{analogy.content}</div>
      </div>
      {analogy.limits?.length ? (
        <div className="border-t border-amber/20 bg-void/30 px-5 py-4 sm:px-6">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-subtle">
            <TriangleAlert className="size-3.5" aria-hidden="true" />
            Where the analogy breaks down
          </p>
          <ul className="mt-2 space-y-1.5">
            {analogy.limits.map((limit) => (
              <li key={limit} className="flex gap-2 text-sm text-ink-muted">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-amber" aria-hidden="true" />
                {limit}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}
