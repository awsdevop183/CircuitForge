"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowRight, Map as MapIcon } from "lucide-react";
import { ComingSoonBadge, PreviewBadge, Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MODULES } from "@/content/curriculum";
import type { LearningModule } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * The nine-stage learning path drawn as a single circuit trace. The trace
 * "conducts" as the learner scrolls and each stage node lights up in turn.
 */
export function LearningPathSection() {
  const trackRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <section aria-labelledby="path-heading" className="relative py-16 sm:py-24">
      <div className="bg-circuit-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(transparent,black_15%,black_85%,transparent)]" aria-hidden="true" />
      <Container className="relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="path-heading"
            eyebrow="Learning path"
            title="One trace. Nine stages. From electrons to intelligence."
            description="Each stage builds directly on the one before it — the same way current flows through a circuit."
          />
          <ButtonLink href="/roadmap" variant="secondary" className="self-start md:self-auto">
            <MapIcon className="size-4 text-amber" aria-hidden="true" />
            View roadmap
          </ButtonLink>
        </div>

        <ol ref={trackRef} className="relative mt-14 space-y-6 lg:space-y-0">
          {/* The trace: idle copper underneath, glowing conductor on top */}
          <div
            className="absolute bottom-6 left-[19px] top-6 w-[3px] rounded-full bg-line-strong lg:left-1/2 lg:-translate-x-1/2"
            aria-hidden="true"
          >
            <motion.div
              className="h-full w-full origin-top rounded-full bg-gradient-to-b from-cyan via-cyan to-amber shadow-[0_0_14px_rgb(34_211_238/0.8)]"
              style={{ scaleY: progress }}
            />
          </div>

          {MODULES.map((module, index) => (
            <PathStage key={module.slug} module={module} index={index} />
          ))}
        </ol>
      </Container>
    </section>
  );
}

function PathStage({ module, index }: { module: LearningModule; index: number }) {
  const onLeft = index % 2 === 0;
  const lessonCount = module.lessons.length;

  return (
    <li className="relative grid grid-cols-[40px_1fr] gap-4 lg:grid-cols-[1fr_64px_1fr] lg:gap-0 lg:py-3">
      {/* Node on the trace */}
      <div className={cn("relative flex justify-center pt-5 lg:col-start-2 lg:row-start-1")}>
        <motion.span
          className="relative z-10 flex size-10 items-center justify-center rounded-full border-2 bg-page font-mono text-xs font-semibold"
          initial={{ borderColor: "#263447", color: "#7f8ea4", boxShadow: "0 0 0 0 rgba(34,211,238,0)" }}
          whileInView={{ borderColor: "#22d3ee", color: "#e8eef6", boxShadow: "0 0 22px -2px rgba(34,211,238,0.7)" }}
          viewport={{ once: true, margin: "0px 0px -35% 0px" }}
          transition={{ duration: 0.5 }}
          aria-hidden="true"
        >
          {module.number}
        </motion.span>
      </div>

      <motion.div
        className={cn(
          "lg:row-start-1",
          onLeft ? "lg:col-start-1 lg:pr-8" : "lg:col-start-3 lg:pl-8",
        )}
        initial={{ opacity: 0, x: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link
          href={`/learn/${module.slug}`}
          className={cn(
            "panel group relative block rounded-2xl p-5 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-cyan/45 sm:p-6",
          )}
        >
          {/* Horizontal stub connecting card to the trace on desktop */}
          <span
            className={cn(
              "absolute top-[38px] hidden h-[3px] w-8 bg-line-strong lg:block",
              onLeft ? "-right-8" : "-left-8",
            )}
            aria-hidden="true"
          />
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-line-strong bg-surface-high text-cyan transition-colors group-hover:border-cyan/50">
              <Icon name={module.icon} className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-mono text-xs text-ink-subtle">
                  {module.number} <span aria-hidden="true">—</span>
                </p>
                {module.status === "available" ? (
                  <Badge tone="positive">Available</Badge>
                ) : module.status === "preview" ? (
                  <PreviewBadge />
                ) : (
                  <ComingSoonBadge />
                )}
              </div>
              <h3 className="mt-1.5 text-xl font-semibold text-ink">{module.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{module.description}</p>
              <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-ink-subtle transition-colors group-hover:text-cyan">
                {lessonCount} lessons
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </p>
            </div>
          </div>
        </Link>
      </motion.div>
    </li>
  );
}
