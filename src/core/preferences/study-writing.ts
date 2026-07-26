import type { VocabularyEntry } from '@/src/core/content-schema/schema';

export type StudyWritingPreference = 'target-first' | 'reading-first';

export const DEFAULT_STUDY_WRITING_PREFERENCE: StudyWritingPreference =
  'target-first';

export function isStudyWritingPreference(
  value: unknown,
): value is StudyWritingPreference {
  return value === 'target-first' || value === 'reading-first';
}

export function getStudyPromptForms(
  entry: Pick<VocabularyEntry, 'target' | 'reading'>,
  preference: StudyWritingPreference,
): { primary: string; secondary: string | null } {
  const reading =
    entry.reading && entry.reading !== entry.target ? entry.reading : null;

  if (preference === 'reading-first' && reading) {
    return {
      primary: reading,
      secondary: entry.target,
    };
  }

  return {
    primary: entry.target,
    secondary: reading,
  };
}
