import { Sparkles } from "lucide-react";

/** The lesson's single key idea, followed by a short recap. */
export function KeyTakeaway({ headline, items }: { headline: string; items: readonly string[] }) {
  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-cyan/40 bg-cyan/[0.06] p-6 shadow-[0_0_40px_-20px_rgb(34_211_238/0.8)]">
        <p className="eyebrow flex items-center gap-2 text-cyan">
          <Sparkles className="size-4" aria-hidden="true" />
          Key takeaway
        </p>
        <p className="mt-3 text-balance font-display text-xl font-semibold leading-snug text-ink sm:text-2xl">{headline}</p>
      </div>
      <ol className="grid gap-3 sm:grid-cols-2">
        {items.map((item, index) => (
          <li key={item} className="panel flex gap-3 rounded-xl p-4">
            <span className="font-mono text-xs text-amber">{String(index + 1).padStart(2, "0")}</span>
            <p className="text-sm text-ink">{item}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
