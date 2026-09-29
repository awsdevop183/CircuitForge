import type { ReactNode } from "react";
import { FlaskConical, Info } from "lucide-react";
import { cn } from "@/lib/cn";

interface InteractivePanelProps {
  title: string;
  /** A short "try this" prompt shown in the header. */
  prompt?: ReactNode;
  /** Right-aligned extra content in the header (status, icon…). */
  aside?: ReactNode;
  /** Show the flask icon before the title (for experiments). */
  experiment?: boolean;
  /**
   * Describes the simplifications of an educational simulation, e.g.
   * "Ideal wires; the LED is modelled as a fixed 2 V drop." Shown as a footer note.
   */
  model?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Classes for the body. Defaults to padded; pass "p-0" for full-bleed content. */
  bodyClassName?: string;
}

/**
 * The one framed panel for interactive content across CircuitForge: lab
 * instruments, component demos and lesson experiments.
 */
export function InteractivePanel({ title, prompt, aside, experiment = false, model, children, className, bodyClassName }: InteractivePanelProps) {
  return (
    <section className={cn("panel-raised overflow-hidden rounded-2xl", className)} aria-label={title}>
      <header className="flex flex-col gap-1 border-b border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <h2 className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-ink-subtle">
          {experiment ? <FlaskConical className="size-4 text-amber" aria-hidden="true" /> : null}
          {title}
        </h2>
        {prompt ? <p className="text-sm text-ink-muted">{prompt}</p> : null}
        {aside}
      </header>
      <div className={cn("p-4 sm:p-5", bodyClassName)}>{children}</div>
      {model ? <ModelNote>{model}</ModelNote> : null}
    </section>
  );
}

/** "Educational model" disclosure for simplified simulations. */
export function ModelNote({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("flex items-start gap-2 border-t border-line px-4 py-3 text-xs text-ink-subtle sm:px-5", className)}>
      <Info className="mt-0.5 size-3.5 shrink-0 text-electric" aria-hidden="true" />
      <span>
        <span className="font-semibold text-ink-muted">Educational model: </span>
        {children}
      </span>
    </p>
  );
}
