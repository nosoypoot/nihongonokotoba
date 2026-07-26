import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

import type { RecallRating, StoredCard } from '@/src/core/scheduling/scheduler';

const WEB_PROGRESS_DATABASE_NAME = 'nihongo-no-kotoba-progress';
const WEB_PROGRESS_DATABASE_VERSION = 1;

export type CardStateRecord = StoredCard & {
  cardId: string;
  lessonId: string;
};

export type AttemptRecord = {
  attemptId?: number;
  cardId: string;
  entryId: string;
  lessonId: string;
  rating: RecallRating;
  recallClaim: RecallRating | null;
  reviewedAt: number;
};

export type LessonEnrollmentRecord = {
  lessonId: string;
  enrolledAt: number;
  excluded: boolean;
  focusedSessionCount: number;
  eligibleForCumulative: boolean;
};

interface WebProgressDatabaseSchema extends DBSchema {
  cardStates: {
    key: string;
    value: CardStateRecord;
    indexes: {
      'by-due-at': number;
      'by-lesson': string;
    };
  };
  attempts: {
    key: number;
    value: AttemptRecord;
    indexes: {
      'by-lesson': string;
      'by-reviewed-at': number;
    };
  };
  lessonEnrollments: {
    key: string;
    value: LessonEnrollmentRecord;
  };
  preferences: {
    key: string;
    value: string;
  };
}

export type WebProgressDatabase = IDBPDatabase<WebProgressDatabaseSchema>;

export function openWebProgressDatabase(
  databaseName = WEB_PROGRESS_DATABASE_NAME,
): Promise<WebProgressDatabase> {
  return openDB<WebProgressDatabaseSchema>(
    databaseName,
    WEB_PROGRESS_DATABASE_VERSION,
    {
      upgrade(database) {
        const cardStates = database.createObjectStore('cardStates', {
          keyPath: 'cardId',
        });
        cardStates.createIndex('by-due-at', 'dueAt');
        cardStates.createIndex('by-lesson', 'lessonId');

        const attempts = database.createObjectStore('attempts', {
          autoIncrement: true,
          keyPath: 'attemptId',
        });
        attempts.createIndex('by-lesson', 'lessonId');
        attempts.createIndex('by-reviewed-at', 'reviewedAt');

        database.createObjectStore('lessonEnrollments', {
          keyPath: 'lessonId',
        });
        database.createObjectStore('preferences');
      },
    },
  );
}
