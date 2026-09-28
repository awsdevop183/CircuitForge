import type { Metadata } from "next";
import { ComponentQuiz } from "@/components/component-lab/ComponentQuiz";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { IDENTIFY_QUESTIONS } from "@/content/component-games";

export const metadata: Metadata = {
  title: "Identify the Component",
  description: "Look at a real component and decide what it is used for. Every answer is explained.",
};

export default function IdentifyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Component Explorer · Game"
        title="Identify the Component"
        description="Real parts don't come with labels. Look at each one and decide what it's used for."
      />
      <Container className="py-12">
        <div className="panel-raised mx-auto max-w-3xl overflow-hidden rounded-2xl">
          <ComponentQuiz
            title="What is it used for?"
            intro="You'll see a component as it looks on your bench. Choose what it's used for — then read what it is and why."
            questions={IDENTIFY_QUESTIONS}
            progressKey="games/identify"
          />
        </div>
      </Container>
    </>
  );
}
