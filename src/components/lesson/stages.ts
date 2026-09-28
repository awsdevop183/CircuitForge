import { CircleArrowRight, Eye, FlaskConical, Globe, Lightbulb, ListChecks, type LucideIcon } from "lucide-react";
import type { LessonStage } from "@/content/lessons/types";

export const STAGE_ORDER: readonly LessonStage[] = ["concept", "visual", "experiment", "real-world", "quick-check", "next"];

export const STAGES: Record<LessonStage, { label: string; icon: LucideIcon }> = {
  concept: { label: "Concept", icon: Lightbulb },
  visual: { label: "Visual Explanation", icon: Eye },
  experiment: { label: "Interactive Experiment", icon: FlaskConical },
  "real-world": { label: "Real-World Example", icon: Globe },
  "quick-check": { label: "Quick Check", icon: ListChecks },
  next: { label: "Next Concept", icon: CircleArrowRight },
};
