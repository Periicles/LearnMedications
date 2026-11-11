import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CHOICE_EXERCISE } from "@/testing/quiz-fixtures";
import { ChoiceButton } from "./choice-button";
import { ChoiceExerciseView } from "./choice-exercise";
import { ExercisePrompt } from "./exercise-prompt";

describe("ChoiceButton", () => {
  it("renders the label with its shortcut and state", async () => {
    const onSelect = vi.fn();
    render(
      <ChoiceButton
        label="Option"
        shortcut={2}
        state="wrong"
        disabled={false}
        onSelect={onSelect}
      />,
    );
    const button = screen.getByRole("button", { name: /Option/ });
    expect(button).toHaveClass("border-danger");
    expect(screen.getByText("2")).toBeInTheDocument();
    await userEvent.click(button);
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("does not fire when disabled", async () => {
    const onSelect = vi.fn();
    render(
      <ChoiceButton label="Option" shortcut={1} state="dimmed" disabled onSelect={onSelect} />,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onSelect).not.toHaveBeenCalled();
  });
});

describe("ExercisePrompt", () => {
  it("shows the badge, the question and the subject", () => {
    render(<ExercisePrompt kind="brand-to-substance" subject="Doliprane" />);
    expect(screen.getByText("Nom commercial → molécule")).toBeInTheDocument();
    expect(screen.getByRole("heading")).toHaveTextContent("Quelle est la molécule (DCI)");
    expect(screen.getByText("Doliprane")).toBeInTheDocument();
  });

  it("omits the subject for exercises without one", () => {
    render(<ExercisePrompt kind="match-pairs" />);
    expect(screen.getByRole("heading")).toHaveTextContent("Associez les paires");
    expect(screen.queryByText("Doliprane")).not.toBeInTheDocument();
  });
});

describe("ChoiceExerciseView", () => {
  it("reports a correct answer and marks the buttons", async () => {
    const onAnswer = vi.fn();
    render(<ChoiceExerciseView exercise={CHOICE_EXERCISE} locked={false} onAnswer={onAnswer} />);
    await userEvent.click(screen.getByRole("button", { name: /Alphamol/ }));
    expect(onAnswer).toHaveBeenCalledWith({
      correct: true,
      message: CHOICE_EXERCISE.fact,
      records: [{ substanceSlug: "alpha", correct: true }],
    });
    expect(screen.getByRole("button", { name: /Alphamol/ })).toHaveClass("border-brand");
    expect(screen.getByRole("button", { name: /Betamol/ })).toBeDisabled();
  });

  it("flags the wrong pick, shows the answer and only answers once", async () => {
    const onAnswer = vi.fn();
    render(<ChoiceExerciseView exercise={CHOICE_EXERCISE} locked={false} onAnswer={onAnswer} />);
    await userEvent.click(screen.getByRole("button", { name: /Betamol/ }));
    expect(onAnswer).toHaveBeenCalledWith(expect.objectContaining({ correct: false }));
    expect(screen.getByRole("button", { name: /Betamol/ })).toHaveClass("border-danger");
    expect(screen.getByRole("button", { name: /Alphamol/ })).toHaveClass("border-brand");
    expect(screen.getByRole("button", { name: /Gammamol/ })).toHaveClass("opacity-50");
    await userEvent.keyboard("1");
    expect(onAnswer).toHaveBeenCalledOnce();
  });

  it("answers with the number keys and ignores other keys", async () => {
    const onAnswer = vi.fn();
    render(<ChoiceExerciseView exercise={CHOICE_EXERCISE} locked={false} onAnswer={onAnswer} />);
    await userEvent.keyboard("9x");
    expect(onAnswer).not.toHaveBeenCalled();
    await userEvent.keyboard("2");
    expect(onAnswer).toHaveBeenCalledWith(expect.objectContaining({ correct: false }));
  });

  it("ignores everything while locked", async () => {
    const onAnswer = vi.fn();
    render(<ChoiceExerciseView exercise={CHOICE_EXERCISE} locked onAnswer={onAnswer} />);
    await userEvent.keyboard("1");
    expect(onAnswer).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: /Alphamol/ })).toBeDisabled();
  });
});
