import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Mastery } from "@/types/progress";
import { StrengthChart } from "./strength-chart";

function makeMastery(substanceSlug: string, strength: number): Mastery {
  return { substanceSlug, strength, correctCount: 0, wrongCount: 0, nextReviewAt: "" };
}

describe("StrengthChart", () => {
  it("counts substances per strength level", () => {
    const rows = [makeMastery("a", 1), makeMastery("b", 1), makeMastery("c", 5)];
    render(<StrengthChart rows={rows} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(6);
    expect(within(items[1]).getByText("Fragile")).toBeInTheDocument();
    expect(within(items[1]).getByText("2")).toBeInTheDocument();
    expect(within(items[5]).getByText("1")).toBeInTheDocument();
  });

  it("renders empty bars without data", () => {
    render(<StrengthChart rows={[]} />);
    expect(screen.getAllByText("0")).toHaveLength(6);
  });
});
