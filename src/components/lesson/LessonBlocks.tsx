import type { ComponentType, ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

/** Short explanatory paragraph(s). Keep text lean — the visuals do the teaching. */
export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "max-w-2xl space-y-4 text-base leading-relaxed text-ink-muted sm:text-[1.0625rem] [&_strong]:font-semibold [&_strong]:text-ink",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** A large visual/interactive area inside a lesson section. */
export function VisualStage({ children, caption, className }: { children: ReactNode; caption?: ReactNode; className?: string }) {
  return (
    <figure className={cn("my-8", className)}>
      <div className="panel-raised overflow-hidden rounded-2xl">{children}</div>
      {caption ? <figcaption className="mt-3 text-sm text-ink-subtle">{caption}</figcaption> : null}
    </figure>
  );
}

/** A grid of small concept cards (icon/term + one-line explanation). */
export function ConceptGrid({ children, columns = 3 }: { children: ReactNode; columns?: 2 | 3 | 4 }) {
  const cols = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[columns];
  return <div className={cn("my-8 grid gap-3", cols)}>{children}</div>;
}

export function ConceptCard({
  title,
  children,
  visual,
  accent = "cyan",
}: {
  title: string;
  children: ReactNode;
  visual?: ReactNode;
  accent?: "cyan" | "amber";
}) {
  return (
    <div className="panel flex flex-col rounded-xl p-5">
      {visual ? <div className="mb-4 flex h-16 items-center">{visual}</div> : null}
      <p className={cn("font-display text-lg font-semibold", accent === "cyan" ? "text-cyan" : "text-amber")}>{title}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{children}</p>
    </div>
  );
}

/** Highlighted single insight inside a section. */
export function KeyIdea({ children }: { children: ReactNode }) {
  return (
    <p className="my-8 flex items-start gap-3 rounded-xl border-l-2 border-cyan bg-cyan/5 py-4 pl-5 pr-4 font-display text-lg leading-snug text-ink sm:text-xl">
      <Sparkles className="mt-1 size-5 shrink-0 text-cyan" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

/** An everyday example of the concept. */
export function RealWorldCard({
  icon: Icon,
  title,
  children,
}: {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" }>;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="panel flex gap-4 rounded-xl p-5">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-amber/35 bg-amber/10 text-amber">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div>
        <p className="font-semibold text-ink">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">{children}</p>
      </div>
    </div>
  );
}
