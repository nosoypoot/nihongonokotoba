import { bundledPacks } from '@/content';
import {
  importContentPack,
  openContentDatabase,
} from '@/src/data/content/database';
import {
  createContentRepository,
  type ContentRepository,
} from '@/src/data/content/repository';
import { openProgressDatabase } from '@/src/data/progress/database';
import {
  createProgressRepository,
  type ProgressRepository,
} from '@/src/data/progress/repository';
import { requestPersistentStorage } from '@/src/data/pwa/persistence';
import { openAppDatabases } from '@/src/data/open-app-databases';

export type AppRepositories = {
  content: ContentRepository;
  progress: ProgressRepository;
};

let repositoriesPromise: Promise<AppRepositories> | null = null;

export function initializeStorage(): Promise<AppRepositories> {
  if (repositoriesPromise) {
    return repositoriesPromise;
  }

  repositoriesPromise = (async () => {
    await requestPersistentStorage();
    const [contentDatabase, progressDatabase] = await openAppDatabases(
      openContentDatabase,
      openProgressDatabase,
    );

    for (const pack of bundledPacks) {
      await importContentPack(contentDatabase, pack);
    }

    return {
      content: createContentRepository(contentDatabase),
      progress: createProgressRepository(progressDatabase),
    };
  })().catch((error: unknown) => {
    repositoriesPromise = null;
    throw error;
  });

  return repositoriesPromise;
}
