import type { IconKey } from "./types";

export type ProjectLevel =
  | "Beginner"
  | "Beginner+"
  | "Intermediate"
  | "Intermediate+"
  | "Advanced"
  | "Advanced+"
  | "Future";

export interface Project {
  slug: string;
  level: ProjectLevel;
  title: string;
  summary: string;
  skills: string[];
  hardware: string[];
  icon: IconKey;
  available: boolean;
}

export const PROJECTS: readonly Project[] = [
  {
    slug: "led-circuit",
    level: "Beginner",
    title: "LED Circuit",
    summary: "Light an LED safely from a 9 V battery — choose the resistor, wire it, and understand every part.",
    skills: ["Ohm's law", "Polarity", "Current limiting"],
    hardware: ["9 V battery", "Red LED", "470 Ω resistor", "Breadboard"],
    icon: "lightbulb",
    available: true,
  },
  {
    slug: "traffic-light",
    level: "Beginner+",
    title: "Traffic Light",
    summary: "Three LEDs, three resistors and a sequence: red, amber, green — first with switches, later with logic.",
    skills: ["Parallel LEDs", "Switches", "Sequencing"],
    hardware: ["Battery pack", "Red, amber and green LEDs", "Resistors", "Push buttons"],
    icon: "lightbulb",
    available: false,
  },
  {
    slug: "temperature-monitor",
    level: "Intermediate",
    title: "Temperature Monitor",
    summary: "Read a thermistor with a voltage divider and turn temperature into a voltage you can measure.",
    skills: ["Voltage dividers", "Sensors", "Measurement"],
    hardware: ["Thermistor", "Resistors", "Multimeter"],
    icon: "thermometer",
    available: false,
  },
  {
    slug: "light-sensor",
    level: "Intermediate",
    title: "Light Sensor",
    summary: "Use a light-dependent resistor and a transistor to switch an LED on when it gets dark.",
    skills: ["Voltage dividers", "Transistor switching", "Thresholds"],
    hardware: ["LDR", "NPN transistor", "LED", "Resistors"],
    icon: "gauge",
    available: false,
  },
  {
    slug: "esp32-sensor",
    level: "Intermediate+",
    title: "ESP32 Sensor",
    summary: "Connect a digital sensor to an ESP32 and stream readings to your computer.",
    skills: ["GPIO", "I²C", "Serial debugging"],
    hardware: ["ESP32 dev board", "Temperature/humidity sensor"],
    icon: "cpu",
    available: false,
  },
  {
    slug: "esp32-mqtt-cloud",
    level: "Advanced",
    title: "ESP32 → MQTT → Cloud",
    summary: "Publish device telemetry over MQTT to a cloud IoT service, securely.",
    skills: ["MQTT", "TLS certificates", "Cloud IoT"],
    hardware: ["ESP32", "Sensor of your choice"],
    icon: "cloud",
    available: false,
  },
  {
    slug: "edge-ai-device",
    level: "Advanced+",
    title: "Edge AI Device",
    summary: "Run a small neural network on-device to classify sensor or camera data without the cloud.",
    skills: ["Model deployment", "Quantisation", "Embedded Linux"],
    hardware: ["Single-board computer or ESP32-S3", "Camera or microphone"],
    icon: "brain",
    available: false,
  },
  {
    slug: "robot",
    level: "Future",
    title: "Robot",
    summary: "Combine motors, sensors and vision into a robot that perceives and reacts to its world.",
    skills: ["Motor control", "Feedback", "Perception"],
    hardware: ["Robot chassis", "Motor drivers", "Sensors", "Controller board"],
    icon: "bot",
    available: false,
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
