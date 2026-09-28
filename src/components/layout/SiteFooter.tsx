import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PRIMARY_NAV, SITE } from "@/lib/navigation";
import { LogoMark } from "./Logo";

const LEARN_LINKS = [
  { label: "What Is Electricity?", href: "/learn/electricity/what-is-electricity" },
  { label: "Voltage", href: "/learn/electricity/voltage" },
  { label: "Current", href: "/learn/electricity/current" },
];

const LAB_LINKS = [
  { label: "Ohm's Law", href: "/lab/ohms-law" },
  { label: "Series vs Parallel", href: "/lab/series-parallel" },
  { label: "Resistor", href: "/components/resistor" },
  { label: "LED", href: "/components/led" },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-line bg-void">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/50 to-transparent"
        aria-hidden="true"
      />
      <Container className="grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span className="font-display text-lg font-semibold">
              Circuit<span className="text-cyan">Forge</span>
            </span>
          </div>
          <p className="mt-3 font-mono text-sm text-amber">{SITE.tagline}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-subtle">
            An interactive electronics laboratory — see it, interact with it, experiment with it, build it.
          </p>
        </div>
        <FooterColumn title="Explore" links={PRIMARY_NAV} />
        <FooterColumn title="Start here" links={LEARN_LINKS} />
        <FooterColumn title="Try it" links={LAB_LINKS} />
      </Container>
      <Container className="flex flex-col gap-2 border-t border-line py-6 text-xs text-ink-subtle sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} CircuitForge. Built for curious builders.</p>
        <p className="font-mono">v0.1 · electricity fundamentals</p>
      </Container>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: readonly { label: string; href: string }[] }) {
  return (
    <nav aria-label={title}>
      <p className="eyebrow mb-4 text-ink-subtle">{title}</p>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-ink-muted transition-colors hover:text-cyan">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
