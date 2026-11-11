import type { ExerciseKind } from "@/types/quiz";

export const CHOICE_COUNT = 4;
export const MATCH_PAIR_COUNT = 4;
export const LEARN_TYPING_COUNT = 2;
export const LEARN_BRAND_RECALL_COUNT = 2;
export const REVIEW_TYPING_COUNT = 3;

export const KIND_LABELS: Record<ExerciseKind, string> = {
  "brand-to-substance": "Nom commercial → molécule",
  "substance-to-brand": "Molécule → nom commercial",
  "substance-to-class": "Molécule → famille",
  "class-to-substance": "Famille → molécule",
  "type-substance": "Écriture",
  "match-pairs": "Associations",
};

export const KIND_PROMPTS: Record<ExerciseKind, string> = {
  "brand-to-substance": "Quelle est la molécule (DCI) de ce médicament ?",
  "substance-to-brand": "Quel nom commercial correspond à cette molécule ?",
  "substance-to-class": "À quelle famille appartient cette molécule ?",
  "class-to-substance": "Quelle molécule appartient à cette famille ?",
  "type-substance": "Écrivez la molécule (DCI) de ce médicament",
  "match-pairs": "Associez les paires",
};
export const MAX_TYPED_LENGTH = 22;
