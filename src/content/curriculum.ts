import type { LearningModule, LessonSummary } from "./types";

/**
 * The CircuitForge learning path. Modules are ordered; lessons within a module
 * are ordered. `available: false` lessons are shown as upcoming.
 */
export const MODULES: readonly LearningModule[] = [
  {
    number: "01",
    slug: "electricity",
    title: "Electricity",
    description: "Voltage, current, resistance, power and electrical fundamentals.",
    topics: ["Charge", "Voltage", "Current", "Resistance", "Power"],
    difficulty: "beginner",
    status: "available",
    icon: "zap",
    lessons: [
      {
        slug: "what-is-electricity",
        title: "What Is Electricity?",
        summary: "Charge, electrons, conductors, insulators and why a circuit must be closed.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        available: true,
      },
      {
        slug: "voltage",
        title: "Voltage",
        summary: "The electrical ‘push’: potential difference, terminals and voltage sources.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        available: true,
      },
      {
        slug: "current",
        title: "Current",
        summary: "How much charge flows, which way it goes, and a first look at V = I × R.",
        estimatedMinutes: 15,
        difficulty: "beginner",
        available: true,
      },
      {
        slug: "resistance",
        title: "Resistance",
        summary: "Why materials oppose current, and how resistors put that to work.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        available: false,
      },
      {
        slug: "power",
        title: "Power & Energy",
        summary: "Watts, heat and why components have power ratings.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        available: false,
      },
      {
        slug: "ohms-law-in-practice",
        title: "Ohm's Law in Practice",
        summary: "Solve real circuits with V = I × R and check your answers in the lab.",
        estimatedMinutes: 15,
        difficulty: "beginner",
        available: false,
      },
    ],
    resources: [
      { label: "Ohm's Law experiment", href: "/lab/ohms-law", kind: "lab" },
      { label: "Battery", href: "/components/battery", kind: "component" },
    ],
  },
  {
    number: "02",
    slug: "components",
    title: "Components",
    description: "Resistors, capacitors, diodes, LEDs, transistors, MOSFETs, relays and more.",
    topics: ["Resistors", "Capacitors", "Diodes", "LEDs", "Transistors", "MOSFETs", "Relays"],
    difficulty: "beginner",
    status: "preview",
    icon: "components",
    lessons: [
      planned("resistors", "Resistors", "Colour codes, tolerances and power ratings.", 12, "beginner"),
      planned("capacitors", "Capacitors", "Storing charge, charging curves and filtering.", 14, "beginner"),
      planned("diodes-and-leds", "Diodes & LEDs", "One-way current, forward voltage and lighting LEDs safely.", 14, "beginner"),
      planned("transistors", "Transistors", "Using a small current to control a bigger one.", 16, "intermediate"),
      planned("mosfets", "MOSFETs", "Voltage-controlled switches for real loads.", 16, "intermediate"),
      planned("relays", "Relays", "Switching isolated, high-power circuits with a coil.", 12, "intermediate"),
    ],
    resources: [
      { label: "Resistor deep-dive", href: "/components/resistor", kind: "component" },
      { label: "LED deep-dive", href: "/components/led", kind: "component" },
      { label: "Capacitor deep-dive", href: "/components/capacitor", kind: "component" },
    ],
  },
  {
    number: "03",
    slug: "circuits",
    title: "Circuits",
    description: "Series/parallel circuits, voltage dividers, switching, timing and practical circuits.",
    topics: ["Series", "Parallel", "Voltage dividers", "Switching", "RC timing"],
    difficulty: "beginner",
    status: "preview",
    icon: "circuit",
    lessons: [
      planned("series-and-parallel", "Series & Parallel", "How current and voltage split across loads.", 15, "beginner"),
      planned("voltage-dividers", "Voltage Dividers", "Two resistors that make any voltage you need.", 14, "beginner"),
      planned("switching-circuits", "Switching Circuits", "Buttons, pull-ups and transistor switches.", 16, "intermediate"),
      planned("rc-timing", "RC Timing", "Capacitors and resistors as a clock.", 16, "intermediate"),
      planned("practical-circuits", "Practical Circuits", "Put it together: indicators, sensors and drivers.", 20, "intermediate"),
    ],
    resources: [
      { label: "Series vs Parallel experiment", href: "/lab/series-parallel", kind: "lab" },
      { label: "Ohm's Law experiment", href: "/lab/ohms-law", kind: "lab" },
      { label: "Project: LED Circuit", href: "/projects/led-circuit", kind: "project" },
    ],
  },
  {
    number: "04",
    slug: "digital-electronics",
    title: "Digital Electronics",
    description: "Binary, logic gates, digital signals, memory and digital systems.",
    topics: ["Binary", "Logic gates", "Digital signals", "Flip-flops", "Memory"],
    difficulty: "intermediate",
    status: "coming-soon",
    icon: "binary",
    lessons: [
      planned("binary", "Binary & Logic Levels", "Ones, zeros and the voltages that represent them.", 12, "intermediate"),
      planned("logic-gates", "Logic Gates", "AND, OR, NOT and building decisions from switches.", 15, "intermediate"),
      planned("digital-signals", "Digital Signals", "Clocks, edges and timing diagrams.", 14, "intermediate"),
      planned("memory", "Flip-Flops & Memory", "Circuits that remember.", 16, "intermediate"),
      planned("digital-systems", "Digital Systems", "Counters, registers and how computers are built.", 18, "intermediate"),
    ],
  },
  {
    number: "05",
    slug: "microcontrollers",
    title: "Microcontrollers",
    description: "Arduino, ESP32, GPIO, PWM, ADC, UART, I²C and SPI.",
    topics: ["Arduino", "ESP32", "GPIO", "PWM", "ADC", "UART", "I²C", "SPI"],
    difficulty: "intermediate",
    status: "coming-soon",
    icon: "cpu",
    lessons: [
      planned("what-is-a-microcontroller", "What Is a Microcontroller?", "A tiny computer that talks to circuits.", 12, "intermediate"),
      planned("gpio", "GPIO", "Reading buttons and driving LEDs from code.", 15, "intermediate"),
      planned("pwm", "PWM", "Dimming, speed control and fake analogue.", 15, "intermediate"),
      planned("adc", "ADC", "Turning sensor voltages into numbers.", 15, "intermediate"),
      planned("uart", "UART", "Serial communication between devices.", 15, "intermediate"),
      planned("i2c-and-spi", "I²C & SPI", "Talking to sensors, displays and memory.", 18, "intermediate"),
    ],
  },
  {
    number: "06",
    slug: "embedded-linux",
    title: "Embedded Linux",
    description: "Raspberry Pi, Linux, GPIO, sensors and edge devices.",
    topics: ["Raspberry Pi", "Linux", "GPIO", "Sensors", "Edge devices"],
    difficulty: "intermediate",
    status: "coming-soon",
    icon: "terminal",
    lessons: [
      planned("raspberry-pi", "Meet the Raspberry Pi", "A full Linux computer with pins.", 12, "intermediate"),
      planned("linux-for-hardware", "Linux for Hardware", "The shell, services and device files.", 16, "intermediate"),
      planned("linux-gpio", "GPIO on Linux", "Controlling pins from Python and the kernel.", 16, "intermediate"),
      planned("linux-sensors", "Sensors & Buses", "I²C and SPI sensors on a Pi.", 18, "intermediate"),
      planned("edge-devices", "Edge Devices", "Running reliable software at the edge.", 18, "advanced"),
    ],
  },
  {
    number: "07",
    slug: "iot",
    title: "IoT",
    description: "Sensors, MQTT, gateways, cloud connectivity and device management.",
    topics: ["Sensors", "MQTT", "Gateways", "Cloud", "Device management"],
    difficulty: "advanced",
    status: "coming-soon",
    icon: "wifi",
    lessons: [
      planned("iot-architecture", "IoT Architecture", "Devices, gateways and the cloud.", 14, "advanced"),
      planned("mqtt", "MQTT", "Publish/subscribe messaging for devices.", 16, "advanced"),
      planned("gateways", "Gateways", "Bridging local networks to the internet.", 16, "advanced"),
      planned("cloud-connectivity", "Cloud Connectivity", "Secure device-to-cloud communication.", 18, "advanced"),
      planned("device-management", "Device Management", "Provisioning, updates and monitoring fleets.", 18, "advanced"),
    ],
  },
  {
    number: "08",
    slug: "industrial-systems",
    title: "Industrial Systems",
    description: "PLC, Modbus, RS-485, CAN, SCADA, industrial networking and OT.",
    topics: ["PLC", "Modbus", "RS-485", "CAN", "SCADA", "OT"],
    difficulty: "advanced",
    status: "coming-soon",
    icon: "factory",
    lessons: [
      planned("plc", "PLCs", "The computers that run factories.", 16, "advanced"),
      planned("rs-485-and-modbus", "RS-485 & Modbus", "Robust industrial serial networks.", 18, "advanced"),
      planned("can-bus", "CAN Bus", "The network inside vehicles and machines.", 16, "advanced"),
      planned("scada", "SCADA", "Supervising whole plants.", 16, "advanced"),
      planned("ot-networking", "OT Networking & Security", "Keeping industrial systems safe.", 18, "advanced"),
    ],
  },
  {
    number: "09",
    slug: "robotics-and-ai",
    title: "Robotics & AI",
    description: "Robotics, computer vision, edge AI and intelligent physical systems.",
    topics: ["Motors", "Control", "Computer vision", "Edge AI", "Autonomy"],
    difficulty: "advanced",
    status: "coming-soon",
    icon: "bot",
    lessons: [
      planned("robotics-fundamentals", "Robotics Fundamentals", "Sensors, actuators and control loops.", 16, "advanced"),
      planned("motors-and-control", "Motors & Control", "DC, servo and stepper motors with feedback.", 18, "advanced"),
      planned("computer-vision", "Computer Vision", "Cameras that understand what they see.", 18, "advanced"),
      planned("edge-ai", "Edge AI", "Running neural networks on small devices.", 20, "advanced"),
      planned("intelligent-systems", "Intelligent Physical Systems", "Putting perception, decisions and motion together.", 20, "advanced"),
    ],
  },
];

