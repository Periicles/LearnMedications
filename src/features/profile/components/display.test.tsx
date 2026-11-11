import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { AreaMastery, DailyPoint } from "@/types/profile";
import type { Profile } from "@/types/progress";
import { AreaMasteryList } from "./area-mastery-list";
import { ProfileHeader } from "./profile-header";
import { StatsGrid } from "./stats-grid";
import { XpChart } from "./xp-chart";

const profile: Profile = {
  id: "u1",
  username: "lea",
  avatar: "🩺",
  totalXp: 120,
  currentStreak: 2,
  longestStreak: 9,
  lastActiveOn: null,
  createdAt: "2026-03-15T10:00:00Z",
};

describe("ProfileHeader", () => {
  it("shows the identity, the membership date and the level progress", () => {
    render(<ProfileHeader profile={profile} />);
    expect(screen.getByRole("heading", { name: "lea" })).toBeInTheDocument();
    expect(screen.getByText("Membre depuis mars 2026")).toBeInTheDocument();
    expect(screen.getByText(/^Niveau \d+$/)).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", { name: /Progression vers le niveau/ }),
    ).toBeInTheDocument();
  });
});

describe("StatsGrid", () => {
  const stats = { lessonCount: 4, learnedCount: 12, masteredCount: 3 } as Parameters<
    typeof StatsGrid
  >[0]["stats"];
  const sessions = { answerCount: 8, correctCount: 6 } as Parameters<
    typeof StatsGrid
  >[0]["sessions"];

  it("renders every statistic with the rounded accuracy", () => {
    render(<StatsGrid profile={profile} stats={stats} sessions={sessions} visibleStreak={2} />);
    const grid = screen.getByLabelText("Statistiques");
    expect(within(grid).getByText("75 %")).toBeInTheDocument();
    expect(within(grid).getByText("Meilleure série").previousSibling).toHaveTextContent("9");
    expect(within(grid).getByText("XP total").previousSibling).toHaveTextContent("120");
    expect(within(grid).getByText("Leçons terminées").previousSibling).toHaveTextContent("4");
    expect(within(grid).getByText("Série actuelle").previousSibling).toHaveTextContent("2");
  });

  it("shows a dash when nothing has been answered", () => {
    const empty = { ...sessions, answerCount: 0, correctCount: 0 };
    render(<StatsGrid profile={profile} stats={stats} sessions={empty} visibleStreak={0} />);
    expect(screen.getByText("Précision").previousSibling).toHaveTextContent("–");
  });
});

describe("XpChart", () => {
  const points: DailyPoint[] = [
    { day: "2026-11-09", label: "L", xp: 0 },
    { day: "2026-11-10", label: "M", xp: 40 },
  ];

  it("totals the XP and lists each day", () => {
    render(<XpChart points={points} />);
    expect(screen.getByRole("heading", { name: "2 derniers jours" })).toBeInTheDocument();
    expect(screen.getAllByText("40 XP").length).toBeGreaterThan(0);
    const list = screen.getByRole("list", { name: "XP gagnés par jour" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(2);
    expect(within(list).getByText("2026-11-10 : 40 XP")).toBeInTheDocument();
  });

  it("copes with a window without any XP", () => {
    render(<XpChart points={points.map((point) => ({ ...point, xp: 0 }))} />);
    expect(screen.getByText("0 XP")).toBeInTheDocument();
  });
});

describe("AreaMasteryList", () => {
  it("shows the mastered ratio and bar widths per area", () => {
    const areas: AreaMastery[] = [
      {
        slug: "pain",
        name: "Douleur",
        icon: "💊",
        learnedCount: 5,
        masteredCount: 2,
        totalCount: 10,
      },
    ];
    const { container } = render(<AreaMasteryList areas={areas} />);
    expect(screen.getByText("2/10")).toBeInTheDocument();
    expect(screen.getByText(/Douleur/)).toBeInTheDocument();
    const widths = [...container.querySelectorAll<HTMLElement>("span[style]")].map(
      (fill) => fill.style.width,
    );
    expect(widths).toEqual(["50%", "20%"]);
  });
});
