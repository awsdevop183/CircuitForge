import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ExperimentGrid } from "@/components/lab/ExperimentGrid";
import { OhmsLawCalculator } from "@/components/simulations/OhmsLawCalculator";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { SafetyNotice } from "@/components/ui/SafetyNotice";
import { LAB_CATEGORIES } from "@/content/experiments";

export const metadata: Metadata = {
  title: "Electricity Lab",
  description: LAB_CATEGORIES.electricity.description,
};

export default function ElectricityLabPage() {
  return (
    <>
      <PageHeader eyebrow="Interactive Lab" title="Electricity Lab" description={LAB_CATEGORIES.electricity.description}>
        <Link href="/lab" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-cyan">
          <ArrowLeft className="size-4" aria-hidden="true" />
          All labs
        </Link>
      </PageHeader>
      <Container className="space-y-14 py-12">
        <section aria-labelledby="featured-heading">
          <h2 id="featured-heading" className="mb-4 text-2xl font-semibold text-ink">
            Start here: Ohm&apos;s law, live
          </h2>
          <OhmsLawCalculator />
        </section>
        <section aria-labelledby="experiments-heading">
          <h2 id="experiments-heading" className="mb-6 text-2xl font-semibold text-ink">
            Experiments
          </h2>
          <ExperimentGrid category="electricity" />
        </section>
        <SafetyNotice topic="general" />
      </Container>
    </>
  );
}
