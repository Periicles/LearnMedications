/** Upper-cases and strips accents and punctuation so names can be compared loosely. */
export function normalizeName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, " ")
    .trim();
}

/** Keeps the significant stem of an INN so salts and gender endings still match. */
export function nameStem(value: string): string {
  const words = normalizeName(value)
    .split(" ")
    .filter((word) => word.length > 3 && word !== "ACIDE");
  const longest = words.sort((left, right) => right.length - left.length)[0] ?? "";
  return longest.slice(0, Math.max(5, longest.length - 2));
}
