export interface NavItem {
  label: string;
  href: string;
}

export const PRIMARY_NAV: readonly NavItem[] = [
  { label: "Learn", href: "/learn" },
  { label: "Components", href: "/components" },
  { label: "Interactive Lab", href: "/lab" },
  { label: "Projects", href: "/projects" },
  { label: "Roadmap", href: "/roadmap" },
];

export const SITE = {
  name: "CircuitForge",
  tagline: "From Electrons to Intelligence.",
  description:
    "An interactive electronics laboratory. Learn voltage, current, circuits, microcontrollers, IoT and edge AI by seeing how it works.",
} as const;

/** True when `pathname` is `href` or a page nested under it. */
export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
