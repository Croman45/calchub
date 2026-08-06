import { describe, it, expect } from "vitest";
import { computeBmi, computeBmr, computeCalorie, computeWaterIntake } from "./health";

describe("computeBmi", () => {
  it("matches the standard formula for 70kg / 175cm", () => {
    const result = computeBmi({ weight: 70, weightUnit: "kg", height: 175, heightUnit: "cm" });
    // 70 / 1.75^2 = 22.857...
    expect(result.primary.value).toBe("22.9");
    expect(result.secondary?.[0].value).toBe("Normal weight");
  });

  it("converts pounds and inches correctly", () => {
    const metric = computeBmi({ weight: 70, weightUnit: "kg", height: 175, heightUnit: "cm" });
    const imperial = computeBmi({ weight: 70 / 0.45359237, weightUnit: "lb", height: 175 / 2.54, heightUnit: "in" });
    expect(imperial.primary.value).toBe(metric.primary.value);
  });

  it("classifies underweight and obesity ranges", () => {
    const underweight = computeBmi({ weight: 45, weightUnit: "kg", height: 175, heightUnit: "cm" });
    const obese = computeBmi({ weight: 110, weightUnit: "kg", height: 175, heightUnit: "cm" });
    expect(underweight.secondary?.[0].value).toBe("Underweight");
    expect(obese.secondary?.[0].value).toBe("Obesity");
  });
});

describe("computeBmr", () => {
  it("matches the Mifflin-St Jeor equation for men", () => {
    // 10*70 + 6.25*175 - 5*30 + 5 = 700 + 1093.75 - 150 + 5 = 1648.75
    const result = computeBmr({ sex: "male", weight: 70, weightUnit: "kg", height: 175, heightUnit: "cm", age: 30 });
    expect(result.primary.value).toBe("1,649 kcal/day");
  });

  it("matches the Mifflin-St Jeor equation for women", () => {
    // 10*60 + 6.25*165 - 5*25 - 161 = 600 + 1031.25 - 125 - 161 = 1345.25
    const result = computeBmr({ sex: "female", weight: 60, weightUnit: "kg", height: 165, heightUnit: "cm", age: 25 });
    expect(result.primary.value).toBe("1,345 kcal/day");
  });
});

describe("computeCalorie", () => {
  it("applies the activity multiplier on top of BMR", () => {
    const bmr = computeBmr({ sex: "male", weight: 70, weightUnit: "kg", height: 175, heightUnit: "cm", age: 30 });
    const calorie = computeCalorie({ sex: "male", weight: 70, weightUnit: "kg", height: 175, heightUnit: "cm", age: 30, activityLevel: "sedentary" });
    const bmrValue = Number(bmr.primary.value.replace(/[^0-9.]/g, ""));
    const calorieValue = Number(calorie.primary.value.replace(/[^0-9.]/g, ""));
    expect(calorieValue).toBeCloseTo(bmrValue * 1.2, 0);
  });
});

describe("computeWaterIntake", () => {
  it("scales base intake with body weight", () => {
    const result = computeWaterIntake({ weight: 70, weightUnit: "kg", exerciseMinutes: 0, climate: "temperate" });
    // 70 * 0.033 = 2.31 L
    expect(result.primary.value).toContain("2.31");
  });

  it("adds a climate bonus for hot climates", () => {
    const temperate = computeWaterIntake({ weight: 70, weightUnit: "kg", exerciseMinutes: 0, climate: "temperate" });
    const hot = computeWaterIntake({ weight: 70, weightUnit: "kg", exerciseMinutes: 0, climate: "hot" });
    const temperateValue = Number(temperate.primary.value.match(/[\d.]+/)?.[0]);
    const hotValue = Number(hot.primary.value.match(/[\d.]+/)?.[0]);
    expect(hotValue).toBeGreaterThan(temperateValue);
  });
});
