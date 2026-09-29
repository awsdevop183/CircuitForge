import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge, ComingSoonBadge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PROJECTS } from "@/content/projects";
import { cn } from "@/lib/cn";

/** The project progression, from a first LED to a robot. */
export function ProjectsPreviewSection() {
  return (
    <section aria-labelledby="projects-heading" className="py-16 sm:py-24">
      <Container>
        <SectionHeading id="projects-heading" eyebrow="Build projects" title="From your first LED to intelligent machines." description="Each project uses what you've just learned. Start with safe, low-voltage builds; the rest unlock as new modules arrive." />
        <ol className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PROJECTS.map((project) => {
            const body = (
              <>
                <div className="flex items-center justify-between gap-2">
                  <Icon name={project.icon} className={cn("size-5", project.available ? "text-cyan" : "text-ink-subtle")} />
                  {project.available ? <Badge tone="positive">Available</Badge> : <ComingSoonBadge />}
                </div>
                <p className="mt-3 font-mono text-xs text-ink-subtle">{project.level}</p>
                <p className="mt-0.5 font-semibold text-ink">{project.title}</p>
              </>
            );
            return (
              <li key={project.slug}>
                {project.available ? (
                  <Link href={`/projects/${project.slug}`} className="panel block h-full rounded-xl p-4 transition-colors hover:border-cyan/45">
                    {body}
                  </Link>
                ) : (
                  <div className="panel h-full rounded-xl p-4 opacity-80">{body}</div>
                )}
              </li>
            );
          })}
        </ol>
        <ButtonLink href="/projects" variant="secondary" className="mt-8">
          See all projects
          <ArrowRight className="size-4" aria-hidden="true" />
        </ButtonLink>
      </Container>
    </section>
  );
}
