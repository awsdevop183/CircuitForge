import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ComingSoonBadge, DifficultyBadge, DurationBadge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import type { Experiment } from "@/content/experiments";
import { cn } from "@/lib/cn";

export function ExperimentCard({ experiment, index }: { experiment: Experiment; index: number }) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "flex size-12 items-center justify-center rounded-xl border",
            experiment.available
              ? "border-cyan/40 bg-cyan/10 text-cyan shadow-[0_0_20px_-6px_rgb(34_211_238/0.6)]"
              : "border-line-strong bg-surface-high text-ink-subtle",
          )}
        >
          <Icon name={experiment.icon} className="size-6" />
        </span>
        <span className="font-mono text-xs text-ink-subtle">EXP-{String(index + 1).padStart(2, "0")}</span>
      </div>
      <h2 className="mt-5 text-xl font-semibold text-ink">{experiment.title}</h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{experiment.summary}</p>
      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Concepts">
        {experiment.concepts.map((concept) => (
          <li key={concept} className="rounded-md bg-surface-high px-2 py-0.5 text-xs text-ink-muted">
            {concept}
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <DifficultyBadge difficulty={experiment.difficulty} />
        <DurationBadge minutes={experiment.estimatedMinutes} />
        {experiment.available ? (
          <span className="ml-auto flex items-center gap-1 text-sm font-semibold text-cyan">
            Launch
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        ) : (
          <ComingSoonBadge className="ml-auto" />
        )}
      </div>
    </>
  );

  const classes = "panel group flex h-full flex-col rounded-2xl p-6 transition-[border-color,transform] duration-300";

  return experiment.available ? (
    <Link href={`/lab/${experiment.slug}`} className={cn(classes, "hover:-translate-y-0.5 hover:border-cyan/45")}>
      {body}
    </Link>
  ) : (
    <div className={cn(classes, "opacity-70")} aria-disabled="true">
      {body}
    </div>
  );
}
