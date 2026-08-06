import type { CategorySlug } from "@/lib/calculators/types";

export interface CategoryMeta {
  slug: CategorySlug;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: "finance",
    name: "Finance",
    description:
      "Mortgage, loan, interest, and investment calculators to plan your money with confidence.",
    icon: "Landmark",
    color: "emerald",
  },
  {
    slug: "health",
    name: "Health",
    description:
      "BMI, calorie, BMR, and body composition calculators grounded in trusted medical formulas.",
    icon: "HeartPulse",
    color: "rose",
  },
  {
    slug: "math",
    name: "Math",
    description:
      "Percentage, scientific, fraction, and number theory calculators for school and work.",
    icon: "Sigma",
    color: "indigo",
  },
  {
    slug: "construction",
    name: "Construction",
    description:
      "Concrete, paint, flooring, and tile calculators to estimate materials accurately.",
    icon: "HardHat",
    color: "amber",
  },
  {
    slug: "education",
    name: "Education",
    description: "Grade, GPA, and study-planning calculators for students and teachers.",
    icon: "GraduationCap",
    color: "sky",
  },
  {
    slug: "conversions",
    name: "Conversions",
    description:
      "Length, weight, temperature, area, volume, and speed unit converters.",
    icon: "ArrowLeftRight",
    color: "violet",
  },
  {
    slug: "time",
    name: "Time",
    description: "Age, date difference, and countdown calculators for everyday planning.",
    icon: "Clock",
    color: "cyan",
  },
  {
    slug: "fitness",
    name: "Fitness",
    description: "Pace, heart-rate, and training calculators to support your workouts.",
    icon: "Dumbbell",
    color: "orange",
  },
  {
    slug: "everyday",
    name: "Everyday",
    description: "Tip, discount, and day-to-day calculators for quick real-world answers.",
    icon: "ShoppingCart",
    color: "teal",
  },
  {
    slug: "business",
    name: "Business",
    description: "Margin, break-even, and payroll calculators for running a business.",
    icon: "Briefcase",
    color: "blue",
  },
  {
    slug: "science",
    name: "Science",
    description: "Physics and chemistry calculators for classroom and lab work.",
    icon: "FlaskConical",
    color: "fuchsia",
  },
];

export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
