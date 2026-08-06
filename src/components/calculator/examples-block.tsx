"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CalculatorExample } from "@/lib/calculators/types";

export function ExamplesBlock({
  examples,
  onApply,
}: {
  examples: CalculatorExample[];
  onApply?: (inputs: CalculatorExample["inputs"]) => void;
}) {
  if (!examples.length) return null;

  return (
    <Card className="border-border/60">
      <CardContent className="space-y-4 p-6">
        <h2 className="text-xl font-semibold">Examples</h2>
        <div className="space-y-3">
          {examples.map((example) => (
            <div
              key={example.title}
              className="flex flex-col gap-2 rounded-lg border border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium">{example.title}</p>
                {example.note && <p className="text-sm text-muted-foreground">{example.note}</p>}
              </div>
              {onApply && Object.keys(example.inputs).length > 0 && (
                <Button variant="outline" size="sm" onClick={() => onApply(example.inputs)}>
                  Try this example
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
