"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { OhmsLawCircuit } from "@/components/lab/OhmsLawCircuit";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Readout } from "@/components/ui/Readout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InteractiveSlider } from "@/components/ui/InteractiveSlider";
import { currentFrom, powerFrom } from "@/lib/electronics";
import { formatAmps, formatFixed } from "@/lib/format";

const RESISTANCE = 100;
const MAX_VOLTS = 24;

/** A working slice of the lab, right on the landing page. */
export function LabTeaserSection() {
  const [voltage, setVoltage] = useState(10);
  const current = currentFrom(voltage, RESISTANCE);

  return (
    <section aria-labelledby="lab-teaser-heading" className="py-16 sm:py-24">
      <Container>
        <div className="panel-raised overflow-hidden rounded-3xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.25fr]">
            <div className="flex flex-col justify-center gap-6 border-b border-line p-6 sm:p-10 lg:border-b-0 lg:border-r">
              <SectionHeading
                id="lab-teaser-heading"
                eyebrow="Interactive Lab"
                title="Turn the voltage up. Watch the current respond."
                description="This is a live circuit, not a picture. Drag the slider and the charge speeds up, the meters update, and the resistor warms."
              />
              <InteractiveSlider
                label="Supply voltage"
                value={voltage}
                min={0}
                max={MAX_VOLTS}
                step={0.5}
                onChange={setVoltage}
                format={(v) => `${formatFixed(v, 1)} V`}
                color="var(--color-amber)"
                minLabel="0 V"
                maxLabel={`${MAX_VOLTS} V`}
              />
              <div className="grid grid-cols-3 gap-2">
                <Readout label="V" value={formatFixed(voltage, 1)} unit="V" tone="amber" size="sm" />
                <Readout label="R" value={RESISTANCE} unit="Ω" size="sm" />
                <Readout label="I" value={formatAmps(current, 2)} tone="cyan" size="sm" />
              </div>
              <div className="flex flex-wrap gap-2">
                <ButtonLink href="/lab/electronics" variant="secondary" className="self-start">
                  Electricity Lab
                  <ArrowRight className="size-4" aria-hidden="true" />
                </ButtonLink>
                <ButtonLink href="/lab/digital" variant="secondary" className="self-start">
                  Digital Lab
                  <ArrowRight className="size-4" aria-hidden="true" />
                </ButtonLink>
              </div>
            </div>
            <div className="bg-breadboard flex items-center px-2 py-6 sm:px-8">
              <OhmsLawCircuit
                voltage={voltage}
                resistance={RESISTANCE}
                current={current}
                power={powerFrom(voltage, current)}
                maxCurrent={MAX_VOLTS / RESISTANCE}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
