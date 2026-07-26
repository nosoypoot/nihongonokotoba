import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import type { LessonWithCount } from '@/src/data/content/repository';
import { systemClock } from '@/src/data/clock';
import { buildCardId } from '@/src/core/content-schema/card-id';
import { isDue } from '@/src/core/scheduling/scheduler';
import { useRepositories } from '@/src/features/bootstrap/AppBootstrapProvider';

export type HomeLesson = LessonWithCount & {
  attemptCount: number;
  focusedSessionCount: number;
  dueCount: number;
  unseenCount: number;
};

type HomeData = {
  lessons: HomeLesson[];
  dueCount: number;
  loading: boolean;
  error: Error | null;
  reload(): void;
};

export function useHomeData(): HomeData {
  const repositories = useRepositories();
  const [lessons, setLessons] = useState<HomeLesson[]>([]);
  const [dueCount, setDueCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useFocusEffect(
    useCallback(() => {
      void reloadToken;
      let active = true;
      setLoading(true);

      repositories.content
        .listLessons()
        .then(async (lessonRows) => {
          const now = systemClock.now();
          const enriched = await Promise.all(
            lessonRows.map(async (lesson) => {
              const entries = await repositories.content.getEntriesForLesson(lesson.id);
              const cards = entries.flatMap((entry) =>
                entry.senses.map((sense) =>
                  buildCardId({
                    courseId: lesson.courseId,
                    entryId: entry.id,
                    senseId: sense.id,
                  }),
                ),
              );
              const states = await Promise.all(
                cards.map((cardId) => repositories.progress.getCardState(cardId)),
              );
              return {
                ...lesson,
                attemptCount: await repositories.progress.countAttemptsForLesson(
                  lesson.id,
                ),
                focusedSessionCount:
                  await repositories.progress.getFocusedSessionCount(lesson.id),
                dueCount: states.filter((state) => state && isDue(state, now)).length,
                unseenCount: states.filter((state) => state === null).length,
              };
            }),
          );
          if (active) {
            setLessons(enriched);
            setDueCount(
              enriched.reduce((total, lesson) => total + lesson.dueCount, 0),
            );
            setError(null);
          }
        })
        .catch((reason: unknown) => {
          if (active) {
            setError(
              reason instanceof Error
                ? reason
                : new Error('No pudimos leer tus lecciones.'),
            );
          }
        })
        .finally(() => {
          if (active) {
            setLoading(false);
          }
        });

      return () => {
        active = false;
      };
    }, [repositories, reloadToken]),
  );

  return {
    lessons,
    dueCount,
    loading,
    error,
    reload: () => setReloadToken((value) => value + 1),
  };
}
