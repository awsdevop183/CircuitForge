import { CircleCheck, Info, TriangleAlert, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Level = "ok" | "info" | "caution" | "danger";

const LEVELS: Record<Level, { icon: LucideIcon; classes: string; iconClass: string }> = {
  ok: { icon: CircleCheck, classes: "border-positive/45 bg-positive/[0.06]", iconClass: "text-positive" },
  info: { icon: Info, classes: "border-line-strong bg-void/40", iconClass: "text-electric" },
  caution: { icon: TriangleAlert, classes: "border-orange/50 bg-orange/[0.07]", iconClass: "text-orange" },
  danger: { icon: TriangleAlert, classes: "border-negative/60 bg-negative/10", iconClass: "text-negative" },
};

/** A live status line: icon + heading + text, never colour alone. */
export function StatusBanner({ level, title, children, className }: { level: Level; title: string; children?: ReactNode; className?: string }) {
  const { icon: Icon, classes, iconClass } = LEVELS[level];
  return (
    <div role="status" aria-live="polite" className={cn("flex items-start gap-3 rounded-xl border p-4 text-sm", classes, className)}>
      <Icon className={cn("mt-0.5 size-5 shrink-0", iconClass)} aria-hidden="true" />
      <p className="text-ink-muted">
        <strong className={cn("block", iconClass)}>{title}</strong>
        {children}
      </p>
    </div>
  );
}
