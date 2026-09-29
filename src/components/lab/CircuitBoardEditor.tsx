"use client";

import { useState } from "react";
import { FlipHorizontal2 } from "lucide-react";
import { PART_NAMES, SLOT_POSITIONS } from "@/components/circuit";
import type { Board, BoardPart, BoardPartKind } from "@/lib/series-board";
import { cn } from "@/lib/cn";

export interface TrayItem {
  kind: BoardPartKind;
  /** Short detail shown on the tray button, e.g. "9 V". */
  detail: string;
  /** Can be placed more than once (e.g. wires). */
  reusable?: boolean;
  /** Extra properties for the placed part (e.g. a resistor's ohms). */
  defaults?: Partial<BoardPart>;
}

interface CircuitBoardEditorProps {
  board: Board;
  onChange: (board: Board) => void;
  tray: readonly TrayItem[];
}

const FLIPPABLE: readonly BoardPartKind[] = ["battery", "led", "diode"];

/**
 * Accessible, touch-friendly way to build a circuit: pick a part from the
 * tray, then tap a slot. Tap a filled slot with nothing selected to remove it.
 */
export function CircuitBoardEditor({ board, onChange, tray }: CircuitBoardEditorProps) {
  const [selected, setSelected] = useState<BoardPartKind | null>(null);
  const item = (kind: BoardPartKind) => tray.find((t) => t.kind === kind);
  const used = (kind: BoardPartKind) => board.some((p) => p?.kind === kind);

  const place = (slot: number) => {
    if (!selected) {
      if (board[slot]) onChange(board.map((p, i) => (i === slot ? null : p)));
      return;
    }
    const chosen = item(selected)!;
    const next = board.map((p) => (!chosen.reusable && p?.kind === selected ? null : p));
    next[slot] = { kind: selected, flipped: false, closed: selected === "switch" ? false : undefined, ...chosen.defaults };
    onChange(next);
    if (!chosen.reusable) setSelected(null);
  };

  return (
    <div>
      <div role="group" aria-label="Parts box" className="flex flex-wrap gap-2 border-b border-line p-4 sm:p-5">
        {tray.map((t) => {
          const inUse = !t.reusable && used(t.kind);
          return (
            <button
              key={t.kind}
              type="button"
              aria-pressed={selected === t.kind}
              onClick={() => setSelected((s) => (s === t.kind ? null : t.kind))}
              className={cn(
                "flex min-h-11 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors",
                selected === t.kind ? "border-cyan bg-cyan/15 text-cyan" : "border-line-strong bg-surface text-ink hover:border-cyan/50",
                inUse && selected !== t.kind && "opacity-60",
              )}
            >
              {PART_NAMES[t.kind]}
              <span className="font-mono text-xs text-ink-subtle">{inUse ? "placed" : t.detail}</span>
            </button>
          );
        })}
      </div>
      <ul className="grid gap-2 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
        {board.map((part, slot) => (
          <li key={slot} className="flex items-stretch gap-2">
            <button
              type="button"
              onClick={() => place(slot)}
              className={cn(
                "flex min-h-12 flex-1 flex-col items-start justify-center rounded-lg border px-3 py-1.5 text-left text-sm transition-colors",
                part ? "border-line-strong bg-surface-raised" : "border-dashed border-line-strong bg-void/40",
                selected && "hover:border-cyan/60",
              )}
            >
              <span className="text-xs text-ink-subtle">{SLOT_POSITIONS[slot]!.label}</span>
              <span className="font-medium text-ink">
                {part ? PART_NAMES[part.kind] : "Empty"}
                <span className="sr-only">{selected ? ` — place ${PART_NAMES[selected]} here` : part ? " — remove it" : ""}</span>
              </span>
            </button>
            {part && FLIPPABLE.includes(part.kind) ? (
              <button
                type="button"
                onClick={() => onChange(board.map((p, i) => (i === slot && p ? { ...p, flipped: !p.flipped } : p)))}
                aria-pressed={Boolean(part.flipped)}
                className="flex min-h-12 w-12 items-center justify-center rounded-lg border border-line-strong text-ink-muted hover:text-cyan"
              >
                <FlipHorizontal2 className="size-4" aria-hidden="true" />
                <span className="sr-only">Turn the {PART_NAMES[part.kind].toLowerCase()} around</span>
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
