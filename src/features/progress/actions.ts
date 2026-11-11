"use server";

import { revalidatePath } from "next/cache";
import { getSessionStats, getUnlockedAchievements } from "@/features/achievements/lib/queries";
import { findSessionBadges } from "@/features/achievements/lib/session-badges";
import { getFriendCount } from "@/features/friends/lib/queries";
import { requireUser } from "@/features/auth/lib/session";
import { outcomeFromRecords } from "@/features/quiz/lib/session";
import { sessionInputSchema } from "@/schemas/progress";
import type { SessionInput, SessionReward } from "@/types/progress";
import { toLocalDay } from "./lib/dates";
import { levelFromXp } from "./lib/levels";
import { applyRecords } from "./lib/mastery";
import { getCompletions, getMasteryRows, getProfile } from "./lib/queries";
import { saveSession } from "./lib/save-session";
import { acceptRecords } from "./lib/session-records";
import { nextStreak } from "./lib/streak";
import { computeSessionXp } from "./lib/xp";

/** Records a finished lesson or review and returns what the learner earned. */
export async function completeSession(rawInput: SessionInput): Promise<SessionReward | null> {
  const user = await requireUser();
  const parsed = sessionInputSchema.safeParse(rawInput);
  if (!parsed.success) return null;

  const [profile, masteryRows, completions, sessions, unlocked, friendCount] = await Promise.all([
    getProfile(user.id),
    getMasteryRows(user.id),
    getCompletions(user.id),
    getSessionStats(),
    getUnlockedAchievements(user.id),
    getFriendCount(),
  ]);
  const records = acceptRecords(parsed.data, completions);
  if (!profile || records.length === 0) return null;

  const moment = new Date();
  const today = toLocalDay(moment);
  const outcome = outcomeFromRecords(records);
  const xpGained = computeSessionXp(outcome, parsed.data.mode);
  const streak = nextStreak(profile, today);
  const known = new Map(masteryRows.map((mastery) => [mastery.substanceSlug, mastery]));
  const updatedMastery = applyRecords(records, known, moment);
  const badges = findSessionBadges({
    input: parsed.data,
    outcome,
    totalXp: profile.totalXp + xpGained,
    streak,
    completions,
    knownMastery: masteryRows,
    updatedMastery,
    sessions,
    friendCount,
    ownedKeys: [...unlocked.keys()],
  });

  const totalXp = await saveSession({
    userId: user.id,
    input: parsed.data,
    outcome,
    accuracy: outcome.accuracy,
    xpGained,
    today,
    streak,
    mastery: updatedMastery,
    badgeKeys: badges.map((badge) => badge.key),
  });
  if (totalXp === null) return null;

  revalidatePath("/", "layout");
  const level = levelFromXp(totalXp);
  return {
    xpGained,
    totalXp,
    level,
    leveledUp: level > levelFromXp(profile.totalXp),
    streak,
    streakExtended: profile.lastActiveOn !== today,
    badges: badges.map((badge) => ({ key: badge.key, title: badge.title, icon: badge.icon })),
  };
}
