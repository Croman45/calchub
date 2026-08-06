import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { getPopularCalculators } from "@/lib/calculators/registry";
import { CalculatorCard } from "@/components/shared/calculator-card";
import { Calculator } from "lucide-react";

export default function NotFound() {
  const popular = getPopularCalculators(4);

  return (
    <Container className="flex flex-col items-center py-20 text-center sm:py-28">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl brand-gradient-bg text-white">
        <Calculator className="h-8 w-8" />
      </span>
      <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">404</h1>
      <p className="mt-3 max-w-md text-lg text-muted-foreground">
        We couldn&apos;t find that page. It may have been moved, or the link might be broken.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Back to home</Link>
      </Button>

      <div className="mt-16 w-full text-left">
        <h2 className="mb-4 text-center text-xl font-semibold">Popular calculators</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((calc) => (
            <CalculatorCard key={calc.slug} calculator={calc} />
          ))}
        </div>
      </div>
    </Container>
  );
}
