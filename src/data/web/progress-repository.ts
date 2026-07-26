import {
  DEFAULT_STUDY_WRITING_PREFERENCE,
  isStudyWritingPreference,
} from '@/src/core/preferences/study-writing';
import { rateCard, type StoredCard } from '@/src/core/scheduling/scheduler';
import type { ProgressRepository } from '@/src/data/progress/repository';
import type {
  CardStateRecord,
  WebProgressDatabase,
} from '@/src/data/web/progress-database';

const STUDY_WRITING_PREFERENCE_KEY = 'study_writing_preference';

function toStoredCard(record: CardStateRecord): StoredCard {
  return {
    dueAt: record.dueAt,
    stability: record.stability,
    difficulty: record.difficulty,
    elapsedDays: record.elapsedDays,
    scheduledDays: record.scheduledDays,
    learningSteps: record.learningSteps,
    reps: record.reps,
    lapses: record.lapses,
    state: record.state,
    lastReviewAt: record.lastReviewAt,
  };
}

export function createWebProgressRepository(
  database: WebProgressDatabase,
): ProgressRepository {
  return {
    async enrollLesson(lessonId, now) {
      const current = await database.get('lessonEnrollments', lessonId);
      await database.put('lessonEnrollments', {
        lessonId,
        enrolledAt: current?.enrolledAt ?? now,
        excluded: false,
        focusedSessionCount: current?.focusedSessionCount ?? 0,
        eligibleForCumulative: current?.eligibleForCumulative ?? false,
      });
    },

    async markFocusedSessionComplete(lessonId) {
      const transaction = database.transaction(
        'lessonEnrollments',
        'readwrite',
      );
      const current = await transaction.store.get(lessonId);
      if (current) {
        const focusedSessionCount = current.focusedSessionCount + 1;
        await transaction.store.put({
          ...current,
          focusedSessionCount,
          eligibleForCumulative: focusedSessionCount >= 3,
        });
      }
      await transaction.done;
    },

    async getFocusedSessionCount(lessonId) {
      const enrollment = await database.get('lessonEnrollments', lessonId);
      return enrollment?.focusedSessionCount ?? 0;
    },

    async getStudyWritingPreference() {
      const preference = await database.get(
        'preferences',
        STUDY_WRITING_PREFERENCE_KEY,
      );
      return isStudyWritingPreference(preference)
        ? preference
        : DEFAULT_STUDY_WRITING_PREFERENCE;
    },

    async setStudyWritingPreference(preference) {
      await database.put(
        'preferences',
        preference,
        STUDY_WRITING_PREFERENCE_KEY,
      );
    },

    async getCardState(cardId) {
      const record = await database.get('cardStates', cardId);
      return record ? toStoredCard(record) : null;
    },

    async countDueCards(now) {
      const [cards, enrollments] = await Promise.all([
        database.getAllFromIndex(
          'cardStates',
          'by-due-at',
          IDBKeyRange.upperBound(now),
        ),
        database.getAll('lessonEnrollments'),
      ]);
      const activeLessons = new Set(
        enrollments
          .filter((enrollment) => !enrollment.excluded)
          .map((enrollment) => enrollment.lessonId),
      );
      return cards.filter((card) => activeLessons.has(card.lessonId)).length;
    },

    async countAttemptsForLesson(lessonId) {
      return database.countFromIndex('attempts', 'by-lesson', lessonId);
    },

    async recordAttempt(input) {
      const transaction = database.transaction(
        ['cardStates', 'attempts'],
        'readwrite',
      );
      const cardStates = transaction.objectStore('cardStates');
      const attempts = transaction.objectStore('attempts');
      const currentRecord = await cardStates.get(input.cardId);
      const schedule = rateCard(
        currentRecord ? toStoredCard(currentRecord) : null,
        input.rating,
        input.now,
      );

      await attempts.add({
        cardId: input.cardId,
        entryId: input.entryId,
        lessonId: input.lessonId,
        rating: input.rating,
        recallClaim: input.recallClaim,
        reviewedAt: input.now,
      });
      await cardStates.put({
        cardId: input.cardId,
        lessonId: input.lessonId,
        ...schedule.next,
      });
      await transaction.done;

      return schedule.next;
    },

    async listRecentAttempts(limit = 100) {
      const attempts = await database.getAll('attempts');
      return attempts
        .sort((left, right) => right.reviewedAt - left.reviewedAt)
        .slice(0, limit)
        .map((attempt) => {
          if (attempt.attemptId === undefined) {
            throw new Error('El historial guardado no tiene identificador.');
          }
          return {
            attemptId: attempt.attemptId,
            cardId: attempt.cardId,
            entryId: attempt.entryId,
            lessonId: attempt.lessonId,
            rating: attempt.rating,
            recallClaim: attempt.recallClaim,
            reviewedAt: attempt.reviewedAt,
          };
        });
    },
  };
}
