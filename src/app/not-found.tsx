import { ArrowRight } from "lucide-react";
import { CircuitGap } from "@/components/layout/CircuitGap";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <CircuitGap />
      <p className="eyebrow mt-8 text-amber">Error 404 · open circuit</p>
      <h1 className="mt-3 text-4xl font-semibold text-ink sm:text-5xl">There&apos;s a gap in this circuit.</h1>
      <p className="mt-4 max-w-md text-ink-muted">The page you&apos;re looking for doesn&apos;t exist — so no current can flow. Let&apos;s close the loop.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/">
          Back to home
          <ArrowRight className="size-4" aria-hidden="true" />
        </ButtonLink>
        <ButtonLink href="/learn" variant="secondary">
          Browse lessons
        </ButtonLink>
      </div>
    </Container>
  );
}
