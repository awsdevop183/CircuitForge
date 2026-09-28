import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ComponentSymbol } from "@/components/explorer/ComponentSymbol";
import { ComponentIllustration } from "@/components/illustrations/ComponentIllustration";
import { getComponent } from "@/content/component-library";
import { ComponentSpecification } from "./ComponentSpecification";

/**
 * "See the component": what it looks like, its schematic symbol and its job —
 * the first step of every component lesson.
 */
export function ComponentIntro({ slug, showSpecs = false }: { slug: string; showSpecs?: boolean }) {
  const component = getComponent(slug);
  if (!component) return null;
  return (
    <div className="my-8">
      <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-[1.2fr_1fr_1.3fr]">
        <figure className="flex flex-col items-center justify-center bg-surface-raised p-5">
          <ComponentIllustration slug={slug} className="h-28 w-auto max-w-full" />
          <figcaption className="eyebrow mt-3 text-ink-subtle">What it looks like</figcaption>
        </figure>
        <figure className="flex flex-col items-center justify-center bg-surface-raised p-5">
          <ComponentSymbol slug={slug} name={component.name} className="h-20 w-auto max-w-full" />
          <figcaption className="eyebrow mt-3 text-ink-subtle">Its symbol</figcaption>
        </figure>
        <div className="flex flex-col justify-center bg-surface-raised p-5">
          <p className="eyebrow text-ink-subtle">Its job</p>
          <p className="mt-1 font-display text-2xl font-semibold text-cyan">{component.job}</p>
          <p className="mt-2 text-sm text-ink-muted">{component.summary}</p>
          <Link href={`/components/${slug}`} className="mt-3 inline-flex items-center gap-1 text-sm text-cyan hover:underline">
            Open in the Component Explorer
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
      {showSpecs ? <ComponentSpecification specs={component.specs} className="mt-4" /> : null}
    </div>
  );
}
