# CircuitForge

**From Electrons to Intelligence.**

CircuitForge is an interactive platform for learning electronics — from voltage and current through circuits, microcontrollers, IoT, edge computing, robotics and AI hardware. It's built to feel like an interactive electronics lab rather than a documentation site:

> Don't just read electronics. See it. Interact with it. Experiment with it. Build it.

This version is frontend-only: all content is static and local. There's no backend, authentication or database yet. Learner progress is saved in the browser.

## Getting started

Requires Node.js 20+.

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script              | Purpose                          |
| ------------------- | -------------------------------- |
| `npm run dev`       | Development server               |
| `npm run build`     | Production build (static pages)  |
| `npm run start`     | Serve the production build       |
| `npm run lint`      | ESLint (Next.js + TypeScript)    |
| `npm run typecheck` | TypeScript, no emit              |

## What's included

| Route                          | What it is                                                                                          |
| ------------------------------ | --------------------------------------------------------------------------------------------------- |
| `/`                            | Home: live Battery → Resistor → LED hero, Why CircuitForge, learning journey, lab and project previews, your progress |
| `/learn`                       | Learning path (12 modules) with "continue where you left off"                                       |
| `/learn/electricity`           | Module 01 — Electricity & Fundamentals (15 lessons). `/learn/fundamentals/*` redirects here           |
| `/learn/components`            | Module 02 — Electronic Components (14 lessons, challenge and games)                                 |
| `/learn/digital-electronics`   | Module 03 — Digital Electronics (20 lessons, quiz, challenge, playground)                            |
| `/learn/[module]` (04–12)      | Coming-soon pages for Microcontrollers → AI + Intelligent Hardware (no placeholder lessons)          |
| `/components`                  | Component Explorer: 11 components, filters Passive / Active / Semiconductor / Electromechanical / Power / Input / Output |
| `/components/[slug]`           | What it is → symbol → visual → how it works → interactive demo → applications → specs → mistakes → safety → related |
| `/components/compare`, `/symbol-trainer`, `/identify` | Side-by-side comparisons; symbol quiz (21 symbols); identification game (22 questions) |
| `/lab`                         | Interactive Lab: Electricity Lab and Digital Lab (18 experiments)                                    |
| `/lab/electronics`             | Electricity Lab: Ohm's law, voltage, current, resistance, power, series/parallel, LED, capacitor, divider, Circuit Builder |
| `/lab/digital`                 | Digital Lab: all seven gates, the logic playground, and truth tables, binary, adders, signals, Build the Logic |
| `/lab/[experiment]`            | Each experiment, with its educational-model note and a link to the lesson behind it                 |
| `/quiz/[module]`               | End-of-module quiz (Digital Electronics: 36 questions)                                               |
| `/projects`, `/projects/led-circuit` | Project journey (LED Circuit → Robot); only the LED Circuit build guide is live                 |
| `/roadmap`                     | The 12-module journey, derived from the curriculum                                                  |

Every lesson follows the same learning loop: **Learning objective → visual explanation → interactive demonstration → real-world example → try it yourself → knowledge check → key takeaway → next lesson**. Each also has a learning objective, "builds on" prerequisites, a real-world analogy that says where it breaks down, a key takeaway, "Try it yourself" prompts, an estimated time and difficulty, a scroll-spy outline and previous/next navigation.

### Module 01 — Electricity & Fundamentals

| # | Lesson | Main interactive |
|---|--------|------------------|
| 1 | What Is Matter and Electric Charge? | `MatterZoom` (object → atom → nucleus), charge attraction/repulsion |
| 2 | What Is an Electron? | `AtomExplorer` (particles, ions, orbit vs electron-cloud models) |
| 3 | Conductors vs Insulators | `MaterialTester` (copper, aluminium, silver vs rubber, plastic, glass) |
| 4 | What Is Electricity? | `ElectronDrift` (random motion vs drift), electron chain |
| 5 | What Is a Circuit? | `CircuitExplorer` with anatomy mode, symbol legend |
| 6 | Voltage | `PotentialDifference` (two points, voltmeter), water analogy with limits |
| 7 | Current | Charge counter, conventional vs electron flow, `CircuitExplorer` with V/R/I |
| 8 | Resistance | `ResistanceExplorer` (resistance ↑ → current ↓), wire length/thickness |
| 9 | Ohm's Law | `OhmsLawCalculator` (solve V/I/R, presets A–C, warnings), I–V graph |
| 10 | Electrical Power | `PowerVisualizer` (P = V × I, power meter, device comparison), power-as-area |
| 11 | DC vs AC | `DcAcExplorer` + `WaveformVisualizer` |
| 12 | Open vs Closed Circuits | `CircuitExplorer` with cuttable wires |
| 13 | Short Circuit | `ShortCircuitDemo` (internal resistance, fuse that blows) |
| 14 | Ground / 0 V | `GroundReference` (move the reference), `GroundTypes` (reference / earth / chassis) |
| 15 | Series vs Parallel | Computed worked example, series/parallel lab experiment |

