import type { AreaFile, Catalog, Collection, DrugClass, Lesson, Substance } from "@/types/content";
import { AREA_FILES } from "./area-files";
import { buildCollections } from "./collections";

export function buildCatalog(files: AreaFile[]): Catalog {
  const classes = new Map<string, DrugClass>();
  const substances = new Map<string, Substance>();
  for (const file of files) {
    const areaSlug = file.area.slug;
    file.classes.forEach((drugClass) => classes.set(drugClass.slug, { ...drugClass, areaSlug }));
    file.substances.forEach((substance) =>
      substances.set(substance.slug, { ...substance, areaSlug }),
    );
  }
  const areas = files.map((file) => file.area);
  const collections = buildCollections([...substances.values()], areas, classes);
  return { areas, classes, substances, collections };
}

let cachedCatalog: Catalog | undefined;

export function getCatalog(): Catalog {
  cachedCatalog ??= buildCatalog(AREA_FILES);
  return cachedCatalog;
}

export function findCollection(slug: string): Collection | undefined {
  return getCatalog().collections.find((collection) => collection.slug === slug);
}

export function findLesson(collectionSlug: string, lessonKey: string): Lesson | undefined {
  return findCollection(collectionSlug)?.lessons.find((lesson) => lesson.key === lessonKey);
}

export function pickSubstances(slugs: string[]): Substance[] {
  const { substances } = getCatalog();
  return slugs.flatMap((slug) => substances.get(slug) ?? []);
}
