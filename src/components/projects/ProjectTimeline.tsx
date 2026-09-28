import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ComingSoonBadge, Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import type { Project } from "@/content/projects";
import { cn } from "@/lib/cn";

/** Projects as a rising progression — each one builds on the skills of the last. */
export function ProjectTimeline({ projects }: { projects: readonly Project[] }) {
  return (
    <ol className="relative space-y-5 before:absolute before:bottom-8 before:left-[23px] before:top-8 before:w-[3px] before:rounded-full before:bg-gradient-to-b before:from-cyan before:via-line-strong before:to-line sm:before:left-[27px]">
      {projects.map((project, index) => (
        <li key={project.slug} className="relative grid grid-cols-[48px_1fr] gap-4 sm:grid-cols-[56px_1fr] sm:gap-6">
          <span
            className={cn(
              "relative z-10 flex size-12 items-center justify-center rounded-xl border-2 bg-page sm:size-14",
              project.available ? "border-cyan text-cyan shadow-[0_0_20px_-4px_rgb(34_211_238/0.7)]" : "border-line-strong text-ink-subtle",
            )}
          >
            <Icon name={project.icon} className="size-5 sm:size-6" />
          </span>
          <Reveal delay={index * 0.04}>
            <ProjectCard project={project} />
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const content = (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs uppercase tracking-wider text-amber">{project.level}</span>
        {project.available ? <Badge tone="positive">Available</Badge> : <ComingSoonBadge />}
      </div>
      <h2 className="mt-2 text-xl font-semibold text-ink sm:text-2xl">{project.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{project.summary}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="eyebrow text-[0.65rem] text-ink-subtle">Skills</p>
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {project.skills.map((skill) => (
              <li key={skill} className="rounded-md bg-surface-high px-2 py-0.5 text-xs text-ink-muted">
                {skill}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow text-[0.65rem] text-ink-subtle">Hardware</p>
          <p className="mt-1.5 text-xs text-ink-muted">{project.hardware.join(" · ")}</p>
        </div>
      </div>
      {project.available ? (
        <p className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-cyan">
          Start building
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </p>
      ) : null}
    </>
  );

  return project.available ? (
    <Link href={`/projects/${project.slug}`} className="panel group block rounded-2xl p-5 transition-colors hover:border-cyan/45 sm:p-6">
      {content}
    </Link>
  ) : (
    <div className="panel rounded-2xl p-5 opacity-75 sm:p-6">{content}</div>
  );
}
