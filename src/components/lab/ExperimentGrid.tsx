import { experimentsIn, type LabCategory } from "@/content/experiments";
import { ExperimentCard } from "./ExperimentCard";

/** Grid of experiment cards for one lab category. */
export function ExperimentGrid({ category, exclude = [] }: { category: LabCategory; exclude?: readonly string[] }) {
  const experiments = experimentsIn(category).filter((e) => !exclude.includes(e.slug));
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {experiments.map((experiment, index) => (
        <li key={experiment.slug}>
          <ExperimentCard experiment={experiment} index={index} />
        </li>
      ))}
    </ul>
  );
}
