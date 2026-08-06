"use client";

import * as React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FieldInput } from "@/components/calculator/field-input";
import { ResultDisplay } from "@/components/calculator/result-display";
import { StepByStep } from "@/components/calculator/step-by-step";
import { ExamplesBlock } from "@/components/calculator/examples-block";
import { ScientificCalculator } from "@/components/calculator/scientific-calculator";
import { buildDefaultValues, buildFieldSchema } from "@/lib/calculators/form-schema";
import { getComputeFn } from "@/lib/calculators/compute-registry";
import type { CalculatorConfig, CalculatorComputeResult, CalculatorInputs } from "@/lib/calculators/types";

const ChartBlock = dynamic(
  () => import("@/components/calculator/chart-block").then((mod) => mod.ChartBlock),
  { ssr: false, loading: () => <Skeleton className="h-72 w-full" /> },
);

export function CalculatorClient({ config }: { config: CalculatorConfig }) {
  if (config.slug === "scientific") {
    return <ScientificCalculator />;
  }

  return <StandardCalculator config={config} />;
}

function StandardCalculator({ config }: { config: CalculatorConfig }) {
  const schema = React.useMemo(() => buildFieldSchema(config.fields), [config.fields]);
  const defaultValues = React.useMemo(() => buildDefaultValues(config.fields), [config.fields]);
  const computeFn = React.useMemo(() => getComputeFn(config.slug), [config.slug]);

  const {
    control,
    watch,
    getValues,
    reset,
    formState: { errors },
  } = useForm<CalculatorInputs>({
    resolver: zodResolver(schema) as unknown as Resolver<CalculatorInputs>,
    defaultValues,
    mode: "onChange",
  });

  const [result, setResult] = React.useState<CalculatorComputeResult | null>(null);

  // Subscribing via watch()'s callback form (rather than depending on the
  // object watch() returns) is required here - watch() returns a new object
  // reference on every render, so using it as a useEffect dependency causes
  // an infinite render loop (recompute -> setState -> re-render -> new
  // reference -> recompute -> ...).
  React.useEffect(() => {
    if (!computeFn) return;

    function recompute(rawValues: Partial<CalculatorInputs>) {
      const validation = schema.safeParse(rawValues);
      if (!validation.success) return;
      setResult(computeFn!(validation.data as CalculatorInputs));
    }

    recompute(getValues());
    const subscription = watch((value) => recompute(value as Partial<CalculatorInputs>));
    return () => subscription.unsubscribe();
  }, [computeFn, schema, watch, getValues]);

  React.useEffect(() => {
    if (!config.autoRefreshMs || !computeFn) return;
    const interval = setInterval(() => {
      const validation = schema.safeParse(getValues());
      if (validation.success) setResult(computeFn(validation.data as CalculatorInputs));
    }, config.autoRefreshMs);
    return () => clearInterval(interval);
  }, [config.autoRefreshMs, computeFn, schema, getValues]);

  function handleApplyExample(inputs: Record<string, number | string>) {
    reset({ ...defaultValues, ...inputs });
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardContent className="space-y-4 p-6">
            {config.fields.map((field) => (
              <FieldInput key={field.id} field={field} control={control} errors={errors} />
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {result && <ResultDisplay result={result} />}
          {result?.steps && result.steps.length > 0 && <StepByStep steps={result.steps} />}
          {result?.chartData && result.chartData.length > 0 && config.chartType !== "none" && (
            <Card className="border-border/60">
              <CardContent className="p-6">
                <ChartBlock
                  chartType={config.chartType}
                  data={result.chartData}
                  keys={result.chartKeys ?? []}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <ExamplesBlock examples={config.examples} onApply={handleApplyExample} />
    </div>
  );
}
