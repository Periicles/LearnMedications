import type { ReactNode } from "react";

export type ChoiceKind =
  "brand-to-substance" | "substance-to-brand" | "substance-to-class" | "class-to-substance";

export type ExerciseKind = ChoiceKind | "type-substance" | "match-pairs";
export type PlanMode = "learn" | "review";
export type RandomSource = () => number;
export type SessionPhase = "intro" | "question" | "feedback" | "done";
export type TypedVerdict = "exact" | "typo" | "wrong";

export interface ChoiceExercise {
  id: string;
  kind: ChoiceKind;
  substanceSlug: string;
  subject: string;
  choices: string[];
  answer: string;
  fact: string;
}

export interface TypingExercise {
  id: string;
  kind: "type-substance";
  substanceSlug: string;
  subject: string;
  answer: string;
  fact: string;
}

export interface MatchPair {
  substanceSlug: string;
  left: string;
  right: string;
}

export interface MatchExercise {
  id: string;
  kind: "match-pairs";
  pairs: MatchPair[];
  rightOrder: string[];
}

export type Exercise = ChoiceExercise | TypingExercise | MatchExercise;

export interface IntroCard {
  substanceSlug: string;
  name: string;
  brands: string[];
  className: string;
  classSummary: string;
  hint: string;
}

export interface LessonPlan {
  title: string;
  cards: IntroCard[];
  exercises: Exercise[];
}

export interface AnswerRecord {
  substanceSlug: string;
  correct: boolean;
}

export interface AnswerResult {
  correct: boolean;
  records: AnswerRecord[];
  message: string;
}

export interface SessionState {
  phase: SessionPhase;
  cardIndex: number;
  cardCount: number;
  queue: Exercise[];
  position: number;
  records: AnswerRecord[];
  retriedIds: string[];
  lastResult: AnswerResult | null;
}

export type SessionAction =
  { type: "next-card" } | { type: "answer"; result: AnswerResult } | { type: "continue" };

export interface SessionOutcome {
  records: AnswerRecord[];
  correctCount: number;
  totalCount: number;
  accuracy: number;
  perfect: boolean;
}

export interface LessonPlayerProps {
  plan: LessonPlan;
  exitHref: string;
  /** Called once when the last exercise is answered. */
  onComplete?: (outcome: SessionOutcome) => void;
  /** Extra content for the summary screen, such as rewards or calls to action. */
  summaryFooter?: ReactNode;
}

export interface ExerciseViewProps<Kind extends Exercise> {
  exercise: Kind;
  locked: boolean;
  onAnswer: (result: AnswerResult) => void;
}

export interface IntroCardViewProps {
  card: IntroCard;
  step: number;
  total: number;
  onNext: () => void;
}

export interface FeedbackBarProps {
  result: AnswerResult;
  onContinue: () => void;
}

export interface LessonHeaderProps {
  exitHref: string;
  progress: number;
}

export interface LessonSummaryProps {
  outcome: SessionOutcome;
  exitHref: string;
  children?: ReactNode;
}

export interface ChoiceButtonProps {
  label: string;
  shortcut: number;
  state: "idle" | "correct" | "wrong" | "dimmed";
  disabled: boolean;
  onSelect: () => void;
}

export interface MatchTileProps {
  label: string;
  state: "idle" | "selected" | "matched" | "wrong";
  onSelect: () => void;
}

export interface MatchSelection {
  left: string | null;
  right: string | null;
}

export interface ExercisePromptProps {
  kind: ExerciseKind;
  subject?: string;
}

export interface ExerciseSwitchProps {
  exercise: Exercise;
  locked: boolean;
  onAnswer: (result: AnswerResult) => void;
}
