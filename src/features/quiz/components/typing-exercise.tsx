"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import type { ExerciseViewProps, TypingExercise } from "@/types/quiz";
import { gradeTyped } from "../lib/grading";
import { ExercisePrompt } from "./exercise-prompt";

export function TypingExerciseView(props: ExerciseViewProps<TypingExercise>) {
  const { exercise, locked, onAnswer } = props;
  const [typed, setTyped] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (locked || typed.trim().length === 0) return;
    const verdict = gradeTyped(typed, exercise.answer);
    const correct = verdict !== "wrong";
    const prefix = verdict === "typo" ? "Attention à l'orthographe : " : "";
    onAnswer({
      correct,
      message: `${prefix}${exercise.fact}`,
      records: [{ substanceSlug: exercise.substanceSlug, correct }],
    });
  };

  return (
    <form onSubmit={submit} className="animate-pop flex flex-col gap-5">
      <ExercisePrompt kind={exercise.kind} subject={exercise.subject} />
      <input
        value={typed}
        onChange={(event) => setTyped(event.target.value)}
        readOnly={locked}
        autoFocus
        aria-label="Votre réponse"
        placeholder="Nom de la molécule"
        autoCapitalize="none"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="done"
        className="border-line bg-surface focus:border-brand min-h-14 rounded-2xl border-2 px-4 text-lg font-bold"
      />
      {locked ? null : (
        <Button type="submit" size="large" fullWidth disabled={typed.trim().length === 0}>
          Valider
        </Button>
      )}
    </form>
  );
}
