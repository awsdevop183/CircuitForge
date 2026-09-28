import type { ComponentType } from "react";
import { OhmsLawExperiment } from "./OhmsLawExperiment";
import { SeriesParallelExperiment } from "./SeriesParallelExperiment";

/**
 * Maps experiment slugs (see content/experiments.ts) to their interactive
 * implementation. Add new experiments here.
 */
export const EXPERIMENT_COMPONENTS: Readonly<Record<string, ComponentType>> = {
  "ohms-law": OhmsLawExperiment,
  "series-parallel": SeriesParallelExperiment,
};
