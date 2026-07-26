import { z } from 'zod';

const localizedTextSchema = z.object({
  es: z.string().trim().min(1),
  en: z.string().trim().min(1),
});

const exampleSchema = z.object({
  id: z.string().trim().min(1),
  target: z.string().trim().min(1),
  reading: z.string().trim().min(1).optional(),
  translations: localizedTextSchema,
});

const structureNoteSchema = z.object({
  form: z.string().trim().min(1),
  reading: z.string().trim().min(1).optional(),
  meanings: localizedTextSchema,
});

const senseSchema = z.object({
  id: z.string().trim().min(1),
  meanings: localizedTextSchema,
  explanation: localizedTextSchema,
  structure: z.array(structureNoteSchema).default([]),
  examples: z.array(exampleSchema).min(1),
});

const lessonSchema = z.object({
  id: z.string().trim().min(1),
  order: z.number().int().positive(),
  kind: z.enum(['numbered', 'special']).default('numbered'),
  title: localizedTextSchema,
  description: localizedTextSchema,
});

const entrySchema = z.object({
  id: z.string().trim().min(1),
  lessonId: z.string().trim().min(1),
  target: z.string().trim().min(1),
  reading: z.string().trim().min(1).optional(),
  partOfSpeech: localizedTextSchema,
  senses: z.array(senseSchema).min(1),
});

export const contentPackSchema = z
  .object({
    schemaVersion: z.literal(1),
    contentVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
    packId: z.string().trim().min(1),
    courseId: z.string().trim().min(1),
    languageTag: z.string().trim().min(2),
    title: localizedTextSchema,
    description: localizedTextSchema,
    authors: z.array(z.string().trim().min(1)).min(1),
    license: z.object({
      name: z.string().trim().min(1),
      url: z.string().url(),
    }),
    sourceNotes: z.array(z.string().trim().min(1)).min(1),
    lessons: z.array(lessonSchema).min(1),
    entries: z.array(entrySchema).min(1),
  })
  .superRefine((pack, context) => {
    const lessonIds = new Set<string>();
    const lessonOrders = new Set<number>();

    pack.lessons.forEach((lesson, index) => {
      if (lessonIds.has(lesson.id)) {
        context.addIssue({
          code: 'custom',
          message: `Duplicate lesson id: ${lesson.id}`,
          path: ['lessons', index, 'id'],
        });
      }
      if (lessonOrders.has(lesson.order)) {
        context.addIssue({
          code: 'custom',
          message: `Duplicate lesson order: ${lesson.order}`,
          path: ['lessons', index, 'order'],
        });
      }
      lessonIds.add(lesson.id);
      lessonOrders.add(lesson.order);
    });

    const entryIds = new Set<string>();
    const cardIdentity = new Set<string>();

    pack.entries.forEach((entry, entryIndex) => {
      if (entryIds.has(entry.id)) {
        context.addIssue({
          code: 'custom',
          message: `Duplicate entry id: ${entry.id}`,
          path: ['entries', entryIndex, 'id'],
        });
      }
      if (!lessonIds.has(entry.lessonId)) {
        context.addIssue({
          code: 'custom',
          message: `Unknown lesson id: ${entry.lessonId}`,
          path: ['entries', entryIndex, 'lessonId'],
        });
      }
      entryIds.add(entry.id);

      entry.senses.forEach((sense, senseIndex) => {
        const identity = `${entry.id}:recognition:${sense.id}`;
        if (cardIdentity.has(identity)) {
          context.addIssue({
            code: 'custom',
            message: `Duplicate card identity: ${identity}`,
            path: ['entries', entryIndex, 'senses', senseIndex, 'id'],
          });
        }
        cardIdentity.add(identity);

        if (pack.languageTag.startsWith('ja')) {
          sense.examples.forEach((example, exampleIndex) => {
            if (!example.reading) {
              context.addIssue({
                code: 'custom',
                message: `Japanese example requires a kana reading: ${example.id}`,
                path: [
                  'entries',
                  entryIndex,
                  'senses',
                  senseIndex,
                  'examples',
                  exampleIndex,
                  'reading',
                ],
              });
            }
          });
        }
      });
    });
  });

export type ContentPack = z.infer<typeof contentPackSchema>;
export type CourseLesson = ContentPack['lessons'][number];
export type VocabularyEntry = ContentPack['entries'][number];
export type VocabularySense = VocabularyEntry['senses'][number];

export function parseContentPack(input: unknown): ContentPack {
  return contentPackSchema.parse(input);
}
