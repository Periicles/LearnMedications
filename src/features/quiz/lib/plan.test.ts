import { describe, expect, it } from "vitest";
import { getCatalog, pickSubstances } from "@/features/content/lib/catalog";
import type { ChoiceExercise, Exercise } from "@/types/quiz";
import { CHOICE_COUNT } from "../constants";
import { buildLessonPlan } from "./plan";
import { seededRandom } from "./random";

const catalog = getCatalog();

function isChoice(exercise: Exercise): exercise is ChoiceExercise {
  return "choices" in exercise;
}

describe("buildLessonPlan", () => {
  it("is deterministic for a given seed", () => {
    const targets = pickSubstances(catalog.collections[0].lessons[0].substanceSlugs);
    const first = buildLessonPlan("Test", targets, catalog, "learn", seededRandom(7));
    const second = buildLessonPlan("Test", targets, catalog, "learn", seededRandom(7));
    expect(first).toEqual(second);
  });

  it("builds valid exercises for every lesson of every collection", () => {
    const random = seededRandom(42);
    for (const collection of catalog.collections) {
      for (const lesson of collection.lessons) {
        const targets = pickSubstances(lesson.substanceSlugs);
        const plan = buildLessonPlan(lesson.title, targets, catalog, "learn", random);
        expect(plan.cards).toHaveLength(targets.length);
        expect(plan.exercises.length).toBeGreaterThanOrEqual(targets.length * 2);
        for (const exercise of plan.exercises.filter(isChoice)) {
          expect(exercise.choices).toHaveLength(CHOICE_COUNT);
          expect(new Set(exercise.choices).size).toBe(CHOICE_COUNT);
          expect(exercise.choices).toContain(exercise.answer);
        }
      }
    }
  });

  it("never offers another valid answer as a distractor", () => {
    const random = seededRandom(3);
    for (const substance of catalog.substances.values()) {
      const plan = buildLessonPlan("Test", [substance], catalog, "review", random);
      for (const exercise of plan.exercises.filter(isChoice)) {
        const wrong = exercise.choices.filter((choice) => choice !== exercise.answer);
        if (exercise.kind === "substance-to-brand") {
          expect(wrong.some((choice) => substance.brands.includes(choice))).toBe(false);
        }
        if (exercise.kind === "class-to-substance") {
          const sameClass = [...catalog.substances.values()]
            .filter((other) => other.classSlug === substance.classSlug)
            .map((other) => other.name);
          expect(wrong.some((choice) => sameClass.includes(choice))).toBe(false);
        }
      }
    }
  });

  it("skips intro cards in review mode", () => {
    const targets = pickSubstances(catalog.collections[0].lessons[0].substanceSlugs);
    const plan = buildLessonPlan("Révision", targets, catalog, "review", seededRandom(1));
    expect(plan.cards).toEqual([]);
    expect(plan.exercises.length).toBeGreaterThan(0);
  });
});
