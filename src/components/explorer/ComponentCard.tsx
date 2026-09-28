"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ComponentIllustration } from "@/components/illustrations/ComponentIllustration";
import { Badge, DifficultyBadge } from "@/components/ui/Badge";
import { COMPONENT_TAG_LABELS, type ElectronicComponent } from "@/content/component-library";
import { ComponentSymbol } from "./ComponentSymbol";

/** Library card: real-world look + symbol, its job, difficulty and a way in. */
export function ComponentCard({ component }: { component: ElectronicComponent }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="panel group relative flex h-full flex-col overflow-hidden rounded-2xl transition-colors duration-300 focus-within:border-cyan/45 hover:border-cyan/45"
    >
      <div className="relative flex h-40 items-center justify-center border-b border-line bg-void/40">
        <div className="bg-circuit-grid absolute inset-0 opacity-50" aria-hidden="true" />
        <ComponentIllustration
          slug={component.slug}
          className="relative h-24 w-auto max-w-[70%] transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute bottom-2 right-2 rounded-lg border border-line bg-surface/90 p-1.5">
          <ComponentSymbol slug={component.slug} name={component.name} className="h-9 w-auto" />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-xs text-ink-subtle">
          {component.designator} · {component.tags.map((tag) => COMPONENT_TAG_LABELS[tag]).join(" · ")}
        </p>
        <h2 className="mt-1 text-xl font-semibold text-ink">{component.name}</h2>
        <p className="mt-2 text-base font-medium text-cyan-soft">{component.job}</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">{component.summary}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
          <DifficultyBadge difficulty={component.difficulty} />
          <Badge tone="cyan">Interactive</Badge>
        </div>
        <Link
          href={`/components/${component.slug}`}
          className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line-strong bg-surface-raised px-4 text-sm font-semibold text-ink transition-colors after:absolute after:inset-0 after:content-[''] group-hover:border-cyan/50 group-hover:text-cyan"
        >
          Explore Component
          <span className="sr-only">: {component.name}</span>
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
    </motion.article>
  );
}
