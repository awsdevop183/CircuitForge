import { useId } from "react";

interface ResistorIllustrationProps {
  /** Band colours as CSS colours, left to right (last = tolerance). */
  bands?: readonly string[];
  className?: string;
  title?: string;
}

const DEFAULT_BANDS = ["#a52a2a", "#1a1a1a", "#8b4513", "#d4af37"]; // 100 Ω ±5%

/** Through-hole axial resistor with colour bands. */
export function ResistorIllustration({ bands = DEFAULT_BANDS, className, title }: ResistorIllustrationProps) {
  const id = useId().replace(/:/g, "");
  const bodyGradient = `res-body-${id}`;
  const shine = `res-shine-${id}`;
  // Leave a gap before the tolerance band like real parts.
  const positions = bands.length === 5 ? [58, 70, 82, 94, 116] : [60, 74, 88, 114];

  return (
    <svg viewBox="0 0 200 80" className={className} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <defs>
        <linearGradient id={bodyGradient} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f3dfb8" />
          <stop offset="0.55" stopColor="#d9b98a" />
          <stop offset="1" stopColor="#a8875c" />
        </linearGradient>
        <linearGradient id={shine} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="0" y1="40" x2="200" y2="40" stroke="#b8c2cc" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M 44 26 Q 44 20 52 20 L 60 22 L 140 22 L 148 20 Q 156 20 156 26 L 156 54 Q 156 60 148 60 L 140 58 L 60 58 L 52 60 Q 44 60 44 54 Z"
        fill={`url(#${bodyGradient})`}
      />
      {bands.map((color, index) => (
        <rect key={index} x={positions[index]} y={index === 0 ? 20.5 : 22} width="7" height={index === 0 ? 39 : 36} fill={color} />
      ))}
      <path d="M 44 26 Q 44 20 52 20 L 60 22 L 140 22 L 148 20 Q 156 20 156 26 L 156 38 L 44 38 Z" fill={`url(#${shine})`} />
    </svg>
  );
}
