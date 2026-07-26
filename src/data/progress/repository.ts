import type { SQLiteDatabase } from 'expo-sqlite';

import {
  rateCard,
  type RecallRating,
  type StoredCard,
} from '@/src/core/scheduling/scheduler';
import {
  DEFAULT_STUDY_WRITING_PREFERENCE,
  isStudyWritingPreference,
  type StudyWritingPreference,
} from '@/src/core/preferences/study-writing';

const STUDY_WRITING_PREFERENCE_KEY = 'study_writing_preference';

type CardStateRow = {
  due_at: number;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  learning_steps: number;
  reps: number;
  lapses: number;
  state: number;
  last_review_at: number | null;
};

export type Attempt = {
  attemptId: number;
  cardId: string;
  entryId: string;
  lessonId: string;
  rating: RecallRating;
  recallClaim: RecallRating | null;
  reviewedAt: number;
};

type RecordAttemptInput = {
  cardId: string;
  entryId: string;
  lessonId: string;
  rating: RecallRating;
  recallClaim: RecallRating;
  now: number;
};

export type ProgressRepository = {
  enrollLesson(lessonId: string, now: number): Promise<void>;
  markFocusedSessionComplete(lessonId: string): Promise<void>;
  getFocusedSessionCount(lessonId: string): Promise<number>;
  getStudyWritingPreference(): Promise<StudyWritingPreference>;
  setStudyWritingPreference(preference: StudyWritingPreference): Promise<void>;
  getCardState(cardId: string): Promise<StoredCard | null>;
  countDueCards(now: number): Promise<number>;
  countAttemptsForLesson(lessonId: string): Promise<number>;
  recordAttempt(input: RecordAttemptInput): Promise<StoredCard>;
  listRecentAttempts(limit?: number): Promise<Attempt[]>;
};

function rowToCard(row: CardStateRow): StoredCard {
  return {
    dueAt: row.due_at,
    stability: row.stability,
    difficulty: row.difficulty,
    elapsedDays: row.elapsed_days,
    scheduledDays: row.scheduled_days,
    learningSteps: row.learning_steps,
    reps: row.reps,
    lapses: row.lapses,
    state: row.state,
    lastReviewAt: row.last_review_at,
  };
}

