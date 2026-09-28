import type { LearningModule, LessonSummary } from "./types";

/**
 * The CircuitForge learning path. Modules are ordered; lessons within a module
 * are ordered. `available: false` lessons are shown as upcoming.
 */
export const MODULES: readonly LearningModule[] = [
  {
    number: "01",
    slug: "fundamentals",
    title: "Electronics Fundamentals",
    description: "From matter and charge to voltage, current, resistance, Ohm's law, power, AC/DC, ground and circuits.",
    topics: ["Charge", "Circuits", "Voltage", "Current", "Resistance", "Ohm's law", "Power", "AC/DC", "Ground"],
    difficulty: "beginner",
    status: "available",
    icon: "zap",
    lessons: [
      lesson("matter-and-charge", "What Is Matter and Electric Charge?", "Everything is made of atoms — and atoms carry positive and negative charge.", 10),
      lesson("the-electron", "What Is an Electron?", "Meet the tiny, mobile particle that makes electricity possible.", 10),
      lesson("conductors-and-insulators", "Conductors vs Insulators", "Why electrons move easily through copper but not through rubber.", 10),
      lesson("what-is-electricity", "What Is Electricity?", "Electricity is moving charge — and it carries energy from place to place.", 10),
      lesson("what-is-a-circuit", "What Is a Circuit?", "A complete loop for charge: source, path, load and control.", 12),
      lesson("voltage", "Voltage", "The difference in electric potential between two points — the push behind current.", 12),
      lesson("current", "Current", "How much charge flows each second, and which way it goes.", 12),
      lesson("resistance", "Resistance", "How components and materials limit current — and why that's useful.", 12),
      lesson("ohms-law", "Ohm's Law", "V = I × R: calculate any one of voltage, current or resistance.", 15),
      lesson("electrical-power", "Electrical Power", "Watts, P = V × I, and how much energy devices really use.", 12),
      lesson("dc-vs-ac", "DC vs AC", "Current that flows one way vs current that swaps direction.", 12),
      lesson("open-vs-closed-circuits", "Open vs Closed Circuits", "Switches, breaks and faults: why one gap stops everything.", 10),
      lesson("short-circuit", "Short Circuit", "What happens when current bypasses the load — and why it's dangerous.", 10),
      lesson("ground", "Ground / 0 V", "Ground is a reference point — and it means different things in different systems.", 12),
      lesson("series-and-parallel", "Series vs Parallel Circuits", "Two ways to connect components, and how current and voltage share out.", 15),
    ],
    resources: [
      { label: "Ohm's Law Lab", href: "/lab/ohms-law", kind: "lab" },
      { label: "Series vs Parallel experiment", href: "/lab/series-parallel", kind: "lab" },
      { label: "Resistor deep-dive", href: "/components/resistor", kind: "component" },
      { label: "Project: LED Circuit", href: "/projects/led-circuit", kind: "project" },
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
      planned("kirchhoffs-laws", "Kirchhoff’s Laws", "Tracking current and voltage around any network.", 15, "intermediate"),
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

function lesson(slug: string, title: string, summary: string, estimatedMinutes: number): LessonSummary {
  return { slug, title, summary, estimatedMinutes, difficulty: "beginner", available: true };
}

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
export const FIRST_LESSON_HREF = lessonHref("fundamentals", "matter-and-charge");
