import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonLayout } from "@/components/lesson/LessonLayout";
import { allAvailableLessonParams, locateLesson } from "@/content/curriculum";
import { getLessonContent } from "@/content/lessons";

interface LessonPageProps {
  params: Promise<{ moduleSlug: string; lessonSlug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return allAvailableLessonParams().filter(({ moduleSlug, lessonSlug }) => getLessonContent(moduleSlug, lessonSlug));
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { moduleSlug, lessonSlug } = await params;
  const location = locateLesson(moduleSlug, lessonSlug);
  return location ? { title: location.lesson.title, description: location.lesson.summary } : {};
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { moduleSlug, lessonSlug } = await params;
  const location = locateLesson(moduleSlug, lessonSlug);
  const content = getLessonContent(moduleSlug, lessonSlug);
  if (!location || !content) notFound();

  return <LessonLayout location={location} content={content} />;
}
