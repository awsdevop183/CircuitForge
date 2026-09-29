"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Battery, CircuitCanvas, CircuitLabel, CurrentFlow, Led, PushButton, Resistor, Switch, Wire, rectLoop } from "@/components/circuit";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { cn } from "@/lib/cn";

type SwitchType = "toggle" | "push-no" | "push-nc";

const TYPES: Record<SwitchType, { label: string; name: string; behaviour: string }> = {
  toggle: { label: "Toggle", name: "Toggle switch", behaviour: "Latching: it stays where you put it, like a light switch." },
  "push-no": { label: "Push (NO)", name: "Push button — normally open", behaviour: "Momentary: the circuit is closed only while you hold the button down, like a doorbell." },
  "push-nc": { label: "Push (NC)", name: "Push button — normally closed", behaviour: "Momentary: the circuit is closed until you press, like a fridge-door light switch." },
};

const LEFT = 70;
const RIGHT = 390;
const TOP = 70;
const BOTTOM = 220;
const MID_Y = (TOP + BOTTOM) / 2;
const SWITCH_X = 170;
const LOOP = rectLoop(LEFT, TOP, RIGHT, BOTTOM, 14);

/** Place different switches into the same circuit and operate them. */
export function SwitchLab() {
  const [type, setType] = useState<SwitchType>("toggle");
  const [toggled, setToggled] = useState(false);
  const [pressed, setPressed] = useState(false);

  const closed = type === "toggle" ? toggled : type === "push-no" ? pressed : !pressed;
  const info = TYPES[type];

  const choose = (next: SwitchType) => {
    setType(next);
    setPressed(false);
  };

  const rows =
    type === "toggle"
      ? [
          { when: "Switch set OFF", closed: false, active: !toggled },
          { when: "Switch set ON", closed: true, active: toggled },
        ]
      : [
          { when: "Not pressed", closed: type === "push-nc", active: !pressed },
          { when: "Held down", closed: type === "push-no", active: pressed },
        ];

  return (
    <div>
      <div className="border-b border-line p-4 sm:p-5">
        <SegmentedControl label="Place a switch in the circuit" options={(Object.keys(TYPES) as SwitchType[]).map((t) => ({ value: t, label: TYPES[t].label, ariaLabel: TYPES[t].name }))} value={type} onChange={choose} size="sm" />
      </div>
      <div className="bg-breadboard px-2 py-4 sm:px-6">
        <CircuitCanvas
          viewBox="0 0 460 270"
          interactive
          title={`Circuit with a ${info.name.toLowerCase()}`}
          description={`${info.name}. The circuit is ${closed ? "closed and the LED is on" : "open and the LED is off"}.`}
          className="mx-auto max-w-2xl"
        >
          <Wire d={LOOP} energized={closed} />
          <CurrentFlow d={LOOP} active={closed} speed={50} />
          <Battery x={LEFT} y={MID_Y} rotation={-90} detail="9 V" energized={closed} labelPlacement="right" labelOffset={26} />
          <AnimatePresence mode="wait">
            <motion.g key={type} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.25 }}>
              {type === "toggle" ? (
                <Switch x={SWITCH_X} y={TOP} closed={toggled} onToggle={() => setToggled((t) => !t)} name="Toggle switch" labelOffset={30} />
              ) : (
                <PushButton x={SWITCH_X} y={TOP} kind={type === "push-no" ? "no" : "nc"} pressed={pressed} onPressChange={setPressed} labelOffset={36} />
              )}
            </motion.g>
          </AnimatePresence>
          <Resistor x={290} y={TOP} detail="470 Ω" energized={closed} labelPlacement="bottom" labelOffset={22} />
          <Led x={RIGHT} y={MID_Y} rotation={90} brightness={closed ? 0.85 : 0} color="#fb7185" labelPlacement="left" labelOffset={32} />
          <CircuitLabel x={(LEFT + RIGHT) / 2} y={BOTTOM + 34} text={closed ? "CLOSED — LED ON" : "OPEN — LED OFF"} tone={closed ? "cyan" : "amber"} size={13} decorative />
        </CircuitCanvas>
      </div>
      <div className="grid grid-cols-1 gap-4 border-t border-line p-4 sm:p-5 md:grid-cols-2 md:items-center">
        <div>
          {type === "toggle" ? (
            <button
              type="button"
              aria-pressed={toggled}
              onClick={() => setToggled((t) => !t)}
              className={cn("min-h-12 w-full rounded-xl font-semibold", toggled ? "border border-line-strong text-ink" : "bg-cyan text-void hover:bg-cyan-soft")}
            >
              Flip the switch {toggled ? "OFF" : "ON"}
            </button>
          ) : (
            <button
              type="button"
              aria-pressed={pressed}
              onPointerDown={() => setPressed(true)}
              onPointerUp={() => setPressed(false)}
              onPointerLeave={() => setPressed(false)}
              onKeyDown={(event) => {
                if ((event.key === " " || event.key === "Enter") && !event.repeat) {
                  event.preventDefault();
                  setPressed(true);
                }
              }}
              onKeyUp={(event) => (event.key === " " || event.key === "Enter") && setPressed(false)}
              onBlur={() => setPressed(false)}
              className={cn("min-h-12 w-full touch-none select-none rounded-xl font-semibold transition-transform", pressed ? "translate-y-0.5 bg-amber text-void" : "bg-cyan text-void hover:bg-cyan-soft")}
            >
              {pressed ? "Holding the button…" : "Press and hold"}
            </button>
          )}
          <p className="mt-3 text-sm text-ink-muted">{info.behaviour}</p>
        </div>
        <table className="w-full text-left text-sm">
          <caption className="sr-only">What the {info.name.toLowerCase()} does</caption>
          <thead>
            <tr className="border-b border-line text-xs text-ink-subtle">
              <th scope="col" className="py-2 font-medium">Button</th>
              <th scope="col" className="py-2 font-medium">Contacts</th>
              <th scope="col" className="py-2 font-medium">LED</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {rows.map((row) => (
              <tr key={row.when} className={cn("border-b border-line/60 last:border-0", row.active && "bg-cyan/10")}>
                <th scope="row" className="py-2 pl-2 font-sans font-medium text-ink">
                  {row.when}
                  {row.active ? <span className="sr-only"> (now)</span> : null}
                </th>
                <td className={row.closed ? "text-cyan" : "text-amber"}>{row.closed ? "Closed" : "Open"}</td>
                <td className={row.closed ? "text-positive" : "text-ink-muted"}>{row.closed ? "ON" : "OFF"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
