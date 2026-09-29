"use client";

import type { Bit, TruthRow } from "@/lib/logic";
import { cn } from "@/lib/cn";

interface TruthTableProps {
  inputLabels: readonly string[];
  outputLabels: readonly string[];
  rows: readonly TruthRow[];
  /** Row matching the current inputs, highlighted. */
  activeRow?: number;
  /** Make rows clickable: choosing a row sets the inputs. */
  onSelectRow?: (inputs: Bit[]) => void;
  /** Output cells shown as "?" (e.g. in a "complete the table" question), as [row, output] pairs. */
  masked?: readonly (readonly [number, number])[];
  /** Rows to flag as wrong (e.g. a challenge attempt that doesn't match). */
  mismatched?: readonly number[];
  caption: string;
  className?: string;
}

/** A truth table with the live row highlighted. */
export function TruthTable({ inputLabels, outputLabels, rows, activeRow, onSelectRow, masked = [], mismatched = [], caption, className }: TruthTableProps) {
  const isMasked = (row: number, output: number) => masked.some(([r, o]) => r === row && o === output);
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[12rem] border-collapse text-center font-mono">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b-2 border-line-strong text-sm">
            {inputLabels.map((label) => (
              <th key={label} scope="col" className="px-3 py-2 font-semibold text-ink-muted">
                {label}
              </th>
            ))}
            {outputLabels.map((label, i) => (
              <th key={label} scope="col" className={cn("px-3 py-2 font-semibold text-logic", i === 0 && "border-l-2 border-line-strong")}>
                {label}
              </th>
            ))}
            {onSelectRow ? (
              <th scope="col" className="px-2 py-2">
                <span className="sr-only">Try this row</span>
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => {
            const active = r === activeRow;
            const wrong = mismatched.includes(r);
            return (
              <tr
                key={r}
                onClick={onSelectRow ? () => onSelectRow(row.inputs) : undefined}
                className={cn(
                  "border-b border-line/70 text-lg transition-colors duration-300 last:border-0",
                  onSelectRow && "cursor-pointer hover:bg-surface-high/60",
                  active && "bg-logic/10 shadow-[inset_3px_0_0_var(--color-logic)]",
                  wrong && "bg-negative/10 shadow-[inset_3px_0_0_var(--color-negative)]",
                )}
              >
                {row.inputs.map((value, i) => (
                  <td key={i} className={cn("px-3 py-1.5", value ? "text-ink" : "text-ink-subtle")}>
                    {value}
                  </td>
                ))}
                {row.outputs.map((value, i) => (
                  <td key={`o${i}`} className={cn("px-3 py-1.5 font-bold", i === 0 && "border-l-2 border-line-strong", isMasked(r, i) ? "text-clock" : value ? "text-logic" : "text-ink-subtle")}>
                    {isMasked(r, i) ? "?" : value}
                    {active && i === row.outputs.length - 1 ? <span className="sr-only"> (current inputs)</span> : null}
                    {wrong && i === row.outputs.length - 1 ? <span className="sr-only"> (does not match)</span> : null}
                  </td>
                ))}
                {onSelectRow ? (
                  <td className="px-2 py-1">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onSelectRow(row.inputs);
                      }}
                      className="min-h-9 rounded-md border border-line-strong px-2 text-xs text-ink-muted hover:border-logic/60 hover:text-logic"
                      aria-label={`Set inputs to ${row.inputs.map((v, i) => `${inputLabels[i]} ${v}`).join(", ")}`}
                    >
                      Try
                    </button>
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
