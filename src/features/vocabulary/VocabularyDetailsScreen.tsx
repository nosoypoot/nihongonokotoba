import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, IconButton, Snackbar, useTheme } from 'react-native-paper';

import type {
  VocabularyEntry,
  VocabularySense,
} from '@/src/core/content-schema/schema';
import type { StudyWritingPreference } from '@/src/core/preferences/study-writing';
import { useRepositories } from '@/src/features/bootstrap/AppBootstrapProvider';
import { StudyWritingToggle } from '@/src/features/preferences/StudyWritingToggle';
import { VocabularyDetails } from '@/src/features/vocabulary/VocabularyDetails';
import { AppText } from '@/src/ui/AppText';
import { Page } from '@/src/ui/Page';

type LoadedDetails = {
  entry: VocabularyEntry;
  sense: VocabularySense;
  writingPreference: StudyWritingPreference;
};

export default function VocabularyDetailsScreen() {
  const { entryId, senseId } = useLocalSearchParams<{
    entryId: string;
    senseId?: string;
  }>();
  const repositories = useRepositories();
  const theme = useTheme();
  const [loaded, setLoaded] = useState<LoadedDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    Promise.all([
      repositories.content.getEntry(entryId),
      repositories.progress.getStudyWritingPreference(),
    ])
      .then(([entry, writingPreference]) => {
        const sense =
          entry?.senses.find((candidate) => candidate.id === senseId) ??
          entry?.senses[0];
        if (!entry || !sense) {
          throw new Error('No encontramos la información de esta palabra.');
        }
        if (active) {
          setLoaded({ entry, sense, writingPreference });
        }
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(
            reason instanceof Error
              ? reason.message
              : 'No pudimos abrir esta palabra.',
          );
        }
      });

    return () => {
      active = false;
    };
  }, [entryId, repositories, senseId]);

  const changeWritingPreference = (next: StudyWritingPreference) => {
    if (!loaded) {
      return;
    }
    const previous = loaded.writingPreference;
    setLoaded({ ...loaded, writingPreference: next });
    repositories.progress.setStudyWritingPreference(next).catch(() => {
      setLoaded((current) =>
        current ? { ...current, writingPreference: previous } : current,
      );
      setError('No pudimos guardar la preferencia de escritura.');
    });
  };

  return (
    <Page>
      <View style={styles.appBar}>
        <IconButton
          icon="arrow-left"
          onPress={() => router.back()}
          accessibilityLabel="Volver al historial"
        />
        <AppText variant="heading" style={styles.title}>
          Ficha de estudio
        </AppText>
        <View style={styles.balance} />
      </View>

      {!loaded && !error ? (
        <View style={styles.loading}>
          <ActivityIndicator accessibilityLabel="Cargando palabra" />
        </View>
      ) : loaded ? (
        <>
          <View style={styles.toggle}>
            <AppText
              variant="label"
              style={{ color: theme.colors.onSurfaceVariant }}>
              Escritura principal
            </AppText>
            <StudyWritingToggle
              value={loaded.writingPreference}
              onChange={changeWritingPreference}
            />
          </View>
          <VocabularyDetails
            entry={loaded.entry}
            sense={loaded.sense}
            writingPreference={loaded.writingPreference}
          />
        </>
      ) : (
        <View accessibilityRole="alert" style={styles.error}>
          <AppText variant="bodyBold">No pudimos abrir esta palabra.</AppText>
          <AppText>{error}</AppText>
        </View>
      )}

      <Snackbar visible={Boolean(error && loaded)} onDismiss={() => setError(null)}>
        {error}
      </Snackbar>
    </Page>
  );
}

const styles = StyleSheet.create({
  appBar: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: -10,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
  },
  balance: {
    width: 48,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggle: {
    gap: 8,
    marginTop: 16,
  },
  error: {
    gap: 8,
    marginTop: 32,
  },
});
