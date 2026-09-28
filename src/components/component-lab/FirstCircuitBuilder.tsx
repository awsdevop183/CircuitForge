"use client";

import { useCallback, useState } from "react";
import { ChallengeList } from "@/components/lab/ChallengeList";
import { CircuitExplorer, type CircuitExplorerState } from "@/components/simulations/CircuitExplorer";
import { LED_RATED_CURRENT } from "@/lib/circuit-sim";

/**
 * Battery → switch → resistor → LED → battery, with missions that use
 * everything from Modules 01 and 02.
 */
export function FirstCircuitBuilder() {
  const [state, setState] = useState<CircuitExplorerState | null>(null);
  const [seen, setSeen] = useState({ tooBright: false, dim: false });
  const onStateChange = useCallback((next: CircuitExplorerState) => setState(next), []);

  // Remember milestones once reached (adjust-state-during-render pattern).
  if (state?.ledOverdriven && !seen.tooBright) setSeen((s) => ({ ...s, tooBright: true }));
  const lit = state?.status === "flowing";
  const safe = lit && state.current >= 0.01 && state.current <= LED_RATED_CURRENT;
  if (lit && state.current < 0.005 && !seen.dim) setSeen((s) => ({ ...s, dim: true }));

  const missions = [
    { id: "light", prompt: "Close the switch to complete the circuit and light the LED.", satisfied: Boolean(lit) },
    { id: "safe", prompt: "Adjust voltage and resistance so the LED runs safely at 10–20 mA.", satisfied: Boolean(safe) },
    { id: "too-bright", prompt: "Lower the resistance until the LED is overdriven (then fix it!).", satisfied: seen.tooBright },
    { id: "dim", prompt: "Make the LED glow very dimly — under 5 mA.", satisfied: seen.dim },
    { id: "off-again", prompt: "Open the switch to turn it off once more.", satisfied: Boolean(state && !state.closed && seen.tooBright) },
  ];

  return (
    <div className="space-y-5">
      <div className="panel-raised overflow-hidden rounded-2xl">
        <CircuitExplorer
          parts={{ switch: true, resistor: true, led: true, ground: true }}
          initial={{ voltage: 9, resistance: 1_000, closed: false }}
          controls={{ voltage: [3, 12], resistance: [47, 10_000], direction: true }}
          readouts
          title="Your first circuit: battery, switch, resistor and LED"
          onStateChange={onStateChange}
        />
      </div>
      <div className="panel-raised rounded-2xl p-5">
        <ChallengeList challenges={missions} />
      </div>
    </div>
  );
}
