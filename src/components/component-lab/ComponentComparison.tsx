"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ComponentSymbol } from "@/components/explorer/ComponentSymbol";
import { ComponentIllustration } from "@/components/illustrations/ComponentIllustration";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { getComponent } from "@/content/component-library";
import { COMPARISONS, type ComparisonSide } from "@/content/component-comparisons";

const ROWS: { key: keyof Omit<ComparisonSide, "slug">; label: string }[] = [
  { key: "purpose", label: "Purpose" },
  { key: "control", label: "How it's controlled" },
  { key: "applications", label: "Applications" },
  { key: "advantages", label: "Advantages" },
  { key: "limitations", label: "Limitations" },
];

/** Two components side by side: purpose, control, uses, strengths and limits. */
export function ComponentComparison({ initial = COMPARISONS[0]!.id }: { initial?: string }) {
  const [id, setId] = useState(initial);
  const pair = COMPARISONS.find((c) => c.id === id) ?? COMPARISONS[0]!;
  const [a, b] = pair.sides.map((side) => ({ side, component: getComponent(side.slug)! }));

  return (
    <div>
      <div className="border-b border-line p-4 sm:p-5">
        <SegmentedControl label="Compare" options={COMPARISONS.map((c) => ({ value: c.id, label: c.title }))} value={id} onChange={setId} size="sm" />
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={pair.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <p className="border-b border-line px-4 py-4 text-ink sm:px-5">{pair.summary}</p>
          <div className="grid grid-cols-2 gap-px bg-line">
            {[a!, b!].map(({ component }) => (
              <div key={component.slug} className="flex flex-col items-center gap-2 bg-surface-raised p-4 text-center">
                <div className="flex items-center gap-3">
                  <ComponentIllustration slug={component.slug} className="h-16 w-auto sm:h-20" />
                  <ComponentSymbol slug={component.slug} name={component.name} className="hidden h-12 w-auto sm:block" />
                </div>
                <h2 className="text-lg font-semibold text-ink">
                  <Link href={`/components/${component.slug}`} className="hover:text-cyan">
                    {component.name}
                  </Link>
                </h2>
                <p className="text-sm text-cyan-soft">{component.job}</p>
              </div>
            ))}
          </div>
          <table className="w-full table-fixed text-left text-sm">
            <caption className="sr-only">{pair.title}</caption>
            <thead className="sr-only">
              <tr>
                <th scope="col">Aspect</th>
                <th scope="col">{a!.component.name}</th>
                <th scope="col">{b!.component.name}</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.key} className="border-t border-line align-top">
                  <th scope="row" className="hidden w-40 px-4 py-4 font-mono text-xs uppercase tracking-[0.1em] text-ink-subtle sm:table-cell">
                    {row.label}
                  </th>
                  {[a!, b!].map(({ side }) => {
                    const value = side[row.key];
                    return (
                      <td key={side.slug} className="px-3 py-4 text-ink-muted sm:px-4">
                        <span className="mb-1 block font-mono text-[0.65rem] uppercase tracking-[0.1em] text-ink-subtle sm:hidden">{row.label}</span>
                        {Array.isArray(value) ? (
                          <ul className="space-y-1">
                            {value.map((item) => (
                              <li key={item} className="flex gap-2">
                                <span className={row.key === "limitations" ? "text-orange" : row.key === "advantages" ? "text-positive" : "text-amber"} aria-hidden="true">
                                  •
                                </span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-ink">{value}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-line px-4 py-3 text-sm text-ink-subtle sm:px-5">Neither is better: each is the right choice for different jobs.</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
