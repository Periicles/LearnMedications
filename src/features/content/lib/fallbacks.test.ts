import { describe, expect, it } from "vitest";
import { makeDrugClass, makeSubstance } from "@/testing/quiz-fixtures";
import { pickSubstances } from "./catalog";
import { buildLessons } from "./lessons";

describe("pickSubstances", () => {
  it("skips unknown slugs and keeps the requested order", () => {
    const names = pickSubstances(["nope", "paracetamol", "also-nope"]).map((item) => item.slug);
    expect(names.every((slug) => slug === "paracetamol")).toBe(true);
    expect(pickSubstances([])).toEqual([]);
  });
});

describe("buildLessons with an unknown class", () => {
  const area = { slug: "area-a", name: "Zone A", icon: "A" };
  const substances = ["one", "two", "three"].map((slug) =>
    makeSubstance({ slug, name: slug, classSlug: "ghost-class" }),
  );

  it("titles the lesson after the class slug", () => {
    const lessons = buildLessons(substances, [area], new Map());
    expect(lessons).toHaveLength(1);
    expect(lessons[0].title).toBe("ghost-class");
    expect(lessons[0].substanceSlugs).toEqual(["one", "two", "three"]);
  });

  it("numbers the lessons of a large class", () => {
    const many = Array.from({ length: 7 }, (_unused, index) =>
      makeSubstance({ slug: `s${index}`, classSlug: "class-a" }),
    );
    const classes = new Map([["class-a", makeDrugClass()]]);
    const titles = buildLessons(many, [area], classes).map((lesson) => lesson.title);
    expect(titles).toEqual(["Classe A (1)", "Classe A (2)"]);
  });
});
