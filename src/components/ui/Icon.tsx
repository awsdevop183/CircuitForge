import {
  Binary,
  Bot,
  BrainCircuit,
  Cable,
  CircuitBoard,
  Cloud,
  Cpu,
  Factory,
  FlaskConical,
  Gauge,
  GitMerge,
  Layers,
  Lightbulb,
  RadioTower,
  Server,
  SquareTerminal,
  Thermometer,
  Timer,
  Wifi,
  Zap,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import type { IconKey } from "@/content/types";

const ICONS: Record<IconKey, LucideIcon> = {
  zap: Zap,
  components: CircuitBoard,
  circuit: Cable,
  binary: Binary,
  cpu: Cpu,
  terminal: SquareTerminal,
  wifi: Wifi,
  factory: Factory,
  bot: Bot,
  server: Server,
  brain: BrainCircuit,
  lightbulb: Lightbulb,
  thermometer: Thermometer,
  radio: RadioTower,
  cloud: Cloud,
  flask: FlaskConical,
  gauge: Gauge,
  "git-merge": GitMerge,
  timer: Timer,
  layers: Layers,
};

interface IconProps extends LucideProps {
  name: IconKey;
}

/** Renders a content icon from its serialisable key. Decorative by default. */
export function Icon({ name, ...props }: IconProps) {
  const Component = ICONS[name];
  return <Component aria-hidden="true" focusable="false" {...props} />;
}
