import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import type { NextConcept } from "@/content/lessons/types";

export function NextLesson({ next }: { next: NextConcept }) {
  return (
    <div className="panel-raised relative overflow-hidden rounded-2xl p-6 sm:p-8">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-cyan via-amber to-transparent" aria-hidden="true" />
      <p className="max-w-xl text-ink-muted">{next.description}</p>
      <ButtonLink href={next.href} className="mt-6">
        {next.cta}
        <ArrowRight className="size-4" aria-hidden="true" />
      </ButtonLink>
    </div>
  );
}
