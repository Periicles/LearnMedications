import { describe, expect, it } from "vitest";
import type { LessonPlan } from "@/types/quiz";
import { CHOICE_EXERCISE } from "@/testing/quiz-fixtures";
import { initSession, outcomeFromRecords, sessionProgress, sessionReducer } from "./session";

const emptyPlan: LessonPlan = { title: "Vide", cards: [], exercises: [] };
const result = { correct: true, message: "ok", records: [] };

describe("session edge cases", () => {
  it("reports full progress for an empty queue and a zero outcome", () => {
    expect(sessionProgress(initSession(emptyPlan))).toBe(1);
    expect(outcomeFromRecords([])).toMatchObject({ accuracy: 0, perfect: false, totalCount: 0 });
  });

  it("ignores actions that do not match the current phase", () => {
    const state = initSession({ ...emptyPlan, exercises: [CHOICE_EXERCISE] });
    expect(sessionReducer(state, { type: "continue" })).toBe(state);
    expect(sessionReducer(state, { type: "next-card" })).toBe(state);
  });

  it("does not answer while in the intro phase", () => {
    const intro = initSession({ ...emptyPlan, cards: [{ ...makeCard() }] });
    expect(sessionReducer(intro, { type: "answer", result })).toBe(intro);
  });
});

function makeCard() {
  return {
    substanceSlug: "alpha",
    name: "A",
    brands: [],
    className: "C",
    classSummary: "S",
    hint: "H",
  };
}
