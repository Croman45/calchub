import { Card, CardContent } from "@/components/ui/card";
import type { CalculatorStepResult } from "@/lib/calculators/types";

export function StepByStep({ steps }: { steps: CalculatorStepResult[] }) {
  if (!steps.length) return null;

  return (
    <Card className="border-border/60">
      <CardContent className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Step-by-step solution</h2>
        <ol className="space-y-4">
          {steps.map((step, index) => (
            <li key={step.label} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-medium">{step.label}</p>
                <p className="text-sm text-muted-foreground">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
