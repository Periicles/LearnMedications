import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { SessionReward } from "@/types/progress";
import { RewardPanel } from "./reward-panel";

const reward: SessionReward = {
  xpGained: 16,
  totalXp: 116,
  level: 2,
  leveledUp: false,
  streak: 1,
  streakExtended: true,
  badges: [],
};

describe("RewardPanel", () => {
  it("shows a placeholder while saving", () => {
    const { container } = render(<RewardPanel state={{ status: "pending" }} />);
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.queryByText("XP gagnés")).not.toBeInTheDocument();
  });

  it("warns when the results could not be saved", () => {
    render(<RewardPanel state={{ status: "failed" }} />);
    expect(screen.getByText(/n'ont pas pu être enregistrés/)).toBeInTheDocument();
  });

  it("shows xp and a singular streak", () => {
    render(<RewardPanel state={{ status: "ready", reward }} />);
    expect(screen.getByText("+16")).toBeInTheDocument();
    expect(screen.getByText("1 jour")).toBeInTheDocument();
    expect(screen.queryByText(/Niveau 2 atteint/)).not.toBeInTheDocument();
  });

  it("announces level-ups and unlocked badges", () => {
    const rich = {
      ...reward,
      streak: 4,
      leveledUp: true,
      badges: [{ key: "first-lesson", title: "Premier pas", icon: "🎬" }],
    };
    render(<RewardPanel state={{ status: "ready", reward: rich }} />);
    expect(screen.getByText("4 jours")).toBeInTheDocument();
    expect(screen.getByText(/Niveau 2 atteint/)).toBeInTheDocument();
    expect(screen.getByText(/Succès débloqué : Premier pas/)).toBeInTheDocument();
  });
});
