import type { Metadata } from "next";
import { Quiz } from "@/components/quiz/Quiz";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { IDENTIFY_QUESTIONS } from "@/content/component-games";

export const metadata: Metadata = {
  title: "Identify the Component",
  description: "Look at a real component, name it and decide what it is used for — 22 questions, every answer explained.",
};

export default function IdentifyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Component Explorer · Game"
        title="Identify the Component"
        description="Real parts don't come with labels. Look at each one, name it, and decide what it's used for."
      />
      <Container className="py-12">
        <div className="panel-raised mx-auto max-w-3xl overflow-hidden rounded-2xl">
          <Quiz
            title="Name it. Explain it."
            intro="You'll see a component as it looks on your bench. Say what it is, or what it's used for — then read why."
            questions={IDENTIFY_QUESTIONS}
            roundOptions={[11, IDENTIFY_QUESTIONS.length]}
            progressKey="games/identify"
          />
        </div>
      </Container>
    </>
  );
}
