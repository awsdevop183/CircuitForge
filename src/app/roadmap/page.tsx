import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowRight, Award, Bot, Cloud, Cpu, MessageSquareText, Puzzle, Trophy, UserRound, Workflow } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge, ComingSoonBadge, PreviewBadge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FIRST_LESSON_HREF, getModule } from "@/content/curriculum";
import { ROADMAP } from "@/content/roadmap";

export const metadata: Metadata = {
  title: "Roadmap",
  description: "The complete CircuitForge journey: from electricity to microcontrollers, IoT, edge computing, robotics and AI.",
};

const PLATFORM_FEATURES = [
  { icon: UserRound, title: "Accounts & synced progress", body: "Pick up on any device." },
  { icon: Workflow, title: "Drag-and-drop circuit builder", body: "Place any parts anywhere and simulate your own designs." },
  { icon: Cpu, title: "Arduino & ESP32 labs", body: "Write code and watch simulated pins respond." },
  { icon: Cloud, title: "AWS IoT integration", body: "Send real device data to the cloud." },
  { icon: MessageSquareText, title: "AI-assisted learning", body: "Ask questions about any circuit you're looking at." },
  { icon: Puzzle, title: "Project challenges", body: "Open-ended builds with goals to hit." },
  { icon: Award, title: "Certificates", body: "Show what you've learned." },
] as const;

export default function RoadmapPage() {
  return (
    <>
      <PageHeader
        eyebrow="Roadmap"
        title="From absolute beginner to building intelligent machines."
        description="CircuitForge is designed as one continuous journey. Each stage gives you the foundation for the next — until you're designing systems that sense, decide and act in the physical world."
      >
        <ButtonLink href={FIRST_LESSON_HREF}>
          Begin at stage one
          <ArrowRight className="size-4" aria-hidden="true" />
        </ButtonLink>
      </PageHeader>

      <Container className="max-w-3xl py-16">
        <ol aria-label="Learning journey">
          {ROADMAP.map((stage, index) => {
            const stageModule = stage.moduleSlug ? getModule(stage.moduleSlug) : undefined;
            const status = stageModule?.status ?? "coming-soon";
            const last = index === ROADMAP.length - 1;
            return (
              <li key={stage.title}>
                <Reveal>
                  <div className="panel relative grid grid-cols-[auto_1fr] items-start gap-4 rounded-2xl p-5 sm:gap-5 sm:p-6">
                    <span
                      className={
                        status === "coming-soon"
                          ? "flex size-12 items-center justify-center rounded-xl border border-line-strong bg-surface-high text-ink-subtle"
                          : "flex size-12 items-center justify-center rounded-xl border border-cyan/50 bg-cyan/10 text-cyan shadow-[0_0_20px_-6px_rgb(34_211_238/0.7)]"
                      }
                    >
                      <Icon name={stage.icon} className="size-6" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs text-ink-subtle">Module {stage.number}</span>
                        {status === "available" ? <Badge tone="positive">Available</Badge> : status === "preview" ? <PreviewBadge /> : <ComingSoonBadge />}
                      </div>
                      <h2 className="mt-1.5 text-xl font-semibold text-ink sm:text-2xl">{stage.title}</h2>
                      <p className="mt-1 text-sm text-ink-muted">{stage.description}</p>
                      <p className="mt-3 flex items-start gap-2 text-sm text-ink">
                        <Trophy className="mt-0.5 size-4 shrink-0 text-amber" aria-hidden="true" />
                        <span>
                          <span className="sr-only">Outcome: </span>
                          {stage.outcome}
                        </span>
                      </p>
                      {stageModule && status === "available" ? (
                        <Link href={`/learn/${stageModule.slug}`} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-cyan hover:underline">
                          Module {stageModule.number}: {stageModule.title}
                          <ArrowRight className="size-3.5" aria-hidden="true" />
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </Reveal>
                {!last ? (
                  <div className="flex justify-center py-2" aria-hidden="true">
                    <span className="flex flex-col items-center">
                      <span className="h-5 w-0.5 bg-gradient-to-b from-cyan/60 to-cyan/10" />
                      <ArrowDown className="size-4 text-cyan/70" />
                    </span>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
        <div className="mt-10 flex items-center gap-4 rounded-2xl border border-amber/30 bg-amber/5 p-6">
          <Bot className="size-8 shrink-0 text-amber" aria-hidden="true" />
          <p className="text-ink-muted">
            <strong className="text-ink">The destination:</strong> you can design, build and program intelligent physical systems —
            devices that sense the world, make decisions on the edge and act on them.
          </p>
        </div>
      </Container>

      <section aria-labelledby="platform-heading" className="border-t border-line py-16">
        <Container>
          <SectionHeading
            id="platform-heading"
            eyebrow="Platform roadmap"
            title="What's coming to CircuitForge"
            description="Today CircuitForge covers the first three modules, the Interactive Lab and quizzes. These features are planned next — none of them are live yet."
          />
          <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PLATFORM_FEATURES.map((feature) => (
              <li key={feature.title} className="panel rounded-xl p-5">
                <feature.icon className="size-5 text-cyan" aria-hidden="true" />
                <p className="mt-3 font-semibold text-ink">{feature.title}</p>
                <p className="mt-1 text-sm text-ink-muted">{feature.body}</p>
                <ComingSoonBadge label="Planned" className="mt-3" />
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
