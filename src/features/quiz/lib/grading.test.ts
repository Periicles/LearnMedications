import { describe, expect, it } from "vitest";
import { editDistance, gradeTyped, normalizeAnswer } from "./grading";

describe("normalizeAnswer", () => {
  it("removes accents, case and punctuation", () => {
    expect(normalizeAnswer("  Paracétamol ")).toBe("paracetamol");
    expect(normalizeAnswer("Amoxicilline + acide clavulanique")).toBe(
      "amoxicilline + acide clavulanique",
    );
  });
});

describe("editDistance", () => {
  it("counts insertions, deletions and substitutions", () => {
    expect(editDistance("tramadol", "tramadol")).toBe(0);
    expect(editDistance("tramadol", "tramadl")).toBe(1);
    expect(editDistance("kitten", "sitting")).toBe(3);
  });
});

describe("gradeTyped", () => {
  it("accepts exact answers regardless of accents", () => {
    expect(gradeTyped("paracetamol", "Paracétamol")).toBe("exact");
  });

  it("tolerates small typos on long names only", () => {
    expect(gradeTyped("paracetamool", "Paracétamol")).toBe("typo");
    expect(gradeTyped("ibuprofen", "Ibuprofène")).toBe("typo");
    expect(gradeTyped("codeune", "Codéine")).toBe("typo");
    expect(gradeTyped("iode", "Fer")).toBe("wrong");
  });

  it("rejects empty and unrelated answers", () => {
    expect(gradeTyped("", "Morphine")).toBe("wrong");
    expect(gradeTyped("tramadol", "Morphine")).toBe("wrong");
  });
});
