import { Sparkles } from "lucide-react";

export function KeyTakeaways({ items }: { items: readonly string[] }) {
  return (
    <ol className="grid gap-3 sm:grid-cols-2">
      {items.map((item, index) => (
        <li key={item} className="panel relative overflow-hidden rounded-xl p-5">
          <span className="absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b from-cyan to-amber" aria-hidden="true" />
          <p className="flex items-center gap-2 font-mono text-xs text-amber">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Takeaway {index + 1}
          </p>
          <p className="mt-2 text-ink">{item}</p>
        </li>
      ))}
    </ol>
  );
}
