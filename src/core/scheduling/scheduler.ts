import {
  createEmptyCard,
  FSRSVersion,
  fsrs,
  Rating,
  type Card,
  type CardInput,
  type Grade,
} from 'ts-fsrs';

export const SCHEDULER_PARAMETER_ID = 'retention-0.90_steps-1m-10m_v1';

const scheduler = fsrs({
  request_retention: 0.9,
  enable_short_term: true,
  learning_steps: ['1m', '10m'],
  relearning_steps: ['1m', '10m'],
});

export type RecallRating = 'again' | 'good';

export type StoredCard = {
  dueAt: number;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  learningSteps: number;
  reps: number;
  lapses: number;
  state: number;
  lastReviewAt: number | null;
};

export type ScheduleResult = {
  previous: StoredCard;
  next: StoredCard;
  rating: RecallRating;
  schedulerVersion: string;
  parameterId: string;
};

function toStoredCard(card: Card): StoredCard {
  return {
    dueAt: card.due.getTime(),
    stability: card.stability,
    difficulty: card.difficulty,
    elapsedDays: card.elapsed_days,
    scheduledDays: card.scheduled_days,
    learningSteps: card.learning_steps,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
    lastReviewAt: card.last_review?.getTime() ?? null,
  };
}

function toCardInput(card: StoredCard): CardInput {
  return {
    due: card.dueAt,
    stability: card.stability,
    difficulty: card.difficulty,
    elapsed_days: card.elapsedDays,
    scheduled_days: card.scheduledDays,
    learning_steps: card.learningSteps,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
    last_review: card.lastReviewAt,
  };
}

export function createInitialStoredCard(now: number): StoredCard {
  return toStoredCard(createEmptyCard(now));
}

export function rateCard(
  current: StoredCard | null,
  rating: RecallRating,
  now: number,
): ScheduleResult {
  const previous = current ?? createInitialStoredCard(now);
  const grade: Grade = rating === 'again' ? Rating.Again : Rating.Good;
  const result = scheduler.next(toCardInput(previous), now, grade);

  return {
    previous,
    next: toStoredCard(result.card),
    rating,
    schedulerVersion: FSRSVersion,
    parameterId: SCHEDULER_PARAMETER_ID,
  };
}

export function isDue(card: StoredCard | null, now: number): boolean {
  return card === null || card.dueAt <= now;
}
