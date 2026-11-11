import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ACHIEVEMENTS } from "../catalog";
import { AchievementCard } from "./achievement-card";

const achievement = ACHIEVEMENTS.find((candidate) => candidate.key === "streak-7")!;

describe("AchievementCard", () => {
  it("shows the progress of a locked achievement", () => {
    render(<AchievementCard view={{ achievement, unlockedAt: null, current: 3 }} />);
    expect(screen.getByRole("heading", { name: achievement.title })).toBeInTheDocument();
    expect(screen.getByText("3/7")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "3");
  });

  it("shows the unlock date of an unlocked achievement", () => {
    render(
      <AchievementCard view={{ achievement, unlockedAt: "2026-11-11T10:00:00Z", current: 7 }} />,
    );
    expect(screen.getByText(/Débloqué le 11 nov\. 2026/)).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });
});
