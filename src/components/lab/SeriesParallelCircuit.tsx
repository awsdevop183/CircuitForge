"use client";

import {
  Battery,
  CircuitCanvas,
  CircuitLabel,
  CircuitNode,
  CurrentFlow,
  Lamp,
  Wire,
  pathThrough,
  rectLoop,
  type Point,
} from "@/components/circuit";
import type { NetworkResult } from "@/lib/electronics";
import { formatAmps, formatVolts } from "@/lib/format";
import { flowSpeedForCurrent } from "./flow-speed";

export type CircuitMode = "series" | "parallel";

interface SeriesParallelCircuitProps {
  mode: CircuitMode;
  sourceVoltage: number;
  result: NetworkResult;
  /** 0–1 brightness for each lamp. */
  brightness: readonly [number, number];
  lampConnected: readonly [boolean, boolean];
  referenceCurrent: number;
}

const LEFT = 60;
const RIGHT = 400;
const TOP = 70;
const BOTTOM = 250;
const MID_Y = (TOP + BOTTOM) / 2;
const BATTERY_TOP = MID_Y - 40;
const BATTERY_BOTTOM = MID_Y + 40;
const BRANCH_1_X = 230;
const BRANCH_2_X = RIGHT;

export function SeriesParallelCircuit(props: SeriesParallelCircuitProps) {
  const { mode, sourceVoltage, result } = props;
  const description =
    mode === "series"
      ? `Two bulbs in a single loop from a ${formatVolts(sourceVoltage)} supply. The same ${formatAmps(result.totalCurrent)} flows through both bulbs.`
      : `Two bulbs on separate branches across a ${formatVolts(sourceVoltage)} supply. Each bulb gets the full supply voltage; total current is ${formatAmps(result.totalCurrent)}.`;

  return (
    <CircuitCanvas
      viewBox="0 0 470 320"
      interactive
      title={mode === "series" ? "Series circuit with two bulbs" : "Parallel circuit with two bulbs"}
      description={description}
    >
      {mode === "series" ? <SeriesLayout {...props} /> : <ParallelLayout {...props} />}
      <Battery x={LEFT} y={MID_Y} rotation={-90} detail={formatVolts(sourceVoltage)} energized={result.totalCurrent > 0} labelPlacement="right" labelOffset={26} />
      <CircuitLabel x={LEFT - 30} y={MID_Y - 6} text="SUPPLY" value={formatVolts(sourceVoltage)} anchor="end" decorative />
    </CircuitCanvas>
  );
}

function SeriesLayout({ result, brightness, lampConnected, referenceCurrent }: SeriesParallelCircuitProps) {
  const loop = rectLoop(LEFT, TOP, RIGHT, BOTTOM, 14);
  const flowing = result.totalCurrent > 0;
  const speed = flowSpeedForCurrent(result.totalCurrent, referenceCurrent);
  const lampXs = [170, 310] as const;

  return (
    <g>
      <Wire d={loop} energized={flowing} />
      <CurrentFlow d={loop} active={flowing} speed={speed} />
      {lampXs.map((x, index) => (
        <LampWithReadout
          key={x}
          index={index}
          x={x}
          y={TOP}
          rotation={0}
          brightness={brightness[index]!}
          connected={lampConnected[index]!}
          voltage={result.branches[index]!.voltage}
          current={result.branches[index]!.current}
          readoutPosition={[x, TOP + 44]}
        />
      ))}
      <CircuitLabel x={(LEFT + RIGHT) / 2} y={BOTTOM + 30} text="ONE PATH — SAME CURRENT EVERYWHERE" decorative />
      <CircuitLabel x={RIGHT + 14} y={MID_Y} text="I" value={formatAmps(result.totalCurrent, 2)} anchor="start" valueTone="cyan" decorative />
    </g>
  );
}

function ParallelLayout({ result, brightness, lampConnected, referenceCurrent }: SeriesParallelCircuitProps) {
  const [branch1, branch2] = result.branches;
  const total = result.totalCurrent;
  const i1 = branch1!.current;
  const i2 = branch2!.current;
  const speed = (i: number) => flowSpeedForCurrent(i, referenceCurrent);

  // Conductors, split into segments so each carries its own current.
  const segments: { points: Point[]; current: number }[] = [
    { points: [[LEFT, BATTERY_TOP], [LEFT, TOP], [BRANCH_1_X, TOP]], current: total },
    { points: [[BRANCH_1_X, TOP], [BRANCH_2_X, TOP], [BRANCH_2_X, BOTTOM], [BRANCH_1_X, BOTTOM]], current: i2 },
    { points: [[BRANCH_1_X, TOP], [BRANCH_1_X, BOTTOM]], current: i1 },
    { points: [[BRANCH_1_X, BOTTOM], [LEFT, BOTTOM], [LEFT, BATTERY_BOTTOM]], current: total },
  ];

  return (
    <g>
      {segments.map((segment, index) => {
        const d = pathThrough(segment.points, 12);
        return <Wire key={`wire-${index}`} d={d} energized={segment.current > 0} />;
      })}
      {segments.map((segment, index) => {
        const d = pathThrough(segment.points, 12);
        return <CurrentFlow key={`flow-${index}`} d={d} active={segment.current > 0} speed={speed(segment.current)} />;
      })}
      <CircuitNode x={BRANCH_1_X} y={TOP} active={total > 0} />
      <CircuitNode x={BRANCH_1_X} y={BOTTOM} active={total > 0} />

      {[BRANCH_1_X, BRANCH_2_X].map((x, index) => (
        <LampWithReadout
          key={x}
          index={index}
          x={x}
          y={MID_Y}
          rotation={90}
          brightness={brightness[index]!}
          connected={lampConnected[index]!}
          voltage={result.branches[index]!.voltage}
          current={result.branches[index]!.current}
          readoutPosition={[x - 30, MID_Y - 6]}
          anchor="end"
        />
      ))}
      <CircuitLabel x={(LEFT + BRANCH_1_X) / 2} y={TOP - 14} text="I total" value={formatAmps(total, 2)} valueTone="cyan" decorative />
      <CircuitLabel x={(LEFT + RIGHT) / 2} y={BOTTOM + 30} text="TWO PATHS — SAME VOLTAGE ACROSS EACH" decorative />
    </g>
  );
}

interface LampWithReadoutProps {
  index: number;
  x: number;
  y: number;
  rotation: number;
  brightness: number;
  connected: boolean;
  voltage: number;
  current: number;
  readoutPosition: Point;
  anchor?: "start" | "middle" | "end";
}

function LampWithReadout({
  index,
  x,
  y,
  rotation,
  brightness,
  connected,
  voltage,
  current,
  readoutPosition,
  anchor = "middle",
}: LampWithReadoutProps) {
  const name = `Bulb ${index + 1}`;
  return (
    <g opacity={connected ? 1 : 0.45}>
      <Lamp x={x} y={y} rotation={rotation} brightness={connected ? brightness : 0} name={name} detail={connected ? `${formatVolts(voltage, 2)}, ${formatAmps(current, 2)}` : "removed"} />
      <CircuitLabel
        x={readoutPosition[0]}
        y={readoutPosition[1]}
        text={connected ? `B${index + 1} ${formatVolts(voltage, 2)}` : `B${index + 1} REMOVED`}
        value={connected ? formatAmps(current, 2) : "open"}
        anchor={anchor}
        tone={connected ? "muted" : "danger"}
        valueTone={connected ? "cyan" : "danger"}
        size={11}
        decorative
      />
    </g>
  );
}
