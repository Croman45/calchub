import type { CalculatorComputeResult, CalculatorInputs } from "../types";
import { formatCurrency, num, round } from "../utils";

/** Standard amortizing-loan monthly payment formula. */
function monthlyPayment(principal: number, monthlyRate: number, numPayments: number): number {
  if (principal <= 0 || numPayments <= 0) return 0;
  if (monthlyRate === 0) return principal / numPayments;
  const factor = Math.pow(1 + monthlyRate, numPayments);
  return (principal * monthlyRate * factor) / (factor - 1);
}

export function computeMortgage(inputs: CalculatorInputs): CalculatorComputeResult {
  const homePrice = num(inputs, "homePrice", 400000);
  const downPaymentPercent = num(inputs, "downPaymentPercent", 20);
  const termYears = num(inputs, "termYears", 30);
  const annualRate = num(inputs, "interestRate", 6.5);
  const annualPropertyTax = num(inputs, "annualPropertyTax", 0);
  const annualInsurance = num(inputs, "annualInsurance", 0);

  const downPayment = homePrice * (downPaymentPercent / 100);
  const principal = Math.max(homePrice - downPayment, 0);
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;

  const pAndI = monthlyPayment(principal, monthlyRate, numPayments);
  const monthlyTax = annualPropertyTax / 12;
  const monthlyInsurance = annualInsurance / 12;
  const totalMonthly = pAndI + monthlyTax + monthlyInsurance;

  const totalPaid = pAndI * numPayments;
  const totalInterest = totalPaid - principal;

  const chartData = [
    { name: "Principal", value: round(principal) },
    { name: "Total interest", value: round(Math.max(totalInterest, 0)) },
  ];

  const steps = [
    { label: "1. Loan amount", detail: `${formatCurrency(homePrice)} home − ${formatCurrency(downPayment)} down payment (${downPaymentPercent}%) = ${formatCurrency(principal)} loan principal.` },
    { label: "2. Monthly rate", detail: `${annualRate}% annual ÷ 12 = ${round(monthlyRate * 100, 4)}% per month (${monthlyRate.toFixed(6)} as a decimal).` },
    { label: "3. Number of payments", detail: `${termYears} years × 12 = ${numPayments} monthly payments.` },
    { label: "4. Payment formula", detail: `M = P × [r(1+r)^n] / [(1+r)^n − 1] = ${formatCurrency(pAndI)} principal & interest per month.` },
    { label: "5. Add escrow", detail: `+ ${formatCurrency(monthlyTax)} property tax + ${formatCurrency(monthlyInsurance)} insurance = ${formatCurrency(totalMonthly)} total monthly payment.` },
  ];

  return {
    primary: { label: "Total monthly payment", value: formatCurrency(totalMonthly), highlight: true },
    secondary: [
      { label: "Principal & interest", value: formatCurrency(pAndI) },
      { label: "Loan amount", value: formatCurrency(principal) },
      { label: "Down payment", value: formatCurrency(downPayment) },
      { label: "Total interest paid", value: formatCurrency(Math.max(totalInterest, 0)) },
      { label: "Total cost of loan", value: formatCurrency(totalPaid) },
    ],
    steps,
    chartData,
    chartKeys: ["value"],
  };
}

