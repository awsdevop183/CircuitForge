import { ProgressOverview } from "@/components/learn/ProgressOverview";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ProgressSection() {
  return (
    <section aria-labelledby="progress-heading" className="py-12 sm:py-16">
      <Container>
        <SectionHeading id="progress-heading" eyebrow="Your progress" title="Pick up where you left off." description="Every lesson, quiz, challenge and experiment you finish lights up here." />
        <div className="mt-8">
          <ProgressOverview />
        </div>
      </Container>
    </section>
  );
}
