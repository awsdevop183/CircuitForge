"use client";

import { Battery, CircuitCanvas, Lamp, Switch, Wire, rectLoop } from "@/components/circuit";

/** An open circuit illustration for the 404 page. */
export function CircuitGap() {
  return (
    <div className="w-full max-w-sm">
      <CircuitCanvas viewBox="0 0 320 180" title="An open circuit" background="#070a10">
        <Wire d={rectLoop(40, 30, 280, 150, 12)} />
        <Battery x={40} y={90} rotation={-90} focusable={false} />
        <Lamp x={160} y={30} brightness={0} focusable={false} />
        <Switch x={160} y={150} closed={false} focusable={false} />
      </CircuitCanvas>
    </div>
  );
}
