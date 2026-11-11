import "server-only";
import { cache } from "react";
import { createServerSupabase } from "@/lib/supabase/server";
import type { AchievementRow, SessionStats, SessionStatsRow } from "@/types/achievements";
import { EMPTY_SESSION_STATS } from "./stats";

/** Unlock dates by achievement key. */
export const getUnlockedAchievements = cache(
  async (userId: string): Promise<Map<string, string>> => {
    const supabase = await createServerSupabase();
    const { data } = await supabase
      .from("user_achievements")
      .select("achievement_key, unlocked_at")
      .eq("user_id", userId)
      .overrideTypes<AchievementRow[]>();
    return new Map((data ?? []).map((record) => [record.achievement_key, record.unlocked_at]));
  },
);

export const getSessionStats = cache(async (): Promise<SessionStats> => {
  const supabase = await createServerSupabase();
  const { data } = await supabase.rpc("get_session_stats").maybeSingle<SessionStatsRow>();
  if (!data) return EMPTY_SESSION_STATS;
  return {
    sessionCount: data.session_count,
    perfectCount: data.perfect_count,
    reviewCount: data.review_count,
    answerCount: data.answer_count,
    correctCount: data.correct_count,
  };
});
