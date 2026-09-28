import { Target } from "lucide-react";

/** "By the end of this lesson…" — one clear goal plus optional supporting goals. */
export function LearningObjective({ objective, supporting = [] }: { objective: string; supporting?: readonly string[] }) {
  return (
    <div className="panel rounded-2xl p-5">
      <p className="flex items-center gap-2 text-sm font-semibold text-ink">
        <Target className="size-4 text-amber" aria-hidden="true" />
        Learning objective
      </p>
      <p className="mt-2 text-ink">{objective}</p>
      {supporting.length > 0 ? (
        <ul className="mt-3 space-y-1.5 border-t border-line pt-3">
          {supporting.map((goal) => (
            <li key={goal} className="flex gap-2 text-sm text-ink-muted">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-cyan" aria-hidden="true" />
              {goal}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
