import type { Area, DrugClass, Lesson, Substance, SubstanceGroup } from "@/types/content";
import { LESSON_SIZE, MIN_LESSON_SIZE } from "../constants";

export function groupByClass(substances: Substance[]): SubstanceGroup[] {
  const groups = new Map<string, SubstanceGroup>();
  for (const substance of substances) {
    const group = groups.get(substance.classSlug) ?? {
      classSlug: substance.classSlug,
      areaSlug: substance.areaSlug,
      substances: [],
    };
    group.substances.push(substance);
    groups.set(substance.classSlug, group);
  }
  return [...groups.values()].map((group) => ({
    ...group,
    substances: [...group.substances].sort((left, right) => left.tier - right.tier),
  }));
}

/** Splits a list into evenly sized chunks of at most LESSON_SIZE items. */
export function splitEvenly<Item>(items: Item[]): Item[][] {
  const chunkCount = Math.ceil(items.length / LESSON_SIZE);
  const chunks: Item[][] = [];
  let cursor = 0;
  for (let index = 0; index < chunkCount; index += 1) {
    const size = Math.ceil((items.length - cursor) / (chunkCount - index));
    chunks.push(items.slice(cursor, cursor + size));
    cursor += size;
  }
  return chunks;
}

/** Names a lesson mixing several small families after the first families it contains. */
export function mixedTitle(substances: Substance[], classes: Map<string, DrugClass>): string {
  const names = [...new Set(substances.map((substance) => substance.classSlug))].map((slug) =>
    (classes.get(slug)?.name ?? slug).replace(/\s*\(.*\)$/, ""),
  );
  if (names.length <= 2) return names.join(" · ");
  return `${names.slice(0, 2).join(" · ")}…`;
}

function buildAreaLessons(
  area: Area,
  groups: SubstanceGroup[],
  classes: Map<string, DrugClass>,
): Lesson[] {
  const lessons: Lesson[] = [];
  const leftovers: Substance[] = [];
  const pushLesson = (title: string, substances: Substance[]) =>
    lessons.push({
      key: substances[0].slug,
      title,
      areaSlug: area.slug,
      substanceSlugs: substances.map((substance) => substance.slug),
    });

  for (const group of groups) {
    if (group.substances.length < MIN_LESSON_SIZE) {
      leftovers.push(...group.substances);
      continue;
    }
    const className = classes.get(group.classSlug)?.name ?? group.classSlug;
    const chunks = splitEvenly(group.substances);
    chunks.forEach((chunk, index) =>
      pushLesson(chunks.length > 1 ? `${className} (${index + 1})` : className, chunk),
    );
  }

  splitEvenly(leftovers).forEach((chunk) => pushLesson(mixedTitle(chunk, classes), chunk));
  return lessons;
}

export function buildLessons(
  substances: Substance[],
  areas: Area[],
  classes: Map<string, DrugClass>,
): Lesson[] {
  const groups = groupByClass(substances);
  return areas.flatMap((area) =>
    buildAreaLessons(
      area,
      groups.filter((group) => group.areaSlug === area.slug),
      classes,
    ),
  );
}
