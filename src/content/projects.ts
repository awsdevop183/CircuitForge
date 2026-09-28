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
    slug: "temperature-monitor",
    level: "Beginner+",
    title: "Temperature Monitor",
    summary: "Read a thermistor with a voltage divider and turn temperature into a signal you can measure.",
    skills: ["Voltage dividers", "Sensors", "Measurement"],
    hardware: ["Thermistor", "Resistors", "Multimeter"],
    icon: "thermometer",
    available: false,
  },
  {
    slug: "esp32-sensor",
    level: "Intermediate",
    title: "ESP32 Sensor",
    summary: "Connect a digital sensor to an ESP32 over I²C and stream readings to your computer.",
    skills: ["GPIO", "I²C", "Serial debugging"],
    hardware: ["ESP32 dev board", "BME280 sensor"],
    icon: "cpu",
    available: false,
  },
  {
    slug: "iot-environmental-monitor",
    level: "Intermediate+",
    title: "IoT Environmental Monitor",
    summary: "Build a Wi-Fi connected station that tracks temperature, humidity and air quality.",
    skills: ["Wi-Fi", "Power management", "Dashboards"],
    hardware: ["ESP32", "Environmental sensors", "Enclosure"],
    icon: "radio",
    available: false,
  },
  {
    slug: "esp32-mqtt-aws",
    level: "Advanced",
    title: "ESP32 → MQTT → AWS",
    summary: "Publish device telemetry over MQTT to AWS IoT Core with certificates and a cloud rule.",
    skills: ["MQTT", "TLS certificates", "AWS IoT Core"],
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
    hardware: ["Raspberry Pi or ESP32-S3", "Camera or microphone"],
    icon: "brain",
    available: false,
  },
  {
    slug: "robotics-ai",
    level: "Future",
    title: "Robotics + AI",
    summary: "Combine motors, sensors and vision into a robot that perceives and reacts to its world.",
    skills: ["Motor control", "Computer vision", "Autonomy"],
    hardware: ["Robot chassis", "Motor drivers", "Camera", "Single-board computer"],
    icon: "bot",
    available: false,
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
