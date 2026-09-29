/**
 * Logic levels. Module 02 uses them to drive transistor and MOSFET switches
 * from a "GPIO" pin; Module 03 (Digital Electronics) uses the thresholds to
 * show that HIGH and LOW are voltage ranges. Gates and truth tables live in
 * lib/logic.ts.
 */

export type LogicLevel = "LOW" | "HIGH";

export interface LogicFamily {
  name: string;
  supply: number;
  /** Highest input voltage guaranteed to read as LOW. */
  inputLowMax: number;
  /** Lowest input voltage guaranteed to read as HIGH. */
  inputHighMin: number;
}

/** Typical thresholds for common microcontroller families. */
export const LOGIC_FAMILIES = {
  "3v3": { name: "3.3 V logic (ESP32, Raspberry Pi)", supply: 3.3, inputLowMax: 0.8, inputHighMin: 2.0 },
  "5v": { name: "5 V logic (Arduino Uno)", supply: 5, inputLowMax: 1.5, inputHighMin: 3.5 },
} as const satisfies Record<string, LogicFamily>;

/** The voltage a pin outputs for a logic level. */
export function levelToVoltage(level: LogicLevel, family: LogicFamily): number {
  return level === "HIGH" ? family.supply : 0;
}

/** How an input interprets a voltage; between the thresholds the result is undefined. */
export function voltageToLevel(volts: number, family: LogicFamily): LogicLevel | "UNDEFINED" {
  if (volts <= family.inputLowMax) return "LOW";
  if (volts >= family.inputHighMin) return "HIGH";
  return "UNDEFINED";
}

export function toggleLevel(level: LogicLevel): LogicLevel {
  return level === "HIGH" ? "LOW" : "HIGH";
}
