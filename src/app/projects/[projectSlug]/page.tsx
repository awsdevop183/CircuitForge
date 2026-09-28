import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calculator, ListOrdered, Package, Wrench } from "lucide-react";
import { LedProjectCircuit } from "@/components/projects/LedProjectCircuit";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";
import { getProject } from "@/content/projects";
import { ledSeriesResistor, nextE12Value } from "@/lib/electronics";

interface ProjectPageProps {
  params: Promise<{ projectSlug: string }>;
}

export const dynamicParams = false;

/** Only projects with a written build guide get a page. */
export function generateStaticParams() {
  return [{ projectSlug: "led-circuit" }];
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { projectSlug } = await params;
  const project = getProject(projectSlug);
  return project ? { title: `${project.title} · Projects`, description: project.summary } : {};
}

const SUPPLY = 9;
const FORWARD_VOLTAGE = 2;
const TARGET_CURRENT = 0.015;

const PARTS = [
  { name: "9 V battery + snap clip", href: "/components/battery" },
  { name: "Red 5 mm LED", href: "/components/led" },
  { name: "470 Ω resistor (yellow, violet, brown)", href: "/components/resistor" },
  { name: "Breadboard and 2 jumper wires", href: null },
] as const;

const STEPS = [
  {
    title: "Identify the LED legs",
    body: "The longer leg is the anode (+). The shorter leg, next to the flat edge of the rim, is the cathode (−).",
  },
  {
    title: "Place the LED",
    body: "Push the LED into the breadboard with its legs in two different rows. Note which row has the long leg.",
  },
  {
    title: "Add the resistor",
    body: "Connect one end of the 470 Ω resistor to the long-leg row. Resistors aren't polarised — either way round works.",
  },
  {
    title: "Wire the battery",
    body: "Red (+) lead to the free end of the resistor. Black (−) lead to the LED's short-leg row. That closes the loop.",
  },
  {
    title: "Test and troubleshoot",
    body: "No light? Check the LED isn't reversed, every lead is firmly seated, and the battery isn't flat.",
  },
];

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectSlug } = await params;
  const project = getProject(projectSlug);
  if (!project || !project.available) notFound();

  const idealResistance = ledSeriesResistor(SUPPLY, FORWARD_VOLTAGE, TARGET_CURRENT)!;
  const resistance = nextE12Value(idealResistance);
  const current = (SUPPLY - FORWARD_VOLTAGE) / resistance;

  return (
    <Container className="max-w-5xl py-8 sm:py-12">
      <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-cyan">
        <ArrowLeft className="size-4" aria-hidden="true" />
        All projects
      </Link>
      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-amber">{project.level}</span>
          <Badge tone="positive">Available</Badge>
          <Badge>≈ 20 min build</Badge>
        </div>
        <h1 className="mt-3 text-4xl font-semibold text-ink sm:text-5xl">{project.title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-muted">{project.summary}</p>
      </header>

      <section aria-labelledby="diagram-heading" className="mt-12">
        <h2 id="diagram-heading" className="flex items-center gap-2 text-2xl font-semibold text-ink">
          <Wrench className="size-5 text-cyan" aria-hidden="true" />
          The circuit
        </h2>
        <div className="panel-raised mt-5 overflow-hidden rounded-2xl">
          <LedProjectCircuit supply={SUPPLY} resistance={resistance} current={current} />
        </div>
      </section>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <section aria-labelledby="parts-heading" className="panel rounded-2xl p-6">
          <h2 id="parts-heading" className="flex items-center gap-2 text-xl font-semibold text-ink">
            <Package className="size-5 text-amber" aria-hidden="true" />
            Parts
          </h2>
          <ul className="mt-4 space-y-2.5">
            {PARTS.map((part) => (
              <li key={part.name} className="flex items-center gap-3 text-sm">
                <span className="size-1.5 shrink-0 rounded-full bg-cyan" aria-hidden="true" />
                {part.href ? (
                  <Link href={part.href} className="text-ink underline decoration-line-strong underline-offset-4 hover:text-cyan hover:decoration-cyan">
                    {part.name}
                  </Link>
                ) : (
                  <span className="text-ink">{part.name}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="calc-heading" className="panel rounded-2xl p-6">
          <h2 id="calc-heading" className="flex items-center gap-2 text-xl font-semibold text-ink">
            <Calculator className="size-5 text-amber" aria-hidden="true" />
            Choosing the resistor
          </h2>
          <ol className="mt-4 space-y-2 font-mono text-sm text-ink-muted">
            <li>
              R = (V<sub>supply</sub> − V<sub>LED</sub>) ÷ I
            </li>
            <li>
              R = ({SUPPLY} V − {FORWARD_VOLTAGE} V) ÷ {TARGET_CURRENT * 1000} mA = <span className="text-ink">{idealResistance.toFixed(0)} Ω</span>
            </li>
            <li>
              Nearest standard value up: <span className="text-cyan">{resistance} Ω</span>
            </li>
            <li>
              Actual current: <span className="text-cyan">{(current * 1000).toFixed(1)} mA</span> — safely under 20 mA
            </li>
          </ol>
        </section>
      </div>

      <section aria-labelledby="steps-heading" className="mt-12">
        <h2 id="steps-heading" className="flex items-center gap-2 text-2xl font-semibold text-ink">
          <ListOrdered className="size-5 text-cyan" aria-hidden="true" />
          Build it
        </h2>
        <ol className="mt-6 space-y-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="panel flex gap-4 rounded-xl p-5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-cyan/40 bg-cyan/10 font-mono text-sm text-cyan">
                {index + 1}
              </span>
              <div>
                <p className="font-semibold text-ink">{step.title}</p>
                <p className="mt-1 text-sm text-ink-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <Callout kind="warning" className="mt-6">
          <p>Never connect an LED straight across a battery without a resistor — it will burn out almost instantly.</p>
        </Callout>
      </section>

      <div className="mt-12 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/components/led">
          Experiment with LED resistors
          <ArrowRight className="size-4" aria-hidden="true" />
        </ButtonLink>
        <ButtonLink href="/projects" variant="secondary">
          See what&apos;s next
        </ButtonLink>
      </div>
    </Container>
  );
}
