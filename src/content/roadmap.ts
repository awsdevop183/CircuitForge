import { MODULES } from "./curriculum";
import type { IconKey, ModuleStatus } from "./types";

export interface RoadmapStage {
  number: string;
  title: string;
  description: string;
  outcome: string;
  icon: IconKey;
  moduleSlug: string;
  status: ModuleStatus;
}

/**
 * The full CircuitForge journey, from first principles to intelligent machines.
 * Derived from the curriculum so the roadmap and the learning path never disagree.
 */
export const ROADMAP: readonly RoadmapStage[] = MODULES.map((m) => ({
  number: m.number,
  title: m.title,
  description: m.description,
  outcome: m.outcome,
  icon: m.icon,
  moduleSlug: m.slug,
  status: m.status,
}));
