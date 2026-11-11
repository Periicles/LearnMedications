import { describe, expect, it } from "vitest";
import { getCatalog } from "@/features/content/lib/catalog";
import type { CompletionMap } from "@/types/progress";
import { listProgress, pickContinue } from "./overview";

const { collections } = getCatalog();

function completeAll(slugs: string[]): CompletionMap {
  return new Map(
    collections
      .filter((collection) => slugs.includes(collection.slug))
      .map((collection) => [
        collection.slug,
        new Set(collection.lessons.map((lesson) => lesson.key)),
      ]),
  );
}

describe("listProgress", () => {
  it("lists only collections of the requested kind", () => {
    const kind = collections[0].kind;
    const items = listProgress(new Map(), kind);
    expect(items.length).toBe(collections.filter((collection) => collection.kind === kind).length);
    expect(items.every((item) => item.collection.kind === kind)).toBe(true);
  });
});

describe("pickContinue", () => {
  it("starts with the first collection for a new learner", () => {
    expect(pickContinue(new Map())?.collection.slug).toBe(collections[0].slug);
  });

  it("prefers the started collection with the most completed lessons", () => {
    const target = collections.find((collection) => collection.lessons.length >= 2)!;
    const completions: CompletionMap = new Map([[target.slug, new Set([target.lessons[0].key])]]);
    expect(pickContinue(completions)?.collection.slug).toBe(target.slug);
  });

  it("returns null when everything is finished", () => {
    expect(pickContinue(completeAll(collections.map((collection) => collection.slug)))).toBeNull();
  });
});
