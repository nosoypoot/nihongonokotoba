import type { SQLiteDatabase } from 'expo-sqlite';
import * as SQLite from 'expo-sqlite';

const PROGRESS_DATABASE_VERSION = 3;

export async function openProgressDatabase(): Promise<SQLiteDatabase> {
  const database = await SQLite.openDatabaseAsync('progress.db');
  await database.execAsync('PRAGMA journal_mode = WAL');
  await migrateProgressDatabase(database);
  return database;
}

async function migrateProgressDatabase(database: SQLiteDatabase): Promise<void> {
  const row = await database.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version',
  );
  const currentVersion = row?.user_version ?? 0;

  if (currentVersion > PROGRESS_DATABASE_VERSION) {
    throw new Error('Tu progreso fue creado por una versión más nueva.');
  }

  if (currentVersion === 0) {
    await database.execAsync(`
      CREATE TABLE card_state (
        card_id TEXT PRIMARY KEY NOT NULL,
        lesson_id TEXT NOT NULL,
        due_at INTEGER NOT NULL,
        stability REAL NOT NULL,
        difficulty REAL NOT NULL,
        elapsed_days REAL NOT NULL,
        scheduled_days REAL NOT NULL,
        learning_steps INTEGER NOT NULL,
        reps INTEGER NOT NULL,
        lapses INTEGER NOT NULL,
        state INTEGER NOT NULL,
        last_review_at INTEGER
      );

      CREATE TABLE attempt (
        attempt_id INTEGER PRIMARY KEY AUTOINCREMENT,
        card_id TEXT NOT NULL,
        entry_id TEXT NOT NULL,
        lesson_id TEXT NOT NULL,
        rating TEXT NOT NULL CHECK (rating IN ('again', 'good')),
        reviewed_at INTEGER NOT NULL,
        previous_state_json TEXT NOT NULL,
        next_state_json TEXT NOT NULL,
        scheduler_version TEXT NOT NULL,
        parameter_id TEXT NOT NULL
      );

      CREATE TABLE lesson_enrollment (
        lesson_id TEXT PRIMARY KEY NOT NULL,
        enrolled_at INTEGER NOT NULL,
        excluded INTEGER NOT NULL DEFAULT 0,
        focused_session_count INTEGER NOT NULL DEFAULT 0,
        eligible_for_cumulative INTEGER NOT NULL DEFAULT 0
      );

      CREATE INDEX card_state_due_idx
        ON card_state(lesson_id, due_at);

      CREATE INDEX attempt_reviewed_idx
        ON attempt(reviewed_at DESC);
    `);
    await database.execAsync('PRAGMA user_version = 1');
  }

  if (currentVersion < 2) {
    await database.execAsync(`
      CREATE TABLE app_preference (
        preference_key TEXT PRIMARY KEY NOT NULL,
        preference_value TEXT NOT NULL
      );
    `);
    await database.execAsync('PRAGMA user_version = 2');
  }

  if (currentVersion < 3) {
    await database.execAsync(`
      ALTER TABLE attempt
      ADD COLUMN recall_claim TEXT
      CHECK (recall_claim IN ('again', 'good'));
    `);
    await database.execAsync('PRAGMA user_version = 3');
  }
}
