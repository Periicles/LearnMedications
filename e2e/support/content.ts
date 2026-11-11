import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { ContentIndex } from "@/types/e2e";
import type { AreaFile } from "@/types/content";

const AREAS_DIR = join(process.cwd(), "content", "areas");

/** Indexes the dataset so tests can pick right or wrong answers on purpose. */
export function loadContentIndex(): ContentIndex {
  const index: ContentIndex = {
    nameByBrand: new Map(),
    brandsByName: new Map(),
    familyByName: new Map(),
    hintByName: new Map(),
  };
  for (const fileName of readdirSync(AREAS_DIR)) {
    const file = JSON.parse(readFileSync(join(AREAS_DIR, fileName), "utf8")) as AreaFile;
    const families = new Map(file.classes.map((drugClass) => [drugClass.slug, drugClass.name]));
    for (const substance of file.substances) {
      substance.brands.forEach((brand) => index.nameByBrand.set(brand, substance.name));
      index.brandsByName.set(substance.name, substance.brands);
      index.familyByName.set(substance.name, families.get(substance.classSlug) ?? "");
      index.hintByName.set(substance.name, substance.hint);
    }
  }
  return index;
}

export function isRightChoice(
  index: ContentIndex,
  prompt: string,
  subject: string,
  choice: string,
): boolean {
  if (prompt.includes("molécule (DCI)")) return index.nameByBrand.get(subject) === choice;
  if (prompt.includes("nom commercial")) {
    return index.brandsByName.get(subject)?.includes(choice) ?? false;
  }
  if (prompt.includes("quelle famille")) return index.familyByName.get(subject) === choice;
  return index.familyByName.get(choice) === subject;
}
