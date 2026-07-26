import type { Ref } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import type {
  VocabularyEntry,
  VocabularySense,
} from '@/src/core/content-schema/schema';
import {
  getStudyPromptForms,
  type StudyWritingPreference,
} from '@/src/core/preferences/study-writing';
import { AppText } from '@/src/ui/AppText';

type TargetProps = {
  entry: Pick<VocabularyEntry, 'target' | 'reading'>;
  writingPreference: StudyWritingPreference;
};

export function VocabularyTarget({
  entry,
  writingPreference,
}: TargetProps) {
  const theme = useTheme();
  const forms = getStudyPromptForms(entry, writingPreference);

  return (
    <View style={styles.targetBlock}>
      <AppText
        variant="target"
        style={styles.target}
        accessibilityLanguage="ja-JP">
        {forms.primary}
      </AppText>
      {forms.secondary ? (
        <AppText
          variant="japanese"
          style={{ color: theme.colors.onSurfaceVariant }}
          accessibilityLanguage="ja-JP">
          {forms.secondary}
        </AppText>
      ) : null}
    </View>
  );
}

type DetailsProps = TargetProps & {
  sense: VocabularySense;
  includeTarget?: boolean;
  meaningRef?: Ref<View>;
};

export function VocabularyDetails({
  entry,
  sense,
  writingPreference,
  includeTarget = true,
  meaningRef,
}: DetailsProps) {
  const theme = useTheme();

  return (
    <View>
      {includeTarget ? (
        <VocabularyTarget
          entry={entry}
          writingPreference={writingPreference}
        />
      ) : null}

      <View
        ref={meaningRef}
        accessible
        accessibilityRole="header"
        style={[styles.meaning, { borderColor: theme.colors.outline }]}>
        <AppText variant="label" style={{ color: theme.colors.primary }}>
          Significado
        </AppText>
        <AppText variant="heading">{sense.meanings.es}</AppText>
      </View>

      <View style={[styles.annotation, { borderColor: theme.colors.primary }]}>
        <AppText variant="label" style={{ color: theme.colors.primary }}>
          Dentro de la palabra
        </AppText>
        <AppText style={styles.explanation}>{sense.explanation.es}</AppText>
        {sense.structure.length > 0 ? (
          <View style={styles.structureRow}>
            {sense.structure.map((part) => {
              const partForms = getStudyPromptForms(
                {
                  target: part.form,
                  reading: part.reading,
                },
                writingPreference,
              );
              return (
                <View
                  key={`${part.form}-${part.reading ?? ''}`}
                  style={[
                    styles.structurePart,
                    { backgroundColor: theme.colors.primaryContainer },
                  ]}>
                  <AppText variant="heading" accessibilityLanguage="ja-JP">
                    {partForms.primary}
                  </AppText>
                  {partForms.secondary ? (
                    <AppText
                      variant="japanese"
                      style={{ color: theme.colors.onSurfaceVariant }}
                      accessibilityLanguage="ja-JP">
                      {partForms.secondary}
                    </AppText>
                  ) : null}
                  <AppText style={{ color: theme.colors.onSurfaceVariant }}>
                    {part.meanings.es}
                  </AppText>
                </View>
              );
            })}
          </View>
        ) : null}
      </View>

      {sense.examples.map((example) => {
        const exampleForms = getStudyPromptForms(example, writingPreference);
        return (
          <View
            key={example.id}
            style={[styles.example, { borderColor: theme.colors.outline }]}>
            <AppText variant="label" style={{ color: theme.colors.primary }}>
              En uso
            </AppText>
            <AppText
              variant="japanese"
              style={styles.examplePrimary}
              accessibilityLanguage="ja-JP">
              {exampleForms.primary}
            </AppText>
            {exampleForms.secondary ? (
              <AppText
                variant="japanese"
                style={[
                  styles.exampleReading,
                  { color: theme.colors.onSurfaceVariant },
                ]}
                accessibilityLanguage="ja-JP">
                {exampleForms.secondary}
              </AppText>
            ) : null}
            <AppText style={{ color: theme.colors.onSurfaceVariant }}>
              {example.translations.es}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  targetBlock: {
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 34,
  },
  target: {
    textAlign: 'center',
  },
  meaning: {
    gap: 5,
    paddingBottom: 22,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  annotation: {
    marginVertical: 26,
    paddingLeft: 16,
    borderLeftWidth: 3,
  },
  explanation: {
    marginTop: 8,
  },
  structureRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
  },
  structurePart: {
    minWidth: 130,
    flexGrow: 1,
    flexBasis: 0,
    gap: 3,
    padding: 12,
    borderRadius: 4,
  },
  example: {
    gap: 5,
    paddingBottom: 22,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  examplePrimary: {
    fontSize: 21,
    lineHeight: 32,
  },
  exampleReading: {
    fontSize: 15,
    lineHeight: 23,
  },
});
