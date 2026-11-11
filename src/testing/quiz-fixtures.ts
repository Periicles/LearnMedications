import type { Catalog, DrugClass, Substance } from "@/types/content";
import type { ChoiceExercise, LessonPlan, MatchExercise, TypingExercise } from "@/types/quiz";

export function makeSubstance(overrides: Partial<Substance> = {}): Substance {
  return {
    slug: "alpha",
    name: "Alphamol",
    brands: ["Alphadol"],
    classSlug: "class-a",
    hint: "Soulage la douleur",
    tier: 1,
    services: [],
    areaSlug: "area-a",
    ...overrides,
  };
}

export function makeDrugClass(overrides: Partial<DrugClass> = {}): DrugClass {
  return {
    slug: "class-a",
    name: "Classe A",
    atc: "N02",
    summary: "Résumé de la classe",
    areaSlug: "area-a",
    ...overrides,
  };
}

export function makeCatalog(substances: Substance[], classes: DrugClass[] = []): Catalog {
  return {
    areas: [{ slug: "area-a", name: "Zone A", icon: "A" }],
    classes: new Map(classes.map((drugClass) => [drugClass.slug, drugClass])),
    substances: new Map(substances.map((substance) => [substance.slug, substance])),
    collections: [],
  };
}

export const CHOICE_EXERCISE: ChoiceExercise = {
  id: "brand-to-substance:alpha",
  kind: "brand-to-substance",
  substanceSlug: "alpha",
  subject: "Alphadol",
  choices: ["Alphamol", "Betamol", "Gammamol", "Deltamol"],
  answer: "Alphamol",
  fact: "Alphamol (Alphadol) · Classe A",
};

export const SECOND_CHOICE: ChoiceExercise = {
  ...CHOICE_EXERCISE,
  id: "substance-to-class:beta",
  kind: "substance-to-class",
  substanceSlug: "beta",
  subject: "Betamol",
  choices: ["Classe A", "Classe B", "Classe C", "Classe D"],
  answer: "Classe B",
  fact: "Betamol · Classe B",
};

export const TYPING_EXERCISE: TypingExercise = {
  id: "type-substance:gamma",
  kind: "type-substance",
  substanceSlug: "gamma",
  subject: "Gammadol",
  answer: "Paracétamol",
  fact: "Paracétamol (Gammadol) · Classe C",
};

export const MATCH_EXERCISE: MatchExercise = {
  id: "match-pairs:a+b",
  kind: "match-pairs",
  pairs: [
    { substanceSlug: "a", left: "Aspirine", right: "Aspégic" },
    { substanceSlug: "b", left: "Tramadol", right: "Contramal" },
  ],
  rightOrder: ["Contramal", "Aspégic"],
};

export const FULL_PLAN: LessonPlan = {
  title: "Leçon de test",
  cards: [
    {
      substanceSlug: "alpha",
      name: "Alphamol",
      brands: ["Alphadol"],
      className: "Classe A",
      classSummary: "Résumé de la classe",
      hint: "Soulage la douleur",
    },
    {
      substanceSlug: "beta",
      name: "Betamol",
      brands: [],
      className: "Classe B",
      classSummary: "Autre résumé",
      hint: "Fait baisser la fièvre",
    },
  ],
  exercises: [CHOICE_EXERCISE, SECOND_CHOICE, MATCH_EXERCISE, TYPING_EXERCISE],
};
