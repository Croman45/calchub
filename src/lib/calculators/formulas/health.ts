import type { CalculatorComputeResult, CalculatorInputs } from "../types";
import { formatNumber, num, round, str } from "../utils";

function toKg(weight: number, unit: string): number {
  return unit === "lb" ? weight * 0.45359237 : weight;
}

function toCm(height: number, unit: string): number {
  if (unit === "in") return height * 2.54;
  if (unit === "ft") return height * 30.48;
  return height;
}

export function computeBmi(inputs: CalculatorInputs): CalculatorComputeResult {
  const weightUnit = str(inputs, "weightUnit", "kg");
  const heightUnit = str(inputs, "heightUnit", "cm");
  const weightKg = toKg(num(inputs, "weight", 70), weightUnit);
  const heightCm = toCm(num(inputs, "height", 175), heightUnit);
  const heightM = heightCm / 100;

  const bmi = heightM > 0 ? weightKg / (heightM * heightM) : 0;

  let category = "Normal weight";
  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25) category = "Normal weight";
  else if (bmi < 30) category = "Overweight";
  else category = "Obesity";

  const steps = [
    { label: "1. Convert to metric", detail: `Weight = ${round(weightKg, 1)} kg, height = ${round(heightM, 3)} m.` },
    { label: "2. Apply the BMI formula", detail: `BMI = weight (kg) ÷ height (m)² = ${round(weightKg, 1)} ÷ ${round(heightM, 3)}² = ${round(bmi, 1)}.` },
    { label: "3. Classify", detail: `A BMI of ${round(bmi, 1)} falls in the "${category}" range.` },
  ];

  return {
    primary: { label: "Your BMI", value: round(bmi, 1).toString(), highlight: true },
    secondary: [{ label: "Category", value: category }],
    steps,
    chartData: [
      { name: "Underweight", value: 18.5 },
      { name: "Normal", value: 24.9 },
      { name: "Overweight", value: 29.9 },
      { name: "Obesity", value: 40 },
      { name: "You", value: round(bmi, 1) },
    ],
    chartKeys: ["value"],
    warnings: [
      "BMI is a screening tool, not a diagnosis - it doesn't account for muscle mass, bone density, or body composition.",
    ],
  };
}

export function computeBmr(inputs: CalculatorInputs): CalculatorComputeResult {
  const sex = str(inputs, "sex", "male");
  const weightUnit = str(inputs, "weightUnit", "kg");
  const heightUnit = str(inputs, "heightUnit", "cm");
  const weightKg = toKg(num(inputs, "weight", 70), weightUnit);
  const heightCm = toCm(num(inputs, "height", 175), heightUnit);
  const age = num(inputs, "age", 30);

  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const bmr = sex === "female" ? base - 161 : base + 5;

  const steps = [
    { label: "1. Mifflin-St Jeor equation", detail: sex === "female" ? "BMR = 10×weight + 6.25×height − 5×age − 161" : "BMR = 10×weight + 6.25×height − 5×age + 5" },
    { label: "2. Plug in your numbers", detail: `10×${round(weightKg, 1)} + 6.25×${round(heightCm, 1)} − 5×${age} ${sex === "female" ? "− 161" : "+ 5"}` },
    { label: "3. Result", detail: `BMR ≈ ${formatNumber(bmr, 0)} calories/day at complete rest.` },
  ];

  return {
    primary: { label: "Basal Metabolic Rate", value: `${formatNumber(bmr, 0)} kcal/day`, highlight: true },
    steps,
  };
}

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export function computeCalorie(inputs: CalculatorInputs): CalculatorComputeResult {
  const sex = str(inputs, "sex", "male");
  const weightUnit = str(inputs, "weightUnit", "kg");
  const heightUnit = str(inputs, "heightUnit", "cm");
  const weightKg = toKg(num(inputs, "weight", 70), weightUnit);
  const heightCm = toCm(num(inputs, "height", 175), heightUnit);
  const age = num(inputs, "age", 30);
  const activity = str(inputs, "activityLevel", "moderate");

  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const bmr = sex === "female" ? base - 161 : base + 5;
  const multiplier = ACTIVITY_MULTIPLIERS[activity] ?? 1.55;
  const maintenance = bmr * multiplier;

  const steps = [
    { label: "1. Calculate BMR", detail: `Mifflin-St Jeor BMR ≈ ${formatNumber(bmr, 0)} kcal/day.` },
    { label: "2. Apply activity multiplier", detail: `${formatNumber(bmr, 0)} × ${multiplier} (activity factor) = ${formatNumber(maintenance, 0)} kcal/day.` },
  ];

  return {
    primary: { label: "Maintenance calories", value: `${formatNumber(maintenance, 0)} kcal/day`, highlight: true },
    secondary: [
      { label: "Mild weight loss (-0.5 kg/wk)", value: `${formatNumber(maintenance - 500, 0)} kcal/day` },
      { label: "Mild weight gain (+0.5 kg/wk)", value: `${formatNumber(maintenance + 500, 0)} kcal/day` },
      { label: "Base BMR", value: `${formatNumber(bmr, 0)} kcal/day` },
    ],
    steps,
  };
}

