import type { ComponentType } from "react";
import { CapacitorDeepDive } from "./CapacitorDeepDive";
import { LedDeepDive } from "./LedDeepDive";
import { ResistorDeepDive } from "./ResistorDeepDive";

/** Component slugs with a full interactive deep-dive. */
export const DEEP_DIVES: Readonly<Record<string, ComponentType>> = {
  resistor: ResistorDeepDive,
  led: LedDeepDive,
  capacitor: CapacitorDeepDive,
};
