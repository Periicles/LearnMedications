import type { Area, Collection, CollectionMeta, DrugClass, Substance } from "@/types/content";
import { ESSENTIALS_COLLECTION, SERVICES } from "../constants";
import { buildLessons } from "./lessons";

function makeCollection(
  meta: CollectionMeta,
  substances: Substance[],
  areas: Area[],
  classes: Map<string, DrugClass>,
): Collection {
  const lessons = buildLessons(substances, areas, classes);
  return {
    ...meta,
    lessons,
    substanceSlugs: lessons.flatMap((lesson) => lesson.substanceSlugs),
  };
}

export function buildCollections(
  substances: Substance[],
  areas: Area[],
  classes: Map<string, DrugClass>,
): Collection[] {
  const essentials = makeCollection(
    ESSENTIALS_COLLECTION,
    substances.filter((substance) => substance.tier === 1),
    areas,
    classes,
  );
  const serviceCollections = SERVICES.map((service) =>
    makeCollection(
      { ...service, kind: "service" },
      substances.filter((substance) => substance.services.includes(service.slug)),
      areas,
      classes,
    ),
  );
  const areaCollections = areas.map((area) =>
    makeCollection(
      {
        slug: area.slug,
        title: area.name,
        description: `Toutes les familles de la spécialité « ${area.name} ».`,
        icon: area.icon,
        kind: "area",
      },
      substances.filter((substance) => substance.areaSlug === area.slug),
      areas,
      classes,
    ),
  );
  return [essentials, ...serviceCollections, ...areaCollections].filter(
    (collection) => collection.lessons.length > 0,
  );
}
