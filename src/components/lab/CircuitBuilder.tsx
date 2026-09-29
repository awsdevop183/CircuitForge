"use client";

import { useState } from "react";
import { PART_NAMES, SLOT_POSITIONS, SeriesCircuit } from "@/components/circuit";
import { StatusBanner } from "@/components/component-lab/StatusBanner";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { ModelNote } from "@/components/ui/InteractivePanel";
import { Readout } from "@/components/ui/Readout";
import { SafetyNotice } from "@/components/ui/SafetyNotice";
import { DIODE_FORWARD_VOLTAGE, solveBoard, type Board, type BoardSolution } from "@/lib/series-board";
import { RED_LED_FORWARD_VOLTAGE } from "@/lib/circuit-sim";
import { formatAmps, formatFixed, formatOhms } from "@/lib/format";
import { CircuitBoardEditor, type TrayItem } from "./CircuitBoardEditor";

const TRAY: TrayItem[] = [
  { kind: "battery", detail: "adjustable" },
  { kind: "switch", detail: "on/off" },
  { kind: "resistor", detail: "adjustable" },
  { kind: "led", detail: `${RED_LED_FORWARD_VOLTAGE} V` },
  { kind: "lamp", detail: "bulb" },
  { kind: "diode", detail: `${DIODE_FORWARD_VOLTAGE} V` },
  { kind: "wire", detail: "link", reusable: true },
  { kind: "capacitor", detail: "blocks DC" },
];

const START: Board = [{ kind: "battery" }, { kind: "switch", closed: true }, { kind: "resistor" }, { kind: "led" }];

function explain(board: Board, solution: BoardSolution): { level: "ok" | "info" | "caution" | "danger"; title: string; body: string } {
  const has = (kind: string) => board.some((p) => p?.kind === kind);
  const burnt = solution.parts.some((p) => p?.burnt);
  switch (solution.status) {
    case "no-source":
      return { level: "info", title: "No battery — nothing pushes the current.", body: "Every circuit needs a source. Add the battery." };
    case "multiple-sources":
      return { level: "info", title: "One battery at a time.", body: "This simple builder supports one source per loop." };
    case "open":
      return {
        level: "info",
        title: "Open circuit — no current anywhere.",
        body: board.some((p) => p === null) ? "There's an empty slot: fill it with a part or a wire." : has("capacitor") ? "A charged capacitor blocks steady DC, so it acts as a gap. The switch may be open too." : "The switch is open. Close it (click it in the diagram) to complete the loop.",
      };
    case "blocked":
      return { level: "caution", title: "A diode or LED is the wrong way round.", body: "It blocks the current like a closed one-way valve. Use the flip button to turn it around." };
    case "insufficient-voltage":
      return { level: "info", title: "Not enough voltage.", body: "The LEDs and diodes need their forward voltage before any current flows. Raise the battery voltage." };
    default:
      if (burnt) return { level: "danger", title: "The LED would burn out!", body: "Far more current than a small LED can handle. Add a resistor (or increase it) to limit the current." };
      if (!has("resistor") && !has("lamp") && !has("led") && !has("diode")) {
        return { level: "danger", title: "Short circuit!", body: "Only wires across the battery: the current is limited by the battery's own tiny internal resistance. Real wires and batteries get dangerously hot — never do this." };
      }
      return { level: "ok", title: `Current flows: ${formatAmps(solution.current)}.`, body: "The same current flows through every part of a series loop. Each part takes its share of the battery voltage." };
  }
}

/**
 * Circuit Builder: a four-slot series loop you can fill with any parts. The
 * circuit engine (lib/series-board) works out the current and each part's
 * voltage live.
 */
export function CircuitBuilder() {
  const [board, setBoard] = useState<Board>(START);
  const [voltage, setVoltage] = useState(9);
  const [ohms, setOhms] = useState(470);
  const configured = board.map((p) => (p?.kind === "battery" ? { ...p, voltage } : p?.kind === "resistor" ? { ...p, ohms } : p));
  const solution = solveBoard(configured);
  const message = explain(configured, solution);

  return (
    <div className="panel-raised overflow-hidden rounded-2xl">
      <CircuitBoardEditor board={board} onChange={setBoard} tray={TRAY} />
      <div className="border-t border-line bg-breadboard px-2 py-4 sm:px-6">
        <SeriesCircuit
          board={configured}
          solution={solution}
          onToggleSwitch={(slot) => setBoard((b) => b.map((p, i) => (i === slot && p ? { ...p, closed: !(p.closed ?? true) } : p)))}
          title="Your series circuit"
          className="mx-auto max-w-2xl"
        />
      </div>
      <div className="grid grid-cols-1 gap-5 border-t border-line p-4 sm:p-5 md:grid-cols-2">
        <InteractiveSlider label="Battery voltage" value={voltage} min={1.5} max={12} step={0.5} onChange={setVoltage} format={(v) => `${formatFixed(v, 1)} V`} color="var(--color-amber)" />
        <InteractiveSlider label="Resistor" value={ohms} min={10} max={10_000} scale="log" onChange={setOhms} format={(r) => formatOhms(r)} color="var(--color-electric)" />
      </div>
      <div className="grid grid-cols-1 gap-4 border-t border-line p-4 sm:p-5 md:grid-cols-[auto_1fr]">
        <Readout label="Loop current" value={formatAmps(solution.current, 2)} tone="cyan" />
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Voltage across each part</caption>
          <thead>
            <tr className="border-b border-line text-xs text-ink-subtle">
              <th scope="col" className="py-1.5 font-medium">Slot</th>
              <th scope="col" className="py-1.5 font-medium">Part</th>
              <th scope="col" className="py-1.5 text-right font-medium">Voltage</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {configured.map((p, i) => (
              <tr key={i} className="border-b border-line/60 last:border-0">
                <th scope="row" className="py-1.5 font-sans font-normal text-ink-muted">
                  {SLOT_POSITIONS[i]!.label}
                </th>
                <td className="py-1.5 font-sans text-ink">{p ? PART_NAMES[p.kind] : "—"}</td>
                <td className="py-1.5 text-right text-ink">{p ? `${formatFixed(solution.parts[i]?.voltage ?? 0, 2)} V` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-3 border-t border-line p-4 sm:p-5" aria-live="polite">
        <StatusBanner level={message.level} title={message.title}>
          {" "}
          {message.body}
        </StatusBanner>
        {message.level === "danger" ? <SafetyNotice topic="short-circuit" /> : null}
      </div>
      <ModelNote>ideal wires, LEDs and diodes as fixed voltage drops, a lamp as a fixed 60 Ω, a capacitor in its charged (DC) state, and a battery with 0.5 Ω internal resistance. Good for learning how series loops behave — not a precise simulator.</ModelNote>
    </div>
  );
}
