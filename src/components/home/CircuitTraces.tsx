/**
 * Decorative PCB traces for page backdrops. Purely visual (aria-hidden);
 * the pulse animation is disabled by the global reduced-motion rule.
 */
const TRACES = [
  "M -20 120 H 180 L 220 160 H 420",
  "M -20 220 H 120 L 170 270 H 360 L 400 230 H 620",
  "M 900 60 H 1120 L 1160 100 H 1460",
  "M 980 300 H 1180 L 1220 260 H 1460",
  "M 760 -20 V 60 L 800 100 V 180",
  "M 300 520 H 520 L 560 480 H 760",
  "M 1040 520 H 1240 L 1280 560 H 1460",
];

const PADS: readonly (readonly [number, number])[] = [
  [420, 160],
  [620, 230],
  [900, 60],
  [980, 300],
  [800, 180],
  [760, 480],
  [1040, 520],
];

export function CircuitTraces({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {TRACES.map((d) => (
          <path key={d} d={d} stroke="#15202e" strokeWidth={2} />
        ))}
        {TRACES.map((d, index) => (
          <path
            key={`pulse-${d}`}
            d={d}
            stroke={index % 3 === 1 ? "#f5a524" : "#22d3ee"}
            strokeWidth={2}
            strokeDasharray="40 900"
            style={{
              animation: `trace-run ${7 + index * 1.3}s linear ${index * 0.8}s infinite`,
              opacity: 0.55,
            }}
          />
        ))}
      </g>
      {PADS.map(([cx, cy]) => (
        <g key={`${cx}-${cy}`}>
          <circle cx={cx} cy={cy} r={6} fill="#070a10" stroke="#1f2b3b" strokeWidth={2} />
          <circle cx={cx} cy={cy} r={2} fill="#22d3ee" opacity={0.5} />
        </g>
      ))}
    </svg>
  );
}
