import type { ReactNode } from "react";
import { FlaskConical } from "lucide-react";

interface ComponentExperimentProps {
  title: string;
  /** A short "try this" prompt shown above the experiment. */
  prompt?: ReactNode;
  children: ReactNode;
}

/** Frame for a component's interactive demonstration. */
export function ComponentExperiment({ title, prompt, children }: ComponentExperimentProps) {
  return (
    <section aria-label={title} className="panel-raised overflow-hidden rounded-2xl">
      <header className="flex flex-col gap-1 border-b border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-ink-subtle">
          <FlaskConical className="size-4 text-amber" aria-hidden="true" />
          {title}
        </h3>
        {prompt ? <p className="text-sm text-ink-muted">{prompt}</p> : null}
      </header>
      {children}
    </section>
  );
}
