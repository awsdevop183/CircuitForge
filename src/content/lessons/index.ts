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
import { whatIsAComponent } from "./components/01-what-is-a-component";
import { resistorLesson } from "./components/02-resistor";
import { ledLesson } from "./components/03-led";
import { capacitorLesson } from "./components/04-capacitor";
import { diodeLesson } from "./components/05-diode";
import { transistorLesson } from "./components/06-transistor";
import { mosfetLesson } from "./components/07-mosfet";
import { relayLesson } from "./components/08-relay";
import { potentiometerLesson } from "./components/09-potentiometer";
import { switchesLesson } from "./components/10-switches";
import { batteryLesson } from "./components/11-battery";
import { voltageRegulatorLesson } from "./components/12-voltage-regulator";
import { buildYourFirstCircuit } from "./components/13-build-your-first-circuit";
import { componentChallenge } from "./components/14-component-challenge";
import { analogVsDigital } from "./digital/01-analog-vs-digital";
import { digitalSignals } from "./digital/02-digital-signals";
import { binaryLesson } from "./digital/03-binary";
import { logicLevels } from "./digital/04-logic-levels";
import { logicGatesLesson } from "./digital/05-logic-gates";
import { andGate, nandGate, norGate, notGate, orGate, xnorGate, xorGate } from "./digital/06-12-gates";
import { combiningGates, digitalInComputers, flipFlops, fullAdderLesson, halfAdderLesson, registers, truthTables, whatIsMemory } from "./digital/13-20";
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
  whatIsAComponent,
  resistorLesson,
  ledLesson,
  capacitorLesson,
  diodeLesson,
  transistorLesson,
  mosfetLesson,
  relayLesson,
  potentiometerLesson,
  switchesLesson,
  batteryLesson,
  voltageRegulatorLesson,
  buildYourFirstCircuit,
  componentChallenge,
  analogVsDigital,
  digitalSignals,
  binaryLesson,
  logicLevels,
  logicGatesLesson,
  notGate,
  andGate,
  orGate,
  nandGate,
  norGate,
  xorGate,
  xnorGate,
  truthTables,
  combiningGates,
  halfAdderLesson,
  fullAdderLesson,
  whatIsMemory,
  flipFlops,
  registers,
  digitalInComputers,
];

const LESSONS: Readonly<Record<string, LessonContent>> = Object.fromEntries(
  ALL_LESSONS.map((lesson) => [lessonKey(lesson.moduleSlug, lesson.lessonSlug), lesson]),
);

export function getLessonContent(moduleSlug: string, lessonSlug: string): LessonContent | undefined {
  return LESSONS[lessonKey(moduleSlug, lessonSlug)];
}
