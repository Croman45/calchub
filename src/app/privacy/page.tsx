import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How CalcHub collects, uses, and protects information when you use our calculators.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy", href: "/privacy" }]} />

      <article className="prose prose-neutral mt-6 max-w-3xl dark:prose-invert prose-headings:font-semibold">
        <h1>Privacy Policy</h1>
        <p>Last updated: August 2026</p>

        <h2>Calculator inputs stay on your device</h2>
        <p>
          Every calculator on CalcHub runs entirely in your browser. The numbers, dates, and
          selections you enter into a calculator are never transmitted to or stored on our
          servers - they exist only in your browser&apos;s memory while you&apos;re using the page.
        </p>

        <h2>Information we do collect</h2>
        <p>We use a small number of third-party services that may collect limited data automatically:</p>
        <ul>
          <li>
            <strong>Google Analytics</strong> - collects standard usage data (pages visited, approximate
            location, device and browser type, and Core Web Vitals performance metrics) to help us
            understand which calculators are useful and where the site is slow.
          </li>
          <li>
            <strong>Google AdSense</strong> - may use cookies to show relevant advertising. Google and
            its partners may use cookies to serve ads based on your prior visits to this and other
            websites. You can opt out of personalized advertising through{" "}
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
              Google&apos;s Ad Settings
            </a>
            .
          </li>
        </ul>

        <h2>Cookies</h2>
        <p>
          CalcHub itself does not set cookies to identify you personally. Your dark/light theme
          preference and recent search history are stored locally in your browser&apos;s{" "}
          <code>localStorage</code>, not in a cookie, and never leave your device.
        </p>

        <h2>Contact form</h2>
        <p>
          If you submit the contact form, we receive the name, email address, and message you
          provide, solely to respond to your inquiry. We do not sell or share this information
          with third parties.
        </p>

        <h2>Children&apos;s privacy</h2>
        <p>CalcHub is not directed at children under 13, and we do not knowingly collect personal information from children.</p>

        <h2>Changes to this policy</h2>
        <p>We may update this policy from time to time. Material changes will be reflected by updating the date at the top of this page.</p>

        <h2>Contact us</h2>
        <p>
          Questions about this policy? Reach out via our <Link href="/contact">contact page</Link>.
        </p>
      </article>
    </Container>
  );
}