export function computeLoan(inputs: CalculatorInputs): CalculatorComputeResult {
  const principal = num(inputs, "principal", 20000);
  const annualRate = num(inputs, "interestRate", 8);
  const termMonths = num(inputs, "termMonths", 48);

  const monthlyRate = annualRate / 100 / 12;
  const payment = monthlyPayment(principal, monthlyRate, termMonths);
  const totalPaid = payment * termMonths;
  const totalInterest = totalPaid - principal;

  const steps = [
    { label: "1. Monthly rate", detail: `${annualRate}% ÷ 12 = ${round(monthlyRate * 100, 4)}% per month.` },
    { label: "2. Apply amortization formula", detail: `M = P × [r(1+r)^n] / [(1+r)^n − 1] using P = ${formatCurrency(principal)}, n = ${termMonths} months.` },
    { label: "3. Result", detail: `Monthly payment = ${formatCurrency(payment)}.` },
    { label: "4. Total interest", detail: `${formatCurrency(payment)} × ${termMonths} − ${formatCurrency(principal)} = ${formatCurrency(Math.max(totalInterest, 0))}.` },
  ];

  return {
    primary: { label: "Monthly payment", value: formatCurrency(payment), highlight: true },
    secondary: [
      { label: "Total interest", value: formatCurrency(Math.max(totalInterest, 0)) },
      { label: "Total amount paid", value: formatCurrency(totalPaid) },
      { label: "Loan principal", value: formatCurrency(principal) },
    ],
    steps,
    chartData: [
      { name: "Principal", value: round(principal) },
      { name: "Interest", value: round(Math.max(totalInterest, 0)) },
    ],
    chartKeys: ["value"],
  };
}

export function computeCompoundInterest(inputs: CalculatorInputs): CalculatorComputeResult {
  const principal = num(inputs, "principal", 10000);
  const annualRate = num(inputs, "interestRate", 7);
  const timesPerYear = num(inputs, "compoundFrequency", 12);
  const years = num(inputs, "years", 10);
  const monthlyContribution = num(inputs, "monthlyContribution", 0);

  const r = annualRate / 100;
  const n = timesPerYear;

  // Contributions are modeled monthly regardless of compounding frequency,
  // using an effective periodic rate matched to a monthly step for a close,
  // standard approximation used by most consumer finance calculators.
  const months = Math.round(years * 12);
  const monthlyRate = Math.pow(1 + r / n, n / 12) - 1;
  const chartData: { name: string; balance: number; contributions: number }[] = [];
  let runningTotal = principal;
  let totalContributed = principal;

  for (let m = 1; m <= months; m++) {
    runningTotal = runningTotal * (1 + monthlyRate) + monthlyContribution;
    totalContributed += monthlyContribution;
    if (m % 12 === 0 || m === months) {
      chartData.push({
        name: `Year ${Math.ceil(m / 12)}`,
        balance: round(runningTotal),
        contributions: round(totalContributed),
      });
    }
  }
  const contributionsFV = runningTotal;

  const totalGrowth = contributionsFV - totalContributed;

  const steps = [
    { label: "1. Convert rate", detail: `${annualRate}% annual → periodic rate compounded ${timesPerYear}×/year.` },
    { label: "2. Apply compound growth monthly", detail: `Balance compounds every month at the equivalent monthly rate, and ${formatCurrency(monthlyContribution)} is added each month.` },
    { label: "3. Run forward", detail: `Over ${years} years (${months} months), starting from ${formatCurrency(principal)}.` },
    { label: "4. Result", detail: `Final balance = ${formatCurrency(contributionsFV)}, of which ${formatCurrency(totalGrowth)} is interest earned.` },
  ];

  return {
    primary: { label: "Future value", value: formatCurrency(contributionsFV), highlight: true },
    secondary: [
      { label: "Total contributed", value: formatCurrency(totalContributed) },
      { label: "Total interest earned", value: formatCurrency(Math.max(totalGrowth, 0)) },
      { label: "Starting principal", value: formatCurrency(principal) },
    ],
    steps,
    chartData,
    chartKeys: ["balance", "contributions"],
  };
}

