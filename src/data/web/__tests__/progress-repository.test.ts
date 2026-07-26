import 'fake-indexeddb/auto';

import { deleteDB } from 'idb';

import {
  openWebProgressDatabase,
  type WebProgressDatabase,
} from '@/src/data/web/progress-database';
import { createWebProgressRepository } from '@/src/data/web/progress-repository';

const DATABASE_NAME = 'nihongo-no-kotoba-progress-test';

describe('web progress repository', () => {
  const openDatabases: WebProgressDatabase[] = [];

  beforeEach(async () => {
    await deleteDB(DATABASE_NAME);
  });

  afterEach(async () => {
    for (const database of openDatabases.splice(0)) {
      database.close();
    }
    await deleteDB(DATABASE_NAME);
  });

  async function openRepository() {
    const database = await openWebProgressDatabase(DATABASE_NAME);
    openDatabases.push(database);
    return createWebProgressRepository(database);
  }

  it('shares persisted progress between simultaneous connections', async () => {
    const [firstRepository, secondRepository] = await Promise.all([
      openRepository(),
      openRepository(),
    ]);
    const now = Date.UTC(2026, 6, 25, 12);

    await firstRepository.enrollLesson('lesson-1', now);
    const nextCard = await firstRepository.recordAttempt({
      cardId: 'card-1',
      entryId: 'entry-1',
      lessonId: 'lesson-1',
      rating: 'good',
      recallClaim: 'good',
      now,
    });

    await expect(secondRepository.getCardState('card-1')).resolves.toEqual(
      nextCard,
    );
    await expect(
      secondRepository.countAttemptsForLesson('lesson-1'),
    ).resolves.toBe(1);
    await expect(secondRepository.listRecentAttempts()).resolves.toMatchObject([
      {
        cardId: 'card-1',
        entryId: 'entry-1',
        lessonId: 'lesson-1',
        rating: 'good',
        recallClaim: 'good',
        reviewedAt: now,
      },
    ]);
  });

  it('persists preferences and focused-session progress after reopening', async () => {
    const repository = await openRepository();
    await repository.enrollLesson('lesson-1', 1);
    await repository.markFocusedSessionComplete('lesson-1');
    await repository.setStudyWritingPreference('reading-first');

    openDatabases.splice(0).forEach((database) => database.close());
    const reopenedRepository = await openRepository();

    await expect(
      reopenedRepository.getFocusedSessionCount('lesson-1'),
    ).resolves.toBe(1);
    await expect(
      reopenedRepository.getStudyWritingPreference(),
    ).resolves.toBe('reading-first');
  });
});
