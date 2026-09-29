"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { COMPONENTS, COMPONENT_TAG_DESCRIPTIONS, COMPONENT_TAG_LABELS, type ComponentTag } from "@/content/component-library";
import { cn } from "@/lib/cn";
import { ComponentCard } from "./ComponentCard";

type CategoryFilter = ComponentTag | "all";

const FILTERS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  ...(Object.keys(COMPONENT_TAG_LABELS) as ComponentTag[]).map((value) => ({
    value,
    label: COMPONENT_TAG_LABELS[value],
  })),
];

/** Searchable, filterable grid of components. */
export function ComponentExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return COMPONENTS.filter((component) => {
      if (category !== "all" && !component.tags.includes(category)) return false;
      if (!needle) return true;
      return [component.name, component.job, component.summary, ...component.uses].some((text) =>
        text.toLowerCase().includes(needle),
      );
    });
  }, [query, category]);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div
          role="group"
          aria-label="Filter by component family"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0"
        >
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              aria-pressed={category === filter.value}
              onClick={() => setCategory(filter.value)}
              className={cn(
                "min-h-10 shrink-0 rounded-lg border px-3.5 text-sm font-medium transition-colors",
                category === filter.value
                  ? "border-cyan/60 bg-cyan/10 text-cyan"
                  : "border-line-strong bg-surface text-ink-muted hover:text-ink",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <label className="relative block md:w-72">
          <span className="sr-only">Search components</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-subtle"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search: LED, motor, timing…"
            className="h-11 w-full rounded-lg border border-line-strong bg-surface pl-9 pr-3 text-sm text-ink placeholder:text-ink-subtle focus:border-cyan/60"
          />
        </label>
      </div>

      <p className="mt-6 text-sm text-ink-subtle" aria-live="polite">
        Showing {results.length} of {COMPONENTS.length} components
        {category !== "all" ? <span className="text-ink-muted"> · {COMPONENT_TAG_LABELS[category]}: {COMPONENT_TAG_DESCRIPTIONS[category]}</span> : null}
      </p>

      <ul className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {results.map((component) => (
            <motion.li
              key={component.slug}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
            >
              <ComponentCard component={component} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {results.length === 0 ? (
        <p className="panel mt-4 rounded-2xl p-8 text-center text-ink-muted">
          No components match “{query}”. Try a different word or clear the filter.
        </p>
      ) : null}
    </div>
  );
}
