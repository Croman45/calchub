import type { CalculatorComputeResult, CalculatorInputs } from "../types";
import { str } from "../utils";

function parseDate(value: string): Date {
  const d = new Date(value + "T00:00:00");
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

interface YMD {
  years: number;
  months: number;
  days: number;
}

function diffYMD(startInput: Date, endInput: Date): YMD {
  let start = startInput;
  let end = endInput;
  if (end < start) [start, end] = [end, start];

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

function totalDaysBetween(a: Date, b: Date): number {
  const msPerDay = 86_400_000;
  return Math.floor(Math.abs(b.getTime() - a.getTime()) / msPerDay);
}

export function computeAge(inputs: CalculatorInputs): CalculatorComputeResult {
  const birthDate = parseDate(str(inputs, "birthDate", "2000-01-01"));
  const now = new Date();

  const { years, months, days } = diffYMD(birthDate, now);
  const totalDays = totalDaysBetween(birthDate, now);

  const nextBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBirthday < now) nextBirthday.setFullYear(now.getFullYear() + 1);
  const daysToNextBirthday = totalDaysBetween(now, nextBirthday);

  return {
    primary: { label: "Your age", value: `${years} years, ${months} months, ${days} days`, highlight: true },
    secondary: [
      { label: "Total days lived", value: totalDays.toLocaleString("en-US") },
      { label: "Total weeks lived", value: Math.floor(totalDays / 7).toLocaleString("en-US") },
      { label: "Days until next birthday", value: String(daysToNextBirthday) },
    ],
    steps: [
      { label: "1. Calendar difference", detail: `From ${birthDate.toDateString()} to ${now.toDateString()} is ${years} years, ${months} months, and ${days} days.` },
      { label: "2. Total days", detail: `The same span is ${totalDays.toLocaleString("en-US")} days in total.` },
    ],
  };
}

export function computeDateDifference(inputs: CalculatorInputs): CalculatorComputeResult {
  const startDate = parseDate(str(inputs, "startDate", "2024-01-01"));
  const endDate = parseDate(str(inputs, "endDate", "2024-12-31"));

  const { years, months, days } = diffYMD(startDate, endDate);
  const totalDays = totalDaysBetween(startDate, endDate);

  return {
    primary: { label: "Difference", value: `${years}y ${months}m ${days}d`, highlight: true },
    secondary: [
      { label: "Total days", value: totalDays.toLocaleString("en-US") },
      { label: "Total weeks", value: `${Math.floor(totalDays / 7)} weeks, ${totalDays % 7} days` },
      { label: "Total months (approx.)", value: String(years * 12 + months) },
    ],
    steps: [
      { label: "1. Order the dates", detail: `Earlier: ${startDate < endDate ? startDate.toDateString() : endDate.toDateString()}. Later: ${startDate < endDate ? endDate.toDateString() : startDate.toDateString()}.` },
      { label: "2. Calendar breakdown", detail: `${years} years, ${months} months, ${days} days apart.` },
      { label: "3. Total days", detail: `Equivalent to ${totalDays.toLocaleString("en-US")} days.` },
    ],
  };
}

export function computeCountdown(inputs: CalculatorInputs): CalculatorComputeResult {
  const targetDate = str(inputs, "targetDate", "2030-01-01");
  const targetTime = str(inputs, "targetTime", "00:00");
  const target = new Date(`${targetDate}T${targetTime || "00:00"}:00`);
  const now = new Date();

  const diffMs = target.getTime() - now.getTime();
  const isPast = diffMs < 0;
  const absMs = Math.abs(diffMs);

  const days = Math.floor(absMs / 86_400_000);
  const hours = Math.floor((absMs % 86_400_000) / 3_600_000);
  const minutes = Math.floor((absMs % 3_600_000) / 60_000);
  const seconds = Math.floor((absMs % 60_000) / 1000);

  return {
    primary: {
      label: isPast ? "Time since" : "Time remaining",
      value: `${days}d ${hours}h ${minutes}m ${seconds}s`,
      highlight: true,
    },
    secondary: [
      { label: "Target", value: target.toLocaleString("en-US") },
      { label: "Total hours", value: Math.floor(absMs / 3_600_000).toLocaleString("en-US") },
      { label: "Total minutes", value: Math.floor(absMs / 60_000).toLocaleString("en-US") },
    ],
    steps: [
      { label: "1. Compute the gap", detail: `${isPast ? "Now minus target" : "Target minus now"} = ${absMs.toLocaleString("en-US")} milliseconds.` },
      { label: "2. Break into units", detail: `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds.` },
    ],
  };
}
