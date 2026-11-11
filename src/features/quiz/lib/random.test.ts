import { describe, expect, it } from "vitest";
import { pickOne, pickSome, seededRandom, shuffle } from "./random";

describe("random helpers", () => {
  it("produces the same sequence for the same seed and values in [0, 1)", () => {
    const first = seededRandom(5);
    const second = seededRandom(5);
    const values = Array.from({ length: 20 }, () => first());
    expect(values).toEqual(Array.from({ length: 20 }, () => second()));
    expect(values.every((value) => value >= 0 && value < 1)).toBe(true);
    expect(seededRandom(6)()).not.toBe(values[0]);
  });

  it("shuffles into a new array without losing items", () => {
    const items = [1, 2, 3, 4, 5, 6];
    const shuffled = shuffle(items, seededRandom(1));
    expect(shuffled).not.toBe(items);
    expect([...shuffled].sort()).toEqual(items);
    expect(items).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("picks the requested number of distinct items", () => {
    const picked = pickSome(["a", "b", "c", "d"], 2, seededRandom(3));
    expect(picked).toHaveLength(2);
    expect(new Set(picked).size).toBe(2);
    expect(pickSome(["a"], 5, seededRandom(3))).toEqual(["a"]);
  });

  it("picks one item according to the random source", () => {
    expect(pickOne(["a", "b", "c"], () => 0)).toBe("a");
    expect(pickOne(["a", "b", "c"], () => 0.99)).toBe("c");
  });
});
