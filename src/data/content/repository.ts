import type { SQLiteDatabase } from 'expo-sqlite';

import type {
  CourseLesson,
  VocabularyEntry,
} from '@/src/core/content-schema/schema';

type JsonRow = {
  payload_json: string;
};

export type LessonWithCount = CourseLesson & {
  courseId: string;
  wordCount: number;
};

export type ContentRepository = {
  listLessons(): Promise<LessonWithCount[]>;
  getEntriesForLesson(lessonId: string): Promise<VocabularyEntry[]>;
  getEntry(entryId: string): Promise<VocabularyEntry | null>;
};

export function createContentRepository(
  database: SQLiteDatabase,
): ContentRepository {
  return {
    async listLessons() {
      const rows = await database.getAllAsync<
        JsonRow & { course_id: string; word_count: number }
      >(
        `SELECT
          lesson.payload_json,
          lesson.course_id,
          COUNT(vocabulary_entry.entry_id) AS word_count
        FROM lesson
        LEFT JOIN vocabulary_entry
          ON vocabulary_entry.lesson_id = lesson.lesson_id
        GROUP BY lesson.lesson_id
        ORDER BY lesson.lesson_order`,
      );

      return rows.map((row) => ({
        ...(JSON.parse(row.payload_json) as CourseLesson),
        courseId: row.course_id,
        wordCount: row.word_count,
      }));
    },

    async getEntriesForLesson(lessonId) {
      const rows = await database.getAllAsync<JsonRow>(
        `SELECT payload_json
         FROM vocabulary_entry
         WHERE lesson_id = ?
         ORDER BY rowid`,
        lessonId,
      );
      return rows.map((row) => JSON.parse(row.payload_json) as VocabularyEntry);
    },

    async getEntry(entryId) {
      const row = await database.getFirstAsync<JsonRow>(
        'SELECT payload_json FROM vocabulary_entry WHERE entry_id = ?',
        entryId,
      );
      return row ? (JSON.parse(row.payload_json) as VocabularyEntry) : null;
    },
  };
}
