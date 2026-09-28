import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ExperimentPanelProps {
  title: string;
  /** Right-aligned status/extra content in the panel header. */
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

/** A bench-instrument panel with a labelled header strip. */
export function ExperimentPanel({ title, aside, children, className, bodyClassName }: ExperimentPanelProps) {
  return (
    <section className={cn("panel-raised overflow-hidden rounded-2xl", className)} aria-label={title}>
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
        <h2 className="eyebrow font-mono text-ink-subtle">{title}</h2>
        {aside}
      </div>
      <div className={cn("p-4 sm:p-5", bodyClassName)}>{children}</div>
    </section>
  );
}
