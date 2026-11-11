"use client";

import { useEffect, useEffectEvent, useReducer } from "react";
import type { LessonPlayerProps } from "@/types/quiz";
import { initSession, sessionProgress, sessionReducer, summarize } from "../lib/session";
import { ExerciseSwitch } from "./exercise-switch";
import { FeedbackBar } from "./feedback-bar";
import { IntroCardView } from "./intro-card";
import { LessonHeader } from "./lesson-header";
import { LessonSummary } from "./lesson-summary";

export function LessonPlayer({ plan, exitHref, onComplete, summaryFooter }: LessonPlayerProps) {
  const [state, dispatch] = useReducer(sessionReducer, plan, initSession);
  const isDone = state.phase === "done";
  const notifyComplete = useEffectEvent(() => onComplete?.(summarize(state)));

  useEffect(() => {
    if (isDone) notifyComplete();
  }, [isDone]);

  const exercise = state.queue[state.position];
  const card = plan.cards[state.cardIndex];

  return (
    <div className="flex min-h-dvh flex-col">
      <LessonHeader exitHref={exitHref} progress={isDone ? 1 : sessionProgress(state)} />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pt-4 pb-44">
        {state.phase === "intro" && card ? (
          <IntroCardView
            key={card.substanceSlug}
            card={card}
            step={state.cardIndex + 1}
            total={plan.cards.length}
            onNext={() => dispatch({ type: "next-card" })}
          />
        ) : null}
        {(state.phase === "question" || state.phase === "feedback") && exercise ? (
          <ExerciseSwitch
            key={`${exercise.id}:${state.position}`}
            exercise={exercise}
            locked={state.phase === "feedback"}
            onAnswer={(result) => dispatch({ type: "answer", result })}
          />
        ) : null}
        {isDone ? (
          <LessonSummary outcome={summarize(state)} exitHref={exitHref}>
            {summaryFooter}
          </LessonSummary>
        ) : null}
      </main>
      {state.phase === "feedback" && state.lastResult ? (
        <FeedbackBar result={state.lastResult} onContinue={() => dispatch({ type: "continue" })} />
      ) : null}
    </div>
  );
}
