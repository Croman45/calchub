import { describe, it, expect } from "vitest";
import { computePercentage, computeFraction, computeDecimalToFraction, computePrimeNumber, computeGcd, computeLcm } from "./math";

describe("computePercentage", () => {
  it("computes X% of Y", () => {
    const result = computePercentage({ mode: "percentOf", valueA: 20, valueB: 200 });
    expect(result.primary.value).toBe("40");
  });

  it("computes X is what percent of Y", () => {
    const result = computePercentage({ mode: "isWhatPercent", valueA: 40, valueB: 200 });
    expect(result.primary.value).toBe("20%");
  });

  it("computes percentage change (increase)", () => {
    const result = computePercentage({ mode: "percentChange", valueA: 100, valueB: 150 });
    expect(result.primary.value).toBe("50% increase");
  });

  it("computes percentage change (decrease)", () => {
    const result = computePercentage({ mode: "percentChange", valueA: 100, valueB: 75 });
    expect(result.primary.value).toBe("25% decrease");
  });
});

describe("computeFraction", () => {
  it("adds two fractions and simplifies", () => {
    const result = computeFraction({ numerator1: 1, denominator1: 2, operation: "add", numerator2: 1, denominator2: 3 });
    expect(result.primary.value).toBe("5/6");
  });

  it("multiplies two fractions", () => {
    const result = computeFraction({ numerator1: 2, denominator1: 3, operation: "multiply", numerator2: 3, denominator2: 4 });
    // 6/12 -> simplified 1/2
    expect(result.primary.value).toBe("1/2");
  });

  it("divides two fractions", () => {
    const result = computeFraction({ numerator1: 1, denominator1: 2, operation: "divide", numerator2: 1, denominator2: 4 });
    expect(result.primary.value).toBe("2/1");
  });
});

describe("computeDecimalToFraction", () => {
  it("converts 0.75 to 3/4", () => {
    const result = computeDecimalToFraction({ decimal: 0.75 });
    expect(result.primary.value).toBe("3/4");
  });
});

describe("computePrimeNumber", () => {
  it("identifies 97 as prime", () => {
    const result = computePrimeNumber({ number: 97 });
    expect(result.primary.value).toBe("Yes");
  });

  it("factorizes 84 correctly", () => {
    const result = computePrimeNumber({ number: 84 });
    expect(result.primary.value).toBe("No");
    expect(result.secondary?.[0].value).toBe("2 × 2 × 3 × 7");
  });
});

describe("computeGcd", () => {
  it("computes GCD(48, 18) = 6", () => {
    const result = computeGcd({ numberA: 48, numberB: 18 });
    expect(result.primary.value).toBe("6");
  });
});

describe("computeLcm", () => {
  it("computes LCM(4, 6) = 12", () => {
    const result = computeLcm({ numberA: 4, numberB: 6 });
    expect(result.primary.value).toBe("12");
  });
});
