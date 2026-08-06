import type { Metadata } from "next";
import { Container, Section } from "@/components/shared/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CategoryCard } from "@/components/shared/category-card";
import { CATEGORIES } from "@/data/categories";
import { getCalculatorsByCategory } from "@/lib/calculators/registry";

export const metadata: Metadata = {
  title: "All Calculator Categories",
  description: "Browse every CalcHub calculator category: finance, health, math, conversions, time, construction, and more.",
  alternates: { canonical: "/categories" },
};

export default function CategoriesPage() {
  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Categories", href: "/categories" }]} />

      <div className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">All categories</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {CATEGORIES.length} categories, {CATEGORIES.reduce((sum, c) => sum + getCalculatorsByCategory(c.slug).length, 0)} calculators and counting.
        </p>
      </div>

      <Section className="pb-0">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.slug} category={category} count={getCalculatorsByCategory(category.slug).length} />
          ))}
        </div>
      </Section>
    </Container>
  );
}
