# CircuitForge

**From Electrons to Intelligence.**

CircuitForge is an interactive platform for learning electronics — from voltage and current through circuits, microcontrollers, IoT, edge computing, robotics and AI hardware. It's built to feel like an interactive electronics lab rather than a documentation site:

> Don't just read electronics. See it. Interact with it. Experiment with it. Build it.

This first version is frontend-only: all content is static and local. There's no backend, authentication or database yet. Learner progress is saved in the browser.

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

| Route                        | What it is                                                                                           |
| ---------------------------- | ---------------------------------------------------------------------------------------------------- |
| `/`                          | Landing page: animated live circuit hero, the learning method, the 9-stage path, a lab teaser        |
| `/learn`                     | Learning dashboard: module cards with progress and a "continue where you left off" card              |
| `/learn/[module]`            | Module overview: lessons, status, and related tools you can use now                                   |
| `/learn/fundamentals`        | Module 01 — Electronics Fundamentals: progress, lesson path with quiz scores, safety guidance          |
| `/learn/fundamentals/*`      | 15 full lessons, from matter and charge through Ohm's law, power, AC/DC, ground and series/parallel   |
| `/lab`                       | Interactive lab index                                                                                |
| `/lab/ohms-law`              | Ohm's Law Lab (solve for V, I or R, presets, warnings) plus free exploration with challenges          |
| `/lab/series-parallel`       | Switch between series and parallel wiring, adjust bulbs, remove a bulb, compare measurements          |
| `/learn/components`          | Module 02 — Electronic Components: lesson path, challenge and game results                            |
| `/learn/components/*`        | 14 lessons: 12 components, "Build Your First Circuit" and the Component Challenge                     |
| `/components`                | Library of 11 components, filterable by Passive / Active / Electromechanical / Power / Input / Output |
| `/components/[slug]`         | Every component: symbol, visual, interactive demo, specs, uses, beginner mistakes, safety, related     |
| `/components/compare`        | Resistor vs potentiometer, diode vs LED, transistor vs MOSFET, transistor vs relay                   |
| `/components/symbol-trainer` | Symbol Trainer: 15 random questions per round from 21 symbols, explained after every answer           |
| `/components/identify`       | Identify the Component: see a real part and decide what it's used for                                |
| `/projects`                  | Project progression from LED Circuit to Robotics + AI                                                |
| `/projects/led-circuit`      | Full beginner build guide with wiring diagram, resistor calculation and steps                         |
| `/roadmap`                   | The complete journey (11 stages) and the planned platform features                                    |

Every lesson follows the same learning loop: **Concept → Visual Explanation → Interactive Experiment → Real-World Example → Quick Check → Next Concept**. Each also has a learning objective, "builds on" prerequisites, a real-world analogy that says where it breaks down, a key takeaway, "Try it yourself" prompts, an estimated time and difficulty, a scroll-spy outline and previous/next navigation.

### Module 01 — Electronics Fundamentals

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

## Project structure

```
src/
├── app/                     # Next.js App Router pages (all statically generated)
├── components/
│   ├── circuit/             # ⚡ The circuit visual language (reusable SVG parts)
│   ├── illustrations/       # Real-world component artwork (SVG)
│   ├── lesson/              # Lesson layout: stages, outline, quick check, takeaways, completion
│   ├── simulations/         # Reusable interactive simulations (CircuitExplorer, OhmsLawCalculator, …)
│   ├── lessons/             # Smaller lesson visuals (per topic + shared)
│   ├── lab/                 # Lab framework (panels, challenges, graphs) and experiments
│   ├── explorer/            # Component explorer, symbol library, experiment registry, deep-dives
│   ├── component-lab/       # Module 02 interactives + ComponentQuiz, ComponentComparison, ComponentSpecification…
│   ├── visuals/             # ResistorVisual, LEDVisual… aliases for the component illustrations
│   ├── learn/               # Dashboard cards and progress
│   ├── home/                # Landing-page sections
│   ├── projects/            # Project timeline and build diagrams
│   ├── layout/              # Header, mobile menu, footer, page header
│   └── ui/                  # Design-system primitives (Button, Badge, Slider, SegmentedControl…)
├── content/                 # Typed content: curriculum, lessons (content/lessons/fundamentals/*), components, experiments, projects, roadmap
└── lib/
    ├── electronics.ts       # Pure physics: Ohm's law, series/parallel solvers, RC, LED resistor, E12
    ├── circuit-sim.ts       # Single-loop solver: switches, breaks, LEDs, fuses, shorts, node voltages
    ├── digital.ts           # Logic levels and thresholds (3.3 V / 5 V) — groundwork for Digital Electronics
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
- **Registries map slugs to interactive implementations.** See `content/lessons/index.ts`, `components/lab/registry.tsx`, `components/explorer/experiments.tsx` and `components/explorer/deep-dives/registry.tsx`. The schematic `SYMBOL_LIBRARY` (`explorer/ComponentSymbol.tsx`) feeds both the explorer and the Symbol Trainer.
- **Games are data.** `ComponentQuiz` runs any `QuizQuestion[]` one at a time, shuffled on start, with explanations and saved scores. The next module can reuse it for logic-gate and truth-table games. To add an experiment: add data in `content/experiments.ts`, build the component, and register it.
- **Circuit behaviour lives in one place.** `lib/circuit-sim.ts` solves every single-loop simulation, so the circuit explorer, short-circuit demo and ground lesson can't disagree.
- **Progress is behind an interface** (`lib/progress/types.ts`). Today it's `localStorage`, tracking completed lessons, the current lesson and knowledge-check results. An account-backed store can implement the same `ProgressStore` interface without changing any UI. Older `electricity/*` progress keys are migrated automatically, and old URLs redirect.
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

1. Module 04 — Digital Electronics: logic levels (`lib/digital.ts`), gates and truth tables, reusing `ComponentQuiz`, `TransistorSwitch` and `PushButton`
2. Module 03 — Circuits (currently a preview): Kirchhoff's laws, dividers and RC timing
3. More lab experiments: voltage divider, RC charging, LED driver, logic gates (already listed as coming soon)
4. A drag-and-drop circuit builder (the Component Challenge's slot board is a first step) on top of the circuit visual language and `lib/electronics.ts`
5. Unit tests for `lib/electronics.ts` and component tests for the lab
6. Accounts and synced progress, implementing `ProgressStore` against an API
7. Microcontroller simulation (Arduino/ESP32 GPIO, PWM, ADC) for Module 05
