import type { Metadata } from "next";
import { Quiz } from "@/components/quiz/Quiz";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { SYMBOL_TRAINER_QUESTIONS } from "@/content/component-games";

export const metadata: Metadata = {
  title: "Symbol Trainer",
  description: "Learn to read circuit diagrams: identify schematic symbols in a randomized quiz with an explanation after every answer.",
};

export default function SymbolTrainerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Component Explorer · Game"
        title="Symbol Trainer"
        description="Circuit diagrams are written in symbols. Learn to read them at a glance — every answer comes with an explanation."
      />
      <Container className="py-12">
        <div className="panel-raised mx-auto max-w-3xl overflow-hidden rounded-2xl">
          <Quiz
            title="Name that symbol"
            intro="You'll see a schematic symbol. Pick the component it represents. The order is different every round."
            questions={SYMBOL_TRAINER_QUESTIONS}
            roundLength={15}
            progressKey="games/symbol-trainer"
          />
        </div>
      </Container>
    </>
  );
}
