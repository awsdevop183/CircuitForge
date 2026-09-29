import type { ComponentSpecification as Spec } from "@/content/component-library";
import { cn } from "@/lib/cn";

/** The few numbers on a datasheet a beginner should care about — and why. */
export function ComponentSpecification({ specs, className }: { specs: readonly Spec[]; className?: string }) {
  return (
    <dl className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2", className)}>
      {specs.map((spec) => (
        <div key={spec.label} className="panel rounded-xl p-4">
          <dt className="text-xs font-medium uppercase tracking-[0.1em] text-ink-subtle">{spec.label}</dt>
          <dd className="mt-1 font-mono text-lg text-ink">{spec.value}</dd>
          <dd className="mt-1 text-sm text-ink-muted">{spec.why}</dd>
        </div>
      ))}
    </dl>
  );
}
