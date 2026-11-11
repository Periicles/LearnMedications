"use client";

import { CircleCheck, CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mergeClasses } from "@/lib/class-names";
import type { FeedbackBarProps } from "@/types/quiz";
import { useKeyPress } from "../hooks/use-key-press";

export function FeedbackBar({ result, onContinue }: FeedbackBarProps) {
  const Icon = result.correct ? CircleCheck : CircleX;

  useKeyPress((pressedKey) => {
    if (pressedKey === "Enter") onContinue();
  });

  return (
    <div
      role="status"
      className={mergeClasses(
        "animate-rise fixed inset-x-0 bottom-0 z-30 border-t-2 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
        result.correct ? "border-brand bg-brand-soft" : "border-danger bg-danger-soft",
      )}
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <Icon
            className={mergeClasses(
              "size-8 shrink-0",
              result.correct ? "text-brand" : "text-danger",
            )}
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="text-lg font-black">{result.correct ? "Correct !" : "Pas tout à fait"}</p>
            <p className="font-semibold break-words">{result.message}</p>
          </div>
        </div>
        <Button
          variant={result.correct ? "primary" : "danger"}
          size="large"
          onClick={onContinue}
          className="sm:min-w-44"
        >
          Continuer
        </Button>
      </div>
    </div>
  );
}
