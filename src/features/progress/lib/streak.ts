import type { StreakState } from "@/types/progress";
import { shiftDay } from "./dates";

/** Streak value after an activity recorded on `today`. */
export function nextStreak(state: StreakState, today: string): number {
  if (state.lastActiveOn === today) return Math.max(state.currentStreak, 1);
  if (state.lastActiveOn === shiftDay(today, -1)) return state.currentStreak + 1;
  return 1;
}

/** Streak to display: it is lost once a full day has been missed. */
export function visibleStreak(state: StreakState, today: string): number {
  const isAlive = state.lastActiveOn === today || state.lastActiveOn === shiftDay(today, -1);
  return isAlive ? state.currentStreak : 0;
}

export function isActiveToday(state: StreakState, today: string): boolean {
  return state.lastActiveOn === today;
}
