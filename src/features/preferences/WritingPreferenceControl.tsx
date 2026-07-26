import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Snackbar, useTheme } from 'react-native-paper';

import type { StudyWritingPreference } from '@/src/core/preferences/study-writing';
import { useRepositories } from '@/src/features/bootstrap/AppBootstrapProvider';
import { StudyWritingToggle } from '@/src/features/preferences/StudyWritingToggle';
import { AppText } from '@/src/ui/AppText';

export function WritingPreferenceControl() {
  const repositories = useRepositories();
  const theme = useTheme();
  const [preference, setPreference] = useState<StudyWritingPreference | null>(null);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    let active = true;
    repositories.progress
      .getStudyWritingPreference()
      .then((value) => {
        if (active) {
          setPreference(value);
        }
      })
      .catch(() => {
        if (active) {
          setPreference('target-first');
          setSaveError(true);
        }
      });
    return () => {
      active = false;
    };
  }, [repositories]);

  const changePreference = (nextValue: string) => {
    if (nextValue !== 'target-first' && nextValue !== 'reading-first') {
      return;
    }
    const previous = preference;
    setPreference(nextValue);
    setSaveError(false);
    repositories.progress.setStudyWritingPreference(nextValue).catch(() => {
      setPreference(previous);
      setSaveError(true);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <View>
          <AppText variant="bodyBold">Escritura principal</AppText>
          <AppText style={{ color: theme.colors.onSurfaceVariant }}>
            Elige qué forma verás más grande; ambas permanecen visibles.
          </AppText>
        </View>
        {preference === null ? (
          <ActivityIndicator
            size="small"
            accessibilityLabel="Cargando preferencia de escritura"
          />
        ) : null}
      </View>

      {preference ? (
        <StudyWritingToggle
          value={preference}
          onChange={changePreference}
        />
      ) : null}

      <Snackbar
        visible={saveError}
        onDismiss={() => setSaveError(false)}
        duration={4000}>
        No pudimos guardar la preferencia.
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    marginBottom: 24,
  },
  labelRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
});
