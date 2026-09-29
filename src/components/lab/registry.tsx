import type { ComponentType } from "react";
import { BuildTheLogic } from "@/components/digital/BuildTheLogic";
import { LogicPlaygroundLab } from "@/components/digital/LogicPlaygroundLab";
import { OhmsLawLab } from "./OhmsLawLab";
import { SeriesParallelExperiment } from "./SeriesParallelExperiment";

/**
 * Maps experiment slugs (see content/experiments.ts) to their interactive
 * implementation. Add new experiments here.
 */
export const EXPERIMENT_COMPONENTS: Readonly<Record<string, ComponentType>> = {
  "ohms-law": OhmsLawLab,
  "series-parallel": SeriesParallelExperiment,
  digital: LogicPlaygroundLab,
  "build-the-logic": BuildTheLogicLab,
};

function BuildTheLogicLab() {
  return (
    <div className="panel-raised overflow-hidden rounded-2xl">
      <BuildTheLogic />
    </div>
  );
}
