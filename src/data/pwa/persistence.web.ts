export async function requestPersistentStorage(): Promise<void> {
  if (!navigator.storage?.persist) {
    return;
  }

  try {
    const alreadyPersistent = await navigator.storage.persisted();
    if (!alreadyPersistent) {
      await navigator.storage.persist();
    }
  } catch {
    // Best-effort: the app remains usable when a browser denies persistence.
  }
}
