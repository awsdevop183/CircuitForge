/**
 * Content model for CircuitForge.
 *
 * Everything here is plain serialisable data so it can later move to a CMS,
 * database or API without changing the components that render it.
 */

export type Difficulty = "beginner" | "intermediate" | "advanced";

/** available = has lessons; preview = explore related lab/components now; coming-soon = planned. */
export type ModuleStatus = "available" | "preview" | "coming-soon";

export type IconKey =
  | "zap"
  | "components"
  | "circuit"
  | "binary"
  | "cpu"
  | "terminal"
  | "wifi"
  | "factory"
  | "bot"
  | "server"
  | "brain"
  | "lightbulb"
  | "thermometer"
  | "radio"
  | "cloud"
  | "flask"
  | "gauge"
  | "git-merge"
  | "timer"
  | "layers";

export interface LessonSummary {
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  difficulty: Difficulty;
  available: boolean;
}

export interface ResourceLink {
  label: string;
  href: string;
  kind: "lab" | "component" | "project" | "lesson";
}

export interface LearningModule {
  /** Two-digit display index, e.g. "01". */
  number: string;
  slug: string;
  title: string;
  description: string;
  topics: string[];
  difficulty: Difficulty;
  status: ModuleStatus;
  icon: IconKey;
  lessons: LessonSummary[];
  /** Things a learner can already explore that relate to this module. */
  resources?: ResourceLink[];
}
