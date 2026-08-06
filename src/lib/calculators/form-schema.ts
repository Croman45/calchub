import { z } from "zod";
import type { CalculatorField, CalculatorInputs } from "./types";

export function buildFieldSchema(fields: CalculatorField[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    if (field.type === "number") {
      let schema = z.coerce.number().finite(`${field.label} must be a valid number`);
      if (field.min !== undefined) {
        schema = schema.min(field.min, `${field.label} must be at least ${field.min}`);
      }
      if (field.max !== undefined) {
        schema = schema.max(field.max, `${field.label} must be at most ${field.max}`);
      }
      shape[field.id] = schema;
    } else {
      shape[field.id] = z.string().min(1, `${field.label} is required`);
    }
  }

  return z.object(shape);
}

export function buildDefaultValues(fields: CalculatorField[]): CalculatorInputs {
  const defaults: CalculatorInputs = {};
  for (const field of fields) {
    defaults[field.id] = field.defaultValue;
  }
  return defaults;
}
