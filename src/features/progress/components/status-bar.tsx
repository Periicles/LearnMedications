import { Flame, Star, Zap } from "lucide-react";
import { getSessionUser } from "@/features/auth/lib/session";
import { toLocalDay } from "../lib/dates";
import { levelFromXp } from "../lib/levels";
import { getProfile } from "../lib/queries";
import { isActiveToday, visibleStreak } from "../lib/streak";

/** Compact streak, XP and level indicators shown above every signed-in page. */
export async function StatusBar() {
  const user = await getSessionUser();
  const profile = user ? await getProfile(user.id) : null;
  if (!profile) return null;
  const today = toLocalDay(new Date());
  const dayLabel = visibleStreak(profile, today) > 1 ? "jours" : "jour";

  return (
    <ul className="flex items-center gap-4 text-sm font-extrabold" aria-label="Votre progression">
      <li
        className={isActiveToday(profile, today) ? "text-danger" : "text-ink-soft"}
        title="Série de jours consécutifs"
      >
        <Flame className="mr-1 inline size-5" aria-hidden="true" />
        {visibleStreak(profile, today)}
        <span className="sr-only"> {dayLabel} de série</span>
      </li>
      <li className="text-accent-strong dark:text-accent" title="Points d'expérience">
        <Zap className="mr-1 inline size-5" aria-hidden="true" />
        {profile.totalXp}
        <span className="sr-only"> XP</span>
      </li>
      <li className="text-brand-strong dark:text-brand" title="Niveau">
        <Star className="mr-1 inline size-5" aria-hidden="true" />
        <span aria-hidden="true">Niv. </span>
        <span className="sr-only">Niveau </span>
        {levelFromXp(profile.totalXp)}
      </li>
    </ul>
  );
}
