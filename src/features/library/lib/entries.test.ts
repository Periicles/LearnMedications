import { describe, expect, it } from "vitest";
import { getCatalog } from "@/features/content/lib/catalog";
import { buildLibraryEntries, filterEntries } from "./entries";

const catalog = getCatalog();
const entries = buildLibraryEntries(catalog, [
  { substanceSlug: "paracetamol", strength: 3, correctCount: 3, wrongCount: 0, nextReviewAt: "" },
]);

describe("buildLibraryEntries", () => {
  it("lists every substance alphabetically with its mastery", () => {
    expect(entries).toHaveLength(catalog.substances.size);
    const names = entries.map((entry) => entry.name);
    expect(names).toEqual([...names].sort((left, right) => left.localeCompare(right, "fr")));
    expect(entries.find((entry) => entry.slug === "paracetamol")?.strength).toBe(3);
  });
});

describe("filterEntries", () => {
  it("searches by brand, molecule or family without accents", () => {
    expect(filterEntries(entries, "doliprane").map((entry) => entry.slug)).toContain("paracetamol");
    expect(filterEntries(entries, "PARACÉTAMOL").length).toBeGreaterThan(0);
    expect(filterEntries(entries, "betabloquants").length).toBeGreaterThan(2);
  });

  it("requires every word and returns everything for an empty query", () => {
    expect(filterEntries(entries, "doliprane zzzz")).toEqual([]);
    expect(filterEntries(entries, "  ")).toBe(entries);
  });
});
