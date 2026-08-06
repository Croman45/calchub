import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of CalcHub's calculators and website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms of Service", href: "/terms" }]} />

      <article className="prose prose-neutral mt-6 max-w-3xl dark:prose-invert prose-headings:font-semibold">
        <h1>Terms of Service</h1>
        <p>Last updated: August 2026</p>

        <h2>Acceptance of terms</h2>
        <p>
          By accessing or using CalcHub, you agree to these Terms of Service. If you do not
          agree, please do not use the site.
        </p>

        <h2>Use of the service</h2>
        <p>
          CalcHub provides free calculators for informational purposes. You may use the site for
          personal or commercial reference, but you may not scrape, republish, or resell the
          site&apos;s content or calculators in bulk without permission.
        </p>

        <h2>No warranty</h2>
        <p>
          CalcHub is provided &quot;as is&quot; without warranties of any kind. While we test our
          calculators against known formulas and correct results, we do not guarantee that every
          calculation is free of errors, and results should not be treated as professional
          financial, medical, legal, or engineering advice. See our{" "}
          <Link href="/disclaimer">Disclaimer</Link> for more detail.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, CalcHub and its operators are not liable for
          any damages arising from your use of, or inability to use, the calculators or content
          on this site, including decisions made based on calculator results.
        </p>

        <h2>Third-party services and advertising</h2>
        <p>
          CalcHub uses third-party services, including Google Analytics and Google AdSense,
          which have their own terms and privacy practices. We are not responsible for the
          content of third-party advertisements displayed on this site.
        </p>

        <h2>Intellectual property</h2>
        <p>
          The CalcHub name, logo, design, and original written content are owned by CalcHub.
          Calculator formulas themselves are standard, publicly documented mathematical and
          financial formulas and are not proprietary.
        </p>

        <h2>Changes to these terms</h2>
        <p>
          We may update these terms from time to time. Continued use of the site after changes
          are posted constitutes acceptance of the revised terms.
        </p>

        <h2>Contact us</h2>
        <p>
          Questions about these terms? Reach out via our <Link href="/contact">contact page</Link>.
        </p>
      </article>
    </Container>
  );
}
