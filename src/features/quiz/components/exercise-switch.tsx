import type { ExerciseSwitchProps } from "@/types/quiz";
import { ChoiceExerciseView } from "./choice-exercise";
import { MatchExerciseView } from "./match-exercise";
import { TypingExerciseView } from "./typing-exercise";

export function ExerciseSwitch({ exercise, locked, onAnswer }: ExerciseSwitchProps) {
  if (exercise.kind === "match-pairs") {
    return <MatchExerciseView exercise={exercise} locked={locked} onAnswer={onAnswer} />;
  }
  if (exercise.kind === "type-substance") {
    return <TypingExerciseView exercise={exercise} locked={locked} onAnswer={onAnswer} />;
  }
  return <ChoiceExerciseView exercise={exercise} locked={locked} onAnswer={onAnswer} />;
}
