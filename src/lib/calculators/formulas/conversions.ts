import type { CalculatorComputeResult, CalculatorInputs } from "../types";
import { formatNumber, num, str } from "../utils";

/** Factor to convert 1 unit of X into the category's base unit. */
type UnitTable = Record<string, { label: string; toBase: number }>;

const LENGTH_UNITS: UnitTable = {
  mm: { label: "millimeters", toBase: 0.001 },
  cm: { label: "centimeters", toBase: 0.01 },
  m: { label: "meters", toBase: 1 },
  km: { label: "kilometers", toBase: 1000 },
  in: { label: "inches", toBase: 0.0254 },
  ft: { label: "feet", toBase: 0.3048 },
  yd: { label: "yards", toBase: 0.9144 },
  mi: { label: "miles", toBase: 1609.344 },
};

const WEIGHT_UNITS: UnitTable = {
  mg: { label: "milligrams", toBase: 0.000001 },
  g: { label: "grams", toBase: 0.001 },
  kg: { label: "kilograms", toBase: 1 },
  t: { label: "metric tons", toBase: 1000 },
  oz: { label: "ounces", toBase: 0.028349523125 },
  lb: { label: "pounds", toBase: 0.45359237 },
  st: { label: "stone", toBase: 6.35029318 },
};

const AREA_UNITS: UnitTable = {
  sqm: { label: "square meters", toBase: 1 },
  sqkm: { label: "square kilometers", toBase: 1_000_000 },
  sqft: { label: "square feet", toBase: 0.09290304 },
  sqyd: { label: "square yards", toBase: 0.83612736 },
  acre: { label: "acres", toBase: 4046.8564224 },
  hectare: { label: "hectares", toBase: 10000 },
};

const VOLUME_UNITS: UnitTable = {
  ml: { label: "milliliters", toBase: 0.001 },
  l: { label: "liters", toBase: 1 },
  m3: { label: "cubic meters", toBase: 1000 },
  gal_us: { label: "US gallons", toBase: 3.785411784 },
  qt_us: { label: "US quarts", toBase: 0.946352946 },
  cup_us: { label: "US cups", toBase: 0.2365882365 },
  floz_us: { label: "US fluid ounces", toBase: 0.0295735295625 },
};

const SPEED_UNITS: UnitTable = {
  mps: { label: "meters/second", toBase: 1 },
  kph: { label: "kilometers/hour", toBase: 0.277777778 },
  mph: { label: "miles/hour", toBase: 0.44704 },
  knot: { label: "knots", toBase: 0.514444444 },
  fps: { label: "feet/second", toBase: 0.3048 },
};

function convertLinear(inputs: CalculatorInputs, table: UnitTable): CalculatorComputeResult {
  const value = num(inputs, "value", 1);
  const fromUnit = str(inputs, "fromUnit", Object.keys(table)[0]);
  const toUnit = str(inputs, "toUnit", Object.keys(table)[1] ?? Object.keys(table)[0]);

  const from = table[fromUnit] ?? Object.values(table)[0];
  const to = table[toUnit] ?? Object.values(table)[0];

  const baseValue = value * from.toBase;
  const result = baseValue / to.toBase;

  return {
    primary: { label: `${value} ${from.label} =`, value: `${formatNumber(result, 6)} ${to.label}`, highlight: true },
    steps: [
      { label: "1. Convert to the base unit", detail: `${value} × ${from.toBase} = ${formatNumber(baseValue, 8)} (base unit)` },
      { label: "2. Convert to the target unit", detail: `${formatNumber(baseValue, 8)} ÷ ${to.toBase} = ${formatNumber(result, 6)} ${to.label}` },
    ],
  };
}

export function computeLengthConversion(inputs: CalculatorInputs) {
  return convertLinear(inputs, LENGTH_UNITS);
}

export function computeWeightConversion(inputs: CalculatorInputs) {
  return convertLinear(inputs, WEIGHT_UNITS);
}

export function computeAreaConversion(inputs: CalculatorInputs) {
  return convertLinear(inputs, AREA_UNITS);
}

export function computeVolumeConversion(inputs: CalculatorInputs) {
  return convertLinear(inputs, VOLUME_UNITS);
}

export function computeSpeedConversion(inputs: CalculatorInputs) {
  return convertLinear(inputs, SPEED_UNITS);
}

export function computeTemperatureConversion(inputs: CalculatorInputs): CalculatorComputeResult {
  const value = num(inputs, "value", 0);
  const fromUnit = str(inputs, "fromUnit", "c");
  const toUnit = str(inputs, "toUnit", "f");

  let celsius: number;
  if (fromUnit === "f") celsius = ((value - 32) * 5) / 9;
  else if (fromUnit === "k") celsius = value - 273.15;
  else celsius = value;

  let result: number;
  let formula: string;
  if (toUnit === "f") {
    result = (celsius * 9) / 5 + 32;
    formula = "°F = °C × 9/5 + 32";
  } else if (toUnit === "k") {
    result = celsius + 273.15;
    formula = "K = °C + 273.15";
  } else {
    result = celsius;
    formula = "°C = °C";
  }

  const unitLabel: Record<string, string> = { c: "°C", f: "°F", k: "K" };

  return {
    primary: {
      label: `${value}${unitLabel[fromUnit]} =`,
      value: `${formatNumber(result, 2)}${unitLabel[toUnit]}`,
      highlight: true,
    },
    steps: [
      { label: "1. Convert to Celsius first", detail: fromUnit === "c" ? `Already in °C: ${value}°C.` : `${value}${unitLabel[fromUnit]} → ${formatNumber(celsius, 4)}°C.` },
      { label: "2. Convert to the target unit", detail: `${formula} → ${formatNumber(result, 2)}${unitLabel[toUnit]}.` },
    ],
  };
}
