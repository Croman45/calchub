import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CalculatorCard } from "@/components/shared/calculator-card";
import { Icon } from "@/components/shared/icon-map";
import { JsonLd, buildBreadcrumbSchema } from "@/components/shared/json-ld";
import { CATEGORIES, getCategoryBySlug } from "@/data/categories";
import { getCalculatorsByCategory } from "@/lib/calculators/registry";

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) return {};

  return {
    title: `${category.name} Calculators`,
    description: category.description,
    alternates: { canonical: `/${category.slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const calculators = getCalculatorsByCategory(category.slug);
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/categories" },
    { label: category.name, href: `/${category.slug}` },
  ];

  return (
    <Container className="py-8 sm:py-12">
      <JsonLd data={buildBreadcrumbSchema(breadcrumbItems)} />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mt-6 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon name={category.icon} className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{category.name} calculators</h1>
          <p className="mt-1 max-w-2xl text-muted-foreground">{category.description}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {calculators.map((calc) => (
          <CalculatorCard key={calc.slug} calculator={calc} />
        ))}
      </div>

      {calculators.length === 0 && (
        <p className="mt-8 text-muted-foreground">
          No calculators in this category yet - check back soon.
        </p>
      )}
    </Container>
  );
}