Knowledge checks use four question types (multiple choice, true/false, identify, predict). After every answer the correct option is revealed and explained. Safety messaging (`SafetyNotice`) covers short circuits, batteries, high current, capacitors, AC and mains.

### Module 02 — Electronic Components

Every lesson follows **See the component → understand its behaviour → interact with it → use it in a circuit**, and ends with "Where you'll find it" and a prominent "Common beginner mistakes" section with safety notices.

| # | Lesson | Main interactive (`components/component-lab`) |
|---|--------|------------------|
| 1 | What Is an Electronic Component? | `ComponentJobs` (each part's job and "without it"), `ComponentSorter` |
| 2 | The Resistor | `ResistorLab` (I = V ÷ R, 100 Ω / 1 kΩ / 10 kΩ bars), colour-code reader, `VoltageDivider` |
| 3 | The LED | `LedCircuitLab` (brightness, current, safety meter, remove-the-resistor), LED anatomy |
| 4 | The Capacitor | `RcChargingComparison` (τ = RC, pinned comparison curve, ½CV²), polarity |
| 5 | The Diode | `DiodeLab` (forward/reverse bars), `HalfWaveRectifier` |
| 6 | The Transistor | `TransistorSwitch` (Input LOW/HIGH → transistor → LED; amplifier mode) |
| 7 | The MOSFET | `MosfetSwitch` (GPIO → gate resistor + pull-down → MOSFET → motor, flyback diode) |
| 8 | The Relay | `RelayDemo` (animated coil, COM/NO/NC, isolated 5 V control and 12 V battery load) |
| 9 | The Potentiometer | `PotentiometerLab` with the keyboard-operable `RotaryKnob` |
| 10 | Switches | `SwitchLab` (toggle, push NO, push NC placed into the circuit) |
| 11 | The Battery | `BatteryModel` (voltage vs capacity; the circuit sets the current; runtime) |
| 12 | The Voltage Regulator | `RegulatorDemo` (linear vs switching, dropout, heat) |
| 13 | Build Your First Circuit | `FirstCircuitBuilder` (CircuitExplorer + missions) |
| 14 | Component Challenge | `ComponentChallenge` (place parts, test with `solveLoop`, solution after an attempt) |

Progress tracks lessons, knowledge-check scores, game scores (`games/*`) and challenge attempts and completion (`challenges`). Modules can declare tracked `activities`, which the module page shows with their results.

### Module 03 — Digital Electronics

Electricity → signals → 0/1 → logic gates → digital circuits → memory → computers. Every lesson follows toggle → observe → predict → experiment → understand.

| # | Lesson | Main interactive (`components/digital`) |
|---|--------|------------------|
| 1 | Analog vs Digital | `AnalogVsDigital` (animated waveform, switch analog/digital, live value vs live bit) |
| 2 | What Is a Digital Signal? | `DigitalSignalExplorer` (frequency, duty cycle, HIGH/LOW voltage; labelled edges, period, HIGH time) |
| 3 | Binary — 0 and 1 | `BinaryConverter` (toggle bits ⇄ decimal, 4 or 8 bits, step-by-step decimal → binary) |
| 4 | Logic HIGH and LOW | `LogicLevelsExplorer` (simple view, then device-dependent voltage ranges with the undefined gap) |
| 5 | Logic Gates | `GateExplorer`, `SameInputsAllGates` |
| 6–12 | NOT, AND, OR, NAND, NOR, XOR, XNOR | `GateDemo` (symbol, switches, output, highlighted truth table), `GatePredict`, `GateComposition` (NAND/NOR/XNOR = gate + NOT), `NandUniversal` |
| 13 | Truth Tables | `TruthTableBuilder` (1–3 inputs, any gate, generated table) |
| 14 | Combining Logic Gates | `LogicPlayground` |
| 15 | Half Adder | `HalfAdder` (SUM = XOR, CARRY = AND) |
| 16 | Full Adder | `FullAdder` (concept first, gates on request), `RippleAdder` (4-bit) |
| 17 | What Is Memory? | `MemoryDemo` (no feedback vs a feedback latch) |
| 18 | Flip-Flops | `SrLatchDemo`, `DFlipFlopDemo` (clock pulses, auto clock, timing diagram) |
| 19 | Registers | `RegisterDemo` (4-bit register, 4-address memory) |
| 20 | Digital Circuits in Computers | `ComputerStack` (animated transistors → computer ladder) |

Shared building blocks: `LogicGate` (distinctive-shape symbols), `SignalWire` (glowing HIGH lines with a pulse that ripples on 0 → 1), `DigitalIndicator`, `GateInput`, `GateOutput`, `TruthTable`, `LogicCircuitView` (renders any small gate network) and `MomentaryButton`. All logic lives in `lib/logic.ts` (gates, truth tables, binary, adders, latches, network evaluation with cycle/floating detection).

## Project structure

```
src/
├── app/                     # Next.js App Router pages (all statically generated)
├── components/
│   ├── circuit/             # ⚡ The circuit visual language (reusable SVG parts)
│   ├── illustrations/       # Real-world component artwork (SVG)
│   ├── lesson/              # Lesson layout: stages, outline, quick check, takeaways, completion
│   ├── simulations/         # Reusable interactive simulations (CircuitExplorer, OhmsLawCalculator, …)
│   ├── electricity/         # Module 01 lesson visuals (charge, voltage, current…)
│   ├── quiz/                # Quiz and QuizQuestionCard (one quiz system)
│   ├── lab/                 # Lab framework (panels, challenges, graphs) and experiments
│   ├── explorer/            # Component explorer, symbol library, experiment registry, deep-dives
│   ├── component-lab/       # Module 02 interactives + ComponentQuiz, ComponentComparison, ComponentSpecification…
│   ├── visuals/             # ResistorVisual, LEDVisual… aliases for the component illustrations
│   ├── digital/             # Module 03: logic-gate visual language, playground, challenge, memory demos
│   ├── learn/               # Dashboard cards and progress
│   ├── home/                # Landing-page sections
│   ├── projects/            # Project timeline and build diagrams
│   ├── layout/              # Header, mobile menu, footer, page header
│   └── ui/                  # Design-system primitives (Button, Badge, Slider, SegmentedControl…)
├── content/                 # Typed content: curriculum, lessons (content/lessons/{electricity,components,digital}), components, experiments, quizzes, projects, roadmap
└── lib/
    ├── electronics.ts       # Pure physics: Ohm's law, series/parallel solvers, RC, LED resistor, E12
    ├── circuit-sim.ts       # Single-loop solver: switches, breaks, LEDs, fuses, shorts, node voltages
    ├── series-board.ts      # Circuit engine: parts-in-slots boards → solved circuit state
    ├── use-frame.ts         # Frame loop for every simulation clock
    ├── digital.ts           # Logic levels and thresholds (3.3 V / 5 V examples)
    ├── logic.ts             # Pure digital logic: gates, truth tables, binary, adders, flip-flops, gate networks
    ├── format.ts            # SI-prefix formatting (20 mA, 4.7 kΩ…)
    ├── progress/            # Progress store interface + localStorage implementation + hook
    └── navigation.ts        # Nav config and site metadata
```

## The circuit visual language

All diagrams are composed from reusable parts in `src/components/circuit`. Diagrams aren't hard-coded into pages.

```tsx
<CircuitCanvas viewBox="0 0 460 300" title="A simple circuit" interactive>
  <Wire d={loop} energized={closed} />
  <CurrentFlow d={loop} active={closed} speed={55} direction="conventional" />
  <Battery x={70} y={155} rotation={-90} detail="9 V" />
  <Lamp x={390} y={155} rotation={90} brightness={closed ? 1 : 0} />
  <Switch x={230} y={240} closed={closed} onToggle={toggle} />
</CircuitCanvas>
```

- **Parts:** `Battery`, `AcSource`, `Resistor` (with heat glow), `Led`, `Lamp`, `Capacitor` (with charge), `Switch` (keyboard-operable), `Fuse`, `Ground` (reference / earth / chassis), `Diode`, `Transistor`, `Mosfet`, `Relay`, `Ammeter`, `Potentiometer`, `VoltageRegulator`, `Motor`, `PushButton` (NO/NC, press-and-hold)
- **Aliases:** `CircuitDiagram` (= `CircuitCanvas`) and `CircuitComponent` (= `CircuitPart`); any part accepts `highlighted`
- **Conductors and annotation:** `Wire`, `CurrentFlow`, `DirectionArrow`, `VoltageIndicator`, `CircuitNode`, `CircuitLabel`
- **Conventions:** every two-terminal part is centred on its origin with terminals at ±40 units, positioned with `x`, `y` and `rotation`. `terminalsOf()`, `pathThrough()` and `rectLoop()` help with the geometry.
- **Layering:** draw wires, then flow, then parts. Part bodies mask the wire beneath them.
- **Accessibility:** every canvas has a title and description. Parts have hover/focus name tags and are keyboard-focusable.
- **Motion:** `CurrentFlow` advances a dash offset each frame, so speed changes are smooth. It pauses off-screen and stays still under `prefers-reduced-motion`.

## Architecture notes (built to extend)

- **Content is data.** Modules, lessons, components, experiments and projects are typed objects in `src/content`. Only lesson bodies contain JSX, and they're kept in one file per lesson, so moving to MDX or a CMS later is mechanical.
- **Registries map slugs to interactive implementations.** See `content/lessons/index.ts`, `components/lab/experiments`, `components/explorer/experiments.tsx` and `components/explorer/deep-dives/registry.tsx`. The schematic `SYMBOL_LIBRARY` (`explorer/ComponentSymbol.tsx`) feeds both the explorer and the Symbol Trainer.
- **Games are data.** `ComponentQuiz` runs any `QuizQuestion[]` one at a time, shuffled on start, with explanations and saved scores. The next module can reuse it for logic-gate and truth-table games. To add an experiment: add data in `content/experiments.ts`, build the component, and register it.
- **Circuit engine.** `lib/series-board.ts` describes a series circuit as data (parts in slots) and solves it with `lib/circuit-sim.ts`; `components/circuit/SeriesCircuit` renders any board with live state and current flow, and `components/lab/CircuitBoardEditor` lets learners build one. The Component Challenge and the Circuit Builder both use it. Simplifications are disclosed with `ModelNote` ("Educational model: …").
- **One of each building block.** `InteractivePanel` (every framed interactive), `Quiz` + `QuizQuestionCard` (lesson checks, games and module quizzes share one question renderer), `ProgressBar`, `Waveform`, `DigitalSignal`, `BinaryDisplay`, `LogicGate`, `TruthTable`.
- **Simulation time.** Every animation loop uses `lib/use-frame.ts` (its own `requestAnimationFrame` loop), so simulated time always matches real time.
- **Circuit behaviour lives in one place.** `lib/circuit-sim.ts` solves every single-loop simulation, so the circuit explorer, short-circuit demo and ground lesson can't disagree.
- **Progress is behind an interface** (`lib/progress/types.ts`). Today it's `localStorage`, tracking completed lessons, the current lesson, quiz and knowledge-check results, challenges and lab experiments explored. An account-backed store can implement the same `ProgressStore` interface without changing any UI. Progress saved under the old `fundamentals/*` keys is migrated to `electricity/*` automatically, and old URLs redirect.
- **Lesson building blocks:** `LessonLayout`, `LessonHeader`, `LearningObjective`, `ConceptCard`, `AnalogyCard`, `KnowledgeCheck`, `KeyTakeaway`, `NextLesson`, `InteractiveSlider` (linear or logarithmic), `SafetyNotice`.
- **Physics is pure and UI-free** (`lib/electronics.ts`), ready for unit tests and future simulators.
- **Quick checks are data** (`QuizQuestion[]`), ready for a future quiz/assessment engine.

## Accessibility and motion

- Semantic landmarks, a skip link, breadcrumbs and `aria-current` navigation
- Visible focus rings. Every control is keyboard-operable, including radio groups with arrow keys, the in-diagram switch, and the mobile menu (Escape and a focus trap)
- Status is never conveyed by colour alone: icons and text always accompany colour
- Live regions announce circuit state changes and results
- `prefers-reduced-motion` is respected globally (Framer Motion `MotionConfig` plus a CSS fallback)

## What's next

1. Module 04 — Microcontrollers: GPIO HIGH/LOW, PWM, ADC and serial, simulated first, building on Modules 02–03
2. A drag-and-drop circuit builder with branches (parallel paths), extending `lib/series-board.ts` to small networks
3. Unit tests in the repo (the logic engine, circuit engine and electronics maths are already pure functions)
4. Accounts and synced progress, implementing `ProgressStore` against an API
