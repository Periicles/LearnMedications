import type { LevelProgress } from "@/types/progress";
import { XP_PER_LEVEL_STEP } from "../constants";

/** Total XP required to reach a level: 0, 100, 300, 600, 1000… */
export function xpForLevel(level: number): number {
  return XP_PER_LEVEL_STEP * (level - 1) * level;
}

export function levelFromXp(totalXp: number): number {
  let level = 1;
  while (xpForLevel(level + 1) <= totalXp) level += 1;
  return level;
}

export function levelProgress(totalXp: number): LevelProgress {
  const level = levelFromXp(totalXp);
  const floor = xpForLevel(level);
  const neededForNext = xpForLevel(level + 1) - floor;
  const earnedInLevel = totalXp - floor;
  return { level, earnedInLevel, neededForNext, ratio: earnedInLevel / neededForNext };
}
