import Link from "next/link";
import { BookOpen } from "lucide-react";
import { ComingSoonBadge, DifficultyBadge, PreviewBadge, Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { availableLessons } from "@/content/curriculum";
import type { LearningModule } from "@/content/types";
import { cn } from "@/lib/cn";
import { ModuleCardAction } from "./ModuleCardAction";
import { ModuleProgress } from "@/components/lesson/ModuleProgress";

/** Dashboard card for one learning-path module. */
export function ModuleCard({ module }: { module: LearningModule }) {
  const live = availableLessons(module).length;
  const locked = module.status === "coming-soon";

  return (
    <article
      aria-labelledby={`module-${module.slug}-title`}
      className={cn(
        "panel group relative flex h-full flex-col overflow-hidden rounded-2xl p-6 transition-colors",
        !locked && "hover:border-cyan/40",
      )}
    >
      {/* Faint oversized index for depth */}
      <span className="pointer-events-none absolute -bottom-8 -right-2 font-display text-[7rem] font-bold leading-none text-white/[0.025]" aria-hidden="true">
        {module.number}
      </span>

      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "flex size-12 items-center justify-center rounded-xl border",
            locked ? "border-line-strong bg-surface-high text-ink-subtle" : "border-cyan/40 bg-cyan/10 text-cyan",
          )}
        >
          <Icon name={module.icon} className="size-6" />
        </span>
        {module.status === "available" ? <Badge tone="positive">Available</Badge> : module.status === "preview" ? <PreviewBadge /> : <ComingSoonBadge />}
      </div>

      <p className="mt-5 font-mono text-xs text-ink-subtle">Module {module.number}</p>
      <h2 id={`module-${module.slug}-title`} className="mt-1 text-2xl font-semibold text-ink">
        <Link href={`/learn/${module.slug}`} className="after:absolute after:inset-0 after:content-['']">
          {module.title}
        </Link>
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{module.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <DifficultyBadge difficulty={module.difficulty} />
        <Badge>
          <BookOpen className="size-3" aria-hidden="true" />
          {module.lessons.length} lessons
        </Badge>
      </div>

      <div className="mt-auto pt-6">
        {live > 0 ? (
          <ModuleProgress module={module} />
        ) : (
          <p className="text-xs text-ink-subtle">
            {module.status === "preview" ? "Lessons in development — explore related tools now." : "Planned for a future release."}
          </p>
        )}
        {/* Sits above the card-wide link overlay so it stays clickable */}
        <div className="relative z-10 mt-4">
          <ModuleCardAction module={module} />
        </div>
      </div>
    </article>
  );
}
