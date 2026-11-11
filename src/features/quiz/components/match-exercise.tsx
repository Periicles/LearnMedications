"use client";

import type { ExerciseViewProps, MatchExercise } from "@/types/quiz";
import { useMatchBoard } from "../hooks/use-match-board";
import { ExercisePrompt } from "./exercise-prompt";
import { MatchTile } from "./match-tile";

export function MatchExerciseView({ exercise, onAnswer }: ExerciseViewProps<MatchExercise>) {
  const { pick, tileState } = useMatchBoard(exercise, onAnswer);

  return (
    <div className="animate-pop flex flex-col gap-5">
      <ExercisePrompt kind={exercise.kind} />
      <div className="grid grid-cols-2 gap-2.5">
        <ul className="flex flex-col gap-2.5">
          {exercise.pairs.map((pair) => (
            <li key={pair.left}>
              <MatchTile
                label={pair.left}
                state={tileState("left", pair.left)}
                onSelect={() => pick("left", pair.left)}
              />
            </li>
          ))}
        </ul>
        <ul className="flex flex-col gap-2.5">
          {exercise.rightOrder.map((label) => (
            <li key={label}>
              <MatchTile
                label={label}
                state={tileState("right", label)}
                onSelect={() => pick("right", label)}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
