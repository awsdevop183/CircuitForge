import type { ComponentType } from "react";
import { OhmsLawLab } from "./OhmsLawLab";
import { SeriesParallelExperiment } from "./SeriesParallelExperiment";

/**
 * Maps experiment slugs (see content/experiments.ts) to their interactive
 * implementation. Add new experiments here.
 */
export const EXPERIMENT_COMPONENTS: Readonly<Record<string, ComponentType>> = {
  "ohms-law": OhmsLawLab,
  "series-parallel": SeriesParallelExperiment,
};
