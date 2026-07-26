import type { CourseLesson } from '@/src/core/content-schema/schema';

type LessonIdentity = Pick<CourseLesson, 'kind' | 'order'>;

export function formatLessonLabel(lesson: LessonIdentity): string {
  return lesson.kind === 'special'
    ? 'Lección especial'
    : `Lección ${lesson.order}`;
}

export function formatLessonMarker(lesson: LessonIdentity): string {
  return lesson.kind === 'special'
    ? 'Especial'
    : String(lesson.order).padStart(2, '0');
}
