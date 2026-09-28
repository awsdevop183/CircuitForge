"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export interface OutlineItem {
  id: string;
  title: string;
  label: string;
}

/** "On this page" navigation with scroll-spy highlighting of the current section. */
export function LessonOutline({ items }: { items: readonly OutlineItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id);

  useEffect(() => {
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          const topmost = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b));
          setActiveId(topmost.target.id);
        }
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [items]);

  const activeIndex = items.findIndex((item) => item.id === activeId);

  return (
    <nav aria-label="Lesson sections">
      <p className="eyebrow mb-3 text-ink-subtle">In this lesson</p>
      <ol className="relative space-y-1 border-l border-line">
        {items.map((item, index) => {
          const active = item.id === activeId;
          const passed = index < activeIndex;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active ? "location" : undefined}
                className={cn(
                  "-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors",
                  active
                    ? "border-cyan text-ink"
                    : passed
                      ? "border-cyan/30 text-ink-muted hover:text-ink"
                      : "border-transparent text-ink-subtle hover:text-ink",
                )}
              >
                <span className="block font-mono text-[0.65rem] uppercase tracking-wider text-ink-subtle">{item.label}</span>
                {item.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
