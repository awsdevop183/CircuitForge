import { useId, type ReactNode } from "react";
import { ResistorIllustration } from "./ResistorIllustration";

interface IllustrationProps {
  className?: string;
}

/** Wrapper for 160 × 120 illustrations. */
function Frame({ className, children }: IllustrationProps & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 160 120" className={className} aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

const LEG = "#b8c2cc";

export function LedIllustration({ className, color = "#ef4444", lit = false }: IllustrationProps & { color?: string; lit?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <Frame className={className}>
      <defs>
        <radialGradient id={`led-glow-${id}`}>
          <stop offset="0" stopColor={color} stopOpacity="0.8" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`led-dome-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.95" />
          <stop offset="0.5" stopColor={color} stopOpacity="0.7" />
          <stop offset="1" stopColor={color} stopOpacity="0.95" />
        </linearGradient>
      </defs>
      {lit ? <circle cx="80" cy="36" r="46" fill={`url(#led-glow-${id})`} /> : null}
      {/* Anode (long) and cathode (short) legs */}
      <line x1="72" y1="66" x2="72" y2="116" stroke={LEG} strokeWidth="3" strokeLinecap="round" />
      <line x1="88" y1="66" x2="88" y2="104" stroke={LEG} strokeWidth="3" strokeLinecap="round" />
      <path d="M 62 64 L 62 32 A 18 18 0 0 1 98 32 L 98 64 Z" fill={`url(#led-dome-${id})`} />
      <rect x="58" y="62" width="44" height="6" rx="1.5" fill={color} opacity="0.9" />
      {/* Flat edge marks the cathode */}
      <rect x="99" y="62" width="3" height="6" fill="#0b1018" opacity="0.6" />
      <path d="M 68 30 A 12 12 0 0 1 78 20" stroke="#fff" strokeOpacity="0.6" strokeWidth="3" fill="none" strokeLinecap="round" />
      {lit ? <circle cx="80" cy="36" r="8" fill="#fff" opacity="0.85" /> : null}
    </Frame>
  );
}

export function CapacitorIllustration({ className }: IllustrationProps) {
  const id = useId().replace(/:/g, "");
  return (
    <Frame className={className}>
      <defs>
        <linearGradient id={`cap-can-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#1e3a8a" />
          <stop offset="0.45" stopColor="#3b63c4" />
          <stop offset="1" stopColor="#172554" />
        </linearGradient>
      </defs>
      <line x1="72" y1="92" x2="72" y2="116" stroke={LEG} strokeWidth="3" strokeLinecap="round" />
      <line x1="88" y1="92" x2="88" y2="110" stroke={LEG} strokeWidth="3" strokeLinecap="round" />
      <rect x="56" y="12" width="48" height="82" rx="8" fill={`url(#cap-can-${id})`} />
      <rect x="90" y="12" width="12" height="82" fill="#cbd5e1" opacity="0.85" />
      {[28, 46, 64, 82].map((y) => (
        <rect key={y} x="93.5" y={y - 1.5} width="5" height="3" fill="#1e293b" />
      ))}
      <ellipse cx="80" cy="14" rx="24" ry="4" fill="#94a3b8" />
      <path d="M 70 14 L 90 14 M 80 10 L 80 18" stroke="#64748b" strokeWidth="1.5" />
      <text x="72" y="58" fontSize="9" fill="#dbeafe" fontFamily="var(--font-mono)" transform="rotate(-90 72 58)" textAnchor="middle">
        100µF
      </text>
    </Frame>
  );
}

export function DiodeIllustration({ className }: IllustrationProps) {
  return (
    <Frame className={className}>
      <line x1="0" y1="60" x2="160" y2="60" stroke={LEG} strokeWidth="3" strokeLinecap="round" />
      <rect x="46" y="44" width="68" height="32" rx="6" fill="#1f1f23" />
      <rect x="98" y="44" width="8" height="32" fill="#d1d5db" />
      <rect x="46" y="46" width="68" height="8" rx="4" fill="#fff" opacity="0.08" />
      <text x="72" y="64" fontSize="7" fill="#9ca3af" fontFamily="var(--font-mono)" textAnchor="middle">
        4007
      </text>
    </Frame>
  );
}

export function BatteryIllustration({ className }: IllustrationProps) {
  const id = useId().replace(/:/g, "");
  return (
    <Frame className={className}>
      <defs>
        <linearGradient id={`bat-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#374151" />
          <stop offset="0.4" stopColor="#1f2937" />
          <stop offset="1" stopColor="#0b0f14" />
        </linearGradient>
      </defs>
      <rect x="24" y="38" width="104" height="44" rx="6" fill={`url(#bat-${id})`} />
      <rect x="90" y="38" width="38" height="44" fill="#f5a524" />
      <rect x="128" y="50" width="8" height="20" rx="2" fill="#cbd5e1" />
      <rect x="24" y="40" width="104" height="8" rx="4" fill="#fff" opacity="0.1" />
      <text x="56" y="65" fontSize="11" fill="#e5e7eb" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">
        1.5V
      </text>
      <text x="110" y="66" fontSize="16" fill="#0b1018" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">
        +
      </text>
      <text x="16" y="66" fontSize="16" fill="#60a5fa" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">
        −
      </text>
    </Frame>
  );
}

export function SwitchIllustration({ className }: IllustrationProps) {
  return (
    <Frame className={className}>
      {[
        [52, 34],
        [108, 34],
        [52, 86],
        [108, 86],
      ].map(([x, y]) => (
        <line key={`${x}-${y}`} x1={x} y1={y} x2={x! + (x! < 80 ? -14 : 14)} y2={y} stroke={LEG} strokeWidth="4" strokeLinecap="round" />
      ))}
      <rect x="48" y="28" width="64" height="64" rx="6" fill="#1f2937" stroke="#374151" strokeWidth="2" />
      <circle cx="80" cy="60" r="20" fill="#111827" />
      <circle cx="80" cy="60" r="16" fill="#f5a524" />
      <circle cx="75" cy="55" r="5" fill="#fff" opacity="0.3" />
    </Frame>
  );
}

export function TransistorIllustration({ className }: IllustrationProps) {
  return (
    <Frame className={className}>
      {[64, 80, 96].map((x) => (
        <line key={x} x1={x} y1="70" x2={x} y2="116" stroke={LEG} strokeWidth="3" strokeLinecap="round" />
      ))}
      <path d="M 54 72 L 54 30 A 26 26 0 0 1 106 30 L 106 72 Z" fill="#18181b" />
      <rect x="54" y="30" width="52" height="42" fill="#27272a" />
      <text x="80" y="50" fontSize="7" fill="#a1a1aa" fontFamily="var(--font-mono)" textAnchor="middle">
        BC547
      </text>
      <text x="80" y="60" fontSize="6" fill="#71717a" fontFamily="var(--font-mono)" textAnchor="middle">
        E B C
      </text>
    </Frame>
  );
}

export function MosfetIllustration({ className }: IllustrationProps) {
  return (
    <Frame className={className}>
      {[66, 80, 94].map((x) => (
        <line key={x} x1={x} y1="80" x2={x} y2="116" stroke={LEG} strokeWidth="3" strokeLinecap="round" />
      ))}
      <rect x="54" y="6" width="52" height="36" rx="3" fill="#cbd5e1" />
      <circle cx="80" cy="22" r="7" fill="#070a10" />
      <rect x="54" y="38" width="52" height="44" rx="2" fill="#18181b" />
      <text x="80" y="60" fontSize="7" fill="#a1a1aa" fontFamily="var(--font-mono)" textAnchor="middle">
        IRLZ44N
      </text>
      <text x="80" y="72" fontSize="6" fill="#71717a" fontFamily="var(--font-mono)" textAnchor="middle">
        G D S
      </text>
    </Frame>
  );
}

export function RelayIllustration({ className }: IllustrationProps) {
  return (
    <Frame className={className}>
      {[48, 64, 96, 112].map((x) => (
        <line key={x} x1={x} y1="94" x2={x} y2="112" stroke={LEG} strokeWidth="3" strokeLinecap="round" />
      ))}
      <rect x="36" y="18" width="88" height="78" rx="6" fill="#1d4ed8" />
      <rect x="36" y="18" width="88" height="10" rx="5" fill="#fff" opacity="0.12" />
      <text x="80" y="50" fontSize="9" fill="#dbeafe" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">
        SRD-05VDC
      </text>
      <text x="80" y="64" fontSize="7" fill="#bfdbfe" fontFamily="var(--font-mono)" textAnchor="middle">
        10A 250VAC
      </text>
      <path d="M 60 76 h 40" stroke="#bfdbfe" strokeWidth="1" opacity="0.6" />
    </Frame>
  );
}

const ILLUSTRATIONS: Record<string, (props: IllustrationProps) => ReactNode> = {
  resistor: ({ className }) => <ResistorIllustration className={className} />,
  led: (props) => <LedIllustration {...props} lit />,
  capacitor: CapacitorIllustration,
  diode: DiodeIllustration,
  battery: BatteryIllustration,
  switch: SwitchIllustration,
  transistor: TransistorIllustration,
  mosfet: MosfetIllustration,
  relay: RelayIllustration,
};

/** Realistic illustration for a component slug, or null if none exists. */
export function ComponentIllustration({ slug, className }: { slug: string; className?: string }) {
  const Illustration = ILLUSTRATIONS[slug];
  return Illustration ? <Illustration className={className} /> : null;
}

export { ResistorIllustration };
