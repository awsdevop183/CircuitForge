import { formatWatts } from "@/lib/format";

const COMBINATIONS = [
  { v: 12, i: 1 },
  { v: 6, i: 2 },
  { v: 3, i: 4 },
] as const;

const PX_PER_VOLT = 16;
const PX_PER_AMP = 30;

/**
 * P = V × I drawn as area: width is voltage, height is current. Three very
 * different circuits deliver exactly the same power.
 */
export function PowerRectangles() {
  return (
    <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3 sm:p-6">
      {COMBINATIONS.map(({ v, i }) => (
        <figure key={v} className="flex flex-col items-center">
          <svg viewBox="0 0 220 150" className="h-auto w-full max-w-[14rem]" role="img" aria-label={`${v} volts times ${i} amps equals ${v * i} watts, drawn as a rectangle ${v} units wide and ${i} units tall.`}>
            <rect x={10} y={140 - i * PX_PER_AMP} width={v * PX_PER_VOLT} height={i * PX_PER_AMP} rx={3} fill="#f5a524" fillOpacity={0.22} stroke="#f5a524" strokeWidth={2} />
            <text x={10 + (v * PX_PER_VOLT) / 2} y={140 - (i * PX_PER_AMP) / 2} textAnchor="middle" dominantBaseline="central" fontSize={16} fontWeight={600} fill="#fcd34d" fontFamily="var(--font-mono)">
              {formatWatts(v * i)}
            </text>
          </svg>
          <figcaption className="mt-2 font-mono text-sm text-ink-muted">
            <span className="text-amber">{v} V</span> × <span className="text-cyan">{i} A</span> = <span className="text-ink">{v * i} W</span>
          </figcaption>
        </figure>
      ))}
      <p className="text-sm text-ink-muted sm:col-span-3">Width = voltage, height = current, area = power. Three different shapes, the same area: the same 12 W.</p>
    </div>
  );
}
