import type { RandomSource } from "@/types/quiz";

/** Fisher-Yates shuffle returning a new array. */
export function shuffle<Item>(items: Item[], random: RandomSource): Item[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function pickSome<Item>(items: Item[], count: number, random: RandomSource): Item[] {
  return shuffle(items, random).slice(0, count);
}

export function pickOne<Item>(items: Item[], random: RandomSource): Item {
  return items[Math.floor(random() * items.length)];
}

/** Deterministic generator (mulberry32), used in tests and reproducible sessions. */
export function seededRandom(seed: number): RandomSource {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let mixed = Math.imul(state ^ (state >>> 15), state | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}
