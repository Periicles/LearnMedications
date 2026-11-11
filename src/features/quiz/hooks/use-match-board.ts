import { useState } from "react";
import type { AnswerResult, MatchExercise, MatchSelection, MatchTileProps } from "@/types/quiz";

const WRONG_FLASH_DELAY = 500;
const EMPTY_SELECTION: MatchSelection = { left: null, right: null };

function buildResult(exercise: MatchExercise, mistakes: string[]): AnswerResult {
  return {
    correct: mistakes.length === 0,
    message:
      mistakes.length === 0
        ? "Toutes les paires sont justes."
        : "Paires associées, avec des erreurs.",
    records: exercise.pairs.map((pair) => ({
      substanceSlug: pair.substanceSlug,
      correct: !mistakes.includes(pair.substanceSlug),
    })),
  };
}

export function useMatchBoard(exercise: MatchExercise, onAnswer: (result: AnswerResult) => void) {
  const [selection, setSelection] = useState<MatchSelection>(EMPTY_SELECTION);
  const [matched, setMatched] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState<string[]>([]);
  const [wrongPair, setWrongPair] = useState<MatchSelection>(EMPTY_SELECTION);

  const resolve = (left: string, right: string) => {
    const pair = exercise.pairs.find((candidate) => candidate.left === left);
    if (!pair) return;
    setSelection(EMPTY_SELECTION);
    if (pair.right !== right) {
      setMistakes((known) => [...known, pair.substanceSlug]);
      setWrongPair({ left, right });
      setTimeout(() => setWrongPair(EMPTY_SELECTION), WRONG_FLASH_DELAY);
      return;
    }
    const nextMatched = [...matched, left];
    setMatched(nextMatched);
    if (nextMatched.length === exercise.pairs.length) onAnswer(buildResult(exercise, mistakes));
  };

  const pick = (side: keyof MatchSelection, label: string) => {
    const next = { ...selection, [side]: selection[side] === label ? null : label };
    if (next.left && next.right) resolve(next.left, next.right);
    else setSelection(next);
  };

  const tileState = (side: keyof MatchSelection, label: string): MatchTileProps["state"] => {
    const pair = exercise.pairs.find((candidate) => candidate[side] === label);
    if (pair && matched.includes(pair.left)) return "matched";
    if (wrongPair[side] === label) return "wrong";
    return selection[side] === label ? "selected" : "idle";
  };

  return { pick, tileState };
}
