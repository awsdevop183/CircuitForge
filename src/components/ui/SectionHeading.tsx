import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Heading = "h2",
  id,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <p className={cn("eyebrow mb-3 flex items-center gap-2 text-cyan", align === "center" && "justify-center")}>
          <span className="h-px w-6 bg-cyan/60" aria-hidden="true" />
          {eyebrow}
        </p>
      ) : null}
      <Heading id={id} className="text-balance text-3xl font-semibold text-ink sm:text-4xl">
        {title}
      </Heading>
      {description ? <p className="mt-4 text-pretty text-base leading-relaxed text-ink-muted sm:text-lg">{description}</p> : null}
    </div>
  );
}
