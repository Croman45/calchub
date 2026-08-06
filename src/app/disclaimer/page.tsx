import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "CalcHub calculators are for informational purposes only and are not a substitute for professional advice.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Disclaimer", href: "/disclaimer" }]} />

      <article className="prose prose-neutral mt-6 max-w-3xl dark:prose-invert prose-headings:font-semibold">
        <h1>Disclaimer</h1>
        <p>Last updated: August 2026</p>

        <h2>Informational purposes only</h2>
        <p>
          The calculators on CalcHub are provided for general informational and educational
          purposes only. They are not intended to be, and should not be relied upon as,
          financial, medical, legal, tax, or engineering advice.
        </p>

        <h2>Financial calculators</h2>
        <p>
          Our mortgage, loan, investment, and other finance calculators use standard formulas
          and simplifying assumptions (such as a constant interest rate or return). Actual loan
          terms, fees, taxes, and investment returns depend on your lender, financial institution,
          and market conditions. Always confirm figures with your lender or a licensed financial
          advisor before making financial decisions.
        </p>

        <h2>Health calculators</h2>
        <p>
          Our BMI, calorie, BMR, body fat, and water intake calculators provide general estimates
          based on published formulas (such as Mifflin-St Jeor and the U.S. Navy method). They do
          not account for individual medical conditions, medications, or circumstances, and are
          not a substitute for advice from a doctor, dietitian, or other qualified health
          professional.
        </p>

        <h2>Construction calculators</h2>
        <p>
          Our concrete, paint, flooring, and tile calculators provide material estimates based on
          the measurements you enter and typical coverage rates. Always add an appropriate safety
          margin and confirm quantities with your supplier or contractor before purchasing
          materials.
        </p>

        <h2>No professional relationship</h2>
        <p>
          Using CalcHub does not create a financial advisory, medical, legal, or contractor
          relationship between you and CalcHub. For decisions with real financial, health, or
          safety consequences, consult an appropriately licensed professional.
        </p>

        <h2>Accuracy</h2>
        <p>
          We test our calculators against known correct results, but we cannot guarantee that
          every calculation is free of error for every possible input. If you notice a
          calculation that looks wrong, please <Link href="/contact">let us know</Link>.
        </p>
      </article>
    </Container>
  );
}
