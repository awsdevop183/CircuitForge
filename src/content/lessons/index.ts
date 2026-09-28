import { lessonKey } from "@/content/curriculum";
import { matterAndCharge } from "./fundamentals/01-matter-and-charge";
import { theElectron } from "./fundamentals/02-the-electron";
import { conductorsAndInsulators } from "./fundamentals/03-conductors-and-insulators";
import { whatIsElectricity } from "./fundamentals/04-what-is-electricity";
import { whatIsACircuit } from "./fundamentals/05-what-is-a-circuit";
import { voltage } from "./fundamentals/06-voltage";
import { current } from "./fundamentals/07-current";
import { resistance } from "./fundamentals/08-resistance";
import { ohmsLaw } from "./fundamentals/09-ohms-law";
import { electricalPower } from "./fundamentals/10-electrical-power";
import { dcVsAc } from "./fundamentals/11-dc-vs-ac";
import { openVsClosedCircuits } from "./fundamentals/12-open-vs-closed-circuits";
import { shortCircuit } from "./fundamentals/13-short-circuit";
import { ground } from "./fundamentals/14-ground";
import { seriesAndParallel } from "./fundamentals/15-series-and-parallel";
import type { LessonContent } from "./types";

/** Every lesson with full content, in module order. */
export const ALL_LESSONS: readonly LessonContent[] = [
  matterAndCharge,
  theElectron,
  conductorsAndInsulators,
  whatIsElectricity,
  whatIsACircuit,
  voltage,
  current,
  resistance,
  ohmsLaw,
  electricalPower,
  dcVsAc,
  openVsClosedCircuits,
  shortCircuit,
  ground,
  seriesAndParallel,
];

const LESSONS: Readonly<Record<string, LessonContent>> = Object.fromEntries(
  ALL_LESSONS.map((lesson) => [lessonKey(lesson.moduleSlug, lesson.lessonSlug), lesson]),
);

export function getLessonContent(moduleSlug: string, lessonSlug: string): LessonContent | undefined {
  return LESSONS[lessonKey(moduleSlug, lessonSlug)];
}
