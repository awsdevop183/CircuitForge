import type { Metadata } from "next";
import { ComponentExplorer } from "@/components/explorer/ComponentExplorer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Component Explorer",
  description: "An interactive library of electronic components: symbols, real-world appearance, what they do and where they are used.",
};

export default function ComponentsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Component Explorer"
        title="Meet the parts that build every circuit."
        description="Each component side by side: the symbol you'll see on a schematic and what it looks like on your bench. Open one to see how it behaves."
      />
      <Container className="py-12">
        <ComponentExplorer />
      </Container>
    </>
  );
}
