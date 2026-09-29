import { ComponentsStripSection } from "@/components/home/ComponentsStripSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { HeroSection } from "@/components/home/HeroSection";
import { LabTeaserSection } from "@/components/home/LabTeaserSection";
import { LearningPathSection } from "@/components/home/LearningPathSection";
import { PillarsSection } from "@/components/home/PillarsSection";
import { ProgressSection } from "@/components/home/ProgressSection";
import { ProjectsPreviewSection } from "@/components/home/ProjectsPreviewSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PillarsSection />
      <LearningPathSection />
      <LabTeaserSection />
      <ComponentsStripSection />
      <ProjectsPreviewSection />
      <ProgressSection />
      <FinalCtaSection />
    </>
  );
}
