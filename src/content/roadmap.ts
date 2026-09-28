import type { IconKey } from "./types";

export interface RoadmapStage {
  title: string;
  description: string;
  outcome: string;
  icon: IconKey;
  /** Related learning-path module, if one exists. */
  moduleSlug?: string;
}

/** The full CircuitForge journey, from first principles to intelligent machines. */
export const ROADMAP: readonly RoadmapStage[] = [
  {
    title: "Electronics Fundamentals",
    description: "Charge, voltage, current, resistance, power, AC/DC and ground.",
    outcome: "Explain why a circuit works — and why one doesn't.",
    icon: "zap",
    moduleSlug: "fundamentals",
  },
  {
    title: "Components",
    description: "The parts: resistors, capacitors, diodes, transistors and relays.",
    outcome: "Recognise, choose and wire the core components.",
    icon: "components",
    moduleSlug: "components",
  },
  {
    title: "Circuits",
    description: "Series, parallel, dividers, switching and timing.",
    outcome: "Design and debug small practical circuits.",
    icon: "circuit",
    moduleSlug: "circuits",
  },
  {
    title: "Digital Electronics",
    description: "Binary, logic gates, clocks and memory.",
    outcome: "Understand how circuits compute.",
    icon: "binary",
    moduleSlug: "digital-electronics",
  },
  {
    title: "Microcontrollers",
    description: "Arduino and ESP32: GPIO, PWM, ADC and serial buses.",
    outcome: "Program hardware that senses and responds.",
    icon: "cpu",
    moduleSlug: "microcontrollers",
  },
  {
    title: "Embedded Systems",
    description: "Raspberry Pi, embedded Linux and real-world interfacing.",
    outcome: "Build reliable, always-on devices.",
    icon: "terminal",
    moduleSlug: "embedded-linux",
  },
  {
    title: "IoT",
    description: "Sensors, MQTT, gateways and cloud connectivity.",
    outcome: "Connect devices securely to the internet.",
    icon: "wifi",
    moduleSlug: "iot",
  },
  {
    title: "Edge Computing",
    description: "Processing data where it is produced — on the device.",
    outcome: "Decide what runs on the device and what runs in the cloud.",
    icon: "server",
  },
  {
    title: "Industrial Systems",
    description: "PLCs, Modbus, CAN, SCADA and operational technology.",
    outcome: "Work with the systems that run factories and infrastructure.",
    icon: "factory",
    moduleSlug: "industrial-systems",
  },
  {
    title: "Robotics",
    description: "Motors, feedback control, perception and actuation.",
    outcome: "Build machines that move with purpose.",
    icon: "bot",
    moduleSlug: "robotics-and-ai",
  },
  {
    title: "AI",
    description: "Computer vision and machine learning on physical devices.",
    outcome: "Create intelligent physical systems.",
    icon: "brain",
    moduleSlug: "robotics-and-ai",
  },
];
