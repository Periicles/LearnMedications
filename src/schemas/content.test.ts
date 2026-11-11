import { describe, expect, it } from "vitest";
import { areaFileSchema, drugClassSchema, substanceSchema } from "./content";

describe("content schemas", () => {
  const drugClass = { slug: "ains", name: "AINS", atc: "M01A", summary: "Anti-inflammatoires." };
  const substance = {
    slug: "ibuprofene",
    name: "Ibuprofène",
    brands: ["Advil"],
    classSlug: "ains",
    hint: "Anti-douleur",
    tier: 1,
    services: [],
  };

  it("accepts empty ATC codes and rejects lowercase ones", () => {
    expect(drugClassSchema.safeParse({ ...drugClass, atc: "" }).success).toBe(true);
    expect(drugClassSchema.safeParse({ ...drugClass, atc: "m01" }).success).toBe(false);
  });

  it("limits brands and tiers, and rejects unknown keys", () => {
    expect(substanceSchema.safeParse(substance).success).toBe(true);
    expect(
      substanceSchema.safeParse({ ...substance, brands: ["aa", "bb", "cc", "dd"] }).success,
    ).toBe(false);
    expect(substanceSchema.safeParse({ ...substance, tier: 4 }).success).toBe(false);
    expect(substanceSchema.safeParse({ ...substance, extra: 1 }).success).toBe(false);
  });

  it("requires at least one class and one substance per area file", () => {
    const area = { slug: "pain", name: "Douleur", icon: "💊" };
    const file = { area, classes: [drugClass], substances: [substance] };
    expect(areaFileSchema.safeParse(file).success).toBe(true);
    expect(areaFileSchema.safeParse({ ...file, classes: [] }).success).toBe(false);
    expect(areaFileSchema.safeParse({ ...file, substances: [] }).success).toBe(false);
  });
});
