import type { Metadata } from "next";
import { ContinueLearning } from "@/components/learn/ContinueLearning";
import { ModuleCard } from "@/components/learn/ModuleCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { MODULES } from "@/content/curriculum";

export const metadata: Metadata = {
  title: "Learn",
  description: "The CircuitForge learning path: twelve modules from electricity to AI-powered hardware.",
};

export default function LearnPage() {
  return (
    <>
      <PageHeader
        eyebrow="Learning dashboard"
        title="Your path from electrons to intelligence."
        description="Twelve modules, each building on the last. Start with Electricity &amp; Fundamentals — every lesson is visual, interactive and short enough to finish in one sitting."
      >
        <ContinueLearning />
      </PageHeader>
      <Container className="py-14">
        <ol className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {MODULES.map((module, index) => (
            <li key={module.slug}>
              <Reveal delay={(index % 3) * 0.06} className="h-full">
                <ModuleCard module={module} />
              </Reveal>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-sm text-ink-subtle">
          Progress is saved in this browser. Accounts with synced progress are planned for a future release.
        </p>
      </Container>
    </>
  );
}
