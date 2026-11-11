"use client";

import { useState } from "react";
import type { ChoiceButtonProps, ChoiceExercise, ExerciseViewProps } from "@/types/quiz";
import { useKeyPress } from "../hooks/use-key-press";
import { ChoiceButton } from "./choice-button";
import { ExercisePrompt } from "./exercise-prompt";

function choiceState(
  choice: string,
  answer: string,
  selected: string | null,
): ChoiceButtonProps["state"] {
  if (selected === null) return "idle";
  if (choice === answer) return "correct";
  return choice === selected ? "wrong" : "dimmed";
}

export function ChoiceExerciseView(props: ExerciseViewProps<ChoiceExercise>) {
  const { exercise, locked, onAnswer } = props;
  const [selected, setSelected] = useState<string | null>(null);

  const select = (choice: string) => {
    if (locked || selected !== null) return;
    const correct = choice === exercise.answer;
    setSelected(choice);
    onAnswer({
      correct,
      message: exercise.fact,
      records: [{ substanceSlug: exercise.substanceSlug, correct }],
    });
  };

  useKeyPress((pressedKey) => {
    const choice = exercise.choices[Number(pressedKey) - 1];
    if (choice) select(choice);
  });

  return (
    <div className="animate-pop flex flex-col gap-5">
      <ExercisePrompt kind={exercise.kind} subject={exercise.subject} />
      <ul className="flex flex-col gap-2.5">
        {exercise.choices.map((choice, index) => (
          <li key={choice}>
            <ChoiceButton
              label={choice}
              shortcut={index + 1}
              state={choiceState(choice, exercise.answer, selected)}
              disabled={locked || selected !== null}
              onSelect={() => select(choice)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
