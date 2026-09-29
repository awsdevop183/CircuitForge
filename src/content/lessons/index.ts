import { lessonKey } from "@/content/curriculum";
import { matterAndCharge } from "./electricity/01-matter-and-charge";
import { theElectron } from "./electricity/02-the-electron";
import { conductorsAndInsulators } from "./electricity/03-conductors-and-insulators";
import { whatIsElectricity } from "./electricity/04-what-is-electricity";
import { whatIsACircuit } from "./electricity/05-what-is-a-circuit";
import { voltage } from "./electricity/06-voltage";
import { current } from "./electricity/07-current";
import { resistance } from "./electricity/08-resistance";
import { ohmsLaw } from "./electricity/09-ohms-law";
import { electricalPower } from "./electricity/10-electrical-power";
import { dcVsAc } from "./electricity/11-dc-vs-ac";
import { openVsClosedCircuits } from "./electricity/12-open-vs-closed-circuits";
import { shortCircuit } from "./electricity/13-short-circuit";
import { ground } from "./electricity/14-ground";
import { seriesAndParallel } from "./electricity/15-series-and-parallel";
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
