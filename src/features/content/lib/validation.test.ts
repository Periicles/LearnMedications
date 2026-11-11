import { describe, expect, it } from "vitest";
import type { AreaFile } from "@/types/content";
import { validateAreaFiles } from "./validation";

function makeFile(): AreaFile {
  return {
    area: { slug: "pain", name: "Douleur", icon: "💊" },
    classes: [
      {
        slug: "nsaids",
        name: "AINS",
        atc: "M01A",
        summary: "Anti-inflammatoires non stéroïdiens.",
      },
    ],
    substances: [
      {
        slug: "ibuprofen",
        name: "Ibuprofène",
        brands: ["Advil"],
        classSlug: "nsaids",
        hint: "Douleur, fièvre",
        tier: 1,
        services: ["emergency"],
      },
    ],
  };
}

describe("validateAreaFiles", () => {
  it("accepts a valid file", () => {
    expect(validateAreaFiles([makeFile()])).toEqual([]);
  });

  it("reports schema errors", () => {
    const file = makeFile();
    const broken = { ...file, substances: [{ ...file.substances[0], tier: 4 }] };
    expect(validateAreaFiles([broken])).not.toEqual([]);
  });

  it("reports unknown classes and duplicates", () => {
    const file = makeFile();
    file.substances.push({ ...file.substances[0], classSlug: "missing" });
    const issues = validateAreaFiles([file]);
    expect(issues).toContain('ibuprofen: unknown class "missing"');
    expect(issues).toContain('duplicate substance slug: "ibuprofen"');
    expect(issues).toContain('duplicate brand: "advil"');
  });
});
