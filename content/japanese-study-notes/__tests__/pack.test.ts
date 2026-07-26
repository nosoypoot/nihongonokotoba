import { japaneseStudyNotesPack } from '@/content/japanese-study-notes/pack';

describe('japanese study notes pack', () => {
  it('keeps every entry attached to a declared lesson', () => {
    const lessonIds = new Set(
      japaneseStudyNotesPack.lessons.map((lesson) => lesson.id),
    );

    expect(
      japaneseStudyNotesPack.entries.every((entry) =>
        lessonIds.has(entry.lessonId),
      ),
    ).toBe(true);
  });

  it('contains the complete weekday and general-counter series', () => {
    expect(
      japaneseStudyNotesPack.entries.filter(
        (entry) => entry.lessonId === 'notes-days-of-week',
      ),
    ).toHaveLength(7);
    expect(
      japaneseStudyNotesPack.entries.filter(
        (entry) => entry.lessonId === 'notes-general-counter',
      ),
    ).toHaveLength(10);
  });

  it('keeps original bilingual context for every sense', () => {
    for (const entry of japaneseStudyNotesPack.entries) {
      for (const sense of entry.senses) {
        expect(sense.meanings.es).toBeTruthy();
        expect(sense.meanings.en).toBeTruthy();
        expect(sense.explanation.es).toBeTruthy();
        expect(sense.explanation.en).toBeTruthy();
        expect(sense.examples.length).toBeGreaterThan(0);
      }
    }
  });
});