function planned(
  slug: string,
  title: string,
  summary: string,
  estimatedMinutes: number,
  difficulty: LessonSummary["difficulty"],
): LessonSummary {
  return { slug, title, summary, estimatedMinutes, difficulty, available: false };
}

/* ------------------------------------------------------------------ */
/* Queries                                                             */
/* ------------------------------------------------------------------ */

export function getModule(slug: string): LearningModule | undefined {
  return MODULES.find((module) => module.slug === slug);
}

export function availableLessons(module: LearningModule): LessonSummary[] {
  return module.lessons.filter((lesson) => lesson.available);
}

/** Stable identifier used for progress tracking. */
export function lessonKey(moduleSlug: string, lessonSlug: string): string {
  return `${moduleSlug}/${lessonSlug}`;
}

export function lessonHref(moduleSlug: string, lessonSlug: string): string {
  return `/learn/${moduleSlug}/${lessonSlug}`;
}

export interface LessonLocation {
  module: LearningModule;
  lesson: LessonSummary;
  /** Zero-based index within the module. */
  index: number;
  previous?: { module: LearningModule; lesson: LessonSummary };
  next?: { module: LearningModule; lesson: LessonSummary };
}

/** Resolve a lesson and its available neighbours across the whole path. */
export function locateLesson(moduleSlug: string, lessonSlug: string): LessonLocation | undefined {
  const sequence = MODULES.flatMap((module) =>
    availableLessons(module).map((lesson) => ({ module, lesson })),
  );
  const position = sequence.findIndex(
    (entry) => entry.module.slug === moduleSlug && entry.lesson.slug === lessonSlug,
  );
  if (position === -1) return undefined;

  const { module, lesson } = sequence[position]!;
  return {
    module,
    lesson,
    index: module.lessons.findIndex((l) => l.slug === lesson.slug),
    previous: sequence[position - 1],
    next: sequence[position + 1],
  };
}

/** Every available lesson, for static generation. */
export function allAvailableLessonParams(): { moduleSlug: string; lessonSlug: string }[] {
  return MODULES.flatMap((module) =>
    availableLessons(module).map((lesson) => ({ moduleSlug: module.slug, lessonSlug: lesson.slug })),
  );
}

/** The first lesson a new learner should open. */
export const FIRST_LESSON_HREF = lessonHref("electricity", "what-is-electricity");
