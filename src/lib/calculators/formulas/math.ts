import type { CalculatorComputeResult, CalculatorInputs } from "../types";
import { formatNumber, gcd, lcm, num, round, str } from "../utils";

export function computePercentage(inputs: CalculatorInputs): CalculatorComputeResult {
  const mode = str(inputs, "mode", "percentOf");
  const a = num(inputs, "valueA", 20);
  const b = num(inputs, "valueB", 200);

  if (mode === "percentOf") {
    const result = (a / 100) * b;
    return {
      primary: { label: `${a}% of ${b}`, value: formatNumber(result, 4), highlight: true },
      steps: [
        { label: "1. Formula", detail: "result = (percentage ÷ 100) × value" },
        { label: "2. Plug in", detail: `(${a} ÷ 100) × ${b} = ${formatNumber(result, 4)}` },
      ],
    };
  }

  if (mode === "isWhatPercent") {
    const result = b !== 0 ? (a / b) * 100 : 0;
    return {
      primary: { label: `${a} is what % of ${b}`, value: `${formatNumber(result, 4)}%`, highlight: true },
      steps: [
        { label: "1. Formula", detail: "percentage = (part ÷ whole) × 100" },
        { label: "2. Plug in", detail: `(${a} ÷ ${b}) × 100 = ${formatNumber(result, 4)}%` },
      ],
    };
  }

  // percentChange
  const change = a !== 0 ? ((b - a) / Math.abs(a)) * 100 : 0;
  const direction = change >= 0 ? "increase" : "decrease";
  return {
    primary: { label: "Percentage change", value: `${formatNumber(Math.abs(change), 4)}% ${direction}`, highlight: true },
    steps: [
      { label: "1. Formula", detail: "change % = ((new − old) ÷ |old|) × 100" },
      { label: "2. Plug in", detail: `((${b} − ${a}) ÷ |${a}|) × 100 = ${formatNumber(change, 4)}%` },
    ],
  };
}

function simplifyFraction(n: number, d: number): [number, number] {
  if (d === 0) return [n, 0];
  const divisor = gcd(n, d);
  let num1 = n / divisor;
  let den1 = d / divisor;
  if (den1 < 0) {
    num1 = -num1;
    den1 = -den1;
  }
  return [num1, den1];
}

export function computeFraction(inputs: CalculatorInputs): CalculatorComputeResult {
  const n1 = num(inputs, "numerator1", 1);
  const d1 = num(inputs, "denominator1", 2);
  const op = str(inputs, "operation", "add");
  const n2 = num(inputs, "numerator2", 1);
  const d2 = num(inputs, "denominator2", 3);

  let resultN: number;
  let resultD: number;
  let symbol = "+";

  switch (op) {
    case "subtract":
      symbol = "−";
      resultN = n1 * d2 - n2 * d1;
      resultD = d1 * d2;
      break;
    case "multiply":
      symbol = "×";
      resultN = n1 * n2;
      resultD = d1 * d2;
      break;
    case "divide":
      symbol = "÷";
      resultN = n1 * d2;
      resultD = d1 * n2;
      break;
    default:
      resultN = n1 * d2 + n2 * d1;
      resultD = d1 * d2;
  }

  const [simplifiedN, simplifiedD] = simplifyFraction(resultN, resultD);
  const decimal = simplifiedD !== 0 ? simplifiedN / simplifiedD : 0;

  return {
    primary: { label: "Result", value: `${simplifiedN}/${simplifiedD}`, highlight: true },
    secondary: [{ label: "Decimal equivalent", value: formatNumber(decimal, 6) }],
    steps: [
      { label: "1. Set up the operation", detail: `${n1}/${d1} ${symbol} ${n2}/${d2}` },
      { label: "2. Combine", detail: `= ${resultN}/${resultD}` },
      { label: "3. Simplify using GCD", detail: `GCD(${Math.abs(resultN)}, ${Math.abs(resultD)}) = ${gcd(resultN, resultD)} → ${simplifiedN}/${simplifiedD}` },
    ],
  };
}

