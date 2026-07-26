export async function openAppDatabases<TContentDatabase, TProgressDatabase>(
  openContentDatabase: () => Promise<TContentDatabase>,
  openProgressDatabase: () => Promise<TProgressDatabase>,
): Promise<[TContentDatabase, TProgressDatabase]> {
  const contentDatabase = await openContentDatabase();
  const progressDatabase = await openProgressDatabase();

  return [contentDatabase, progressDatabase];
}
