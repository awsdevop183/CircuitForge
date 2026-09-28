import { OhmsLawCalculator } from "@/components/simulations/OhmsLawCalculator";
import { OhmsLawExperiment } from "./OhmsLawExperiment";

/** The lab's Ohm's law page: the solver first, then free exploration with challenges. */
export function OhmsLawLab() {
  return (
    <div className="space-y-12">
      <section aria-labelledby="solver-heading">
        <h2 id="solver-heading" className="mb-4 text-2xl font-semibold text-ink">
          Solve for V, I or R
        </h2>
        <OhmsLawCalculator />
      </section>
      <section aria-labelledby="explore-heading">
        <h2 id="explore-heading" className="mb-4 text-2xl font-semibold text-ink">
          Explore freely
        </h2>
        <OhmsLawExperiment />
      </section>
    </div>
  );
}
