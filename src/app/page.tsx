import Link from "next/link";
import type { Metadata } from "next";
import { Container, Section } from "@/components/shared/container";
import { FadeIn } from "@/components/shared/fade-in";
import { CalculatorCard } from "@/components/shared/calculator-card";
import { CategoryCard } from "@/components/shared/category-card";
import { StatCounter } from "@/components/shared/stat-counter";
import { AdSlot } from "@/components/shared/ad-slot";
import { HeroSearch } from "@/components/home/hero-search";
import { FaqBlock } from "@/components/calculator/faq-block";
import { Button } from "@/components/ui/button";
import { JsonLd, buildSoftwareAppSchema } from "@/components/shared/json-ld";
import { CATEGORIES } from "@/data/categories";
import {
  getAllCalculators,
  getFeaturedCalculators,
  getPopularCalculators,
  getRecentlyAdded,
  getCalculatorsByCategory,
} from "@/lib/calculators/registry";
import { ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "CalcHub - Fast, Free Online Calculators for Finance, Health, Math & More",
  description:
    "30+ free online calculators covering finance, health, math, conversions, time, and construction. Instant results, step-by-step solutions, no sign-up required.",
  alternates: { canonical: "/" },
};

const HOME_FAQS = [
  {
    question: "Is CalcHub really free to use?",
    answer: "Yes - every calculator on CalcHub is completely free, with no sign-up, subscription, or usage limits.",
  },
  {
    question: "How accurate are the calculations?",
    answer: "Every calculator uses standard, well-documented formulas (shown on each calculator's page) and is covered by automated tests. For financial, health, or legal decisions, always confirm with a qualified professional.",
  },
  {
    question: "Do you store the numbers I enter?",
    answer: "No - all calculations run entirely in your browser. Nothing you type into a calculator is sent to or stored on our servers.",
  },
  {
    question: "Can I use CalcHub on my phone?",
    answer: "Yes - every calculator is fully responsive and designed mobile-first, so it works smoothly on phones, tablets, and desktops.",
  },
];

export default function HomePage() {
  const allCalculators = getAllCalculators();
  const featured = getFeaturedCalculators(6);
  const popular = getPopularCalculators(8);
  const recent = getRecentlyAdded(6);

  return (
    <>
      <JsonLd
        data={buildSoftwareAppSchema({
          name: "CalcHub",
          description: "Free online calculators for finance, health, math, conversions, time, and construction.",
          url: "/",
        })}
      />

      {/* Hero */}
      <Section className="relative overflow-hidden pb-12 pt-16 sm:pt-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-40 [background:radial-gradient(circle_at_20%_20%,var(--brand-from),transparent_40%),radial-gradient(circle_at_80%_0%,var(--brand-to),transparent_35%)]"
        />
        <Container className="text-center">
          <FadeIn>
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {allCalculators.length}+ free calculators, always instant
            </span>
            <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
              Every calculator you need, <span className="gradient-text">in one place</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
              Finance, health, math, conversions, time, and construction - fast, accurate, and
              free. No sign-up, no clutter.
            </p>
          </FadeIn>

          <FadeIn delay={0.1} className="mt-8">
            <HeroSearch />
          </FadeIn>

          <FadeIn delay={0.15} className="mt-6 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div>
              <div className="text-2xl font-bold text-foreground">
                <StatCounter value={allCalculators.length} suffix="+" />
              </div>
              Calculators
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                <StatCounter value={CATEGORIES.length} />
              </div>
              Categories
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                <StatCounter value={100} suffix="%" />
              </div>
              Free forever
            </div>
          </FadeIn>
        </Container>
      </Section>

      <Container>
        <AdSlot format="horizontal" slot="4444444444" />
      </Container>

      {/* Popular */}
      <Section>
        <Container>
          <FadeIn className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Popular calculators</h2>
              <p className="mt-1 text-muted-foreground">The tools people reach for most.</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((calc, index) => (
              <FadeIn key={calc.slug} delay={index * 0.03}>
                <CalculatorCard calculator={calc} />
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>

      {/* Categories */}
      <Section className="bg-muted/20">
        <Container>
          <FadeIn className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Browse by category</h2>
            <p className="mt-1 text-muted-foreground">
              {CATEGORIES.length} categories covering every kind of calculation.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category, index) => (
              <FadeIn key={category.slug} delay={index * 0.03}>
                <CategoryCard category={category} count={getCalculatorsByCategory(category.slug).length} />
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>

      {/* Featured */}
      <Section>
        <Container>
          <FadeIn className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Featured</h2>
            <p className="mt-1 text-muted-foreground">Hand-picked calculators worth trying first.</p>
          </FadeIn>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((calc, index) => (
              <FadeIn key={calc.slug} delay={index * 0.03}>
                <CalculatorCard calculator={calc} />
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>

      <Container>
        <AdSlot format="horizontal" slot="5555555555" />
      </Container>

      {/* Recently added */}
      <Section>
        <Container>
          <FadeIn className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Recently added</h2>
              <p className="mt-1 text-muted-foreground">Fresh calculators, just published.</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link href="/categories">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </FadeIn>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((calc, index) => (
              <FadeIn key={calc.slug} delay={index * 0.03}>
                <CalculatorCard calculator={calc} />
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section className="bg-muted/20">
        <Container className="max-w-3xl">
          <FadeIn className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Frequently asked questions</h2>
          </FadeIn>
          <FadeIn>
            <FaqBlock faqs={HOME_FAQS} />
          </FadeIn>
        </Container>
      </Section>

      {/* SEO content */}
      <Section>
        <Container className="max-w-3xl">
          <FadeIn className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-semibold">
            <h2>Free online calculators built for speed and accuracy</h2>
            <p>
              CalcHub brings together {allCalculators.length}+ calculators across {CATEGORIES.length}{" "}
              categories - from mortgage and loan payments to BMI, unit conversions, and
              construction material estimates. Every calculator shows its formula, a worked
              step-by-step solution, and real examples, so you can trust the number and
              understand how it was reached.
            </p>
            <p>
              Unlike many calculator sites, nothing you type is sent to a server - every
              calculation runs instantly in your browser using the same formulas explained on the
              page. That means your numbers stay private, and results appear the moment you finish
              typing.
            </p>
          </FadeIn>
        </Container>
      </Section>
    </>
  );
}
