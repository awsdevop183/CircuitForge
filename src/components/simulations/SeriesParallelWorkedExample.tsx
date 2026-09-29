"use client";

import { Battery, CircuitCanvas, CircuitLabel, CircuitNode, Resistor, Wire, rectLoop } from "@/components/circuit";
import { parallelResistance, seriesResistance, solveParallel, solveSeries } from "@/lib/electronics";
import { formatAmps, formatOhms, formatVolts } from "@/lib/format";

const SUPPLY = 9;
const R1 = 100;
const R2 = 200;
const LOADS = [
  { resistance: R1, connected: true },
  { resistance: R2, connected: true },
];

/** The same two resistors wired both ways, with the numbers worked out. */
export function SeriesParallelWorkedExample() {
  const series = solveSeries(SUPPLY, LOADS);
  const parallel = solveParallel(SUPPLY, LOADS);

  return (
    <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-2">
      <figure className="bg-surface-raised p-4 sm:p-5">
        <figcaption className="eyebrow mb-2 text-amber">Series — one path</figcaption>
        <CircuitCanvas viewBox="0 0 320 200" title="Series example" description={`${SUPPLY} volts across ${R1} and ${R2} ohms in series.`}>
          <Wire d={rectLoop(40, 40, 280, 160, 10)} energized />
          <Battery x={40} y={100} rotation={-90} detail={`${SUPPLY} V`} energized labelPlacement="right" labelOffset={24} />
          <Resistor x={120} y={40} name="R1" detail={`${R1} Ω`} energized />
          <Resistor x={220} y={40} name="R2" detail={`${R2} Ω`} energized />
          <CircuitLabel x={120} y={72} text={formatVolts(series.branches[0]!.voltage)} tone="amber" decorative />
          <CircuitLabel x={220} y={72} text={formatVolts(series.branches[1]!.voltage)} tone="amber" decorative />
          <CircuitLabel x={160} y={190} text={`I = ${formatAmps(series.totalCurrent)} everywhere`} tone="cyan" decorative />
        </CircuitCanvas>
        <dl className="mt-3 space-y-1.5 font-mono text-sm">
          <Row label="Total resistance" value={`${R1} + ${R2} = ${formatOhms(seriesResistance([R1, R2]))}`} />
          <Row label="Current" value={`${SUPPLY} V ÷ ${formatOhms(series.totalResistance)} = ${formatAmps(series.totalCurrent)}`} />
          <Row label="Voltage shared" value={`${formatVolts(series.branches[0]!.voltage)} + ${formatVolts(series.branches[1]!.voltage)} = ${SUPPLY} V`} />
          <Row label="If one fails" value="Everything stops" />
        </dl>
      </figure>
      <figure className="bg-surface-raised p-4 sm:p-5">
        <figcaption className="eyebrow mb-2 text-cyan">Parallel — two paths</figcaption>
        <CircuitCanvas viewBox="0 0 350 200" title="Parallel example" description={`${SUPPLY} volts across ${R1} and ${R2} ohms in parallel.`}>
          <Wire points={[[40, 60], [40, 30], [280, 30], [280, 170], [40, 170], [40, 140]]} energized />
          <Wire points={[[170, 30], [170, 170]]} energized />
          <CircuitNode x={170} y={30} active />
          <CircuitNode x={170} y={170} active />
          <Battery x={40} y={100} rotation={-90} detail={`${SUPPLY} V`} energized labelPlacement="right" labelOffset={24} />
          <Resistor x={170} y={100} rotation={90} name="R1" detail={`${R1} Ω`} energized labelPlacement="left" labelOffset={30} />
          <Resistor x={280} y={100} rotation={90} name="R2" detail={`${R2} Ω`} energized labelPlacement="left" labelOffset={30} />
          <CircuitLabel x={186} y={104} text={formatAmps(parallel.branches[0]!.current)} tone="cyan" anchor="start" decorative />
          <CircuitLabel x={296} y={104} text={formatAmps(parallel.branches[1]!.current)} tone="cyan" anchor="start" decorative />
          <CircuitLabel x={175} y={194} text={`${SUPPLY} V across each branch`} tone="amber" decorative />
        </CircuitCanvas>
        <dl className="mt-3 space-y-1.5 font-mono text-sm">
          <Row label="Total resistance" value={formatOhms(parallelResistance([R1, R2]))} />
          <Row label="Branch currents" value={`${formatAmps(parallel.branches[0]!.current)} + ${formatAmps(parallel.branches[1]!.current)}`} />
          <Row label="Total current" value={formatAmps(parallel.totalCurrent)} />
          <Row label="If one fails" value="The other keeps working" />
        </dl>
      </figure>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap justify-between gap-x-3 border-b border-line/60 pb-1.5 last:border-0">
      <dt className="font-sans text-ink-subtle">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}
