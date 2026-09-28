"use client";

import {
  Ammeter,
  Battery,
  CircuitCanvas,
  CircuitLabel,
  CircuitNode,
  CurrentFlow,
  Resistor,
  VoltageIndicator,
  Wire,
  rectLoop,
  type FlowDirection,
} from "@/components/circuit";
import { formatAmps, formatOhms, formatVolts } from "@/lib/format";
import { clamp } from "@/lib/math";
import { flowSpeedForCurrent } from "./flow-speed";

interface OhmsLawCircuitProps {
  voltage: number;
  resistance: number;
  current: number;
  power: number;
  maxCurrent: number;
  direction?: FlowDirection;
}

const LEFT = 70;
const RIGHT = 390;
const TOP = 110;
const BOTTOM = 270;
const LOOP = rectLoop(LEFT, TOP, RIGHT, BOTTOM, 14);

/** Battery → resistor → ammeter loop with a voltmeter across the resistor. */
export function OhmsLawCircuit({
  voltage,
  resistance,
  current,
  power,
  maxCurrent,
  direction = "conventional",
}: OhmsLawCircuitProps) {
  const flowing = current > 0;
  const heat = clamp(Math.sqrt(power / 20), 0, 1);
  const midX = (LEFT + RIGHT) / 2;

  return (
    <CircuitCanvas
      viewBox="0 0 460 310"
      interactive
      title="Ohm's law circuit"
      description={`A ${formatVolts(voltage)} supply drives current through a ${formatOhms(resistance)} resistor. The ammeter reads ${formatAmps(current)}.`}
    >
      <Wire d={LOOP} energized={flowing} />
      <CurrentFlow d={LOOP} active={flowing} speed={flowSpeedForCurrent(current, maxCurrent)} direction={direction} />
      {[
        [LEFT, TOP],
        [RIGHT, TOP],
        [RIGHT, BOTTOM],
        [LEFT, BOTTOM],
      ].map(([x, y]) => (
        <CircuitNode key={`${x}-${y}`} x={x!} y={y!} active={flowing} radius={3.5} />
      ))}

      <Battery x={LEFT} y={(TOP + BOTTOM) / 2} rotation={-90} detail={formatVolts(voltage)} energized={flowing} labelPlacement="right" labelOffset={26} />
      <Resistor x={midX} y={TOP} heat={heat} energized={flowing} detail={formatOhms(resistance)} labelPlacement="bottom" labelOffset={20} />
      <Ammeter x={RIGHT} y={(TOP + BOTTOM) / 2} rotation={90} energized={flowing} reading={formatAmps(current, 3)} labelPlacement="left" labelOffset={24} />

      <VoltageIndicator
        x={midX}
        y={38}
        value={voltage}
        label="Across R"
        probes={{ positive: [midX - 40, TOP], negative: [midX + 40, TOP] }}
      />

      <CircuitLabel x={LEFT - 34} y={(TOP + BOTTOM) / 2 - 6} text="SUPPLY" value={formatVolts(voltage)} anchor="end" decorative />
      <CircuitLabel x={RIGHT + 30} y={(TOP + BOTTOM) / 2 - 6} text="I" value={formatAmps(current, 2)} anchor="start" valueTone="cyan" decorative />
      <CircuitLabel x={midX} y={BOTTOM + 28} text={`R = ${formatOhms(resistance)}`} decorative />
    </CircuitCanvas>
  );
}
