import { Brain, Flame, Stethoscope, UsersRound } from "lucide-react";
import type { FeatureItem } from "@/types/ui";

export const LANDING_FEATURES: FeatureItem[] = [
  {
    title: "Molécule, marque, famille",
    description:
      "Associez chaque nom commercial à sa DCI et à sa famille pharmacologique grâce à des exercices variés.",
    icon: Brain,
  },
  {
    title: "Des parcours par service",
    description:
      "Réanimation, urgences, bloc, orthopédie, psychiatrie, officine : révisez ce qui compte pour votre quotidien.",
    icon: Stethoscope,
  },
  {
    title: "Une habitude qui tient",
    description:
      "XP, niveaux, séries quotidiennes et succès pour rester motivé cinq minutes par jour.",
    icon: Flame,
  },
  {
    title: "Entre collègues",
    description:
      "Ajoutez vos amis, comparez vos progrès et grimpez dans le classement de la semaine.",
    icon: UsersRound,
  },
];
