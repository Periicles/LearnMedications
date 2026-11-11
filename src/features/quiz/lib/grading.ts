import type { TypedVerdict } from "@/types/quiz";

export function normalizeAnswer(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9+]+/g, " ")
    .trim();
}

export function editDistance(first: string, second: string): number {
  let previous = Array.from({ length: second.length + 1 }, (_unused, index) => index);
  for (let line = 1; line <= first.length; line += 1) {
    const current = [line];
    for (let column = 1; column <= second.length; column += 1) {
      const cost = first[line - 1] === second[column - 1] ? 0 : 1;
      current.push(
        Math.min(previous[column] + 1, current[column - 1] + 1, previous[column - 1] + cost),
      );
    }
    previous = current;
  }
  return previous[second.length];
}

function allowedTypos(expected: string): number {
  if (expected.length >= 10) return 2;
  return expected.length >= 6 ? 1 : 0;
}

/** Accepts answers that only differ by accents, case or a small typo. */
export function gradeTyped(input: string, expected: string): TypedVerdict {
  const typed = normalizeAnswer(input);
  const target = normalizeAnswer(expected);
  if (typed === target) return "exact";
  if (typed.length === 0) return "wrong";
  return editDistance(typed, target) <= allowedTypos(target) ? "typo" : "wrong";
}
