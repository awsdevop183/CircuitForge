"use client";

import { useState } from "react";
import { CircleCheck, CircleX, RotateCcw } from "lucide-react";
import { ComponentIllustration } from "@/components/illustrations/ComponentIllustration";
import { cn } from "@/lib/cn";

type Group = "passive" | "active" | "electromechanical";

const GROUPS: Record<Group, string> = { passive: "Passive", active: "Active", electromechanical: "Electromechanical" };

const ITEMS: { slug: string; name: string; group: Group; why: string }[] = [
  { slug: "resistor", name: "Resistor", group: "passive", why: "It only resists current — it can't control or amplify anything." },
  { slug: "capacitor", name: "Capacitor", group: "passive", why: "It stores and releases energy, but can't control current with a signal." },
  { slug: "potentiometer", name: "Potentiometer", group: "passive", why: "A resistor you adjust by hand — still just resistance." },
  { slug: "transistor", name: "Transistor", group: "active", why: "A small signal controls a larger current — the definition of active." },
  { slug: "mosfet", name: "MOSFET", group: "active", why: "A gate voltage switches a big current on and off." },
  { slug: "led", name: "LED", group: "active", why: "A semiconductor; most beginner books group diodes and LEDs with active parts." },
  { slug: "diode", name: "Diode", group: "active", why: "A semiconductor that decides which way current may flow (some books call it passive — it can't amplify)." },
  { slug: "switch", name: "Switch", group: "electromechanical", why: "Metal contacts moved by your finger." },
  { slug: "relay", name: "Relay", group: "electromechanical", why: "Metal contacts moved by an electromagnet." },
];

/** Sort components into passive, active and electromechanical, with feedback on each choice. */
export function ComponentSorter() {
  const [answers, setAnswers] = useState<Record<string, Group>>({});
  const answered = Object.keys(answers).length;
  const correct = ITEMS.filter((item) => answers[item.slug] === item.group).length;

  return (
    <div className="p-4 sm:p-5">
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((item) => {
          const answer = answers[item.slug];
          const isRight = answer === item.group;
          return (
            <li key={item.slug} className={cn("rounded-xl border p-3", answer ? (isRight ? "border-positive/45 bg-positive/5" : "border-negative/45 bg-negative/5") : "border-line bg-void/30")}>
              <div className="flex items-center gap-3">
                <ComponentIllustration slug={item.slug} className="h-12 w-16 shrink-0" />
                <p className="font-semibold text-ink">{item.name}</p>
                {answer ? (
                  isRight ? <CircleCheck className="ml-auto size-5 text-positive" aria-label="Correct" /> : <CircleX className="ml-auto size-5 text-negative" aria-label="Incorrect" />
                ) : null}
              </div>
              {answer ? (
                <p className="mt-2 text-xs text-ink-muted" role="status">
                  <strong className="text-ink">{GROUPS[item.group]}.</strong> {item.why}
                </p>
              ) : (
                <div className="mt-2 grid grid-cols-3 gap-1" role="group" aria-label={`Classify the ${item.name}`}>
                  {(Object.keys(GROUPS) as Group[]).map((group) => (
                    <button
                      key={group}
                      type="button"
                      onClick={() => setAnswers((a) => ({ ...a, [item.slug]: group }))}
                      className="min-h-9 rounded-md border border-line-strong px-1 text-[0.7rem] font-medium text-ink-muted hover:border-cyan/60 hover:text-ink"
                    >
                      {group === "electromechanical" ? "Electro-mech." : GROUPS[group]}
                    </button>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="font-mono text-sm text-ink-muted" aria-live="polite">
          {answered === ITEMS.length ? `Sorted! ${correct} of ${ITEMS.length} correct.` : `${answered} of ${ITEMS.length} sorted`}
        </p>
        {answered > 0 ? (
          <button type="button" onClick={() => setAnswers({})} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-line-strong px-3 text-sm text-ink hover:border-cyan/60">
            <RotateCcw className="size-4" aria-hidden="true" />
            Start again
          </button>
        ) : null}
      </div>
    </div>
  );
}
