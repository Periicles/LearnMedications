import { describe, expect, it } from "vitest";
import { getCatalog } from "@/features/content/lib/catalog";
import type { CompletionMap, SessionInput } from "@/types/progress";
import { toCompletionMap } from "./mappers";
import { buildLessonNodes, isLessonUnlocked, summarizeCollection } from "./path";
import { acceptRecords } from "./session-records";

const catalog = getCatalog();
const collection = catalog.collections.find((candidate) => candidate.lessons.length >= 3)!;
const [first, second, third] = collection.lessons;
const none: CompletionMap = new Map();
const firstDone: CompletionMap = new Map([[collection.slug, new Set([first.key])]]);

describe("buildLessonNodes", () => {
  it("marks completed, current and locked lessons with their area name", () => {
    const nodes = buildLessonNodes(collection, firstDone, catalog.areas);
    expect(nodes.slice(0, 3).map((node) => node.status)).toEqual([
      "completed",
      "current",
      "locked",
    ]);
    expect(nodes[0].areaName).toBe(
      catalog.areas.find((area) => area.slug === first.areaSlug)?.name,
    );
    expect(buildLessonNodes(collection, none, [])[0]).toMatchObject({
      status: "current",
      areaName: "",
    });
  });
});

describe("summarizeCollection", () => {
  it("counts completed lessons and points at the next one", () => {
    expect(summarizeCollection(collection, firstDone)).toMatchObject({
      completedCount: 1,
      nextLesson: second,
    });
    const finished: CompletionMap = new Map([
      [collection.slug, new Set(collection.lessons.map((lesson) => lesson.key))],
    ]);
    expect(summarizeCollection(collection, finished).nextLesson).toBeNull();
  });
});

describe("isLessonUnlocked", () => {
  it("unlocks completed lessons and the first open one only", () => {
    expect(isLessonUnlocked(collection, first.key, none)).toBe(true);
    expect(isLessonUnlocked(collection, second.key, none)).toBe(false);
    expect(isLessonUnlocked(collection, first.key, firstDone)).toBe(true);
    expect(isLessonUnlocked(collection, second.key, firstDone)).toBe(true);
    expect(isLessonUnlocked(collection, third.key, firstDone)).toBe(false);
  });
});

describe("toCompletionMap", () => {
  it("merges several lessons of the same collection", () => {
    const grouped = toCompletionMap([
      { collection_slug: "c1", lesson_key: "a", best_accuracy: 1, completions: 1 },
      { collection_slug: "c1", lesson_key: "b", best_accuracy: 1, completions: 1 },
    ]);
    expect([...(grouped.get("c1") ?? [])]).toEqual(["a", "b"]);
  });
});

describe("acceptRecords", () => {
  const known = { substanceSlug: first.substanceSlugs[0], correct: true };
  const foreign = { substanceSlug: "not-in-lesson", correct: true };
  const learn = (lessonKey: string): SessionInput => ({
    mode: "learn",
    collectionSlug: collection.slug,
    lessonKey,
    records: [known, foreign],
  });

  it("keeps only the lesson's substances for an unlocked lesson", () => {
    expect(acceptRecords(learn(first.key), none)).toEqual([known]);
  });

  it("rejects locked or unknown lessons", () => {
    expect(acceptRecords(learn(second.key), none)).toEqual([]);
    expect(acceptRecords(learn("missing"), none)).toEqual([]);
    expect(acceptRecords({ mode: "learn", records: [known] }, none)).toEqual([]);
  });

  it("keeps only catalog substances for a review", () => {
    expect(acceptRecords({ mode: "review", records: [known, foreign] }, none)).toEqual([known]);
  });
});
