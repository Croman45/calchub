import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CalculatorClient } from "./calculator-client";
import gcdConfig from "@/data/calculators/math/gcd.json";
import primeNumberConfig from "@/data/calculators/math/prime-number.json";
import type { CalculatorConfig } from "@/lib/calculators/types";

const config = gcdConfig as CalculatorConfig;

describe("CalculatorClient (GCD)", () => {
  it("computes a result immediately on mount using default values", async () => {
    render(<CalculatorClient config={config} />);
    // Defaults are 48 and 18, whose GCD is 6.
    expect(await screen.findByText("6")).toBeInTheDocument();
  });

  it("recomputes live as inputs change", async () => {
    const user = userEvent.setup();
    render(<CalculatorClient config={config} />);

    const firstInput = screen.getByLabelText(/first number/i);
    await user.clear(firstInput);
    await user.type(firstInput, "20");

    const secondInput = screen.getByLabelText(/second number/i);
    await user.clear(secondInput);
    await user.type(secondInput, "8");

    // GCD(20, 8) = 4
    expect(await screen.findByText("4")).toBeInTheDocument();
  });

  it("shows a validation error when a value violates the field's min constraint", async () => {
    const user = userEvent.setup();
    render(<CalculatorClient config={primeNumberConfig as CalculatorConfig} />);

    const input = screen.getByLabelText(/number to check/i);
    await user.clear(input);
    await user.type(input, "-5");

    expect(await screen.findByText(/must be at least 1/i)).toBeInTheDocument();
  });
});
