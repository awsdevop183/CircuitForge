import type { Metadata } from "next";
import { ComponentComparison } from "@/components/component-lab/ComponentComparison";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Compare Components",
  description: "Resistor vs potentiometer, diode vs LED, transistor vs MOSFET and transistor vs relay — side by side.",
};

export default function ComparePage() {
  return (
    <>
      <PageHeader
        eyebrow="Component Explorer · Compare"
        title="Similar parts, different jobs."
        description="Some components look alike or do similar things. Compare their purpose, how they're controlled, where they're used, and what each does well — and not so well."
      />
      <Container className="py-12">
        <div className="panel-raised overflow-hidden rounded-2xl">
          <ComponentComparison />
        </div>
      </Container>
    </>
  );
}
