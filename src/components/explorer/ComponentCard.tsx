import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ComponentIllustration } from "@/components/illustrations/ComponentIllustration";
import { Badge, DifficultyBadge } from "@/components/ui/Badge";
import { COMPONENT_CATEGORY_LABELS, type ElectronicComponent } from "@/content/component-library";
import { ComponentSymbol } from "./ComponentSymbol";

/** Library card: symbol + real-world look, what it does and where it's used. */
export function ComponentCard({ component }: { component: ElectronicComponent }) {
  return (
    <Link
      href={`/components/${component.slug}`}
      className="panel group flex h-full flex-col overflow-hidden rounded-2xl transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-cyan/45"
    >
      <div className="grid grid-cols-2 divide-x divide-line border-b border-line bg-void/40">
        <figure className="flex flex-col items-center justify-center px-3 pb-2 pt-4">
          <ComponentSymbol
            slug={component.slug}
            name={component.name}
            className="h-16 w-auto max-w-full transition-transform duration-300 group-hover:scale-105"
          />
          <figcaption className="eyebrow mt-2 text-[0.6rem] text-ink-subtle">Symbol</figcaption>
        </figure>
        <figure className="flex flex-col items-center justify-center px-3 pb-2 pt-4">
          <ComponentIllustration
            slug={component.slug}
            className="h-16 w-auto max-w-full transition-transform duration-300 group-hover:scale-105"
          />
          <figcaption className="eyebrow mt-2 text-[0.6rem] text-ink-subtle">Real world</figcaption>
        </figure>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-mono text-xs text-ink-subtle">
              {component.designator} · {COMPONENT_CATEGORY_LABELS[component.category]}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-ink">{component.name}</h2>
          </div>
          <ArrowUpRight
            className="size-5 text-ink-subtle transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan"
            aria-hidden="true"
          />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{component.summary}</p>
        <p className="eyebrow mt-4 text-[0.65rem] text-ink-subtle">Used in</p>
        <ul className="mt-1.5 flex flex-wrap gap-1.5">
          {component.uses.slice(0, 3).map((use) => (
            <li key={use} className="rounded-md bg-surface-high px-2 py-0.5 text-xs text-ink-muted">
              {use}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
          <DifficultyBadge difficulty={component.difficulty} />
          {component.hasDeepDive ? <Badge tone="cyan">Interactive deep-dive</Badge> : <Badge>Overview</Badge>}
        </div>
      </div>
    </Link>
  );
}
