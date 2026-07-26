import { openAppDatabases } from '@/src/data/open-app-databases';

describe('openAppDatabases', () => {
  it('waits for the first database before opening the second one', async () => {
    let resolveContentDatabase: ((value: string) => void) | undefined;
    const contentDatabasePromise = new Promise<string>((resolve) => {
      resolveContentDatabase = resolve;
    });
    const openContentDatabase = jest.fn(() => contentDatabasePromise);
    const openProgressDatabase = jest.fn(async () => 'progress');

    const databasesPromise = openAppDatabases(
      openContentDatabase,
      openProgressDatabase,
    );

    expect(openContentDatabase).toHaveBeenCalledTimes(1);
    expect(openProgressDatabase).not.toHaveBeenCalled();

    resolveContentDatabase?.('content');

    await expect(databasesPromise).resolves.toEqual(['content', 'progress']);
    expect(openProgressDatabase).toHaveBeenCalledTimes(1);
  });
});
