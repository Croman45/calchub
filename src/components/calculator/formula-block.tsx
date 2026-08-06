import { Card, CardContent } from "@/components/ui/card";
import type { CalculatorConfig } from "@/lib/calculators/types";

export function FormulaBlock({ formula }: { formula: CalculatorConfig["formula"] }) {
  return (
    <Card className="border-border/60">
      <CardContent className="space-y-4 p-6">
        <h2 className="text-xl font-semibold">How this is calculated</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{formula.summary}</p>
        <div className="overflow-x-auto rounded-lg bg-muted px-4 py-3 font-mono text-sm">
          {formula.expression}
        </div>
        {formula.variables.length > 0 && (
          <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {formula.variables.map((v) => (
              <div key={v.symbol} className="flex gap-2 text-sm">
                <dt className="font-mono font-semibold text-primary">{v.symbol}</dt>
                <dd className="text-muted-foreground">{v.meaning}</dd>
              </div>
            ))}
          </dl>
        )}
      </CardContent>
    </Card>
  );
}
