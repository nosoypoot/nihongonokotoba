import type { RecallRating } from '@/src/core/scheduling/scheduler';

export type SessionCard = {
  cardId: string;
  entryId: string;
  senseId: string;
};

type SessionPhase = 'recall' | 'revealed' | 'complete';

export type StudySession = {
  phase: SessionPhase;
  current: SessionCard | null;
  queue: SessionCard[];
  totalInitialCards: number;
  ratedAttempts: number;
  rememberedAttempts: number;
  againAttempts: number;
  attemptsByCard: Record<string, number>;
  practicedCardIds: string[];
};

export type SessionAction =
  | { type: 'reveal' }
  | { type: 'rate'; rating: RecallRating };

export function createStudySession(cards: SessionCard[]): StudySession {
  const [current = null, ...queue] = cards;

  return {
    phase: current ? 'recall' : 'complete',
    current,
    queue,
    totalInitialCards: cards.length,
    ratedAttempts: 0,
    rememberedAttempts: 0,
    againAttempts: 0,
    attemptsByCard: {},
    practicedCardIds: [],
  };
}

export function sessionReducer(
  state: StudySession,
  action: SessionAction,
): StudySession {
  if (state.phase === 'complete' || !state.current) {
    return state;
  }

  if (action.type === 'reveal') {
    if (state.phase !== 'recall') {
      return state;
    }
    return { ...state, phase: 'revealed' };
  }

  if (state.phase !== 'revealed') {
    return state;
  }

  const current = state.current;
  const attemptCount = (state.attemptsByCard[current.cardId] ?? 0) + 1;
  const nextQueue = [...state.queue];

  // A forgotten card may return once, but only after two other cards. If the
  // session cannot provide that separation, it waits for the next session.
  if (action.rating === 'again' && attemptCount < 2 && nextQueue.length >= 2) {
    nextQueue.splice(2, 0, current);
  }

  const [next = null, ...remaining] = nextQueue;
  const practicedCardIds = state.practicedCardIds.includes(current.cardId)
    ? state.practicedCardIds
    : [...state.practicedCardIds, current.cardId];

  return {
    ...state,
    phase: next ? 'recall' : 'complete',
    current: next,
    queue: remaining,
    ratedAttempts: state.ratedAttempts + 1,
    rememberedAttempts:
      state.rememberedAttempts + (action.rating === 'good' ? 1 : 0),
    againAttempts: state.againAttempts + (action.rating === 'again' ? 1 : 0),
    attemptsByCard: {
      ...state.attemptsByCard,
      [current.cardId]: attemptCount,
    },
    practicedCardIds,
  };
}
