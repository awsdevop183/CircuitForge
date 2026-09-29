import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Quiz } from "@/components/quiz/Quiz";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { getModule } from "@/content/curriculum";
import { MODULE_QUIZZES } from "@/content/module-quizzes";

interface QuizPageProps {
  params: Promise<{ moduleSlug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(MODULE_QUIZZES).map((moduleSlug) => ({ moduleSlug }));
}

export async function generateMetadata({ params }: QuizPageProps): Promise<Metadata> {
  const { moduleSlug } = await params;
  const quiz = MODULE_QUIZZES[moduleSlug];
  return quiz ? { title: quiz.title, description: quiz.intro } : {};
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { moduleSlug } = await params;
  const quiz = MODULE_QUIZZES[moduleSlug];
  const learningModule = getModule(moduleSlug);
  if (!quiz || !learningModule) notFound();

  return (
    <>
      <PageHeader eyebrow={`Module ${learningModule.number} · Quiz`} title={quiz.title} description={`${quiz.questions.length} questions covering the whole module.`}>
        <Link href={`/learn/${moduleSlug}`} className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-cyan">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to {learningModule.title}
        </Link>
      </PageHeader>
      <Container className="py-12">
        <div className="panel-raised mx-auto max-w-3xl overflow-hidden rounded-2xl">
          <Quiz title={quiz.title} intro={quiz.intro} questions={quiz.questions} roundOptions={quiz.roundOptions} progressKey={`quiz/${moduleSlug}`} accent="logic" />
        </div>
      </Container>
    </>
  );
}
