import type { ContentRepository } from '@/src/data/content/repository';
import type { ProgressRepository } from '@/src/data/progress/repository';
import { requestPersistentStorage } from '@/src/data/pwa/persistence';
import { createWebContentRepository } from '@/src/data/web/content-repository';
import { openWebProgressDatabase } from '@/src/data/web/progress-database';
import { createWebProgressRepository } from '@/src/data/web/progress-repository';

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
    const progressDatabase = await openWebProgressDatabase();

    return {
      content: createWebContentRepository(),
      progress: createWebProgressRepository(progressDatabase),
    };
  })().catch((error: unknown) => {
    repositoriesPromise = null;
    throw error;
  });

  return repositoriesPromise;
}
