import type { BdpmData, BdpmFinding } from "@/types/bdpm";
import type { RawSubstance } from "@/types/content";
import { nameStem, normalizeName } from "./normalize";

function componentStems(substance: RawSubstance): string[] {
  return substance.name
    .split("+")
    .map(nameStem)
    .filter((stem) => stem.length > 0);
}

function findBrandCodes(brand: string, data: BdpmData): string[] {
  const prefix = `${normalizeName(brand)} `;
  return [...data.specialties]
    .filter(([, specialtyName]) => `${specialtyName} `.startsWith(prefix))
    .map(([cisCode]) => cisCode);
}

function checkBrand(substance: RawSubstance, brand: string, data: BdpmData): string | undefined {
  const cisCodes = findBrandCodes(brand, data);
  if (cisCodes.length === 0) return `brand "${brand}" not found in BDPM`;
  const denominations = cisCodes.flatMap((cisCode) => data.compositions.get(cisCode) ?? []);
  const stems = componentStems(substance);
  const matches = stems.some((stem) =>
    denominations.some((denomination) => denomination.includes(stem)),
  );
  if (matches) return undefined;
  const sample = [...new Set(denominations)].slice(0, 3).join(", ");
  return `brand "${brand}" does not seem to contain ${substance.name} (BDPM: ${sample})`;
}

export function compareWithBdpm(substances: RawSubstance[], data: BdpmData): BdpmFinding[] {
  const allDenominations = new Set([...data.compositions.values()].flat());
  const findings: BdpmFinding[] = [];
  for (const substance of substances) {
    const unknownStems = componentStems(substance).filter(
      (stem) => ![...allDenominations].some((denomination) => denomination.includes(stem)),
    );
    if (unknownStems.length > 0) {
      findings.push({ substanceSlug: substance.slug, message: `"${substance.name}" not found` });
    }
    for (const brand of substance.brands) {
      const message = checkBrand(substance, brand, data);
      if (message) findings.push({ substanceSlug: substance.slug, message });
    }
  }
  return findings;
}
