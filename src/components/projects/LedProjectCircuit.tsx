"use client";

import { useState } from "react";
import { Plug, Unplug } from "lucide-react";
import {
  Battery,
  CircuitCanvas,
  CircuitLabel,
  CurrentFlow,
  Led,
  Resistor,
  Wire,
  rectLoop,
} from "@/components/circuit";
import { Button } from "@/components/ui/Button";

const LEFT = 70;
const RIGHT = 390;
const TOP = 70;
const BOTTOM = 230;
const LOOP = rectLoop(LEFT, TOP, RIGHT, BOTTOM, 14);

/** Wiring diagram for the LED project, with a "connect the battery" test. */
export function LedProjectCircuit({ supply, resistance, current }: { supply: number; resistance: number; current: number }) {
  const [connected, setConnected] = useState(false);

  return (
    <div>
      <div className="bg-breadboard px-2 py-5 sm:px-8">
        <CircuitCanvas
          viewBox="0 0 460 280"
          interactive
          title="LED project wiring diagram"
          description={`A ${supply} volt battery, a ${resistance} ohm resistor and a red LED in a single loop. The battery is ${connected ? "connected and the LED is lit" : "disconnected"}.`}
          className="mx-auto max-w-2xl"
        >
          <Wire d={LOOP} energized={connected} />
          <CurrentFlow d={LOOP} active={connected} speed={45} />
          <Battery x={LEFT} y={(TOP + BOTTOM) / 2} rotation={-90} detail={`${supply} V`} energized={connected} labelPlacement="right" labelOffset={26} />
          <Resistor x={(LEFT + RIGHT) / 2} y={TOP} detail={`${resistance} Ω`} energized={connected} labelPlacement="bottom" labelOffset={20} />
          <Led x={RIGHT} y={(TOP + BOTTOM) / 2} rotation={90} brightness={connected ? 0.9 : 0} color="#ef4444" labelPlacement="left" labelOffset={30} />
          <CircuitLabel x={LEFT - 34} y={(TOP + BOTTOM) / 2 - 6} text="BT1" value={`${supply} V`} anchor="end" decorative />
          <CircuitLabel x={(LEFT + RIGHT) / 2} y={TOP - 30} text="R1" value={`${resistance} Ω`} decorative />
          <CircuitLabel x={RIGHT + 30} y={(TOP + BOTTOM) / 2 - 22} text="D1" value="LED" anchor="start" decorative />
          <CircuitLabel x={RIGHT + 30} y={(TOP + BOTTOM) / 2 + 26} text="long leg ↑" anchor="start" size={10} decorative />
          <CircuitLabel x={(LEFT + RIGHT) / 2} y={BOTTOM + 30} text={connected ? `≈ ${(current * 1000).toFixed(1)} mA FLOWING` : "BATTERY CLIP DISCONNECTED"} tone={connected ? "cyan" : "amber"} decorative />
        </CircuitCanvas>
      </div>
      <div className="flex justify-end border-t border-line p-4">
        <Button variant={connected ? "secondary" : "primary"} onClick={() => setConnected((c) => !c)} aria-pressed={connected}>
          {connected ? <Unplug className="size-4" aria-hidden="true" /> : <Plug className="size-4" aria-hidden="true" />}
          {connected ? "Disconnect battery" : "Connect battery"}
        </Button>
      </div>
    </div>
  );
}
