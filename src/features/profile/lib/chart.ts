import { lastDays } from "@/features/progress/lib/dates";
import type { DailyPoint, DailyXpRow } from "@/types/profile";

const WEEKDAY_FORMAT = new Intl.DateTimeFormat("fr-FR", { weekday: "narrow", timeZone: "UTC" });

/** One point per calendar day, including the days without any activity. */
export function buildDailySeries(
  today: string,
  dayCount: number,
  rows: DailyXpRow[],
): DailyPoint[] {
  const xpByDay = new Map(rows.map((record) => [record.day, record.xp]));
  return lastDays(today, dayCount).map((dayKey) => ({
    day: dayKey,
    label: WEEKDAY_FORMAT.format(new Date(`${dayKey}T00:00:00Z`)).toUpperCase(),
    xp: xpByDay.get(dayKey) ?? 0,
  }));
}
