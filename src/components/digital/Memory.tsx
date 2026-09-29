"use client";

import { useEffect, useReducer, useState } from "react";
import { Pause, Play, Timer, TriangleAlert, Upload } from "lucide-react";
import { CircuitCanvas } from "@/components/circuit";
import { pathThrough } from "@/components/circuit/geometry";
import { dFlipFlop, fromBits, invert, srLatch, type Bit } from "@/lib/logic";
import { cn } from "@/lib/cn";
import { LOGIC_COLORS } from "./constants";
import { DigitalIndicator } from "./DigitalIndicator";
import { DigitalSignal } from "./DigitalSignal";
import { GateInput } from "./GateInput";
import { LogicGate } from "./LogicGate";
import { BinaryDisplay } from "./BinaryDisplay";
import { MomentaryButton } from "./MomentaryButton";
import { SignalWire } from "./SignalWire";

/* ------------------------------------------------------------------ */
/* Remembering with feedback                                           */
/* ------------------------------------------------------------------ */

/**
 * Two circuits side by side. Without feedback the output forgets as soon as
 * the button is released; with its output fed back into its input, the
 * circuit holds its state — the seed of memory.
 */
export function MemoryDemo() {
  const [plain, setPlain] = useState(false);
  const [set, setSet] = useState(false);
  const [reset, setReset] = useState(false);
  const [q, setQ] = useState<Bit>(0);

  // Q_next = (S OR Q) AND NOT R — the output loops back into the OR gate.
  const next = (s: boolean, r: boolean, current: Bit): Bit => (r ? 0 : s ? 1 : current);
  const press = (which: "s" | "r", pressed: boolean) => {
    const s = which === "s" ? pressed : set;
    const r = which === "r" ? pressed : reset;
    if (which === "s") setSet(pressed);
    else setReset(pressed);
    setQ((current) => next(s, r, current));
  };

  const S: Bit = set ? 1 : 0;
  const R: Bit = reset ? 1 : 0;
  const orOut: Bit = S || q ? 1 : 0;
  const notR = invert(R);

  return (
    <div className="grid grid-cols-1 gap-px bg-line lg:grid-cols-[1fr_1.6fr]">
      <div className="flex flex-col items-center gap-4 bg-surface-raised p-5">
        <p className="eyebrow self-start text-ink-subtle">No feedback</p>
        <MomentaryButton label="BUTTON" pressed={plain} onPressChange={setPlain} />
        <span className="font-mono text-ink-subtle" aria-hidden="true">
          ↓ wire ↓
        </span>
        <DigitalIndicator value={plain ? 1 : 0} size="lg" />
        <p className="text-center text-sm text-ink-muted">Let go and the output returns to 0. Plain logic only reacts to what its inputs are <em>right now</em>.</p>
      </div>
      <div className="bg-logic-grid p-3 sm:p-5">
        <p className="eyebrow text-ink-subtle">With feedback: the output loops back</p>
        <div className="overflow-x-auto">
          <CircuitCanvas viewBox="0 0 520 230" title="A latch built from OR, AND and NOT gates with feedback" description={`Q is ${q}.`} className="h-auto w-full min-w-[26rem]">
            <SignalWire d={pathThrough([[72, 60], [120, 60], [120, 68], [140, 68]], 5)} value={S} />
            <SignalWire d={pathThrough([[72, 190], [140, 190]])} value={R} />
            <SignalWire d={pathThrough([[240, 190], [270, 190], [270, 112], [290, 112]], 5)} value={notR} />
            <SignalWire d={pathThrough([[240, 80], [262, 80], [262, 88], [290, 88]], 5)} value={orOut} />
            <SignalWire d={pathThrough([[390, 100], [452, 100]])} value={q} />
            {/* The feedback loop */}
            <SignalWire d={pathThrough([[420, 100], [420, 22], [110, 22], [110, 92], [140, 92]], 8)} value={q} />
            <circle cx={420} cy={100} r={4.5} fill={q ? LOGIC_COLORS.high : LOGIC_COLORS.low} />
            <text x={265} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={LOGIC_COLORS.clock} fontFamily="var(--font-mono)">
              feedback: Q goes back in
            </text>
            <LogicGate type="OR" x={190} y={80} inputValues={[S, q]} output={orOut} />
            <LogicGate type="AND" x={340} y={100} inputValues={[orOut, notR]} output={q} />
            <LogicGate type="NOT" x={190} y={190} inputValues={[R]} output={notR} />
            {[
              { label: "SET", y: 60, v: S },
              { label: "RESET", y: 190, v: R },
            ].map((node) => (
              <g key={node.label} aria-hidden="true">
                <rect x={30} y={node.y - 14} width={42} height={28} rx={7} fill={node.v ? "rgb(163 230 53 / 0.2)" : LOGIC_COLORS.gateFill} stroke={node.v ? LOGIC_COLORS.high : LOGIC_COLORS.low} strokeWidth={2.5} />
                <text x={51} y={node.y + 1} textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight={700} fill={node.v ? LOGIC_COLORS.highSoft : LOGIC_COLORS.lowText} fontFamily="var(--font-mono)">
                  {node.v}
                </text>
                <text x={51} y={node.y + 28} textAnchor="middle" fontSize={10} fontWeight={700} fill={LOGIC_COLORS.muted} fontFamily="var(--font-mono)">
                  {node.label}
                </text>
              </g>
            ))}
            <g transform="translate(470 100)" aria-hidden="true">
              <circle r={17} fill={q ? "rgb(163 230 53 / 0.25)" : LOGIC_COLORS.gateFill} stroke={q ? LOGIC_COLORS.high : LOGIC_COLORS.low} strokeWidth={2.5} />
              <text y={1} textAnchor="middle" dominantBaseline="central" fontSize={16} fontWeight={700} fill={q ? LOGIC_COLORS.highSoft : LOGIC_COLORS.lowText} fontFamily="var(--font-mono)">
                {q}
              </text>
              <text x={24} y={1} dominantBaseline="central" fontSize={14} fontWeight={700} fill={LOGIC_COLORS.label} fontFamily="var(--font-mono)">
                Q
              </text>
            </g>
          </CircuitCanvas>
        </div>
        <div className="mt-3 flex flex-wrap justify-center gap-3">
          <MomentaryButton label="SET" pressed={set} onPressChange={(p) => press("s", p)} />
          <MomentaryButton label="RESET" pressed={reset} onPressChange={(p) => press("r", p)} tone="negative" />
        </div>
        <p className="mt-3 text-center text-sm text-ink-muted" aria-live="polite">
          {set || reset
            ? set && reset
              ? "Both held: in this circuit RESET wins, so Q = 0."
              : set
                ? "SET held → Q becomes 1."
                : "RESET held → Q becomes 0."
            : `Nothing pressed — and Q stays ${q}. The circuit remembers.`}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Flip-flops                                                          */
/* ------------------------------------------------------------------ */

/** An SR latch as a block: SET makes Q = 1, RESET makes Q = 0, neither holds. */
export function SrLatchDemo() {
  const [set, setSet] = useState(false);
  const [reset, setReset] = useState(false);
  const [q, setQ] = useState<Bit>(0);
  const invalid = set && reset;

  const press = (which: "s" | "r", pressed: boolean) => {
    const s = which === "s" ? pressed : set;
    const r = which === "r" ? pressed : reset;
    if (which === "s") setSet(pressed);
    else setReset(pressed);
    setQ((current) => {
      const result = srLatch(current, s ? 1 : 0, r ? 1 : 0);
      return result.invalid ? current : result.q;
    });
  };

  return (
    <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-[1.2fr_1fr]">
      <div className="flex flex-col items-center justify-center gap-4 bg-logic-grid p-5">
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-3">
            <MomentaryButton label="SET" pressed={set} onPressChange={(p) => press("s", p)} />
            <MomentaryButton label="RESET" pressed={reset} onPressChange={(p) => press("r", p)} tone="negative" />
          </div>
          <div className={cn("flex h-40 w-28 flex-col justify-between rounded-xl border-2 bg-void/60 p-3 font-mono text-sm font-bold", invalid ? "border-negative" : "border-line-strong")}>
            <span className="text-ink-muted">S</span>
            <span className="text-center text-xs text-ink-subtle">SR latch</span>
            <span className="text-ink-muted">R</span>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <DigitalIndicator value={q} size="sm" showLevel={false} />
              <span className="font-mono font-bold text-ink">Q</span>
            </div>
            <div className="flex items-center gap-2">
              <DigitalIndicator value={invert(q)} size="sm" showLevel={false} />
              <span className="font-mono font-bold text-ink">
                Q̄ <span className="sr-only">(not Q)</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-3 bg-surface-raised p-5 font-mono text-sm">
        {[
          { when: "SET", result: "Q = 1", active: set && !reset },
          { when: "RESET", result: "Q = 0", active: reset && !set },
          { when: "neither", result: `hold (Q stays ${q})`, active: !set && !reset },
        ].map((row) => (
          <p key={row.when} className={cn("flex justify-between rounded-lg border px-3 py-2", row.active ? "border-logic/60 bg-logic/10 text-ink" : "border-line text-ink-subtle")}>
            <span>{row.when}</span>
            <span>→ {row.result}</span>
          </p>
        ))}
        {invalid ? (
          <p className="flex items-start gap-2 rounded-lg border border-negative/50 bg-negative/10 p-3 font-sans text-ink" role="alert">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-negative" aria-hidden="true" />
            SET and RESET together is not allowed for an SR latch: the result is undefined. Designs avoid it — one reason clocked flip-flops exist.
          </p>
        ) : (
          <p className="font-sans text-ink-muted" aria-live="polite">
            The <strong className="text-ink">state</strong> is simply the value of Q: currently {q}.
          </p>
        )}
      </div>
    </div>
  );
}

interface Sample {
  clk: Bit;
  d: Bit;
  q: Bit;
}

const MAX_SAMPLES = 24;

interface FlipFlopState {
  d: Bit;
  clk: Bit;
  q: Bit;
  edges: number;
  history: Sample[];
}

type FlipFlopAction = { type: "toggle-d" } | { type: "clock"; level: Bit | "toggle" };

function flipFlopReducer(state: FlipFlopState, action: FlipFlopAction): FlipFlopState {
  if (action.type === "toggle-d") {
    const d = invert(state.d);
    return { ...state, d, history: [...state.history, { clk: state.clk, d, q: state.q }].slice(-MAX_SAMPLES) };
  }
  const level = action.level === "toggle" ? invert(state.clk) : action.level;
  const q = dFlipFlop(state.q, state.d, state.clk, level);
  const rising = state.clk === 0 && level === 1;
  return { ...state, clk: level, q, edges: state.edges + (rising ? 1 : 0), history: [...state.history, { clk: level, d: state.d, q }].slice(-MAX_SAMPLES) };
}

/** A D flip-flop: Q copies D only at the rising edge of the clock. With a live timing diagram. */
export function DFlipFlopDemo() {
  const [state, dispatch] = useReducer(flipFlopReducer, { d: 1, clk: 0, q: 0, edges: 0, history: Array.from({ length: 4 }, () => ({ clk: 0 as Bit, d: 1 as Bit, q: 0 as Bit })) });
  const [running, setRunning] = useState(false);
  const { d, q, edges, history } = state;

  // Auto clock: flip the clock level at a steady rate.
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => dispatch({ type: "clock", level: "toggle" }), 700);
    return () => window.clearInterval(id);
  }, [running]);

  const toggleD = () => dispatch({ type: "toggle-d" });
  const pulse = () => {
    dispatch({ type: "clock", level: 1 });
    window.setTimeout(() => dispatch({ type: "clock", level: 0 }), 450);
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-[auto_1fr]">
        <div className="flex flex-col gap-3 bg-surface-raised p-5">
          <GateInput label="D" value={d} onToggle={toggleD} />
          <button
            type="button"
            onClick={pulse}
            disabled={running}
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-clock px-4 font-semibold text-void hover:brightness-110 disabled:opacity-50"
          >
            <Timer className="size-5" aria-hidden="true" />
            Clock pulse
          </button>
          <button
            type="button"
            aria-pressed={running}
            onClick={() => setRunning((r) => !r)}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-clock/60 px-4 text-sm font-semibold text-clock hover:bg-clock/10"
          >
            {running ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
            {running ? "Stop the clock" : "Run the clock"}
          </button>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-line-strong bg-void/40 px-3 py-2">
            <span className="font-mono text-sm font-semibold text-ink-muted">Q</span>
            <DigitalIndicator value={q} size="sm" />
          </div>
          <p className="font-mono text-xs text-ink-subtle" aria-live="polite">
            Rising edges: {edges} · Q = {q}
          </p>
        </div>
        <div className="bg-logic-grid p-3 sm:p-5">
          <TimingDiagram history={history} />
          <p className="mt-2 text-sm text-ink-muted">
            Change D as much as you like — Q only copies it at a <span className="font-semibold text-clock">rising clock edge</span> (the dashed lines). Between edges, Q holds its value.
          </p>
        </div>
      </div>
    </div>
  );
}

