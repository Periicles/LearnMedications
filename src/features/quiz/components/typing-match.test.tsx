import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MATCH_EXERCISE, TYPING_EXERCISE } from "@/testing/quiz-fixtures";
import { ExerciseSwitch } from "./exercise-switch";
import { MatchExerciseView } from "./match-exercise";
import { MatchTile } from "./match-tile";
import { TypingExerciseView } from "./typing-exercise";

describe("TypingExerciseView", () => {
  it("keeps the submit button disabled until something is typed", async () => {
    render(<TypingExerciseView exercise={TYPING_EXERCISE} locked={false} onAnswer={vi.fn()} />);
    const submit = screen.getByRole("button", { name: "Valider" });
    expect(submit).toBeDisabled();
    await userEvent.type(screen.getByLabelText("Votre réponse"), "  ");
    expect(submit).toBeDisabled();
    await userEvent.type(screen.getByLabelText("Votre réponse"), "a");
    expect(submit).toBeEnabled();
  });

  it("accepts an exact answer ignoring accents and case", async () => {
    const onAnswer = vi.fn();
    render(<TypingExerciseView exercise={TYPING_EXERCISE} locked={false} onAnswer={onAnswer} />);
    await userEvent.type(screen.getByLabelText("Votre réponse"), "PARACETAMOL{Enter}");
    expect(onAnswer).toHaveBeenCalledWith({
      correct: true,
      message: TYPING_EXERCISE.fact,
      records: [{ substanceSlug: "gamma", correct: true }],
    });
  });

  it("accepts a typo with a spelling warning", async () => {
    const onAnswer = vi.fn();
    render(<TypingExerciseView exercise={TYPING_EXERCISE} locked={false} onAnswer={onAnswer} />);
    await userEvent.type(screen.getByLabelText("Votre réponse"), "Paracetamoll");
    await userEvent.click(screen.getByRole("button", { name: "Valider" }));
    expect(onAnswer).toHaveBeenCalledWith(
      expect.objectContaining({
        correct: true,
        message: `Attention à l'orthographe : ${TYPING_EXERCISE.fact}`,
      }),
    );
  });

  it("rejects a wrong answer", async () => {
    const onAnswer = vi.fn();
    render(<TypingExerciseView exercise={TYPING_EXERCISE} locked={false} onAnswer={onAnswer} />);
    await userEvent.type(screen.getByLabelText("Votre réponse"), "Ibuprofène{Enter}");
    expect(onAnswer).toHaveBeenCalledWith(expect.objectContaining({ correct: false }));
  });

  it("is read-only without a button once locked and never answers", async () => {
    const onAnswer = vi.fn();
    render(<TypingExerciseView exercise={TYPING_EXERCISE} locked onAnswer={onAnswer} />);
    expect(screen.getByLabelText("Votre réponse")).toHaveAttribute("readonly");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    await userEvent.type(screen.getByLabelText("Votre réponse"), "x{Enter}");
    expect(onAnswer).not.toHaveBeenCalled();
  });
});

describe("MatchTile", () => {
  it("exposes the selected and matched states", () => {
    render(
      <>
        <MatchTile label="Sélectionnée" state="selected" onSelect={vi.fn()} />
        <MatchTile label="Associée" state="matched" onSelect={vi.fn()} />
      </>,
    );
    expect(screen.getByRole("button", { name: "Sélectionnée" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Associée" })).toBeDisabled();
  });
});

describe("MatchExerciseView", () => {
  beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
  afterEach(() => vi.useRealTimers());

  it("toggles a selection, flashes a wrong pair and then answers with the mistake", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const onAnswer = vi.fn();
    render(<MatchExerciseView exercise={MATCH_EXERCISE} locked={false} onAnswer={onAnswer} />);
    await user.click(screen.getByRole("button", { name: "Aspirine" }));
    expect(screen.getByRole("button", { name: "Aspirine" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await user.click(screen.getByRole("button", { name: "Aspirine" }));
    expect(screen.getByRole("button", { name: "Aspirine" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );

    await user.click(screen.getByRole("button", { name: "Aspirine" }));
    await user.click(screen.getByRole("button", { name: "Contramal" }));
    expect(screen.getByRole("button", { name: "Contramal" })).toHaveClass("animate-shake");
    act(() => vi.advanceTimersByTime(500));
    expect(screen.getByRole("button", { name: "Contramal" })).not.toHaveClass("animate-shake");

    await user.click(screen.getByRole("button", { name: "Aspirine" }));
    await user.click(screen.getByRole("button", { name: "Aspégic" }));
    expect(screen.getByRole("button", { name: "Aspirine" })).toBeDisabled();
    expect(onAnswer).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Tramadol" }));
    await user.click(screen.getByRole("button", { name: "Contramal" }));
    expect(onAnswer).toHaveBeenCalledWith({
      correct: false,
      message: "Paires associées, avec des erreurs.",
      records: [
        { substanceSlug: "a", correct: false },
        { substanceSlug: "b", correct: true },
      ],
    });
  });

  it("answers correctly when every pair is right", async () => {
    const onAnswer = vi.fn();
    render(<MatchExerciseView exercise={MATCH_EXERCISE} locked={false} onAnswer={onAnswer} />);
    await userEvent.click(screen.getByRole("button", { name: "Aspégic" }));
    await userEvent.click(screen.getByRole("button", { name: "Aspirine" }));
    await userEvent.click(screen.getByRole("button", { name: "Tramadol" }));
    await userEvent.click(screen.getByRole("button", { name: "Contramal" }));
    expect(onAnswer).toHaveBeenCalledWith(
      expect.objectContaining({ correct: true, message: "Toutes les paires sont justes." }),
    );
  });
});

describe("ExerciseSwitch", () => {
  it("renders the view matching the exercise kind", () => {
    const { rerender } = render(
      <ExerciseSwitch exercise={MATCH_EXERCISE} locked={false} onAnswer={vi.fn()} />,
    );
    expect(screen.getByText("Associez les paires")).toBeInTheDocument();
    rerender(<ExerciseSwitch exercise={TYPING_EXERCISE} locked={false} onAnswer={vi.fn()} />);
    expect(screen.getByLabelText("Votre réponse")).toBeInTheDocument();
  });
});
