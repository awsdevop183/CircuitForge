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
| `/learn/electricity/*`       | Three full lessons: **What Is Electricity?**, **Voltage**, **Current**                                |
| `/lab`                       | Interactive lab index                                                                                |
| `/lab/ohms-law`              | Voltage/resistance sliders, live circuit, formula, power and heat, I–V graph, auto-checked challenges |
| `/lab/series-parallel`       | Switch between series and parallel wiring, adjust bulbs, remove a bulb, compare measurements          |
| `/components`                | Searchable, filterable library of 9 components (schematic symbol and real-world illustration)         |
| `/components/resistor`       | Deep-dive: interactive colour-code reader, resistor-in-circuit demo                                   |
| `/components/led`            | Deep-dive: polarity, a series-resistor calculator (E12 values), "flip the LED" and "remove the resistor" |
| `/components/capacitor`      | Deep-dive: real-time RC charge/discharge with a live voltage curve and τ markers                      |
| `/projects`                  | Project progression from LED Circuit to Robotics + AI                                                |
| `/projects/led-circuit`      | Full beginner build guide with wiring diagram, resistor calculation and steps                         |
| `/roadmap`                   | The complete journey (11 stages) and the planned platform features                                    |

Every lesson follows the same learning loop: **Concept → Visual Explanation → Interactive Experiment → Real-World Example → Quick Check → Next Concept**. Each also has key takeaways, "Try it yourself" prompts, an estimated time, a difficulty rating, a scroll-spy outline, a reading-progress bar and previous/next navigation.

## Project structure

```
src/
├── app/                     # Next.js App Router pages (all statically generated)
├── components/
│   ├── circuit/             # ⚡ The circuit visual language (reusable SVG parts)
│   ├── illustrations/       # Real-world component artwork (SVG)
│   ├── lesson/              # Lesson layout: stages, outline, quick check, takeaways, completion
│   ├── lessons/             # Interactive visuals used inside lessons (per topic + shared)
│   ├── lab/                 # Lab framework (panels, challenges, graphs) and experiments
│   ├── explorer/            # Component explorer and deep-dives
│   ├── learn/               # Dashboard cards and progress
│   ├── home/                # Landing-page sections
│   ├── projects/            # Project timeline and build diagrams
│   ├── layout/              # Header, mobile menu, footer, page header
│   └── ui/                  # Design-system primitives (Button, Badge, Slider, SegmentedControl…)
├── content/                 # Typed, serialisable content: curriculum, lessons, components, experiments, projects, roadmap
└── lib/
    ├── electronics.ts       # Pure physics: Ohm's law, series/parallel solvers, RC, LED resistor, E12
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

- **Parts:** `Battery`, `Resistor` (with heat glow), `Led`, `Lamp`, `Capacitor` (with charge), `Switch` (keyboard-operable), `Diode`, `Transistor`, `Mosfet`, `Relay`, `Ammeter`
- **Conductors and annotation:** `Wire`, `CurrentFlow`, `DirectionArrow`, `VoltageIndicator`, `CircuitNode`, `CircuitLabel`
- **Conventions:** every two-terminal part is centred on its origin with terminals at ±40 units, positioned with `x`, `y` and `rotation`. `terminalsOf()`, `pathThrough()` and `rectLoop()` help with the geometry.
- **Layering:** draw wires, then flow, then parts. Part bodies mask the wire beneath them.
- **Accessibility:** every canvas has a title and description. Parts have hover/focus name tags and are keyboard-focusable.
- **Motion:** `CurrentFlow` advances a dash offset each frame, so speed changes are smooth. It pauses off-screen and stays still under `prefers-reduced-motion`.

## Architecture notes (built to extend)

- **Content is data.** Modules, lessons, components, experiments and projects are typed objects in `src/content`. Only lesson bodies contain JSX, and they're kept in one file per lesson, so moving to MDX or a CMS later is mechanical.
- **Registries map slugs to interactive implementations.** See `content/lessons/index.ts`, `components/lab/registry.tsx` and `components/explorer/deep-dives/registry.tsx`. To add an experiment: add data in `content/experiments.ts`, build the component, and register it.
- **Progress is behind an interface** (`lib/progress/types.ts`). Today it's `localStorage`. An account-backed store can implement the same `ProgressStore` interface without changing any UI.
- **Physics is pure and UI-free** (`lib/electronics.ts`), ready for unit tests and future simulators.
- **Quick checks are data** (`QuizQuestion[]`), ready for a future quiz/assessment engine.

## Accessibility and motion

- Semantic landmarks, a skip link, breadcrumbs and `aria-current` navigation
- Visible focus rings. Every control is keyboard-operable, including radio groups with arrow keys, the in-diagram switch, and the mobile menu (Escape and a focus trap)
- Status is never conveyed by colour alone: icons and text always accompany colour
- Live regions announce circuit state changes and results
- `prefers-reduced-motion` is respected globally (Framer Motion `MotionConfig` plus a CSS fallback)

## What's next

1. More lessons: resistance, power, then Module 02 and 03 lessons built on the existing deep-dives and lab experiments
2. More lab experiments: voltage divider, RC charging, LED driver, logic gates (already listed as coming soon)
3. A drag-and-drop circuit builder on top of the circuit visual language and `lib/electronics.ts`
4. Unit tests for `lib/electronics.ts` and component tests for the lab
5. Accounts and synced progress, implementing `ProgressStore` against an API
6. Microcontroller simulation (Arduino/ESP32 GPIO, PWM, ADC) for Module 05
