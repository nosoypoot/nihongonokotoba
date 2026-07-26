import {
  formatLessonLabel,
  formatLessonMarker,
} from '@/src/core/lessons/presentation';

describe('lesson presentation', () => {
  it('preserves the source number for regular lessons', () => {
    const lesson = { kind: 'numbered' as const, order: 6 };

    expect(formatLessonLabel(lesson)).toBe('Lección 6');
    expect(formatLessonMarker(lesson)).toBe('06');
  });

  it('does not invent a number for special lessons', () => {
    const lesson = { kind: 'special' as const, order: 1001 };

    expect(formatLessonLabel(lesson)).toBe('Lección especial');
    expect(formatLessonMarker(lesson)).toBe('Especial');
  });
});
