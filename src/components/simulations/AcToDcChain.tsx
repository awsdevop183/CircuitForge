import { ArrowRight, Plug, Smartphone, Zap } from "lucide-react";

const STEPS = [
  { icon: Zap, title: "Wall socket", detail: "120–230 V AC", note: "Alternates 50–60× a second", tone: "border-orange/50 text-orange" },
  { icon: Plug, title: "Charger", detail: "Converts AC → DC", note: "Lowers the voltage too", tone: "border-amber/50 text-amber" },
  { icon: Smartphone, title: "Phone", detail: "5 V DC", note: "Electronics need steady DC", tone: "border-cyan/50 text-cyan" },
] as const;

/** Why chargers exist: mains AC in, low-voltage DC out. */
export function AcToDcChain() {
  return (
    <ol className="grid items-center gap-3 p-5 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:p-6">
      {STEPS.map((step, index) => (
        <li key={step.title} className="contents">
          <div className={`flex flex-col items-center rounded-xl border bg-void/40 p-4 text-center ${step.tone}`}>
            <step.icon className="size-7" aria-hidden="true" />
            <p className="mt-2 font-semibold text-ink">{step.title}</p>
            <p className="font-mono text-sm">{step.detail}</p>
            <p className="mt-1 text-xs text-ink-subtle">{step.note}</p>
          </div>
          {index < STEPS.length - 1 ? <ArrowRight className="mx-auto size-5 rotate-90 text-ink-subtle sm:rotate-0" aria-hidden="true" /> : null}
        </li>
      ))}
    </ol>
  );
}