export function computeDecimalToFraction(inputs: CalculatorInputs): CalculatorComputeResult {
  const decimal = num(inputs, "decimal", 0.75);
  const isNegative = decimal < 0;
  const abs = Math.abs(decimal);

  const decimalStr = abs.toString();
  const decimalPlaces = decimalStr.includes(".") ? decimalStr.split(".")[1].length : 0;
  const denominator = Math.pow(10, Math.min(decimalPlaces, 10));
  const numerator = Math.round(abs * denominator);

  const [simplifiedN, simplifiedD] = simplifyFraction(numerator, denominator);
  const signedN = isNegative ? -simplifiedN : simplifiedN;
  const percent = decimal * 100;

  return {
    primary: { label: "As a fraction", value: `${signedN}/${simplifiedD}`, highlight: true },
    secondary: [{ label: "As a percentage", value: `${formatNumber(percent, 4)}%` }],
    steps: [
      { label: "1. Write over a power of 10", detail: `${abs} = ${numerator}/${denominator}` },
      { label: "2. Simplify using GCD", detail: `GCD(${numerator}, ${denominator}) = ${gcd(numerator, denominator)} → ${simplifiedN}/${simplifiedD}` },
    ],
  };
}

function primeFactorize(nInput: number): number[] {
  let n = Math.abs(Math.round(nInput));
  const factors: number[] = [];
  let divisor = 2;
  while (divisor * divisor <= n) {
    while (n % divisor === 0) {
      factors.push(divisor);
      n /= divisor;
    }
    divisor++;
  }
  if (n > 1) factors.push(n);
  return factors;
}

function isPrime(nInput: number): boolean {
  const n = Math.round(nInput);
  if (n < 2) return false;
  if (n < 4) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

export function computePrimeNumber(inputs: CalculatorInputs): CalculatorComputeResult {
  const n = Math.round(num(inputs, "number", 97));
  const prime = isPrime(n);
  const factors = primeFactorize(n);

  let nextPrime = n + 1;
  while (!isPrime(nextPrime)) nextPrime++;
  let prevPrime = n - 1;
  while (prevPrime > 1 && !isPrime(prevPrime)) prevPrime--;

  const factorization = factors.length > 0 ? factors.join(" × ") : "n/a";

  return {
    primary: { label: `Is ${n} prime?`, value: prime ? "Yes" : "No", highlight: true },
    secondary: [
      { label: "Prime factorization", value: prime ? `${n} (itself)` : factorization },
      { label: "Next prime", value: String(nextPrime) },
      { label: "Previous prime", value: prevPrime > 1 ? String(prevPrime) : "none" },
    ],
    steps: [
      { label: "1. Trial division", detail: `Check divisibility by every integer from 2 up to √${n} ≈ ${round(Math.sqrt(n), 2)}.` },
      { label: "2. Result", detail: prime ? `No divisors found - ${n} is prime.` : `${n} = ${factorization}.` },
    ],
  };
}

export function computeGcd(inputs: CalculatorInputs): CalculatorComputeResult {
  const a = Math.round(num(inputs, "numberA", 48));
  const b = Math.round(num(inputs, "numberB", 18));

  const steps: { label: string; detail: string }[] = [];
  let x = Math.abs(a);
  let y = Math.abs(b);
  let stepNum = 1;
  while (y !== 0) {
    const remainder = x % y;
    steps.push({ label: `Step ${stepNum}`, detail: `${x} = ${Math.floor(x / y)} × ${y} + ${remainder}` });
    x = y;
    y = remainder;
    stepNum++;
  }

  const result = gcd(a, b);

  return {
    primary: { label: "Greatest Common Divisor", value: String(result), highlight: true },
    secondary: [
      { label: `${a} ÷ GCD`, value: String(a / result) },
      { label: `${b} ÷ GCD`, value: String(b / result) },
    ],
    steps: [{ label: "Method", detail: "Euclidean algorithm: repeatedly replace the larger number with the remainder of dividing it by the smaller, until the remainder is 0." }, ...steps],
  };
}

export function computeLcm(inputs: CalculatorInputs): CalculatorComputeResult {
  const a = Math.round(num(inputs, "numberA", 4));
  const b = Math.round(num(inputs, "numberB", 6));
  const g = gcd(a, b);
  const result = lcm(a, b);

  return {
    primary: { label: "Least Common Multiple", value: String(result), highlight: true },
    steps: [
      { label: "1. Find the GCD first", detail: `GCD(${a}, ${b}) = ${g}` },
      { label: "2. Apply the LCM formula", detail: `LCM = (|a × b|) ÷ GCD(a, b) = (${a} × ${b}) ÷ ${g} = ${result}` },
    ],
  };
}
