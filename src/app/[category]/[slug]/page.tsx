import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalculatorPageTemplate } from "@/components/calculator/calculator-page-template";
import { JsonLd, buildBreadcrumbSchema, buildFaqSchema, buildSoftwareAppSchema } from "@/components/shared/json-ld";
import { getAllCalculators, getCalculatorBySlug } from "@/lib/calculators/registry";
import { getCategoryBySlug } from "@/data/categories";

export function generateStaticParams() {
  return getAllCalculators().map((calc) => ({ category: calc.category, slug: calc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const config = getCalculatorBySlug(slug);
  if (!config || config.category !== category) return {};

  const url = `/${config.category}/${config.slug}`;

  return {
    title: config.title,
    description: config.description,
    alternates: { canonical: url },
    openGraph: {
      title: config.title,
      description: config.description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
    },
  };
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const config = getCalculatorBySlug(slug);
  const categoryMeta = getCategoryBySlug(category);

  if (!config || !categoryMeta || config.category !== category) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: categoryMeta.name, href: `/${category}` },
    { label: config.shortTitle ?? config.title, href: `/${category}/${slug}` },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(breadcrumbItems)} />
      <JsonLd data={buildFaqSchema(config.faqs)} />
      <JsonLd
        data={buildSoftwareAppSchema({
          name: config.title,
          description: config.description,
          url: `/${category}/${slug}`,
        })}
      />
      <CalculatorPageTemplate config={config} />
    </>
  );
}
