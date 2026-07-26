import {
  getStudyPromptForms,
  isStudyWritingPreference,
} from '@/src/core/preferences/study-writing';

describe('study writing preference', () => {
  const entry = {
    target: '食べる',
    reading: 'たべる',
  };

  it('places kanji first when target-first is selected', () => {
    expect(getStudyPromptForms(entry, 'target-first')).toEqual({
      primary: '食べる',
      secondary: 'たべる',
    });
  });

  it('places the reading first when reading-first is selected', () => {
    expect(getStudyPromptForms(entry, 'reading-first')).toEqual({
      primary: 'たべる',
      secondary: '食べる',
    });
  });

  it('shows one form when no alternative reading exists', () => {
    expect(
      getStudyPromptForms({ target: "ja'", reading: undefined }, 'reading-first'),
    ).toEqual({
      primary: "ja'",
      secondary: null,
    });
  });

  it('accepts only persisted preference values', () => {
    expect(isStudyWritingPreference('target-first')).toBe(true);
    expect(isStudyWritingPreference('reading-first')).toBe(true);
    expect(isStudyWritingPreference('kanji')).toBe(false);
  });
});
