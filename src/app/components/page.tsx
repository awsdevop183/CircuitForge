import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Scale, Search, Shapes } from "lucide-react";
import { ComponentExplorer } from "@/components/explorer/ComponentExplorer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Component Explorer",
  description: "An interactive library of electronic components: symbols, real-world appearance, what they do, specs, mistakes to avoid and hands-on demos.",
};

const PRACTICE = [
  { href: "/components/compare", title: "Compare components", description: "Resistor vs potentiometer, diode vs LED, transistor vs MOSFET and relay.", Icon: Scale },
  { href: "/components/symbol-trainer", title: "Symbol Trainer", description: "Name the schematic symbol — 15 random questions per round.", Icon: Shapes },
  { href: "/components/identify", title: "Identify the Component", description: "See a real part and decide what it's used for.", Icon: Search },
];

export default function ComponentsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Component Explorer"
        title="Meet the parts that build every circuit."
        description="See each component, understand its job, then open it to interact with it in a working circuit."
      />
      <Container className="py-12">
        <ComponentExplorer />
        <section aria-labelledby="practice-heading" className="mt-16">
          <h2 id="practice-heading" className="text-2xl font-semibold text-ink">
            Practise and compare
          </h2>
          <ul className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            {PRACTICE.map(({ href, title, description, Icon }) => (
              <li key={href}>
                <Link href={href} className="panel group flex h-full flex-col rounded-2xl p-5 transition-colors hover:border-cyan/45">
                  <Icon className="size-6 text-amber" aria-hidden="true" />
                  <span className="mt-3 flex items-center gap-2 text-lg font-semibold text-ink group-hover:text-cyan">
                    {title}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                  <span className="mt-1 text-sm text-ink-muted">{description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}
