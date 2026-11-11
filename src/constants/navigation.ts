import { BookOpen, Dumbbell, Library, Trophy, UserRound, UsersRound } from "lucide-react";
import type { NavItem } from "@/types/ui";
import { ROUTES } from "./routes";

export const NAV_ITEMS: NavItem[] = [
  { href: ROUTES.learn, label: "Leçons", icon: BookOpen },
  { href: ROUTES.review, label: "Réviser", icon: Dumbbell },
  { href: ROUTES.library, label: "Lexique", icon: Library },
  { href: ROUTES.friends, label: "Amis", icon: UsersRound },
  { href: ROUTES.achievements, label: "Succès", icon: Trophy },
  { href: ROUTES.profile, label: "Profil", icon: UserRound },
];
