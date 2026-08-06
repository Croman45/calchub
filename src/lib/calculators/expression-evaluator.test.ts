import { describe, it, expect } from "vitest";
import { evaluateExpression } from "./expression-evaluator";

describe("evaluateExpression", () => {
  it("respects standard operator precedence", () => {
    expect(evaluateExpression("2 + 3 * 4")).toBe(14);
    expect(evaluateExpression("(2 + 3) * 4")).toBe(20);
  });

  it("handles exponentiation", () => {
    expect(evaluateExpression("2^10")).toBe(1024);
  });

  it("handles unary minus", () => {
    expect(evaluateExpression("-5 + 3")).toBe(-2);
  });

  it("evaluates functions", () => {
    expect(evaluateExpression("sqrt(144)")).toBe(12);
    expect(evaluateExpression("sin(0)")).toBe(0);
    expect(evaluateExpression("log(100)")).toBeCloseTo(2, 10);
  });

  it("evaluates constants", () => {
    expect(evaluateExpression("pi")).toBeCloseTo(Math.PI, 10);
    expect(evaluateExpression("e")).toBeCloseTo(Math.E, 10);
  });

  it("evaluates factorial", () => {
    expect(evaluateExpression("5!")).toBe(120);
  });

  it("evaluates nested expressions with functions and operators", () => {
    expect(evaluateExpression("sqrt(144) + 2^5")).toBe(44);
  });

  it("throws a descriptive error for division by zero", () => {
    expect(() => evaluateExpression("5/0")).toThrow(/finite/);
  });

  it("throws for unknown identifiers", () => {
    expect(() => evaluateExpression("banana(1)")).toThrow(/Unknown function/);
  });

  it("throws for malformed expressions", () => {
    expect(() => evaluateExpression("2 +")).toThrow();
    expect(() => evaluateExpression("(2 + 3")).toThrow(/closing parenthesis/);
  });

  it("never executes arbitrary JavaScript", () => {
    // "process" is a valid identifier-like token, but not a defined constant
    // or function, so it must be rejected - never passed to eval/Function.
    expect(() => evaluateExpression("process.exit()")).toThrow();
  });
});
