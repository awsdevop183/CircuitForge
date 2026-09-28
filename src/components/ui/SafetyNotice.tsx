import { ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type SafetyTopic =
  | "general"
  | "short-circuit"
  | "batteries"
  | "high-current"
  | "capacitors"
  | "mains"
  | "ac"
  | "ratings"
  | "polarity"
  | "heat";

const MESSAGES: Record<SafetyTopic, { title: string; points: string[] }> = {
  general: {
    title: "Stay safe while you learn",
    points: [
      "Only build circuits from low-voltage sources: AA/AAA cells, 9 V batteries, USB (5 V) or a bench supply set to 12 V or less.",
      "Young learners should build with an adult's supervision.",
      "Never open, modify or experiment with anything that plugs into the wall.",
    ],
  },
  "short-circuit": {
    title: "Never short-circuit a battery on purpose",
    points: [
      "Connecting a battery's terminals directly together makes wires and batteries hot enough to burn skin in seconds.",
      "Lithium batteries (phones, laptops, power banks) can swell, catch fire or explode when shorted.",
      "Watch out for accidental shorts: loose wires, coins or keys touching a 9 V battery's terminals.",
    ],
  },
  batteries: {
    title: "Handle batteries with care",
    points: [
      "Don't short, puncture, heat or try to recharge non-rechargeable batteries.",
      "Store 9 V batteries with their terminals covered so nothing can bridge them.",
      "Stop and disconnect if a battery or wire becomes warm.",
    ],
  },
  "high-current": {
    title: "High current means heat",
    points: [
      "Beginner circuits usually carry a few milliamps to a few hundred milliamps.",
      "Several amps can make thin wires and small resistors glow, melt or start a fire.",
      "If anything gets hot or smells burnt, disconnect the power immediately.",
    ],
  },
  capacitors: {
    title: "Capacitors can hold a charge",
    points: [
      "A capacitor can stay charged after the power is removed.",
      "Large capacitors inside mains equipment (TVs, microwaves, power supplies) can deliver a dangerous shock even when unplugged — never open them.",
      "Keep to small, low-voltage capacitors in your own circuits.",
    ],
  },
  mains: {
    title: "Mains electricity can kill",
    points: [
      "Household mains (120 V or 230 V AC) can drive a lethal current through your body.",
      "Never open, probe or experiment with mains-powered devices, sockets or wiring.",
      "Mains work is for qualified electricians only.",
    ],
  },
  ratings: {
    title: "Stay inside the ratings",
    points: [
      "Every component has maximum ratings: voltage, current and power. Exceed them and it can overheat, fail or burn.",
      "Check P = V × I for resistors, the current limit for LEDs, and the voltage rating for capacitors before you build.",
      "Beginners: stick to battery-powered circuits of 12 V or less.",
    ],
  },
  polarity: {
    title: "Mind the polarity",
    points: [
      "LEDs, diodes, electrolytic capacitors and batteries only work one way round.",
      "An electrolytic capacitor connected backwards can overheat, bulge or burst.",
      "Double-check + and − before connecting power.",
    ],
  },
  heat: {
    title: "Components can get hot",
    points: [
      "Resistors, regulators, transistors and motors turn wasted energy into heat.",
      "Touch-test carefully (or not at all): if something is too hot to hold, disconnect the power.",
      "Hot parts need a bigger rating, a heatsink or a more efficient design.",
    ],
  },
  ac: {
    title: "Explore AC only through simulations",
    points: [
      "The AC you find at home is mains electricity — do not experiment with it.",
      "Everything in this module can be learned safely with batteries and on-screen simulations.",
    ],
  },
};

interface SafetyNoticeProps {
  topic: SafetyTopic;
  /** Extra context specific to the lesson. */
  children?: ReactNode;
  className?: string;
}

/** Standard, consistent safety messaging. Always pairs colour with an icon and heading. */
export function SafetyNotice({ topic, children, className }: SafetyNoticeProps) {
  const message = MESSAGES[topic];
  return (
    <aside
      className={cn("flex gap-3 rounded-xl border border-orange/45 bg-orange/[0.06] p-4 sm:p-5", className)}
      aria-label={`Safety: ${message.title}`}
    >
      <ShieldAlert className="mt-0.5 size-5 shrink-0 text-orange" aria-hidden="true" />
      <div className="min-w-0 text-sm leading-relaxed text-ink-muted">
        <p className="eyebrow mb-1 text-orange">Safety</p>
        <p className="font-semibold text-ink">{message.title}</p>
        <ul className="mt-2 space-y-1.5">
          {message.points.map((point) => (
            <li key={point} className="flex gap-2">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-orange" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
        {children ? <div className="mt-2">{children}</div> : null}
      </div>
    </aside>
  );
}