export function createProgressRepository(
  database: SQLiteDatabase,
): ProgressRepository {
  return {
    async enrollLesson(lessonId, now) {
      await database.runAsync(
        `INSERT INTO lesson_enrollment (lesson_id, enrolled_at, excluded)
         VALUES (?, ?, 0)
         ON CONFLICT(lesson_id) DO UPDATE SET excluded = 0`,
        lessonId,
        now,
      );
    },

    async markFocusedSessionComplete(lessonId) {
      await database.runAsync(
        `UPDATE lesson_enrollment
         SET
           focused_session_count = focused_session_count + 1,
           eligible_for_cumulative =
             CASE WHEN focused_session_count + 1 >= 3 THEN 1 ELSE 0 END
         WHERE lesson_id = ?`,
        lessonId,
      );
    },

    async getFocusedSessionCount(lessonId) {
      const row = await database.getFirstAsync<{ focused_session_count: number }>(
        `SELECT focused_session_count
         FROM lesson_enrollment
         WHERE lesson_id = ?`,
        lessonId,
      );
      return row?.focused_session_count ?? 0;
    },

    async getStudyWritingPreference() {
      const row = await database.getFirstAsync<{ preference_value: string }>(
        `SELECT preference_value
         FROM app_preference
         WHERE preference_key = ?`,
        STUDY_WRITING_PREFERENCE_KEY,
      );
      return isStudyWritingPreference(row?.preference_value)
        ? row.preference_value
        : DEFAULT_STUDY_WRITING_PREFERENCE;
    },

    async setStudyWritingPreference(preference) {
      await database.runAsync(
        `INSERT INTO app_preference (preference_key, preference_value)
         VALUES (?, ?)
         ON CONFLICT(preference_key) DO UPDATE SET
           preference_value = excluded.preference_value`,
        STUDY_WRITING_PREFERENCE_KEY,
        preference,
      );
    },

    async getCardState(cardId) {
      const row = await database.getFirstAsync<CardStateRow>(
        `SELECT
          due_at, stability, difficulty, elapsed_days, scheduled_days,
          learning_steps, reps, lapses, state, last_review_at
         FROM card_state
         WHERE card_id = ?`,
        cardId,
      );
      return row ? rowToCard(row) : null;
    },

    async countDueCards(now) {
      const row = await database.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) AS count
         FROM card_state
         JOIN lesson_enrollment
           ON lesson_enrollment.lesson_id = card_state.lesson_id
         WHERE card_state.due_at <= ?
           AND lesson_enrollment.excluded = 0`,
        now,
      );
      return row?.count ?? 0;
    },

    async countAttemptsForLesson(lessonId) {
      const row = await database.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) AS count
         FROM attempt
         WHERE lesson_id = ?`,
        lessonId,
      );
      return row?.count ?? 0;
    },

    async recordAttempt(input) {
      let nextCard: StoredCard | null = null;

      await database.withExclusiveTransactionAsync(async (transaction) => {
        const row = await transaction.getFirstAsync<CardStateRow>(
          `SELECT
            due_at, stability, difficulty, elapsed_days, scheduled_days,
            learning_steps, reps, lapses, state, last_review_at
           FROM card_state
           WHERE card_id = ?`,
          input.cardId,
        );
        const schedule = rateCard(row ? rowToCard(row) : null, input.rating, input.now);
        nextCard = schedule.next;

        await transaction.runAsync(
          `INSERT INTO attempt (
            card_id, entry_id, lesson_id, rating, recall_claim, reviewed_at,
            previous_state_json, next_state_json, scheduler_version, parameter_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          input.cardId,
          input.entryId,
          input.lessonId,
          input.rating,
          input.recallClaim,
          input.now,
          JSON.stringify(schedule.previous),
          JSON.stringify(schedule.next),
          schedule.schedulerVersion,
          schedule.parameterId,
        );

        await transaction.runAsync(
          `INSERT INTO card_state (
            card_id, lesson_id, due_at, stability, difficulty, elapsed_days, scheduled_days,
            learning_steps, reps, lapses, state, last_review_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(card_id) DO UPDATE SET
            lesson_id = excluded.lesson_id,
            due_at = excluded.due_at,
            stability = excluded.stability,
            difficulty = excluded.difficulty,
            elapsed_days = excluded.elapsed_days,
            scheduled_days = excluded.scheduled_days,
            learning_steps = excluded.learning_steps,
            reps = excluded.reps,
            lapses = excluded.lapses,
            state = excluded.state,
            last_review_at = excluded.last_review_at`,
          input.cardId,
          input.lessonId,
          schedule.next.dueAt,
          schedule.next.stability,
          schedule.next.difficulty,
          schedule.next.elapsedDays,
          schedule.next.scheduledDays,
          schedule.next.learningSteps,
          schedule.next.reps,
          schedule.next.lapses,
          schedule.next.state,
          schedule.next.lastReviewAt,
        );
      });

      if (!nextCard) {
        throw new Error('No se pudo guardar el estado de la palabra.');
      }
      return nextCard;
    },

    async listRecentAttempts(limit = 100) {
      const rows = await database.getAllAsync<{
        attempt_id: number;
        card_id: string;
        entry_id: string;
        lesson_id: string;
        rating: RecallRating;
        recall_claim: RecallRating | null;
        reviewed_at: number;
      }>(
        `SELECT
           attempt_id, card_id, entry_id, lesson_id, rating, recall_claim,
           reviewed_at
         FROM attempt
         ORDER BY reviewed_at DESC
         LIMIT ?`,
        limit,
      );
      return rows.map((row) => ({
        attemptId: row.attempt_id,
        cardId: row.card_id,
        entryId: row.entry_id,
        lessonId: row.lesson_id,
        rating: row.rating,
        recallClaim: row.recall_claim,
        reviewedAt: row.reviewed_at,
      }));
    },
  };
}
