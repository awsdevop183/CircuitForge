import { FlaskConical, Info, Lightbulb, TriangleAlert, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type CalloutKind = "info" | "tip" | "try" | "warning";

const KINDS: Record<CalloutKind, { icon: LucideIcon; label: string; classes: string; iconClasses: string }> = {
  info: { icon: Info, label: "Note", classes: "border-electric/30 bg-electric/5", iconClasses: "text-electric" },
  tip: { icon: Lightbulb, label: "Analogy", classes: "border-amber/30 bg-amber/5", iconClasses: "text-amber" },
  try: { icon: FlaskConical, label: "Try it yourself", classes: "border-cyan/35 bg-cyan/5", iconClasses: "text-cyan" },
  warning: { icon: TriangleAlert, label: "Safety", classes: "border-orange/40 bg-orange/5", iconClasses: "text-orange" },
};

interface CalloutProps {
  kind?: CalloutKind;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Callout({ kind = "info", title, children, className }: CalloutProps) {
  const config = KINDS[kind];
  const Icon = config.icon;
  return (
    <aside className={cn("flex gap-3 rounded-xl border p-4 sm:p-5", config.classes, className)}>
      <Icon className={cn("mt-0.5 size-5 shrink-0", config.iconClasses)} aria-hidden="true" />
      <div className="min-w-0 text-sm leading-relaxed text-ink-muted">
        <p className={cn("eyebrow mb-1", config.iconClasses)}>{title ?? config.label}</p>
        <div className="space-y-2 [&_strong]:text-ink">{children}</div>
      </div>
    </aside>
  );
}
