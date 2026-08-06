import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/shared/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SearchResultsClient } from "@/components/search/search-results-client";

export const metadata: Metadata = {
  title: "Search Calculators",
  description: "Search all CalcHub calculators by name or topic.",
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search", href: "/search" }]} />

      <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">Search</h1>

      <div className="mt-6">
        <Suspense fallback={null}>
          <SearchResultsClient />
        </Suspense>
      </div>
    </Container>
  );
}
