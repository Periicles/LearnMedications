"use client";

import { useState } from "react";
import { LessonPlayer } from "@/features/quiz/components/lesson-player";
import type { RewardState, TrackedLessonProps } from "@/types/progress";
import type { SessionOutcome } from "@/types/quiz";
import { completeSession } from "../actions";
import { RewardPanel } from "./reward-panel";

/** Lesson player that saves the outcome and shows the earned rewards. */
export function TrackedLesson({ plan, exitHref, context }: TrackedLessonProps) {
  const [rewardState, setRewardState] = useState<RewardState>({ status: "pending" });

  const handleComplete = async (outcome: SessionOutcome) => {
    try {
      const reward = await completeSession({ ...context, records: outcome.records });
      setRewardState(reward ? { status: "ready", reward } : { status: "failed" });
    } catch {
      setRewardState({ status: "failed" });
    }
  };

  return (
    <LessonPlayer
      plan={plan}
      exitHref={exitHref}
      onComplete={handleComplete}
      summaryFooter={<RewardPanel state={rewardState} />}
    />
  );
}