export function computeBodyFat(inputs: CalculatorInputs): CalculatorComputeResult {
  const sex = str(inputs, "sex", "male");
  const heightUnit = str(inputs, "heightUnit", "cm");
  const heightCm = toCm(num(inputs, "height", 175), heightUnit);
  const neck = num(inputs, "neck", 38);
  const waist = num(inputs, "waist", 85);
  const hip = num(inputs, "hip", 95);

  let bodyFat: number;
  if (sex === "female") {
    bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.221 * Math.log10(heightCm)) - 450;
  } else {
    bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(heightCm)) - 450;
  }
  bodyFat = Math.max(bodyFat, 0);

  let category = "Average";
  if (sex === "female") {
    if (bodyFat < 14) category = "Essential fat";
    else if (bodyFat < 21) category = "Athletic";
    else if (bodyFat < 25) category = "Fit";
    else if (bodyFat < 32) category = "Average";
    else category = "Above average";
  } else {
    if (bodyFat < 6) category = "Essential fat";
    else if (bodyFat < 14) category = "Athletic";
    else if (bodyFat < 18) category = "Fit";
    else if (bodyFat < 25) category = "Average";
    else category = "Above average";
  }

  const steps = [
    { label: "1. Method", detail: "U.S. Navy circumference method, using neck, waist" + (sex === "female" ? ", and hip" : "") + " measurements." },
    { label: "2. Apply the formula", detail: sex === "female" ? "495 / (1.29579 − 0.35004×log10(waist+hip−neck) + 0.221×log10(height)) − 450" : "495 / (1.0324 − 0.19077×log10(waist−neck) + 0.15456×log10(height)) − 450" },
    { label: "3. Result", detail: `Estimated body fat ≈ ${round(bodyFat, 1)}% ("${category}").` },
  ];

  return {
    primary: { label: "Estimated body fat", value: `${round(bodyFat, 1)}%`, highlight: true },
    secondary: [{ label: "Category", value: category }],
    steps,
    warnings: [
      "The Navy tape-measure method is an estimate with a typical margin of error of ±3-4% versus lab methods like DEXA.",
    ],
  };
}

export function computeWaterIntake(inputs: CalculatorInputs): CalculatorComputeResult {
  const weightUnit = str(inputs, "weightUnit", "kg");
  const weightKg = toKg(num(inputs, "weight", 70), weightUnit);
  const exerciseMinutes = num(inputs, "exerciseMinutes", 30);
  const climate = str(inputs, "climate", "temperate");

  const baseLiters = weightKg * 0.033;
  const exerciseLiters = (exerciseMinutes / 30) * 0.35;
  const climateBonus = climate === "hot" ? baseLiters * 0.15 : 0;
  const totalLiters = baseLiters + exerciseLiters + climateBonus;

  const steps = [
    { label: "1. Base need", detail: `${round(weightKg, 1)} kg × 33 ml/kg = ${round(baseLiters, 2)} L/day.` },
    { label: "2. Add exercise", detail: `${exerciseMinutes} minutes of exercise ≈ +${round(exerciseLiters, 2)} L.` },
    { label: "3. Climate adjustment", detail: climate === "hot" ? `Hot climate: +15% = +${round(climateBonus, 2)} L.` : "Temperate/cold climate: no adjustment." },
  ];

  return {
    primary: { label: "Daily water intake", value: `${round(totalLiters, 2)} L (${round(totalLiters * 33.814, 0)} oz)`, highlight: true },
    secondary: [
      { label: "Cups (250 ml)", value: `${Math.round((totalLiters * 1000) / 250)} cups` },
    ],
    steps,
    warnings: [
      "General guidance only - needs vary with health conditions, pregnancy, and medication. Ask a doctor for personalized advice.",
    ],
  };
}
