import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ExperimentCard } from "@/components/lab/ExperimentCard";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { EXPERIMENTS } from "@/content/experiments";

export const metadata: Metadata = {
  title: "Interactive Lab",
  description: "Hands-on electronics experiments: change voltage, resistance and wiring and watch circuits respond instantly.",
};

export default function LabPage() {
  const liveCount = EXPERIMENTS.filter((e) => e.available).length;
  return (
    <>
      <PageHeader
        eyebrow="Interactive Lab"
        title="Your electronics bench — no parts required."
        description="Every experiment is a live circuit. Change a value, watch the charge move, read the meters and test your predictions. Nothing can burn out here, so push the limits."
      >
        <p className="font-mono text-sm text-ink-subtle">
          <span className="text-cyan">{liveCount}</span> experiments live ·{" "}
          <span className="text-ink-muted">{EXPERIMENTS.length - liveCount}</span> on the bench
        </p>
      </PageHeader>
      <Container className="py-14">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERIMENTS.map((experiment, index) => (
            <li key={experiment.slug}>
              <Reveal delay={index * 0.05} className="h-full">
                <ExperimentCard experiment={experiment} index={index} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
