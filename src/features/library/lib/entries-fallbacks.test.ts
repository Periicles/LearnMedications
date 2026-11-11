import { describe, expect, it } from "vitest";
import { getCatalog } from "@/features/content/lib/catalog";
import { buildLibraryEntries } from "./entries";

describe("buildLibraryEntries fallbacks", () => {
  it("uses empty labels when a substance has no known class or area", () => {
    const catalog = getCatalog();
    const [substance] = [...catalog.substances.values()];
    const orphan = { ...substance, classSlug: "unknown", areaSlug: "unknown" };
    const [entry] = buildLibraryEntries(
      { ...catalog, substances: new Map([[orphan.slug, orphan]]) },
      [],
    );
    expect(entry).toMatchObject({ className: "", areaName: "", areaIcon: "", strength: null });
  });
});
