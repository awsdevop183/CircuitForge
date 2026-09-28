import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

interface PageHeaderProps {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  children?: ReactNode;
  className?: string;
}

/** Top-of-page header for inner pages, with a subtle circuit-grid backdrop. */
export function PageHeader({ eyebrow, title, description, children, className }: PageHeaderProps) {
  return (
    <header className={cn("relative overflow-hidden border-b border-line", className)}>
      <div
        className="bg-circuit-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_75%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-cyan/10 blur-3xl"
        aria-hidden="true"
      />
      <Container className="relative py-14 sm:py-20">
        <p className="eyebrow mb-4 flex items-center gap-2 text-cyan">
          <span className="h-px w-6 bg-cyan/60" aria-hidden="true" />
          {eyebrow}
        </p>
        <h1 className="max-w-3xl text-balance text-4xl font-semibold text-ink sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-ink-muted">{description}</p>
        {children ? <div className="mt-8">{children}</div> : null}
      </Container>
    </header>
  );
}
