import type { Achievement, AchievementMetric } from "@/types/achievements";

function define(
  badgeKey: string,
  icon: string,
  title: string,
  description: string,
  metric: AchievementMetric,
  threshold: number,
): Achievement {
  return { key: badgeKey, icon, title, description, metric, threshold };
}

export const ACHIEVEMENTS: Achievement[] = [
  define("first-lesson", "🎬", "Premier pas", "Terminer une première leçon", "lessonCount", 1),
  define("lessons-10", "📘", "Studieux", "Terminer 10 leçons", "lessonCount", 10),
  define("lessons-50", "📚", "Rat de bibliothèque", "Terminer 50 leçons", "lessonCount", 50),
  define("lessons-150", "🎓", "Major de promo", "Terminer 150 leçons", "lessonCount", 150),
  define("perfect-1", "🎯", "Sans faute", "Réussir une session sans erreur", "perfectCount", 1),
  define(
    "perfect-10",
    "💎",
    "Précision chirurgicale",
    "10 sessions sans erreur",
    "perfectCount",
    10,
  ),
  define("perfect-50", "👑", "Infaillible", "50 sessions sans erreur", "perfectCount", 50),
  define("streak-3", "🔥", "Bien lancé", "3 jours d'affilée", "streak", 3),
  define("streak-7", "📅", "Une semaine complète", "7 jours d'affilée", "streak", 7),
  define("streak-30", "🌙", "Un mois sans faillir", "30 jours d'affilée", "streak", 30),
  define("streak-100", "💯", "Cent jours", "100 jours d'affilée", "streak", 100),
  define("xp-100", "⚡", "Première étincelle", "Gagner 100 XP", "totalXp", 100),
  define("xp-1000", "🚀", "Sur orbite", "Gagner 1 000 XP", "totalXp", 1000),
  define("xp-5000", "🌟", "Supernova", "Gagner 5 000 XP", "totalXp", 5000),
  define("level-5", "🥉", "Niveau 5", "Atteindre le niveau 5", "level", 5),
  define("level-10", "🥈", "Niveau 10", "Atteindre le niveau 10", "level", 10),
  define("level-20", "🥇", "Niveau 20", "Atteindre le niveau 20", "level", 20),
  define("learned-25", "🌱", "Jeune pousse", "Rencontrer 25 molécules", "learnedCount", 25),
  define("learned-100", "🌿", "Herboriste", "Rencontrer 100 molécules", "learnedCount", 100),
  define(
    "learned-300",
    "🌳",
    "Pharmacopée vivante",
    "Rencontrer 300 molécules",
    "learnedCount",
    300,
  ),
  define("mastered-10", "🧠", "Bonne mémoire", "Maîtriser 10 molécules", "masteredCount", 10),
  define("mastered-50", "🧪", "Préparateur", "Maîtriser 50 molécules", "masteredCount", 50),
  define("mastered-150", "⚗️", "Apothicaire", "Maîtriser 150 molécules", "masteredCount", 150),
  define("review-10", "🔁", "Piqûre de rappel", "Terminer 10 révisions", "reviewCount", 10),
  define("review-50", "♻️", "Rappels à jour", "Terminer 50 révisions", "reviewCount", 50),
  define("path-1", "🏁", "Parcours bouclé", "Terminer un parcours complet", "finishedPaths", 1),
  define("path-5", "🗺️", "Globe-trotteur", "Terminer 5 parcours complets", "finishedPaths", 5),
  define("friend-1", "🤝", "Binôme", "Ajouter un premier ami", "friendCount", 1),
  define("friend-5", "👥", "Équipe de garde", "Avoir 5 amis", "friendCount", 5),
];
