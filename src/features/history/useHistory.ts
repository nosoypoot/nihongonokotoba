import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import type { Attempt } from '@/src/data/progress/repository';
import { useRepositories } from '@/src/features/bootstrap/AppBootstrapProvider';

export type HistoryItem = Attempt & {
  target: string;
  reading?: string;
  meaningEs: string;
  senseId?: string;
};

type HistoryState = {
  items: HistoryItem[];
  loading: boolean;
  error: Error | null;
  reload(): void;
};

export function useHistory(): HistoryState {
  const repositories = useRepositories();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useFocusEffect(
    useCallback(() => {
      void reloadToken;
      let active = true;
      setLoading(true);

      repositories.progress
        .listRecentAttempts()
        .then(async (attempts) => {
          const resolved = await Promise.all(
            attempts.map(async (attempt) => {
              const entry = await repositories.content.getEntry(attempt.entryId);
              const sense = entry?.senses.find(
                (candidate) => attempt.cardId.endsWith(`:${candidate.id}`),
              );
              return {
                ...attempt,
                target: entry?.target ?? 'Contenido no disponible',
                reading: entry?.reading,
                meaningEs: sense?.meanings.es ?? '',
                senseId: sense?.id,
              };
            }),
          );
          if (active) {
            setItems(resolved);
            setError(null);
          }
        })
        .catch((reason: unknown) => {
          if (active) {
            setError(
              reason instanceof Error
                ? reason
                : new Error('No pudimos leer tu historial.'),
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
    items,
    loading,
    error,
    reload: () => setReloadToken((value) => value + 1),
  };
}
