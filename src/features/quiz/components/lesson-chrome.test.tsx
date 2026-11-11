import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FULL_PLAN } from "@/testing/quiz-fixtures";
import type { SessionOutcome } from "@/types/quiz";
import { FeedbackBar } from "./feedback-bar";
import { IntroCardView } from "./intro-card";
import { LessonHeader } from "./lesson-header";
import { LessonSkeleton } from "./lesson-skeleton";
import { LessonSummary } from "./lesson-summary";

function outcomeWith(correctCount: number, totalCount: number): SessionOutcome {
  return {
    records: [],
    correctCount,
    totalCount,
    accuracy: correctCount / totalCount,
    perfect: correctCount === totalCount,
  };
}

describe("IntroCardView", () => {
  it("shows brands, family and usage with a next button", async () => {
    const onNext = vi.fn();
    render(<IntroCardView card={FULL_PLAN.cards[0]} step={1} total={2} onNext={onNext} />);
    expect(screen.getByText("Nouvelle molécule 1/2")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Alphamol" })).toBeInTheDocument();
    expect(screen.getByText("Alphadol")).toBeInTheDocument();
    expect(screen.getByText("Résumé de la classe")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Suivant" }));
    expect(onNext).toHaveBeenCalledOnce();
  });

  it("hides the brands section and starts the exercises on the last card", () => {
    render(<IntroCardView card={FULL_PLAN.cards[1]} step={2} total={2} onNext={vi.fn()} />);
    expect(screen.queryByText("Noms commerciaux")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Commencer les exercices" })).toBeInTheDocument();
  });
});

describe("LessonHeader", () => {
  it("links back and exposes the rounded progress", () => {
    render(<LessonHeader exitHref="/learn" progress={0.456} />);
    expect(screen.getByRole("link", { name: "Quitter la leçon" })).toHaveAttribute(
      "href",
      "/learn",
    );
    expect(screen.getByRole("progressbar", { name: "Progression de la leçon" })).toHaveAttribute(
      "aria-valuenow",
      "46",
    );
  });
});

describe("FeedbackBar", () => {
  it("congratulates a correct answer and continues on click and Enter", async () => {
    const onContinue = vi.fn();
    render(
      <FeedbackBar
        result={{ correct: true, message: "Le fait", records: [] }}
        onContinue={onContinue}
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Correct !");
    expect(screen.getByText("Le fait")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Continuer" }));
    screen.getByRole("button", { name: "Continuer" }).blur();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard("a");
    expect(onContinue).toHaveBeenCalledTimes(2);
  });

  it("uses the danger styling for a wrong answer", () => {
    render(
      <FeedbackBar
        result={{ correct: false, message: "Le fait", records: [] }}
        onContinue={vi.fn()}
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Pas tout à fait");
    expect(screen.getByRole("status")).toHaveClass("border-danger");
  });
});

describe("LessonSummary", () => {
  it.each([
    [5, 5, "Sans faute !"],
    [4, 5, "Très bien joué !"],
    [3, 5, "Leçon terminée !"],
    [1, 5, "Continuez, ça vient !"],
  ])("headlines %i/%i as %s", (correct, total, headline) => {
    render(<LessonSummary outcome={outcomeWith(correct, total)} exitHref="/learn" />);
    expect(screen.getByRole("heading")).toHaveTextContent(headline);
    expect(screen.getByText(`${correct}/${total}`)).toBeInTheDocument();
    expect(screen.getByText(`${Math.round((correct / total) * 100)} %`)).toBeInTheDocument();
  });

  it("renders the footer and the exit link", () => {
    render(
      <LessonSummary outcome={outcomeWith(1, 1)} exitHref="/learn">
        <p>Bonus</p>
      </LessonSummary>,
    );
    expect(screen.getByText("Bonus")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Continuer" })).toHaveAttribute("href", "/learn");
  });
});

describe("LessonSkeleton", () => {
  it("renders placeholder blocks", () => {
    const { container } = render(<LessonSkeleton />);
    expect(container.firstElementChild?.children).toHaveLength(6);
  });
});
