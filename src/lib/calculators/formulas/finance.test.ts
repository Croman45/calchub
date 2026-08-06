import { describe, it, expect } from "vitest";
import { computeMortgage, computeLoan, computeCreditCard, computeAutoLoan } from "./finance";

function parseCurrency(value: string): number {
  return Number(value.replace(/[^0-9.-]/g, ""));
}

/** Independently simulates month-by-month amortization to cross-check a payment amount. */
function endingBalanceAfterAmortizing(principal: number, monthlyRate: number, payment: number, months: number): number {
  let balance = principal;
  for (let i = 0; i < months; i++) {
    balance += balance * monthlyRate - payment;
  }
  return balance;
}

describe("computeMortgage", () => {
  it("computes a monthly payment that fully amortizes the loan to ~zero", () => {
    const result = computeMortgage({
      homePrice: 400000,
      downPaymentPercent: 20,
      termYears: 30,
      interestRate: 6.5,
      annualPropertyTax: 0,
      annualInsurance: 0,
    });
    const payment = parseCurrency(result.secondary?.find((s) => s.label === "Principal & interest")?.value ?? "");
    const ending = endingBalanceAfterAmortizing(320000, 0.065 / 12, payment, 360);
    // The displayed payment is rounded to the cent, so simulating 360 months
    // with that rounded figure (rather than the full-precision payment)
    // leaves a small, expected residual - real mortgages handle this with a
    // slightly different final payment. A few dollars confirms the payment
    // is correct; it would be hundreds or thousands off if the formula were wrong.
    expect(Math.abs(ending)).toBeLessThan(5);
  });

  it("adds property tax and insurance on top of principal & interest", () => {
    const result = computeMortgage({
      homePrice: 400000,
      downPaymentPercent: 20,
      termYears: 30,
      interestRate: 6.5,
      annualPropertyTax: 1200,
      annualInsurance: 600,
    });
    const pAndI = parseCurrency(result.secondary?.find((s) => s.label === "Principal & interest")?.value ?? "");
    const total = parseCurrency(result.primary.value);
    expect(total).toBeCloseTo(pAndI + 100 + 50, 1);
  });

  it("reduces the loan amount when down payment increases", () => {
    const low = computeMortgage({ homePrice: 400000, downPaymentPercent: 10, termYears: 30, interestRate: 6.5, annualPropertyTax: 0, annualInsurance: 0 });
    const high = computeMortgage({ homePrice: 400000, downPaymentPercent: 30, termYears: 30, interestRate: 6.5, annualPropertyTax: 0, annualInsurance: 0 });
    expect(parseCurrency(high.primary.value)).toBeLessThan(parseCurrency(low.primary.value));
  });
});

describe("computeLoan", () => {
  it("fully amortizes a personal loan", () => {
    const result = computeLoan({ principal: 20000, interestRate: 8, termMonths: 48 });
    const ending = endingBalanceAfterAmortizing(20000, 0.08 / 12, parseCurrency(result.primary.value), 48);
    expect(Math.abs(ending)).toBeLessThan(1);
  });

  it("charges zero interest with a 0% rate", () => {
    const result = computeLoan({ principal: 12000, interestRate: 0, termMonths: 12 });
    expect(parseCurrency(result.primary.value)).toBeCloseTo(1000, 1);
  });
});

describe("computeCreditCard", () => {
  it("flags balances that can never be paid off", () => {
    const result = computeCreditCard({ balance: 5000, apr: 24, monthlyPayment: 50 });
    expect(result.warnings?.length).toBeGreaterThan(0);
  });

  it("computes a payoff time that empties the balance via simulation", () => {
    const balance = 5000;
    const apr = 22;
    const monthlyPayment = 300;
    const result = computeCreditCard({ balance, apr, monthlyPayment });
    const months = Number(result.secondary?.find((s) => s.label === "Number of payments")?.value);
    const ending = endingBalanceAfterAmortizing(balance, apr / 100 / 12, monthlyPayment, months - 1);
    // One payment short of the final (partial) payment, balance should still be positive but small relative to payment.
    expect(ending).toBeGreaterThan(0);
    expect(ending).toBeLessThan(monthlyPayment);
  });
});

describe("computeAutoLoan", () => {
  it("reduces the loan amount using a trade-in", () => {
    const noTrade = computeAutoLoan({ vehiclePrice: 32000, downPayment: 4000, tradeInValue: 0, salesTaxRate: 6.5, termMonths: 60, interestRate: 7 });
    const withTrade = computeAutoLoan({ vehiclePrice: 32000, downPayment: 4000, tradeInValue: 8000, salesTaxRate: 6.5, termMonths: 60, interestRate: 7 });
    expect(parseCurrency(withTrade.primary.value)).toBeLessThan(parseCurrency(noTrade.primary.value));
  });
});
