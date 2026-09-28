import { CircleAlert, CircleCheck, TriangleAlert } from "lucide-react";
import type { BeginnerMistake, WhereFound } from "@/content/lessons/types";
import { SafetyNotice, type SafetyTopic } from "@/components/ui/SafetyNotice";

/** "Where you'll find it" — everyday places the component turns up. */
export function WhereYoullFindIt({ places }: { places: readonly WhereFound[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {places.map(({ icon: Icon, place, detail }) => (
        <li key={place} className="panel flex gap-4 rounded-xl p-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-amber/35 bg-amber/10 text-amber">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-semibold text-ink">{place}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">{detail}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** A visually prominent list of mistakes beginners make — and how to avoid them. */
export function BeginnerMistakes({ id, mistakes, safety }: { id: string; mistakes: readonly BeginnerMistake[]; safety?: readonly SafetyTopic[] }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="border-t border-line py-12 sm:py-14">
      <div className="rounded-2xl border-2 border-orange/45 bg-orange/[0.06] p-5 sm:p-7">
        <p className="eyebrow flex items-center gap-2 text-orange">
          <TriangleAlert className="size-4" aria-hidden="true" />
          Avoid these
        </p>
        <h2 id={`${id}-heading`} className="mt-3 text-2xl font-semibold text-ink sm:text-3xl">
          Common beginner mistakes
        </h2>
        <ol className="mt-6 grid gap-3 md:grid-cols-2">
          {mistakes.map((m, i) => (
            <li key={m.mistake} className="rounded-xl border border-line bg-surface/80 p-4">
              <p className="flex gap-2 font-semibold text-ink">
                <span className="font-mono text-orange">{String(i + 1).padStart(2, "0")}</span>
                {m.mistake}
              </p>
              {m.consequence ? (
                <p className="mt-2 flex gap-2 text-sm text-ink-muted">
                  <CircleAlert className="mt-0.5 size-4 shrink-0 text-negative" aria-hidden="true" />
                  <span>
                    <span className="sr-only">What happens: </span>
                    {m.consequence}
                  </span>
                </p>
              ) : null}
              <p className="mt-2 flex gap-2 text-sm text-ink-muted">
                <CircleCheck className="mt-0.5 size-4 shrink-0 text-positive" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-positive">Instead: </span>
                  {m.fix}
                </span>
              </p>
            </li>
          ))}
        </ol>
      </div>
      {safety?.length ? (
        <div className="mt-6 space-y-3">
          {safety.map((topic) => (
            <SafetyNotice key={topic} topic={topic} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
