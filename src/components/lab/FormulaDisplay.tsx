import { cn } from "@/lib/cn";

export interface FormulaTerm {
  symbol: string;
  value?: string;
  tone?: "cyan" | "amber" | "ink" | "electric";
}

const TONES = {
  cyan: "text-cyan",
  amber: "text-amber",
  ink: "text-ink",
  electric: "text-electric",
} as const;

interface FormulaDisplayProps {
  /** Left-hand side term. */
  result: FormulaTerm;
  /** Right-hand side, e.g. [V, "/", R]. */
  expression: readonly (FormulaTerm | string)[];
  className?: string;
  label?: string;
}

/** A formula with each symbol and its live value stacked beneath it. */
export function FormulaDisplay({ result, expression, className, label }: FormulaDisplayProps) {
  const spoken = `${result.symbol} equals ${expression
    .map((t) => (typeof t === "string" ? t : `${t.symbol}${t.value ? ` (${t.value})` : ""}`))
    .join(" ")}${result.value ? `, which is ${result.value}` : ""}`;

  return (
    <div
      className={cn("flex flex-wrap items-start justify-center gap-x-3 gap-y-2 font-mono", className)}
      role="math"
      aria-label={label ? `${label}: ${spoken}` : spoken}
    >
      <Term term={result} />
      <span className="pt-1 text-2xl text-ink-subtle" aria-hidden="true">
        =
      </span>
      {expression.map((term, index) =>
        typeof term === "string" ? (
          <span key={index} className="pt-1 text-2xl text-ink-subtle" aria-hidden="true">
            {term}
          </span>
        ) : (
          <Term key={index} term={term} />
        ),
      )}
    </div>
  );
}

function Term({ term }: { term: FormulaTerm }) {
  return (
    <span className="flex flex-col items-center" aria-hidden="true">
      <span className={cn("text-3xl font-semibold", TONES[term.tone ?? "ink"])}>{term.symbol}</span>
      {term.value ? <span className="mt-1 text-xs tabular-nums text-ink-muted">{term.value}</span> : null}
    </span>
  );
}
