import "server-only";
import { APP_TIME_ZONE } from "@/features/progress/constants";
import { createServerSupabase } from "@/lib/supabase/server";
import type { DailyXpRow } from "@/types/profile";

export async function getDailyXp(dayCount: number): Promise<DailyXpRow[]> {
  const supabase = await createServerSupabase();
  const { data } = await supabase.rpc("get_daily_xp", {
    p_time_zone: APP_TIME_ZONE,
    p_days: dayCount,
  });
  return (data as DailyXpRow[] | null) ?? [];
}
