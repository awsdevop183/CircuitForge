import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GateExplorer } from "@/components/digital/GateExplorer";
import { LogicPlaygroundLab } from "@/components/digital/LogicPlaygroundLab";
import { ExperimentGrid } from "@/components/lab/ExperimentGrid";
import { ExperimentVisitTracker } from "@/components/lab/ExperimentVisitTracker";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { LAB_CATEGORIES } from "@/content/experiments";

export const metadata: Metadata = {
  title: "Digital Lab",
  description: LAB_CATEGORIES.digital.description,
};

export default function DigitalLabPage() {
  return (
    <>
      <ExperimentVisitTracker slug="logic-gates" />
      <ExperimentVisitTracker slug="logic-playground" />
      <PageHeader eyebrow="Interactive Lab" title="Digital Lab" description={LAB_CATEGORIES.digital.description}>
        <Link href="/lab" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-cyan">
          <ArrowLeft className="size-4" aria-hidden="true" />
          All labs
        </Link>
      </PageHeader>
      <Container className="space-y-16 py-12">
        <section id="gates" aria-labelledby="gates-heading" className="scroll-mt-24">
          <h2 id="gates-heading" className="text-2xl font-semibold text-ink sm:text-3xl">
            Logic gates
          </h2>
          <p className="mt-2 max-w-2xl text-ink-muted">Pick any of the seven gates. Click the inputs — in the diagram or below — and the output and truth table update instantly.</p>
          <div className="panel-raised mt-6 overflow-hidden rounded-2xl">
            <GateExplorer />
          </div>
        </section>
        <section id="playground" aria-labelledby="playground-heading" className="scroll-mt-24">
          <h2 id="playground-heading" className="text-2xl font-semibold text-ink sm:text-3xl">
            Logic playground
          </h2>
          <p className="mt-2 mb-6 max-w-2xl text-ink-muted">Combine gates into your own circuit. Connect inputs, gates and outputs, and the result is calculated in real time.</p>
          <LogicPlaygroundLab />
        </section>
        <section aria-labelledby="more-heading">
          <h2 id="more-heading" className="mb-6 text-2xl font-semibold text-ink sm:text-3xl">
            More digital experiments
          </h2>
          <ExperimentGrid category="digital" exclude={["logic-gates", "logic-playground"]} />
        </section>
      </Container>
    </>
  );
}
