import type { SQLiteDatabase } from 'expo-sqlite';
import * as SQLite from 'expo-sqlite';

import type { ContentPack } from '@/src/core/content-schema/schema';

const CONTENT_DATABASE_VERSION = 1;

export async function openContentDatabase(): Promise<SQLiteDatabase> {
  const database = await SQLite.openDatabaseAsync('content.db');
  await database.execAsync('PRAGMA journal_mode = WAL');
  await migrateContentDatabase(database);
  return database;
}

async function migrateContentDatabase(database: SQLiteDatabase): Promise<void> {
  const row = await database.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version',
  );
  const currentVersion = row?.user_version ?? 0;

  if (currentVersion > CONTENT_DATABASE_VERSION) {
    throw new Error('La base de contenido fue creada por una versión más nueva.');
  }

  if (currentVersion === 0) {
    await database.execAsync(`
      CREATE TABLE pack_metadata (
        pack_id TEXT PRIMARY KEY NOT NULL,
        course_id TEXT NOT NULL,
        content_version TEXT NOT NULL,
        language_tag TEXT NOT NULL,
        title_es TEXT NOT NULL,
        title_en TEXT NOT NULL
      );

      CREATE TABLE lesson (
        lesson_id TEXT PRIMARY KEY NOT NULL,
        pack_id TEXT NOT NULL,
        course_id TEXT NOT NULL,
        lesson_order INTEGER NOT NULL,
        payload_json TEXT NOT NULL
      );

      CREATE TABLE vocabulary_entry (
        entry_id TEXT PRIMARY KEY NOT NULL,
        pack_id TEXT NOT NULL,
        course_id TEXT NOT NULL,
        lesson_id TEXT NOT NULL,
        payload_json TEXT NOT NULL
      );

      CREATE INDEX lesson_pack_order_idx
        ON lesson(pack_id, lesson_order);

      CREATE INDEX vocabulary_entry_lesson_idx
        ON vocabulary_entry(lesson_id, entry_id);
    `);
    await database.execAsync(`PRAGMA user_version = ${CONTENT_DATABASE_VERSION}`);
  }
}

export async function importContentPack(
  database: SQLiteDatabase,
  pack: ContentPack,
): Promise<void> {
  const installed = await database.getFirstAsync<{ content_version: string }>(
    'SELECT content_version FROM pack_metadata WHERE pack_id = ?',
    pack.packId,
  );

  if (installed?.content_version === pack.contentVersion) {
    return;
  }

  await database.withExclusiveTransactionAsync(async (transaction) => {
    await transaction.runAsync(
      'DELETE FROM vocabulary_entry WHERE pack_id = ?',
      pack.packId,
    );
    await transaction.runAsync('DELETE FROM lesson WHERE pack_id = ?', pack.packId);
    await transaction.runAsync('DELETE FROM pack_metadata WHERE pack_id = ?', pack.packId);

    await transaction.runAsync(
      `INSERT INTO pack_metadata (
        pack_id, course_id, content_version, language_tag, title_es, title_en
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      pack.packId,
      pack.courseId,
      pack.contentVersion,
      pack.languageTag,
      pack.title.es,
      pack.title.en,
    );

    for (const lesson of pack.lessons) {
      await transaction.runAsync(
        `INSERT INTO lesson (
          lesson_id, pack_id, course_id, lesson_order, payload_json
        ) VALUES (?, ?, ?, ?, ?)`,
        lesson.id,
        pack.packId,
        pack.courseId,
        lesson.order,
        JSON.stringify(lesson),
      );
    }

    for (const entry of pack.entries) {
      await transaction.runAsync(
        `INSERT INTO vocabulary_entry (
          entry_id, pack_id, course_id, lesson_id, payload_json
        ) VALUES (?, ?, ?, ?, ?)`,
        entry.id,
        pack.packId,
        pack.courseId,
        entry.lessonId,
        JSON.stringify(entry),
      );
    }
  });
}
