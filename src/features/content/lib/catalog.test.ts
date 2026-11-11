import { describe, expect, it } from "vitest";
import { AREA_FILES } from "./area-files";
import { findLesson, getCatalog, pickSubstances } from "./catalog";
import { validateAreaFiles } from "./validation";

describe("curated content", () => {
  it("passes schema and consistency validation", () => {
    expect(validateAreaFiles(AREA_FILES)).toEqual([]);
  });
});

describe("catalog", () => {
  const catalog = getCatalog();

  it("exposes essentials first, then services and areas", () => {
    expect(catalog.collections[0].slug).toBe("essentials");
    expect(catalog.collections.some((collection) => collection.kind === "service")).toBe(true);
    expect(catalog.collections.some((collection) => collection.kind === "area")).toBe(true);
  });

  it("gives every collection a unique slug", () => {
    const slugs = catalog.collections.map((collection) => collection.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("gives every lesson a unique key inside its collection", () => {
    for (const collection of catalog.collections) {
      const keys = collection.lessons.map((lesson) => lesson.key);
      expect(new Set(keys).size).toBe(keys.length);
    }
  });

  it("places every substance in exactly one lesson of its area collection", () => {
    const areaCollections = catalog.collections.filter((collection) => collection.kind === "area");
    const covered = areaCollections.flatMap((collection) => collection.substanceSlugs);
    expect(covered).toHaveLength(catalog.substances.size);
    expect(new Set(covered).size).toBe(catalog.substances.size);
  });

  it("finds lessons and substances by key", () => {
    const [firstLesson] = catalog.collections[0].lessons;
    expect(findLesson("essentials", firstLesson.key)).toBe(firstLesson);
    expect(pickSubstances(firstLesson.substanceSlugs)).toHaveLength(
      firstLesson.substanceSlugs.length,
    );
  });
});
