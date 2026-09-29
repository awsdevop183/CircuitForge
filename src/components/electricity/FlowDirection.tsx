"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Battery,
  CircuitCanvas,
  CircuitLabel,
  CurrentFlow,
  DirectionArrow,
  Lamp,
  Wire,
  rectLoop,
  type FlowDirection as Direction,
} from "@/components/circuit";
import { SegmentedControl } from "@/components/ui/SegmentedControl";

const LEFT = 80;
const RIGHT = 380;
const TOP = 60;
const BOTTOM = 220;
const LOOP = rectLoop(LEFT, TOP, RIGHT, BOTTOM, 14);
const MID_X = (LEFT + RIGHT) / 2;
const MID_Y = (TOP + BOTTOM) / 2;

/** Arrow positions along the loop; angles are for conventional (clockwise) current. */
const ARROWS = [
  { x: MID_X - 80, y: TOP, angle: 0 },
  { x: MID_X + 80, y: TOP, angle: 0 },
  { x: RIGHT, y: MID_Y + 40, angle: 90 },
  { x: MID_X, y: BOTTOM, angle: 180 },
];

const OPTIONS = [
  { value: "conventional" as const, label: "Conventional (+ → −)" },
  { value: "electron" as const, label: "Electron flow (− → +)" },
];

/** The same circuit shown with conventional current and with electron flow. */
export function FlowDirection() {
  const [direction, setDirection] = useState<Direction>("conventional");
  const conventional = direction === "conventional";
  const color = conventional ? "#f5a524" : "#67e8f9";

  return (
    <div>
      <div className="bg-breadboard px-2 py-5 sm:px-8">
        <CircuitCanvas
          viewBox="0 0 460 270"
          interactive
          title="Direction of current"
          description={
            conventional
              ? "Conventional current: drawn flowing from the positive terminal, clockwise round the circuit, back to the negative terminal."
              : "Electron flow: electrons move from the negative terminal, anticlockwise round the circuit, to the positive terminal."
          }
          className="mx-auto max-w-2xl"
        >
          <Wire d={LOOP} energized color={color} />
          <CurrentFlow d={LOOP} active speed={45} direction={direction} color={color} />
          {ARROWS.map((arrow) => (
            <DirectionArrow key={`${arrow.x}-${arrow.y}`} x={arrow.x} y={arrow.y - (arrow.angle % 180 === 0 ? 16 : 0)} angle={conventional ? arrow.angle : arrow.angle + 180} color={color} />
          ))}
          <Battery x={LEFT} y={MID_Y} rotation={-90} detail="9 V" energized labelPlacement="right" labelOffset={26} />
          <Lamp x={RIGHT} y={MID_Y - 30} rotation={90} brightness={0.8} labelPlacement="left" labelOffset={36} />
          <CircuitLabel x={MID_X} y={MID_Y + 6} text={conventional ? "CONVENTIONAL CURRENT" : "ELECTRON FLOW"} tone={conventional ? "amber" : "cyan"} size={13} decorative />
        </CircuitCanvas>
      </div>
      <div className="border-t border-line p-4 sm:p-5">
        <SegmentedControl label="Show the flow as" options={OPTIONS} value={direction} onChange={setDirection} size="sm" />
        <AnimatePresence mode="wait">
          <motion.p
            key={direction}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-sm text-ink-muted"
            aria-live="polite"
          >
            {conventional
              ? "Conventional current is drawn from + to −. Scientists chose this direction in the 1700s, before anyone knew electrons existed — and every circuit diagram still uses it."
              : "Electrons are negative, so they actually drift the other way: out of the − terminal and back into +. Same circuit, same bulb, same current — just described from the electrons' point of view."}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
