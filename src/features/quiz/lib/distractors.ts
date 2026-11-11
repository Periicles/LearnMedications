import type { Catalog, Substance } from "@/types/content";
import type { RandomSource } from "@/types/quiz";
import { CHOICE_COUNT } from "../constants";
import { shuffle } from "./random";

const DISTRACTOR_COUNT = CHOICE_COUNT - 1;

/** Fills the list with unique labels, taking from the most plausible pools first. */
function takeUnique(pools: string[][], excluded: string[], random: RandomSource): string[] {
  const taken = new Set<string>();
  const blocked = new Set(excluded);
  for (const pool of pools) {
    for (const label of shuffle(pool, random)) {
      if (taken.size >= DISTRACTOR_COUNT) return [...taken];
      if (!blocked.has(label)) taken.add(label);
    }
  }
  return [...taken];
}

function splitByCloseness(target: Substance, catalog: Catalog): Substance[][] {
  const others = [...catalog.substances.values()].filter((other) => other.slug !== target.slug);
  return [
    others.filter((other) => other.classSlug === target.classSlug),
    others.filter((other) => other.areaSlug === target.areaSlug),
    others,
  ];
}

export function substanceDistractors(
  target: Substance,
  catalog: Catalog,
  random: RandomSource,
): string[] {
  const pools = splitByCloseness(target, catalog).map((pool) => pool.map((other) => other.name));
  return takeUnique(pools, [target.name], random);
}

export function brandDistractors(
  target: Substance,
  catalog: Catalog,
  random: RandomSource,
): string[] {
  const pools = splitByCloseness(target, catalog).map((pool) =>
    pool.flatMap((other) => other.brands),
  );
  return takeUnique(pools, target.brands, random);
}

export function classDistractors(
  target: Substance,
  catalog: Catalog,
  random: RandomSource,
): string[] {
  const classes = [...catalog.classes.values()].filter(
    (drugClass) => drugClass.slug !== target.classSlug,
  );
  const pools = [classes.filter((drugClass) => drugClass.areaSlug === target.areaSlug), classes];
  return takeUnique(
    pools.map((pool) => pool.map((drugClass) => drugClass.name)),
    [],
    random,
  );
}

export function outsiderDistractors(
  target: Substance,
  catalog: Catalog,
  random: RandomSource,
): string[] {
  const outsiders = [...catalog.substances.values()].filter(
    (other) => other.classSlug !== target.classSlug,
  );
  const pools = [outsiders.filter((other) => other.areaSlug === target.areaSlug), outsiders];
  return takeUnique(
    pools.map((pool) => pool.map((other) => other.name)),
    [],
    random,
  );
}