export function computeSavings(inputs: CalculatorInputs): CalculatorComputeResult {
  const initialDeposit = num(inputs, "initialDeposit", 1000);
  const monthlyContribution = num(inputs, "monthlyContribution", 200);
  const annualRate = num(inputs, "interestRate", 4);
  const years = num(inputs, "years", 5);

  const monthlyRate = annualRate / 100 / 12;
  const months = Math.round(years * 12);

  let balance = initialDeposit;
  let contributed = initialDeposit;
  const chartData: { name: string; balance: number }[] = [];
  for (let m = 1; m <= months; m++) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    contributed += monthlyContribution;
    if (m % 12 === 0 || m === months) {
      chartData.push({ name: `Year ${Math.ceil(m / 12)}`, balance: round(balance) });
    }
  }

  const interestEarned = balance - contributed;

  const steps = [
    { label: "1. Start", detail: `Initial deposit of ${formatCurrency(initialDeposit)}.` },
    { label: "2. Add monthly", detail: `${formatCurrency(monthlyContribution)} added every month for ${months} months, earning ${annualRate}% APY.` },
    { label: "3. Result", detail: `Ending balance = ${formatCurrency(balance)}, including ${formatCurrency(Math.max(interestEarned, 0))} in interest.` },
  ];

  return {
    primary: { label: "Ending balance", value: formatCurrency(balance), highlight: true },
    secondary: [
      { label: "Total deposited", value: formatCurrency(contributed) },
      { label: "Interest earned", value: formatCurrency(Math.max(interestEarned, 0)) },
    ],
    steps,
    chartData,
    chartKeys: ["balance"],
  };
}

export function computeInvestment(inputs: CalculatorInputs): CalculatorComputeResult {
  const initialInvestment = num(inputs, "initialInvestment", 5000);
  const annualContribution = num(inputs, "annualContribution", 3000);
  const annualReturn = num(inputs, "expectedReturn", 8);
  const years = num(inputs, "years", 20);

  const r = annualReturn / 100;
  let balance = initialInvestment;
  let contributed = initialInvestment;
  const chartData: { name: string; balance: number; contributions: number }[] = [];

  for (let y = 1; y <= years; y++) {
    balance = balance * (1 + r) + annualContribution;
    contributed += annualContribution;
    chartData.push({ name: `Year ${y}`, balance: round(balance), contributions: round(contributed) });
  }

  const growth = balance - contributed;

  const steps = [
    { label: "1. Start", detail: `Initial investment of ${formatCurrency(initialInvestment)}.` },
    { label: "2. Grow and contribute annually", detail: `Balance grows ${annualReturn}% per year and gains ${formatCurrency(annualContribution)} in new contributions each year.` },
    { label: "3. Result after " + years + " years", detail: `Final value = ${formatCurrency(balance)}, of which ${formatCurrency(Math.max(growth, 0))} is investment growth.` },
  ];

  return {
    primary: { label: "Projected value", value: formatCurrency(balance), highlight: true },
    secondary: [
      { label: "Total contributed", value: formatCurrency(contributed) },
      { label: "Total growth", value: formatCurrency(Math.max(growth, 0)) },
    ],
    steps,
    chartData,
    chartKeys: ["balance", "contributions"],
    warnings: [
      "Assumes a constant annual return, which real markets never deliver in a straight line - use this as a long-run planning estimate, not a guarantee.",
    ],
  };
}

