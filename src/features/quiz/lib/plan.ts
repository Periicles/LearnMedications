import type { Catalog, Substance } from "@/types/content";
import type { Exercise, IntroCard, LessonPlan, PlanMode, RandomSource } from "@/types/quiz";
import {
  LEARN_BRAND_RECALL_COUNT,
  LEARN_TYPING_COUNT,
  MAX_TYPED_LENGTH,
  MATCH_PAIR_COUNT,
  REVIEW_TYPING_COUNT,
} from "../constants";
import { availableKinds, buildChoice, buildMatch, buildTyping } from "./exercises";
import { pickOne, pickSome, shuffle } from "./random";

function toCard(substance: Substance, catalog: Catalog): IntroCard {
  const drugClass = catalog.classes.get(substance.classSlug);
  return {
    substanceSlug: substance.slug,
    name: substance.name,
    brands: substance.brands,
    className: drugClass?.name ?? substance.classSlug,
    classSummary: drugClass?.summary ?? "",
    hint: substance.hint,
  };
}

function buildMatchRound(targets: Substance[], catalog: Catalog, random: RandomSource): Exercise[] {
  if (targets.length < 3) return [];
  return [buildMatch(pickSome(targets, MATCH_PAIR_COUNT, random), catalog, random)];
}

function buildTypingRound(
  targets: Substance[],
  count: number,
  catalog: Catalog,
  random: RandomSource,
): Exercise[] {
  const typable = targets.filter(
    (substance) => substance.brands.length > 0 && substance.name.length <= MAX_TYPED_LENGTH,
  );
  return pickSome(typable, count, random).map((substance) =>
    buildTyping(substance, catalog, random),
  );
}

function buildLearnExercises(
  targets: Substance[],
  catalog: Catalog,
  random: RandomSource,
): Exercise[] {
  const branded = targets.filter((substance) => substance.brands.length > 0);
  const recognition = targets.map((substance) =>
    buildChoice(availableKinds(substance)[0], substance, catalog, random),
  );
  const families = targets.map((substance) =>
    buildChoice("substance-to-class", substance, catalog, random),
  );
  const recall = pickSome(branded, LEARN_BRAND_RECALL_COUNT, random).map((substance) =>
    buildChoice("substance-to-brand", substance, catalog, random),
  );
  return [
    ...shuffle(recognition, random),
    ...buildMatchRound(targets, catalog, random),
    ...shuffle([...families, ...recall], random),
    ...buildTypingRound(targets, LEARN_TYPING_COUNT, catalog, random),
  ];
}

function buildReviewExercises(
  targets: Substance[],
  catalog: Catalog,
  random: RandomSource,
): Exercise[] {
  const choices = targets.map((substance) =>
    buildChoice(pickOne(availableKinds(substance), random), substance, catalog, random),
  );
  return [
    ...shuffle(choices, random),
    ...buildMatchRound(targets, catalog, random),
    ...buildTypingRound(targets, REVIEW_TYPING_COUNT, catalog, random),
  ];
}

export function buildLessonPlan(
  title: string,
  targets: Substance[],
  catalog: Catalog,
  mode: PlanMode,
  random: RandomSource = Math.random,
): LessonPlan {
  const isLearning = mode === "learn";
  return {
    title,
    cards: isLearning ? targets.map((substance) => toCard(substance, catalog)) : [],
    exercises: isLearning
      ? buildLearnExercises(targets, catalog, random)
      : buildReviewExercises(targets, catalog, random),
  };
}
