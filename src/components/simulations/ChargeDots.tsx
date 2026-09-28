/** A small cluster of charges, e.g. "+ ● ●" — used on concept cards. */
export function ChargeDots({ sign, count = 3 }: { sign: "+" | "−"; count?: number }) {
  const positive = sign === "+";
  return (
    <svg viewBox={`0 0 ${count * 34 + 6} 40`} className="h-10 w-auto" role="img" aria-label={`${count} ${positive ? "positive" : "negative"} charges`}>
      {Array.from({ length: count }, (_, i) => (
        <g key={i} transform={`translate(${20 + i * 34} 20)`}>
          <circle r={15} fill={positive ? "#7f1d1d" : "#164e63"} stroke={positive ? "#f87171" : "#67e8f9"} strokeWidth={2} />
          <text textAnchor="middle" dominantBaseline="central" fontSize={18} fontWeight={700} fill={positive ? "#fecaca" : "#cffafe"}>
            {sign}
          </text>
        </g>
      ))}
    </svg>
  );
}
