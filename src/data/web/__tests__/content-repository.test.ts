import { bundledPacks } from '@/content';
import { createWebContentRepository } from '@/src/data/web/content-repository';

describe('web content repository', () => {
  it('serves bundled lessons and vocabulary without a database', async () => {
    const repository = createWebContentRepository();
    const lessons = await repository.listLessons();
    const expectedLessonCount = bundledPacks.reduce(
      (total, pack) => total + pack.lessons.length,
      0,
    );

    expect(lessons).toHaveLength(expectedLessonCount);

    const lesson = lessons.find((candidate) => candidate.wordCount > 0);
    expect(lesson).toBeDefined();

    const entries = await repository.getEntriesForLesson(lesson!.id);
    expect(entries).toHaveLength(lesson!.wordCount);
    await expect(repository.getEntry(entries[0].id)).resolves.toEqual(entries[0]);
  });
});
