import { isMastered } from "@/features/progress/lib/mastery";
import type { Catalog } from "@/types/content";
import type { AreaMastery } from "@/types/profile";
import type { Mastery } from "@/types/progress";

/** Learned and mastered substances per therapeutic area. */
export function buildAreaMastery(catalog: Catalog, rows: Mastery[]): AreaMastery[] {
  const substances = [...catalog.substances.values()];
  const known = new Map(rows.map((mastery) => [mastery.substanceSlug, mastery]));

  return catalog.areas.map((area) => {
    const members = substances.filter((substance) => substance.areaSlug === area.slug);
    const learned = members.flatMap((substance) => known.get(substance.slug) ?? []);
    return {
      slug: area.slug,
      name: area.name,
      icon: area.icon,
      learnedCount: learned.length,
      masteredCount: learned.filter(isMastered).length,
      totalCount: members.length,
    };
  });
}
