import type { CalculatorInputs } from "./types";

/** Safely coerces a form input value (number | string) to a finite number. */
export function num(inputs: CalculatorInputs, key: string, fallback = 0): number {
  const raw = inputs[key];
  const value = typeof raw === "number" ? raw : parseFloat(String(raw ?? ""));
  return Number.isFinite(value) ? value : fallback;
}

/** Reads a select/radio field value as a string. */
export function str(inputs: CalculatorInputs, key: string, fallback = ""): string {
  const raw = inputs[key];
  return raw === undefined || raw === null || raw === "" ? fallback : String(raw);
}

export function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function formatCurrency(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return "$0.00";
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatNumber(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return "0";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    [x, y] = [y, x % y];
  }
  return x || 1;
}

export function lcm(a: number, b: number): number {
  const g = gcd(a, b);
  return g === 0 ? 0 : Math.abs(Math.round(a) * Math.round(b)) / g;
}
