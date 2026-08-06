import { z } from "zod";

export const CATEGORY_SLUGS = [
  "finance",
  "health",
  "math",
  "construction",
  "education",
  "conversions",
  "time",
  "fitness",
  "everyday",
  "business",
  "science",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export const calculatorFieldSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(["number", "select", "radio", "date", "time"]),
  unit: z.string().optional(),
  placeholder: z.string().optional(),
  defaultValue: z.union([z.number(), z.string()]),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  options: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .optional(),
  helpText: z.string().optional(),
});

export type CalculatorField = z.infer<typeof calculatorFieldSchema>;

export const calculatorFaqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export type CalculatorFaq = z.infer<typeof calculatorFaqSchema>;

export const calculatorExampleSchema = z.object({
  title: z.string(),
  inputs: z.record(z.string(), z.union([z.number(), z.string()])),
  note: z.string().optional(),
});

export type CalculatorExample = z.infer<typeof calculatorExampleSchema>;

export const calculatorSeoSectionSchema = z.object({
  heading: z.string(),
  body: z.string(),
});

export const calculatorFormulaSchema = z.object({
  summary: z.string(),
  expression: z.string(),
  variables: z.array(z.object({ symbol: z.string(), meaning: z.string() })),
});

export const calculatorConfigSchema = z.object({
  slug: z.string(),
  category: z.enum(CATEGORY_SLUGS),
  title: z.string(),
  shortTitle: z.string().optional(),
  description: z.string().min(50).max(170),
  icon: z.string(),
  fields: z.array(calculatorFieldSchema).default([]),
  faqs: z.array(calculatorFaqSchema).min(1),
  examples: z.array(calculatorExampleSchema).min(1),
  relatedSlugs: z.array(z.string()).default([]),
  seoContent: z.array(calculatorSeoSectionSchema).min(1),
  formula: calculatorFormulaSchema,
  resultUnit: z.string().optional(),
  chartType: z.enum(["bar", "line", "pie", "area", "none"]).default("none"),
  featured: z.boolean().default(false),
  popular: z.boolean().default(false),
  dateAdded: z.string(),
  /** When set, the calculator client re-runs its compute function on this interval (ms) - used by live/countdown-style calculators. */
  autoRefreshMs: z.number().optional(),
});

export type CalculatorConfig = z.infer<typeof calculatorConfigSchema>;

export type CalculatorInputs = Record<string, number | string>;

export interface CalculatorResultField {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface CalculatorStepResult {
  label: string;
  detail: string;
}

export interface CalculatorChartPoint {
  name: string;
  [key: string]: number | string;
}

export interface CalculatorComputeResult {
  primary: CalculatorResultField;
  secondary?: CalculatorResultField[];
  steps?: CalculatorStepResult[];
  chartData?: CalculatorChartPoint[];
  chartKeys?: string[];
  warnings?: string[];
}

export type CalculatorComputeFn = (
  inputs: CalculatorInputs,
) => CalculatorComputeResult;
