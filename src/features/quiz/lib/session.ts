import type { LessonPlan, SessionAction, SessionOutcome, SessionState } from "@/types/quiz";

export function initSession(plan: LessonPlan): SessionState {
  return {
    phase: plan.cards.length > 0 ? "intro" : "question",
    cardIndex: 0,
    cardCount: plan.cards.length,
    queue: plan.exercises,
    position: 0,
    records: [],
    retriedIds: [],
    lastResult: null,
  };
}

function applyAnswer(state: SessionState, action: SessionAction): SessionState {
  if (action.type !== "answer" || state.phase !== "question") return state;
  const exercise = state.queue[state.position];
  const isRetry = state.retriedIds.includes(exercise.id);
  const shouldRetry = !action.result.correct && !isRetry;
  return {
    ...state,
    phase: "feedback",
    lastResult: action.result,
    records: isRetry ? state.records : [...state.records, ...action.result.records],
    queue: shouldRetry ? [...state.queue, exercise] : state.queue,
    retriedIds: shouldRetry ? [...state.retriedIds, exercise.id] : state.retriedIds,
  };
}

function applyContinue(state: SessionState): SessionState {
  if (state.phase !== "feedback") return state;
  const position = state.position + 1;
  const isDone = position >= state.queue.length;
  return { ...state, position, lastResult: null, phase: isDone ? "done" : "question" };
}

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  if (action.type === "next-card") {
    if (state.phase !== "intro") return state;
    const cardIndex = state.cardIndex + 1;
    return { ...state, cardIndex, phase: cardIndex >= state.cardCount ? "question" : "intro" };
  }
  return action.type === "answer" ? applyAnswer(state, action) : applyContinue(state);
}

export function sessionProgress(state: SessionState): number {
  if (state.queue.length === 0) return 1;
  const answered = state.phase === "feedback" ? state.position + 1 : state.position;
  return Math.min(answered / state.queue.length, 1);
}

export function summarize(state: SessionState): SessionOutcome {
  const totalCount = state.records.length;
  const correctCount = state.records.filter((record) => record.correct).length;
  return {
    records: state.records,
    correctCount,
    totalCount,
    accuracy: totalCount > 0 ? correctCount / totalCount : 0,
    perfect: totalCount > 0 && correctCount === totalCount,
  };
}
