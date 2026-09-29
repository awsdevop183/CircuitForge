import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Binary, Zap } from "lucide-react";
import { ExperimentGrid } from "@/components/lab/ExperimentGrid";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { EXPERIMENTS, LAB_CATEGORIES, experimentsIn, type LabCategory } from "@/content/experiments";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Interactive Lab",
  description: "Hands-on electronics and digital-logic experiments: change voltage, resistance, wiring and logic inputs and watch circuits respond instantly.",
};

const ICONS: Record<LabCategory, typeof Zap> = { electricity: Zap, digital: Binary };

export default function LabPage() {
  return (
    <>
      <PageHeader
        eyebrow="Interactive Lab"
        title="Your electronics bench — no parts required."
        description="Every experiment is a live circuit. Change a value, watch the charge move, read the meters and test your predictions. Nothing can burn out here, so push the limits — then build safely for real with low-voltage batteries."
      >
        <p className="font-mono text-sm text-ink-subtle">
          <span className="text-cyan">{EXPERIMENTS.length}</span> experiments in 2 labs
        </p>
      </PageHeader>
      <Container className="space-y-16 py-14">
        {(Object.keys(LAB_CATEGORIES) as LabCategory[]).map((category) => {
          const info = LAB_CATEGORIES[category];
          const Icon = ICONS[category];
          const digital = category === "digital";
          return (
            <section key={category} aria-labelledby={`${category}-lab-heading`}>
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className={cn("eyebrow flex items-center gap-2", digital ? "text-logic" : "text-cyan")}>
                    <Icon className="size-4" aria-hidden="true" />
                    {experimentsIn(category).length} experiments
                  </p>
                  <h2 id={`${category}-lab-heading`} className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">
                    {info.title}
                  </h2>
                  <p className="mt-1 max-w-2xl text-ink-muted">{info.description}</p>
                </div>
                <Link href={info.href} className={cn("inline-flex items-center gap-1.5 text-sm font-semibold", digital ? "text-logic" : "text-cyan")}>
                  Open the {info.title}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
              <ExperimentGrid category={category} />
            </section>
          );
        })}
      </Container>
    </>
  );
}
