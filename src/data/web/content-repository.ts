import { bundledPacks } from '@/content';
import type { VocabularyEntry } from '@/src/core/content-schema/schema';
import type {
  ContentRepository,
  LessonWithCount,
} from '@/src/data/content/repository';

export function createWebContentRepository(): ContentRepository {
  const entries = bundledPacks.flatMap((pack) => pack.entries);
  const entriesById = new Map(entries.map((entry) => [entry.id, entry]));
  const entriesByLesson = new Map<string, VocabularyEntry[]>();
  for (const entry of entries) {
    const lessonEntries = entriesByLesson.get(entry.lessonId) ?? [];
    lessonEntries.push(entry);
    entriesByLesson.set(entry.lessonId, lessonEntries);
  }
  const lessons: LessonWithCount[] = bundledPacks
    .flatMap((pack) =>
      pack.lessons.map((lesson) => ({
        ...lesson,
        courseId: pack.courseId,
        wordCount: entriesByLesson.get(lesson.id)?.length ?? 0,
      })),
    )
    .sort((left, right) => left.order - right.order);

  return {
    async listLessons() {
      return lessons;
    },

    async getEntriesForLesson(lessonId) {
      return entriesByLesson.get(lessonId) ?? [];
    },

    async getEntry(entryId) {
      return entriesById.get(entryId) ?? null;
    },
  };
}
