import type { Catalog, Substance } from "@/types/content";
import type {
  ChoiceExercise,
  ChoiceKind,
  MatchExercise,
  RandomSource,
  TypingExercise,
} from "@/types/quiz";
import {
  brandDistractors,
  classDistractors,
  outsiderDistractors,
  substanceDistractors,
} from "./distractors";
import { pickOne, shuffle } from "./random";

function className(substance: Substance, catalog: Catalog): string {
  return catalog.classes.get(substance.classSlug)?.name ?? substance.classSlug;
}

export function describeFact(substance: Substance, catalog: Catalog): string {
  const brands = substance.brands.length > 0 ? ` (${substance.brands.join(", ")})` : "";
  return `${substance.name}${brands} · ${className(substance, catalog)}`;
}

export function availableKinds(substance: Substance): ChoiceKind[] {
  const always: ChoiceKind[] = ["substance-to-class", "class-to-substance"];
  return substance.brands.length > 0
    ? ["brand-to-substance", "substance-to-brand", ...always]
    : always;
}

export function buildChoice(
  kind: ChoiceKind,
  substance: Substance,
  catalog: Catalog,
  random: RandomSource,
): ChoiceExercise {
  const family = className(substance, catalog);
  const brand = substance.brands.length > 0 ? pickOne(substance.brands, random) : substance.name;
  const variants: Record<ChoiceKind, [string, string, string[]]> = {
    "brand-to-substance": [brand, substance.name, substanceDistractors(substance, catalog, random)],
    "substance-to-brand": [substance.name, brand, brandDistractors(substance, catalog, random)],
    "substance-to-class": [substance.name, family, classDistractors(substance, catalog, random)],
    "class-to-substance": [family, substance.name, outsiderDistractors(substance, catalog, random)],
  };
  const [subject, answer, distractors] = variants[kind];
  return {
    id: `${kind}:${substance.slug}`,
    kind,
    substanceSlug: substance.slug,
    subject,
    answer,
    choices: shuffle([answer, ...distractors], random),
    fact: describeFact(substance, catalog),
  };
}

export function buildTyping(
  substance: Substance,
  catalog: Catalog,
  random: RandomSource,
): TypingExercise {
  return {
    id: `type-substance:${substance.slug}`,
    kind: "type-substance",
    substanceSlug: substance.slug,
    subject: pickOne(substance.brands, random),
    answer: substance.name,
    fact: describeFact(substance, catalog),
  };
}

export function buildMatch(
  substances: Substance[],
  catalog: Catalog,
  random: RandomSource,
): MatchExercise {
  const useBrands = substances.every((substance) => substance.brands.length > 0);
  const pairs = substances.map((substance) => ({
    substanceSlug: substance.slug,
    left: substance.name,
    right: useBrands ? pickOne(substance.brands, random) : substance.hint,
  }));
  return {
    id: `match-pairs:${substances.map((substance) => substance.slug).join("+")}`,
    kind: "match-pairs",
    pairs,
    rightOrder: shuffle(
      pairs.map((pair) => pair.right),
      random,
    ),
  };
}