function TimingDiagram({ history }: { history: readonly Sample[] }) {
  const step = 26;
  const rowH = 44;
  const left = 44;
  const width = left + MAX_SAMPLES * step + 10;
  const rows: { key: keyof Sample; label: string; color: string }[] = [
    { key: "clk", label: "CLK", color: LOGIC_COLORS.clock },
    { key: "d", label: "D", color: "#38bdf8" },
    { key: "q", label: "Q", color: LOGIC_COLORS.high },
  ];
  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${rows.length * rowH + 6}`} className="h-auto w-full min-w-[30rem]" role="img" aria-label={`Timing diagram of the last ${history.length} steps. Q is currently ${history[history.length - 1]?.q ?? 0}.`}>
        {history.map((s, i) =>
          i > 0 && s.clk === 1 && history[i - 1]!.clk === 0 ? (
            <line key={i} x1={left + i * step} x2={left + i * step} y1={4} y2={rows.length * rowH} stroke={LOGIC_COLORS.clock} strokeDasharray="3 4" strokeOpacity={0.7} />
          ) : null,
        )}
        {rows.map((row, r) => (
          <DigitalSignal key={row.key} bits={history.map((s) => s[row.key])} label={row.label} color={row.color} y={r * rowH + 12} step={step} labelWidth={left} />
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Registers                                                           */
/* ------------------------------------------------------------------ */

const ADDRESSES = ["00", "01", "10", "11"];

/** A 4-bit register (four flip-flops sharing one clock) and a tiny 4-address memory built from registers. */
export function RegisterDemo() {
  const [inputs, setInputs] = useState<Bit[]>([1, 0, 1, 1]);
  const [stored, setStored] = useState<Bit[]>([0, 0, 0, 0]);
  const [loads, setLoads] = useState(0);
  const [memory, setMemory] = useState<Bit[][]>(ADDRESSES.map(() => [0, 0, 0, 0]));
  const [address, setAddress] = useState(0);
  const [message, setMessage] = useState("");
  const pending = inputs.some((b, i) => b !== stored[i]);

  const load = () => {
    setStored(inputs);
    setLoads((n) => n + 1);
    setMessage(`Clock pulse: the register captured ${inputs.join("")}.`);
  };
  const write = () => {
    setMemory((m) => m.map((row, i) => (i === address ? stored : row)));
    setMessage(`Wrote ${stored.join("")} to address ${ADDRESSES[address]}.`);
  };
  const read = () => {
    setStored(memory[address]!);
    setLoads((n) => n + 1);
    setMessage(`Read ${memory[address]!.join("")} from address ${ADDRESSES[address]} into the register.`);
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-px bg-line lg:grid-cols-2">
        <div className="bg-logic-grid p-4 sm:p-5">
          <p className="eyebrow text-ink-subtle">Data inputs (D3 … D0)</p>
          <BinaryDisplay bits={inputs} onToggle={(i) => setInputs((prev) => prev.map((v, j) => (j === i ? invert(v) : v)))} bitLabel={(i) => `Data input D${3 - i}`} className="mt-3" />
          <button type="button" onClick={load} className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-xl bg-clock px-4 font-semibold text-void hover:brightness-110">
            <Timer className="size-5" aria-hidden="true" />
            Clock pulse (load)
          </button>
          <p className="eyebrow mt-5 text-ink-subtle">4-bit register (stored)</p>
          <div className="mt-2 flex items-center gap-2">
            <BinaryDisplay bits={stored} loadKey={loads} />
            <span className="ml-2 font-mono text-ink-muted">= {fromBits(stored)}</span>
          </div>
          <p className="mt-3 text-sm text-ink-muted" aria-live="polite">
            {pending ? "The inputs have changed, but the register keeps its old value until the next clock pulse." : message || "Four flip-flops, one clock: all four bits are stored at the same moment."}
          </p>
        </div>
        <div className="bg-surface-raised p-4 sm:p-5">
          <p className="eyebrow text-ink-subtle">Memory: many registers, each with an address</p>
          <table className="mt-3 w-full font-mono">
            <caption className="sr-only">Memory contents</caption>
            <thead>
              <tr className="text-left text-xs text-ink-subtle">
                <th scope="col" className="py-1">Address</th>
                <th scope="col" className="py-1">Contents</th>
                <th scope="col" className="py-1 text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {memory.map((row, i) => (
                <tr key={ADDRESSES[i]} onClick={() => setAddress(i)} className={cn("cursor-pointer border-t border-line", i === address && "bg-clock/10")}>
                  <th scope="row" className="py-2 text-left">
                    <label className="flex items-center gap-2 text-sm text-ink">
                      <input type="radio" name="memory-address" checked={i === address} onChange={() => setAddress(i)} className="accent-[var(--color-clock)]" />
                      {ADDRESSES[i]}
                    </label>
                  </th>
                  <td className="py-2 tracking-[0.3em] text-logic">{row.join("")}</td>
                  <td className="py-2 text-right text-ink-muted">{fromBits(row)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={write} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-logic/60 px-3 text-sm font-semibold text-logic hover:bg-logic/10">
              <Upload className="size-4" aria-hidden="true" />
              Write register → {ADDRESSES[address]}
            </button>
            <button type="button" onClick={read} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line-strong px-3 text-sm font-semibold text-ink hover:border-clock/60">
              Read {ADDRESSES[address]} → register
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 border-t border-line p-4 font-mono text-sm">
          {["1 bit", "4-bit register", "memory (many registers)", "computer"].map((step, i) => (
            <span key={step} className="flex items-center gap-2">
              {i > 0 ? <span className="text-ink-subtle" aria-hidden="true">→</span> : null}
              <span className="rounded-md border border-line-strong bg-void/40 px-2.5 py-1 text-ink">{step}</span>
            </span>
          ))}
      </div>
    </div>
  );
}
