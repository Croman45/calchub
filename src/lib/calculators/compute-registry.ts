import type { CalculatorComputeFn } from "./types";
import * as finance from "./formulas/finance";
import * as health from "./formulas/health";
import * as math from "./formulas/math";
import * as conversions from "./formulas/conversions";
import * as time from "./formulas/time";
import * as construction from "./formulas/construction";

/**
 * Maps a calculator's JSON config `slug` to the pure function that computes
 * its result. This is the one place (besides the JSON config itself) that
 * needs a code change when adding a calculator whose math can't be expressed
 * declaratively - registering it here is what makes it live on its page.
 */
export const COMPUTE_REGISTRY: Record<string, CalculatorComputeFn> = {
  // Finance
  mortgage: finance.computeMortgage,
  loan: finance.computeLoan,
  "compound-interest": finance.computeCompoundInterest,
  savings: finance.computeSavings,
  investment: finance.computeInvestment,
  "credit-card-payoff": finance.computeCreditCard,
  "auto-loan": finance.computeAutoLoan,

  // Health
  bmi: health.computeBmi,
  calorie: health.computeCalorie,
  bmr: health.computeBmr,
  "body-fat": health.computeBodyFat,
  "water-intake": health.computeWaterIntake,

  // Math
  percentage: math.computePercentage,
  fraction: math.computeFraction,
  "decimal-to-fraction": math.computeDecimalToFraction,
  "prime-number": math.computePrimeNumber,
  gcd: math.computeGcd,
  lcm: math.computeLcm,

  // Conversions
  "length-conversion": conversions.computeLengthConversion,
  "weight-conversion": conversions.computeWeightConversion,
  "temperature-conversion": conversions.computeTemperatureConversion,
  "area-conversion": conversions.computeAreaConversion,
  "volume-conversion": conversions.computeVolumeConversion,
  "speed-conversion": conversions.computeSpeedConversion,

  // Time
  age: time.computeAge,
  "date-difference": time.computeDateDifference,
  countdown: time.computeCountdown,

  // Construction
  concrete: construction.computeConcrete,
  paint: construction.computePaint,
  flooring: construction.computeFlooring,
  tile: construction.computeTile,
};

export function getComputeFn(slug: string): CalculatorComputeFn | undefined {
  return COMPUTE_REGISTRY[slug];
}
