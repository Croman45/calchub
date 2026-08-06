import { CalculatorCard } from "@/components/shared/calculator-card";
import type { CalculatorConfig } from "@/lib/calculators/types";

export function RelatedCalculators({ calculators }: { calculators: CalculatorConfig[] }) {
  if (!calculators.length) return null;

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Related calculators</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {calculators.map((calc) => (
          <CalculatorCard
            key={calc.slug}
            calculator={{
              slug: calc.slug,
              category: calc.category,
              title: calc.title,
              description: calc.description,
              icon: calc.icon,
            }}
          />
        ))}
      </div>
    </div>
  );
}
