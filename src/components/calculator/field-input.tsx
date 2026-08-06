"use client";

import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CalculatorField, CalculatorInputs } from "@/lib/calculators/types";
import { cn } from "@/lib/utils";

export function FieldInput({
  field,
  control,
  errors,
}: {
  field: CalculatorField;
  control: Control<CalculatorInputs>;
  errors: FieldErrors<CalculatorInputs>;
}) {
  const error = errors[field.id]?.message as string | undefined;
  const inputId = `field-${field.id}`;
  const errorId = `${inputId}-error`;
  const helpId = `${inputId}-help`;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={inputId} className="flex items-center justify-between text-sm font-medium">
        <span>{field.label}</span>
        {field.unit && <span className="text-xs font-normal text-muted-foreground">{field.unit}</span>}
      </Label>

      <Controller
        name={field.id}
        control={control}
        render={({ field: controllerField }) => {
          if (field.type === "select") {
            return (
              <Select value={String(controllerField.value ?? "")} onValueChange={controllerField.onChange}>
                <SelectTrigger id={inputId} className="w-full" aria-describedby={error ? errorId : helpId}>
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          }

          if (field.type === "radio") {
            return (
              <RadioGroup
                value={String(controllerField.value ?? "")}
                onValueChange={controllerField.onChange}
                className="flex flex-wrap gap-4"
                aria-describedby={error ? errorId : helpId}
              >
                {field.options?.map((opt) => (
                  <div key={opt.value} className="flex items-center gap-2">
                    <RadioGroupItem value={opt.value} id={`${inputId}-${opt.value}`} />
                    <Label htmlFor={`${inputId}-${opt.value}`} className="font-normal">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            );
          }

          if (field.type === "date") {
            return (
              <Input
                id={inputId}
                type="date"
                value={String(controllerField.value ?? "")}
                onChange={controllerField.onChange}
                className={cn(error && "border-destructive")}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : helpId}
              />
            );
          }

          if (field.type === "time") {
            return (
              <Input
                id={inputId}
                type="time"
                value={String(controllerField.value ?? "")}
                onChange={controllerField.onChange}
                className={cn(error && "border-destructive")}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : helpId}
              />
            );
          }

          return (
            <Input
              id={inputId}
              type="number"
              inputMode="decimal"
              step={field.step ?? "any"}
              min={field.min}
              max={field.max}
              placeholder={field.placeholder}
              value={String(controllerField.value ?? "")}
              onChange={controllerField.onChange}
              className={cn(error && "border-destructive")}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : helpId}
            />
          );
        }}
      />

      {field.helpText && !error && (
        <p id={helpId} className="text-xs text-muted-foreground">
          {field.helpText}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
