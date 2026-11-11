import "server-only";
import { cache } from "react";
import { createServerSupabase } from "@/lib/supabase/server";
import type {
  CompletionMap,
  CompletionRow,
  Mastery,
  MasteryRow,
  Profile,
  ProfileRow,
} from "@/types/progress";
import { toCompletionMap, toMastery, toProfile } from "./mappers";

export const PROFILE_COLUMNS =
  "id, username, avatar, total_xp, current_streak, longest_streak, last_active_on, created_at";

export const getProfile = cache(async (userId: string): Promise<Profile | null> => {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", userId)
    .maybeSingle<ProfileRow>();
  return data ? toProfile(data) : null;
});

export const getCompletions = cache(async (userId: string): Promise<CompletionMap> => {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("lesson_completions")
    .select("collection_slug, lesson_key, best_accuracy, completions")
    .eq("user_id", userId)
    .overrideTypes<CompletionRow[]>();
  return toCompletionMap(data ?? []);
});

export const getMasteryRows = cache(async (userId: string): Promise<Mastery[]> => {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("substance_mastery")
    .select("substance_slug, strength, correct_count, wrong_count, next_review_at")
    .eq("user_id", userId)
    .overrideTypes<MasteryRow[]>();
  return (data ?? []).map(toMastery);
});