export function computeCreditCard(inputs: CalculatorInputs): CalculatorComputeResult {
  const balance = num(inputs, "balance", 5000);
  const apr = num(inputs, "apr", 22);
  const monthlyPaymentAmount = num(inputs, "monthlyPayment", 200);

  const monthlyRate = apr / 100 / 12;
  const minRequiredPayment = balance * monthlyRate;

  if (monthlyPaymentAmount <= minRequiredPayment) {
    return {
      primary: { label: "This balance will never be paid off", value: "Increase your payment", highlight: true },
      secondary: [
        { label: "Minimum interest-covering payment", value: formatCurrency(minRequiredPayment) },
        { label: "Your planned payment", value: formatCurrency(monthlyPaymentAmount) },
      ],
      warnings: [
        `A payment of ${formatCurrency(monthlyPaymentAmount)} doesn't even cover the ${formatCurrency(minRequiredPayment)} in monthly interest, so the balance will grow forever. Increase the payment above ${formatCurrency(minRequiredPayment)}.`,
      ],
    };
  }

  const months = -Math.log(1 - (monthlyRate * balance) / monthlyPaymentAmount) / Math.log(1 + monthlyRate);
  const monthsRounded = Math.ceil(months);
  const totalPaid = monthlyPaymentAmount * (monthsRounded - 1) + Math.min(monthlyPaymentAmount, balance * Math.pow(1 + monthlyRate, monthsRounded));
  const totalInterest = totalPaid - balance;

  const years = Math.floor(monthsRounded / 12);
  const remMonths = monthsRounded % 12;
  const timeLabel = years > 0 ? `${years}y ${remMonths}mo` : `${remMonths} months`;

  const steps = [
    { label: "1. Monthly interest rate", detail: `${apr}% APR ÷ 12 = ${round(monthlyRate * 100, 4)}% per month.` },
    { label: "2. Solve for payoff time", detail: `n = −ln(1 − r·B / A) / ln(1 + r), with B = ${formatCurrency(balance)}, A = ${formatCurrency(monthlyPaymentAmount)}.` },
    { label: "3. Result", detail: `It takes about ${monthsRounded} months (${timeLabel}) to pay off, costing roughly ${formatCurrency(Math.max(totalInterest, 0))} in interest.` },
  ];

  return {
    primary: { label: "Time to pay off", value: timeLabel, highlight: true },
    secondary: [
      { label: "Total interest paid", value: formatCurrency(Math.max(totalInterest, 0)) },
      { label: "Total paid", value: formatCurrency(totalPaid) },
      { label: "Number of payments", value: String(monthsRounded) },
    ],
    steps,
  };
}

export function computeAutoLoan(inputs: CalculatorInputs): CalculatorComputeResult {
  const vehiclePrice = num(inputs, "vehiclePrice", 32000);
  const downPayment = num(inputs, "downPayment", 4000);
  const tradeInValue = num(inputs, "tradeInValue", 0);
  const salesTaxRate = num(inputs, "salesTaxRate", 6.5);
  const termMonths = num(inputs, "termMonths", 60);
  const annualRate = num(inputs, "interestRate", 7);

  const taxableAmount = Math.max(vehiclePrice - tradeInValue, 0);
  const salesTax = taxableAmount * (salesTaxRate / 100);
  const loanAmount = Math.max(vehiclePrice + salesTax - downPayment - tradeInValue, 0);

  const monthlyRate = annualRate / 100 / 12;
  const payment = monthlyPayment(loanAmount, monthlyRate, termMonths);
  const totalPaid = payment * termMonths;
  const totalInterest = totalPaid - loanAmount;

  const steps = [
    { label: "1. Sales tax", detail: `${formatCurrency(taxableAmount)} taxable amount × ${salesTaxRate}% = ${formatCurrency(salesTax)}.` },
    { label: "2. Loan amount", detail: `${formatCurrency(vehiclePrice)} price + ${formatCurrency(salesTax)} tax − ${formatCurrency(downPayment)} down − ${formatCurrency(tradeInValue)} trade-in = ${formatCurrency(loanAmount)}.` },
    { label: "3. Monthly payment", detail: `Amortized over ${termMonths} months at ${annualRate}% APR = ${formatCurrency(payment)}/month.` },
  ];

  return {
    primary: { label: "Monthly payment", value: formatCurrency(payment), highlight: true },
    secondary: [
      { label: "Loan amount", value: formatCurrency(loanAmount) },
      { label: "Total interest", value: formatCurrency(Math.max(totalInterest, 0)) },
      { label: "Total cost", value: formatCurrency(totalPaid + downPayment) },
    ],
    steps,
    chartData: [
      { name: "Loan amount", value: round(loanAmount) },
      { name: "Interest", value: round(Math.max(totalInterest, 0)) },
    ],
    chartKeys: ["value"],
  };
}
