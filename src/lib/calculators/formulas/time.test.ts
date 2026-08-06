import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { computeAge, computeDateDifference, computeCountdown } from "./time";

describe("computeAge", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-06T12:00:00"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("computes exact years/months/days for a birth date", () => {
    const result = computeAge({ birthDate: "2000-01-01" });
    expect(result.primary.value).toBe("26 years, 7 months, 5 days");
  });

  it("computes days until next birthday", () => {
    const result = computeAge({ birthDate: "2000-08-10" });
    const daysToNext = result.secondary?.find((s) => s.label === "Days until next birthday")?.value;
    // "Now" is fixed at 2026-08-06T12:00; the next Aug 10 birthday is 3.5 days
    // away, which totalDaysBetween floors down to 3 whole days.
    expect(daysToNext).toBe("3");
  });
});

describe("computeDateDifference", () => {
  it("computes the difference between two dates regardless of order", () => {
    const forward = computeDateDifference({ startDate: "2024-01-01", endDate: "2024-12-31" });
    const backward = computeDateDifference({ startDate: "2024-12-31", endDate: "2024-01-01" });
    expect(forward.primary.value).toBe(backward.primary.value);
    expect(forward.primary.value).toBe("0y 11m 30d");
  });

  it("counts total days correctly across a leap year", () => {
    const result = computeDateDifference({ startDate: "2024-01-01", endDate: "2024-12-31" });
    expect(result.secondary?.find((s) => s.label === "Total days")?.value).toBe("365");
  });
});

describe("computeCountdown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("counts down to a future date", () => {
    const result = computeCountdown({ targetDate: "2026-01-02", targetTime: "00:00" });
    expect(result.primary.label).toBe("Time remaining");
    expect(result.primary.value).toBe("1d 0h 0m 0s");
  });

  it("switches to 'time since' for a past date", () => {
    const result = computeCountdown({ targetDate: "2025-12-31", targetTime: "00:00" });
    expect(result.primary.label).toBe("Time since");
  });
});
