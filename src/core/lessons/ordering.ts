import type { CourseLesson } from '@/src/core/content-schema/schema';

type OrderedLesson = Pick<CourseLesson, 'kind' | 'order'>;

export function groupLessonsNewestFirst<T extends OrderedLesson>(
  lessons: T[],
): { numbered: T[]; special: T[] } {
  const newestFirst = (left: T, right: T) => right.order - left.order;
  return {
    numbered: lessons
      .filter((lesson) => lesson.kind === 'numbered')
      .sort(newestFirst),
    special: lessons
      .filter((lesson) => lesson.kind === 'special')
      .sort(newestFirst),
  };
}
