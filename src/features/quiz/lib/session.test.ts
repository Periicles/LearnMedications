import { describe, expect, it } from "vitest";
import type { AnswerResult, ChoiceExercise, LessonPlan } from "@/types/quiz";
import { initSession, sessionProgress, sessionReducer, summarize } from "./session";

function makeExercise(slug: string): ChoiceExercise {
  return {
    id: `brand-to-substance:${slug}`,
    kind: "brand-to-substance",
    substanceSlug: slug,
    subject: "Brand",
    choices: ["one", "two", "three", "four"],
    answer: "one",
    fact: "fact",
  };
}

function makeResult(slug: string, correct: boolean): AnswerResult {
  return { correct, message: "fact", records: [{ substanceSlug: slug, correct }] };
}

const plan: LessonPlan = {
  title: "Test",
  cards: [],
  exercises: [makeExercise("alpha"), makeExercise("beta")],
};

describe("sessionReducer", () => {
  it("walks through intro cards before questions", () => {
    const card = {
      substanceSlug: "alpha",
      name: "",
      brands: [],
      className: "",
      classSummary: "",
      hint: "",
    };
    let state = initSession({ ...plan, cards: [card, card] });
    expect(state.phase).toBe("intro");
    state = sessionReducer(state, { type: "next-card" });
    expect(state.phase).toBe("intro");
    state = sessionReducer(state, { type: "next-card" });
    expect(state.phase).toBe("question");
  });

  it("finishes after all answers and reports a perfect outcome", () => {
    let state = initSession(plan);
    state = sessionReducer(state, { type: "answer", result: makeResult("alpha", true) });
    expect(sessionProgress(state)).toBe(0.5);
    state = sessionReducer(state, { type: "continue" });
    state = sessionReducer(state, { type: "answer", result: makeResult("beta", true) });
    state = sessionReducer(state, { type: "continue" });
    expect(state.phase).toBe("done");
    expect(summarize(state)).toMatchObject({ correctCount: 2, totalCount: 2, perfect: true });
  });

  it("queues a failed exercise once and ignores the retry in the score", () => {
    let state = initSession(plan);
    state = sessionReducer(state, { type: "answer", result: makeResult("alpha", false) });
    expect(state.queue).toHaveLength(3);
    state = sessionReducer(state, { type: "continue" });
    state = sessionReducer(state, { type: "answer", result: makeResult("beta", true) });
    state = sessionReducer(state, { type: "continue" });
    state = sessionReducer(state, { type: "answer", result: makeResult("alpha", false) });
    expect(state.queue).toHaveLength(3);
    state = sessionReducer(state, { type: "continue" });
    expect(state.phase).toBe("done");
    expect(summarize(state)).toMatchObject({ correctCount: 1, totalCount: 2, accuracy: 0.5 });
  });

  it("ignores answers outside the question phase", () => {
    const state = sessionReducer(initSession(plan), { type: "continue" });
    expect(state.position).toBe(0);
  });
});
