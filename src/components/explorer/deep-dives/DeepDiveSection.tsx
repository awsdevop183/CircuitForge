import type { ReactNode } from "react";

interface DeepDiveSectionProps {
  eyebrow: string;
  title: string;
  description: ReactNode;
  children: ReactNode;
}

export function DeepDiveSection({ eyebrow, title, description, children }: DeepDiveSectionProps) {
  return (
    <section>
      <p className="eyebrow text-cyan">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-ink-muted">{description}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}
