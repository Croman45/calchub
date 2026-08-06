import { describe, it, expect } from "vitest";
import {
  computeLengthConversion,
  computeWeightConversion,
  computeTemperatureConversion,
  computeAreaConversion,
  computeVolumeConversion,
  computeSpeedConversion,
} from "./conversions";

function numericValue(text: string): number {
  return Number(text.replace(/,/g, "").match(/-?[\d.]+/)?.[0]);
}

describe("computeLengthConversion", () => {
  it("converts 1 meter to feet", () => {
    const result = computeLengthConversion({ value: 1, fromUnit: "m", toUnit: "ft" });
    expect(numericValue(result.primary.value)).toBeCloseTo(3.28084, 4);
  });

  it("round-trips meters to miles and back", () => {
    const toMiles = computeLengthConversion({ value: 1609.344, fromUnit: "m", toUnit: "mi" });
    expect(numericValue(toMiles.primary.value)).toBeCloseTo(1, 5);
  });
});

describe("computeWeightConversion", () => {
  it("converts 1 kg to pounds", () => {
    const result = computeWeightConversion({ value: 1, fromUnit: "kg", toUnit: "lb" });
    expect(numericValue(result.primary.value)).toBeCloseTo(2.204623, 4);
  });
});

describe("computeTemperatureConversion", () => {
  it("converts 0C to 32F", () => {
    const result = computeTemperatureConversion({ value: 0, fromUnit: "c", toUnit: "f" });
    expect(numericValue(result.primary.value)).toBeCloseTo(32, 2);
  });

  it("converts 100C to 373.15K", () => {
    const result = computeTemperatureConversion({ value: 100, fromUnit: "c", toUnit: "k" });
    expect(numericValue(result.primary.value)).toBeCloseTo(373.15, 2);
  });

  it("converts -40F to -40C (the crossover point)", () => {
    const result = computeTemperatureConversion({ value: -40, fromUnit: "f", toUnit: "c" });
    expect(numericValue(result.primary.value)).toBeCloseTo(-40, 2);
  });
});

describe("computeAreaConversion", () => {
  it("converts 1 acre to square meters", () => {
    const result = computeAreaConversion({ value: 1, fromUnit: "acre", toUnit: "sqm" });
    expect(numericValue(result.primary.value)).toBeCloseTo(4046.86, 1);
  });
});

describe("computeVolumeConversion", () => {
  it("converts 1 liter to US gallons", () => {
    const result = computeVolumeConversion({ value: 1, fromUnit: "l", toUnit: "gal_us" });
    expect(numericValue(result.primary.value)).toBeCloseTo(0.264172, 4);
  });
});

describe("computeSpeedConversion", () => {
  it("converts 100 km/h to mph", () => {
    const result = computeSpeedConversion({ value: 100, fromUnit: "kph", toUnit: "mph" });
    expect(numericValue(result.primary.value)).toBeCloseTo(62.137, 1);
  });
});
