import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectTimeline } from "@/components/projects/ProjectTimeline";
import { Container } from "@/components/ui/Container";
import { PROJECTS } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Build real hardware, from a single LED to ESP32 IoT devices and edge AI.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="From one LED to intelligent machines."
        description="Projects turn concepts into hardware on your bench. Each one uses the skills from the last — start with a single LED and work up to edge AI and robotics."
      />
      <Container className="max-w-4xl py-14">
        <ProjectTimeline projects={PROJECTS} />
      </Container>
    </>
  );
}
