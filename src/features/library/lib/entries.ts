import { normalizeAnswer } from "@/features/quiz/lib/grading";
import type { Catalog } from "@/types/content";
import type { LibraryEntry } from "@/types/library";
import type { Mastery } from "@/types/progress";

export const LIBRARY_PAGE_SIZE = 40;

export function buildLibraryEntries(catalog: Catalog, rows: Mastery[]): LibraryEntry[] {
  const strengths = new Map(rows.map((mastery) => [mastery.substanceSlug, mastery.strength]));
  const areas = new Map(catalog.areas.map((area) => [area.slug, area]));

  return [...catalog.substances.values()]
    .map((substance) => {
      const className = catalog.classes.get(substance.classSlug)?.name ?? "";
      const area = areas.get(substance.areaSlug);
      return {
        slug: substance.slug,
        name: substance.name,
        brands: substance.brands,
        className,
        areaName: area?.name ?? "",
        areaIcon: area?.icon ?? "",
        hint: substance.hint,
        searchText: normalizeAnswer([substance.name, ...substance.brands, className].join(" ")),
        strength: strengths.get(substance.slug) ?? null,
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name, "fr"));
}

/** Every word of the query must appear in the entry (name, brands or family). */
export function filterEntries(entries: LibraryEntry[], query: string): LibraryEntry[] {
  const words = normalizeAnswer(query).split(" ").filter(Boolean);
  if (words.length === 0) return entries;
  return entries.filter((entry) => words.every((word) => entry.searchText.includes(word)));
}
