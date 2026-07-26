import { groupLessonsNewestFirst } from '@/src/core/lessons/ordering';

describe('lesson ordering', () => {
  it('separates lesson kinds and places newer lessons first', () => {
    const grouped = groupLessonsNewestFirst([
      { kind: 'numbered' as const, order: 1 },
      { kind: 'special' as const, order: 1001 },
      { kind: 'numbered' as const, order: 3 },
      { kind: 'special' as const, order: 1003 },
    ]);

    expect(grouped.numbered.map((lesson) => lesson.order)).toEqual([3, 1]);
    expect(grouped.special.map((lesson) => lesson.order)).toEqual([1003, 1001]);
  });
});
