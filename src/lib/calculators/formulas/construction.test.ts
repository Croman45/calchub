import { describe, it, expect } from "vitest";
import { computeConcrete, computePaint, computeFlooring, computeTile } from "./construction";

describe("computeConcrete", () => {
  it("computes cubic yards for a 10x10 slab at 4 inches thick", () => {
    // 10 * 10 * (4/12) = 33.33 cu ft -> /27 = 1.235 cu yd
    const result = computeConcrete({ length: 10, width: 10, thicknessInches: 4, bagSizeLb: 80 });
    expect(result.primary.value).toBe("1.23 cubic yards");
  });
});

describe("computePaint", () => {
  it("subtracts openings and multiplies by coats", () => {
    // (40*9 - 40) * 2 / 350 = (360-40)*2/350 = 640/350 = 1.8286
    const result = computePaint({ wallLength: 40, wallHeight: 9, doorsWindowsArea: 40, coats: 2, coveragePerGallon: 350 });
    expect(result.primary.value).toBe("1.83 gallons");
  });
});

describe("computeFlooring", () => {
  it("applies the waste factor before dividing into boxes", () => {
    // 15*12=180, *1.10=198 sq ft
    const result = computeFlooring({ roomLength: 15, roomWidth: 12, wasteFactor: 10, coveragePerBox: 20 });
    expect(result.primary.value).toBe("198 sq ft");
  });
});

describe("computeTile", () => {
  it("computes tile count including waste", () => {
    // area 100 sq ft, tile area 1 sq ft, 100 tiles * 1.10 = 110
    const result = computeTile({ areaLength: 10, areaWidth: 10, tileLengthIn: 12, tileWidthIn: 12, wasteFactor: 10 });
    expect(result.primary.value).toBe("110 tiles");
  });
});
