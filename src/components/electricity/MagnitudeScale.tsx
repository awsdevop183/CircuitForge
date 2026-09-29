"use client";

import { motion } from "framer-motion";
import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/cn";

export interface MagnitudeItem {
  label: string;
  value: number;
  display: string;
  note?: string;
  danger?: boolean;
}

interface MagnitudeScaleProps {
  items: readonly MagnitudeItem[];
  /** Accessible name of the list. */
  label: string;
  /** Smallest and largest values on the log axis. */
  domain: readonly [number, number];
  tone?: "cyan" | "amber";
}

/**
 * Compares everyday magnitudes on a logarithmic bar scale — so 20 mA and
 * 200 A can live on the same chart.
 */
export function MagnitudeScale({ items, label, domain, tone = "cyan" }: MagnitudeScaleProps) {
  const [min, max] = domain;
  const width = (value: number) => {
    const t = (Math.log10(value) - Math.log10(min)) / (Math.log10(max) - Math.log10(min));
    return `${Math.max(4, Math.min(100, t * 100))}%`;
  };

  return (
    <div className="panel-raised rounded-2xl p-5 sm:p-6">
      <ul aria-label={label} className="space-y-4">
        {items.map((item, index) => (
          <li key={item.label}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 font-medium text-ink">
                {item.label}
                {item.danger ? (
                  <span className="inline-flex items-center gap-1 rounded bg-orange/15 px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase text-orange">
                    <TriangleAlert className="size-3" aria-hidden="true" />
                    Dangerous
                  </span>
                ) : null}
              </span>
              <span className="font-mono text-ink">{item.display}</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-line" aria-hidden="true">
              <motion.div
                className={cn(
                  "h-full origin-left rounded-full",
                  item.danger ? "bg-orange" : tone === "cyan" ? "bg-cyan" : "bg-amber",
                )}
                style={{ width: width(item.value) }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            {item.note ? <p className="mt-1 text-xs text-ink-subtle">{item.note}</p> : null}
          </li>
        ))}
      </ul>
      <p className="mt-5 text-xs text-ink-subtle">Bars use a logarithmic scale — each step to the right is roughly ten times bigger.</p>
    </div>
  );
}
