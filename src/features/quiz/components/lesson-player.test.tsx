import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CHOICE_EXERCISE, FULL_PLAN } from "@/testing/quiz-fixtures";
import type { LessonPlan } from "@/types/quiz";
import { LessonPlayer } from "./lesson-player";

const progress = () => screen.getByRole("progressbar").getAttribute("aria-valuenow");

async function pressContinue(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "Continuer" }));
}

describe("LessonPlayer", () => {
  it("plays a full lesson with a retry and reports the outcome once", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(
      <LessonPlayer
        plan={FULL_PLAN}
        exitHref="/learn"
        onComplete={onComplete}
        summaryFooter={<p>Créez un compte</p>}
      />,
    );

    expect(screen.getByRole("heading", { name: "Alphamol" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Suivant" }));
    expect(screen.getByRole("heading", { name: "Betamol" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Commencer les exercices" }));

    // Wrong choice answer: it will be asked again at the end.
    expect(progress()).toBe("0");
    await user.click(screen.getByRole("button", { name: /Betamol/ }));
    expect(screen.getByRole("status")).toHaveTextContent("Pas tout à fait");
    expect(progress()).toBe("20");
    await user.keyboard("{Enter}");

    // Correct choice answer with the keyboard shortcut (2 = "Classe B").
    expect(screen.getByText("Classe B", { selector: "button span" })).toBeInTheDocument();
    await user.keyboard("2");
    expect(screen.getByRole("status")).toHaveTextContent("Correct !");
    await user.keyboard("{Enter}");

    // Matching with a wrong pair first.
    await user.click(screen.getByRole("button", { name: "Aspirine" }));
    await user.click(screen.getByRole("button", { name: "Contramal" }));
    expect(screen.getByRole("button", { name: "Contramal" })).toHaveClass("animate-shake");
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Contramal" })).not.toHaveClass("animate-shake"),
    );
    await user.click(screen.getByRole("button", { name: "Aspirine" }));
    await user.click(screen.getByRole("button", { name: "Aspégic" }));
    await user.click(screen.getByRole("button", { name: "Tramadol" }));
    await user.click(screen.getByRole("button", { name: "Contramal" }));
    expect(screen.getByRole("status")).toHaveTextContent("Paires associées, avec des erreurs.");
    await pressContinue(user);

    // Typed answer with a typo is accepted.
    await user.type(screen.getByLabelText("Votre réponse"), "Paracetamoll");
    await user.click(screen.getByRole("button", { name: "Valider" }));
    expect(screen.getByRole("status")).toHaveTextContent("Attention à l'orthographe");
    await pressContinue(user);

    // Retry of the first exercise, answered correctly.
    expect(screen.getByText("Alphadol")).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
    await user.keyboard("1");
    await user.keyboard("{Enter}");

    // The failed matching exercise is retried too, and the retry is not scored.
    for (const label of ["Aspirine", "Aspégic", "Tramadol", "Contramal"]) {
      await user.click(screen.getByRole("button", { name: label }));
    }
    expect(onComplete).not.toHaveBeenCalled();
    await user.keyboard("{Enter}");

    expect(screen.getByRole("heading", { name: "Leçon terminée !" })).toBeInTheDocument();
    expect(screen.getByText("Créez un compte")).toBeInTheDocument();
    expect(screen.getByText("3/5")).toBeInTheDocument();
    expect(progress()).toBe("100");
    expect(onComplete).toHaveBeenCalledOnce();
    expect(onComplete).toHaveBeenCalledWith({
      records: [
        { substanceSlug: "alpha", correct: false },
        { substanceSlug: "beta", correct: true },
        { substanceSlug: "a", correct: false },
        { substanceSlug: "b", correct: true },
        { substanceSlug: "gamma", correct: true },
      ],
      correctCount: 3,
      totalCount: 5,
      accuracy: 0.6,
      perfect: false,
    });
  });

  it("skips the intro when there are no cards and works without onComplete", async () => {
    const plan: LessonPlan = { title: "Rapide", cards: [], exercises: [CHOICE_EXERCISE] };
    render(<LessonPlayer plan={plan} exitHref="/review" />);
    await userEvent.keyboard("1");
    await userEvent.keyboard("{Enter}");
    expect(screen.getByRole("heading", { name: "Sans faute !" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Continuer" })).toHaveAttribute("href", "/review");
  });
});
