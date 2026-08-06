import type { CalculatorComputeResult, CalculatorInputs } from "../types";
import { formatNumber, num, round } from "../utils";

export function computeConcrete(inputs: CalculatorInputs): CalculatorComputeResult {
  const length = num(inputs, "length", 10);
  const width = num(inputs, "width", 10);
  const thicknessInches = num(inputs, "thicknessInches", 4);
  const bagSize = num(inputs, "bagSizeLb", 80);

  const thicknessFeet = thicknessInches / 12;
  const volumeCubicFeet = length * width * thicknessFeet;
  const volumeCubicYards = volumeCubicFeet / 27;

  // A 60 lb bag yields ~0.45 cu ft, an 80 lb bag ~0.60 cu ft of mixed concrete.
  const cuFtPerBag = bagSize === 60 ? 0.45 : bagSize === 40 ? 0.3 : 0.6;
  // Rounding before Math.ceil absorbs floating-point noise (e.g. 110.00000000000001)
  // that would otherwise push a clean result up to the next whole unit.
  const bagsNeeded = Math.ceil(round(volumeCubicFeet / cuFtPerBag, 6));

  return {
    primary: { label: "Concrete needed", value: `${round(volumeCubicYards, 2)} cubic yards`, highlight: true },
    secondary: [
      { label: "Volume (cubic feet)", value: formatNumber(volumeCubicFeet, 2) },
      { label: `${bagSize} lb bags needed`, value: String(bagsNeeded) },
    ],
    steps: [
      { label: "1. Convert thickness to feet", detail: `${thicknessInches} in ÷ 12 = ${round(thicknessFeet, 4)} ft.` },
      { label: "2. Compute volume", detail: `${length} ft × ${width} ft × ${round(thicknessFeet, 4)} ft = ${round(volumeCubicFeet, 2)} cu ft.` },
      { label: "3. Convert to cubic yards", detail: `${round(volumeCubicFeet, 2)} ÷ 27 = ${round(volumeCubicYards, 2)} cu yd.` },
      { label: "4. Bags required", detail: `${round(volumeCubicFeet, 2)} cu ft ÷ ${cuFtPerBag} cu ft/bag ≈ ${bagsNeeded} bags of ${bagSize} lb concrete mix.` },
    ],
    warnings: ["Add 5-10% extra material to cover spillage, uneven subgrade, and waste."],
  };
}

export function computePaint(inputs: CalculatorInputs): CalculatorComputeResult {
  const wallLength = num(inputs, "wallLength", 40);
  const wallHeight = num(inputs, "wallHeight", 9);
  const doorsWindows = num(inputs, "doorsWindowsArea", 40);
  const coats = num(inputs, "coats", 2);
  const coveragePerGallon = num(inputs, "coveragePerGallon", 350);

  const grossArea = wallLength * wallHeight;
  const netArea = Math.max(grossArea - doorsWindows, 0);
  const totalAreaToPaint = netArea * coats;
  const gallonsNeeded = totalAreaToPaint / coveragePerGallon;

  return {
    primary: { label: "Paint needed", value: `${round(gallonsNeeded, 2)} gallons`, highlight: true },
    secondary: [
      { label: "Wall area (net)", value: `${formatNumber(netArea, 1)} sq ft` },
      { label: "Coats", value: String(coats) },
      { label: "Recommended cans", value: `${Math.ceil(round(gallonsNeeded, 6))} × 1-gallon cans` },
    ],
    steps: [
      { label: "1. Gross wall area", detail: `${wallLength} ft × ${wallHeight} ft = ${formatNumber(grossArea, 1)} sq ft.` },
      { label: "2. Subtract doors/windows", detail: `${formatNumber(grossArea, 1)} − ${doorsWindows} = ${formatNumber(netArea, 1)} sq ft.` },
      { label: "3. Multiply by coats", detail: `${formatNumber(netArea, 1)} × ${coats} coats = ${formatNumber(totalAreaToPaint, 1)} sq ft to cover.` },
      { label: "4. Divide by coverage", detail: `${formatNumber(totalAreaToPaint, 1)} ÷ ${coveragePerGallon} sq ft/gal = ${round(gallonsNeeded, 2)} gallons.` },
    ],
  };
}

export function computeFlooring(inputs: CalculatorInputs): CalculatorComputeResult {
  const roomLength = num(inputs, "roomLength", 15);
  const roomWidth = num(inputs, "roomWidth", 12);
  const wasteFactor = num(inputs, "wasteFactor", 10);
  const coveragePerBox = num(inputs, "coveragePerBox", 20);

  const area = roomLength * roomWidth;
  const areaWithWaste = area * (1 + wasteFactor / 100);
  const boxesNeeded = Math.ceil(round(areaWithWaste / coveragePerBox, 6));

  return {
    primary: { label: "Flooring needed", value: `${round(areaWithWaste, 1)} sq ft`, highlight: true },
    secondary: [
      { label: "Room area", value: `${formatNumber(area, 1)} sq ft` },
      { label: "Boxes needed", value: String(boxesNeeded) },
    ],
    steps: [
      { label: "1. Room area", detail: `${roomLength} ft × ${roomWidth} ft = ${formatNumber(area, 1)} sq ft.` },
      { label: "2. Add waste factor", detail: `${formatNumber(area, 1)} × (1 + ${wasteFactor}%) = ${round(areaWithWaste, 1)} sq ft.` },
      { label: "3. Boxes required", detail: `${round(areaWithWaste, 1)} ÷ ${coveragePerBox} sq ft/box = ${boxesNeeded} boxes.` },
    ],
    warnings: ["Waste factor should be higher (15%+) for diagonal layouts or rooms with many cuts."],
  };
}

export function computeTile(inputs: CalculatorInputs): CalculatorComputeResult {
  const areaLength = num(inputs, "areaLength", 10);
  const areaWidth = num(inputs, "areaWidth", 10);
  const tileLengthIn = num(inputs, "tileLengthIn", 12);
  const tileWidthIn = num(inputs, "tileWidthIn", 12);
  const wasteFactor = num(inputs, "wasteFactor", 10);

  const totalArea = areaLength * areaWidth;
  const tileAreaSqFt = (tileLengthIn * tileWidthIn) / 144;
  const tilesNeededExact = totalArea / tileAreaSqFt;
  const tilesWithWaste = Math.ceil(round(tilesNeededExact * (1 + wasteFactor / 100), 6));

  return {
    primary: { label: "Tiles needed", value: `${tilesWithWaste} tiles`, highlight: true },
    secondary: [
      { label: "Area to cover", value: `${formatNumber(totalArea, 1)} sq ft` },
      { label: "Tile size", value: `${tileLengthIn}" × ${tileWidthIn}"` },
    ],
    steps: [
      { label: "1. Area to cover", detail: `${areaLength} ft × ${areaWidth} ft = ${formatNumber(totalArea, 1)} sq ft.` },
      { label: "2. Area per tile", detail: `(${tileLengthIn}" × ${tileWidthIn}") ÷ 144 = ${round(tileAreaSqFt, 3)} sq ft/tile.` },
      { label: "3. Tiles needed", detail: `${formatNumber(totalArea, 1)} ÷ ${round(tileAreaSqFt, 3)} = ${round(tilesNeededExact, 1)} tiles.` },
      { label: "4. Add waste factor", detail: `${round(tilesNeededExact, 1)} × (1 + ${wasteFactor}%), rounded up = ${tilesWithWaste} tiles.` },
    ],
  };
}
