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
    description: "See, understand and use the parts every circuit is built from — resistors, LEDs, capacitors, diodes, transistors, MOSFETs, relays and more.",
    topics: ["Resistors", "LEDs", "Capacitors", "Diodes", "Transistors", "MOSFETs", "Relays", "Switches", "Batteries", "Regulators"],
    difficulty: "beginner",
    status: "available",
    icon: "components",
    lessons: [
      lesson("what-is-a-component", "What Is an Electronic Component?", "Every part has a job: passive and active components working together.", 10),
      lesson("resistor", "The Resistor", "Limit current, read colour bands and divide voltages.", 14),
      lesson("led", "The LED", "Light an LED safely — and see why it needs a resistor.", 14),
      lesson("capacitor", "The Capacitor", "Store charge, watch it charge up and meet the RC time constant.", 14),
      lesson("diode", "The Diode", "A one-way valve for current: bias, rectification and protection.", 12),
      lesson("transistor", "The Transistor", "Use a small signal to switch a bigger current.", 15, "intermediate"),
      lesson("mosfet", "The MOSFET", "A voltage-controlled switch for motors and other real loads.", 14, "intermediate"),
      lesson("relay", "The Relay", "A coil and a magnet that switch a completely separate circuit.", 12, "intermediate"),
      lesson("potentiometer", "The Potentiometer", "A knob that turns into an adjustable voltage.", 10),
      lesson("switches", "Switches", "Open, closed, toggle, push-to-make and push-to-break.", 10),
      lesson("battery", "The Battery", "Voltage vs capacity — and why the circuit decides the current.", 12),
      lesson("voltage-regulator", "The Voltage Regulator", "Turn a wobbly 12 V into a steady 5 V.", 12, "intermediate"),
      lesson("build-your-first-circuit", "Build Your First Circuit", "Battery, switch, resistor and LED — working together.", 15),
      lesson("component-challenge", "Component Challenge", "Build a working LED circuit from a box of parts.", 15),
    ],
    resources: [
      { label: "Component Explorer", href: "/components", kind: "component" },
      { label: "Compare components", href: "/components/compare", kind: "component" },
      { label: "Symbol Trainer", href: "/components/symbol-trainer", kind: "component" },
      { label: "Identify the Component", href: "/components/identify", kind: "component" },
    ],
    activities: [
      { kind: "challenge", id: "components/component-challenge", label: "Component Challenge", href: "/learn/components/component-challenge" },
      { kind: "quiz", id: "games/symbol-trainer", label: "Symbol Trainer", href: "/components/symbol-trainer" },
      { kind: "quiz", id: "games/identify", label: "Identify the Component", href: "/components/identify" },
    ],
  },
  {
    number: "03",
    slug: "digital-electronics",
    title: "Digital Electronics",
    description: "How circuits represent, process and store information with 0 and 1: signals, binary, logic gates, adders, flip-flops and registers.",
    topics: ["Signals", "Binary", "Logic levels", "Logic gates", "Truth tables", "Adders", "Flip-flops", "Registers"],
    difficulty: "beginner",
    status: "available",
    icon: "binary",
    lessons: [
      lesson("analog-vs-digital", "Analog vs Digital", "Smoothly varying signals vs signals with discrete states.", 10),
      lesson("digital-signals", "What Is a Digital Signal?", "HIGH, LOW, edges, period, frequency and duty cycle.", 12),
      lesson("binary", "Binary — 0 and 1", "Bits, bytes and counting with only two digits.", 14),
      lesson("logic-levels", "Logic HIGH and Logic LOW", "Voltage ranges that mean 0 and 1 — and why they depend on the device.", 10),
      lesson("logic-gates", "Logic Gates", "Tiny circuits that make decisions from 0s and 1s.", 12),
      lesson("not-gate", "The NOT Gate", "Flip it: 0 becomes 1, 1 becomes 0.", 8),
      lesson("and-gate", "The AND Gate", "1 only when every input is 1.", 10),
      lesson("or-gate", "The OR Gate", "1 when at least one input is 1.", 10),
      lesson("nand-gate", "The NAND Gate", "NOT + AND — and the universal gate.", 12),
      lesson("nor-gate", "The NOR Gate", "NOT + OR: 1 only when every input is 0.", 10),
      lesson("xor-gate", "The XOR Gate", "1 when the inputs are different.", 10),
      lesson("xnor-gate", "The XNOR Gate", "1 when the inputs are the same.", 8),
      lesson("truth-tables", "Truth Tables", "Every input combination, every output — built automatically.", 12),
      lesson("combining-gates", "Combining Logic Gates", "Connect gates into circuits that make bigger decisions.", 15),
      lesson("half-adder", "The Half Adder", "Logic that does arithmetic: 1 + 1 = 10.", 12, "intermediate"),
      lesson("full-adder", "The Full Adder", "Add three bits, then chain adders to add whole numbers.", 15, "intermediate"),
      lesson("what-is-memory", "What Is Memory?", "Circuits that remember, thanks to feedback.", 10),
      lesson("flip-flops", "Flip-Flops", "State, set, reset and the clock.", 15, "intermediate"),
      lesson("registers", "Registers", "Storing several bits together — and addressing memory.", 12, "intermediate"),
      lesson("digital-circuits-in-computers", "Digital Circuits in Computers", "From transistors to a whole computer.", 12),
    ],
    resources: [
      { label: "Logic Gate Playground", href: "/lab/digital", kind: "lab" },
      { label: "Build the Logic challenge", href: "/lab/build-the-logic", kind: "lab" },
      { label: "Digital Electronics quiz", href: "/quiz/digital-electronics", kind: "lesson" },
    ],
    activities: [
      { kind: "challenge", id: "digital/build-the-logic", label: "Build the Logic (5 challenges)", href: "/lab/build-the-logic", parts: [0, 1, 2, 3, 4].map((n) => `digital/build-the-logic/level-${n}`) },
      { kind: "quiz", id: "quiz/digital-electronics", label: "Digital Electronics quiz", href: "/quiz/digital-electronics" },
      { kind: "challenge", id: "lab/digital-playground", label: "Playground: chain two gates", href: "/lab/digital" },
    ],
  },
  {
    number: "04",
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

function lesson(
  slug: string,
  title: string,
  summary: string,
  estimatedMinutes: number,
  difficulty: LessonSummary["difficulty"] = "beginner",
): LessonSummary {
  return { slug, title, summary, estimatedMinutes, difficulty, available: true };
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
