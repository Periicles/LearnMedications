import type { CollectionMeta, ServiceMeta } from "@/types/content";

export const SERVICE_SLUGS = [
  "emergency",
  "intensive-care",
  "neuro-icu",
  "anesthesia",
  "orthopedic-surgery",
  "geriatrics",
  "pediatrics",
  "psychiatry",
  "oncology",
  "community-pharmacy",
] as const;

export const LESSON_SIZE = 5;
export const MIN_LESSON_SIZE = 3;

export const ESSENTIALS_COLLECTION: CollectionMeta = {
  slug: "essentials",
  title: "Les essentiels",
  description: "Les médicaments incontournables, toutes spécialités confondues.",
  icon: "⭐",
  kind: "general",
};

export const SERVICES: ServiceMeta[] = [
  {
    slug: "emergency",
    title: "Urgences et SMUR",
    description: "Les traitements de l'urgence vitale et du quotidien aux urgences.",
    icon: "🚑",
  },
  {
    slug: "intensive-care",
    title: "Réanimation médicale",
    description: "Sédation, amines, anti-infectieux et traitements de réanimation.",
    icon: "🏥",
  },
  {
    slug: "neuro-icu",
    title: "Réanimation neurologique",
    description: "Neuro-réanimation et neurochirurgie : osmothérapie, antiépileptiques, sédation.",
    icon: "🧠",
  },
  {
    slug: "anesthesia",
    title: "Anesthésie et bloc opératoire",
    description: "Hypnotiques, morphiniques, curares et médicaments du bloc.",
    icon: "😴",
  },
  {
    slug: "orthopedic-surgery",
    title: "Chirurgie orthopédique",
    description: "Antalgiques, anticoagulants, antibioprophylaxie et suites opératoires.",
    icon: "🦴",
  },
  {
    slug: "geriatrics",
    title: "Gériatrie",
    description: "Les traitements les plus fréquents chez la personne âgée.",
    icon: "🧓",
  },
  {
    slug: "pediatrics",
    title: "Pédiatrie",
    description: "Les médicaments courants chez l'enfant.",
    icon: "🧒",
  },
  {
    slug: "psychiatry",
    title: "Psychiatrie",
    description: "Antidépresseurs, anxiolytiques, antipsychotiques et addictologie.",
    icon: "💭",
  },
  {
    slug: "oncology",
    title: "Oncologie",
    description: "Chimiothérapies, thérapies ciblées et soins de support.",
    icon: "🎗️",
  },
  {
    slug: "community-pharmacy",
    title: "Officine",
    description: "Les médicaments les plus délivrés en pharmacie de ville.",
    icon: "⚕️",
  },
];
