import {
  usePreventRemove,
  type NavigationProp,
  type ParamListBase,
} from '@react-navigation/native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import {
  AccessibilityInfo,
  Alert,
  findNodeHandle,
  StyleSheet,
  View,
} from 'react-native';
import {
  ActivityIndicator,
  IconButton,
  Snackbar,
  useTheme,
} from 'react-native-paper';
import {
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';

import type { VocabularyEntry } from '@/src/core/content-schema/schema';
import type { RecallRating } from '@/src/core/scheduling/scheduler';
import type { StudyWritingPreference } from '@/src/core/preferences/study-writing';
import { formatLessonLabel } from '@/src/core/lessons/presentation';
import {
  createStudySession,
  sessionReducer,
} from '@/src/core/session/session-reducer';
import { getRevealedRating } from '@/src/core/session/revealed-action';
import { systemClock } from '@/src/data/clock';
import { useRepositories } from '@/src/features/bootstrap/AppBootstrapProvider';
import { buildFocusedSessionCards } from '@/src/features/focused-session/buildFocusedSession';
import { SwipeDecision } from '@/src/features/focused-session/SwipeDecision';
import { StudyWritingToggle } from '@/src/features/preferences/StudyWritingToggle';
import {
  VocabularyDetails,
  VocabularyTarget,
} from '@/src/features/vocabulary/VocabularyDetails';
import {
  NeutralButton,
  PrimaryButton,
} from '@/src/ui/AppButton';
import { AppText } from '@/src/ui/AppText';
import { Page } from '@/src/ui/Page';

type LoadedSession = {
  entries: Map<string, VocabularyEntry>;
  lessonTitle: string;
  lessonLabel: string;
  courseId: string;
  writingPreference: StudyWritingPreference;
  cards: Awaited<ReturnType<typeof buildFocusedSessionCards>>;
};

export default function FocusedSessionScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const repositories = useRepositories();
  const [loaded, setLoaded] = useState<LoadedSession | null>(null);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!lessonId) {
        throw new Error('No encontramos esa lección.');
      }
      const lessons = await repositories.content.listLessons();
      const lesson = lessons.find((candidate) => candidate.id === lessonId);
      if (!lesson) {
        throw new Error('No encontramos esa lección.');
      }
      const entries = await repositories.content.getEntriesForLesson(lessonId);
      const cards = await buildFocusedSessionCards({
        courseId: lesson.courseId,
        entries,
        progress: repositories.progress,
        now: systemClock.now(),
      });
      const writingPreference =
        await repositories.progress.getStudyWritingPreference();
      await repositories.progress.enrollLesson(lessonId, systemClock.now());

      if (active) {
        setLoaded({
          entries: new Map(entries.map((entry) => [entry.id, entry])),
          lessonTitle: lesson.title.es,
          lessonLabel: formatLessonLabel(lesson),
          courseId: lesson.courseId,
          writingPreference,
          cards,
        });
      }
    };

    load().catch((reason: unknown) => {
      if (active) {
        setLoadError(
          reason instanceof Error ? reason : new Error('No pudimos abrir la lección.'),
        );
      }
    });
    return () => {
      active = false;
    };
  }, [lessonId, repositories]);

  // The reducer is intentionally pure. Loading creates its initial state through
  // a remount key below instead of teaching the reducer about I/O.
  if (loadError) {
    return (
      <Page>
        <AppText variant="heading">No pudimos abrir la lección</AppText>
        <AppText>{loadError.message}</AppText>
        <PrimaryButton onPress={() => router.back()}>Volver</PrimaryButton>
      </Page>
    );
  }

  if (!loaded) {
    return (
      <Page scroll={false}>
        <View style={styles.loading}>
          <ActivityIndicator accessibilityLabel="Preparando práctica" />
        </View>
      </Page>
    );
  }

  return (
    <LoadedFocusedSession
      key={loaded.cards.map((card) => card.cardId).join('|')}
      loaded={loaded}
      lessonId={lessonId}
      repositories={repositories}
    />
  );
}

type LoadedProps = {
  loaded: LoadedSession;
  lessonId: string;
  repositories: ReturnType<typeof useRepositories>;
};

function LoadedFocusedSession({
  loaded,
  lessonId,
  repositories,
}: LoadedProps) {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const theme = useTheme();
  const [session, dispatch] = useReducer(
    sessionReducer,
    loaded.cards,
    createStudySession,
  );
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [recallClaim, setRecallClaim] = useState<RecallRating | null>(null);
  const [writingPreference, setWritingPreference] =
    useState<StudyWritingPreference>(loaded.writingPreference);
  const meaningRef = useRef<View>(null);
  const completionSaved = useRef(false);
  const complete = session.phase === 'complete';

  usePreventRemove(!complete, ({ data }) => {
    Alert.alert(
      '¿Terminar la sesión?',
      'Tus respuestas guardadas se conservarán. La palabra actual volverá después.',
      [
        { text: 'Seguir practicando', style: 'cancel' },
        {
          text: 'Terminar',
          style: 'destructive',
          onPress: () => navigation.dispatch(data.action),
        },
      ],
    );
  });

  const currentEntry = session.current
    ? loaded.entries.get(session.current.entryId) ?? null
    : null;
  const currentSense =
    currentEntry && session.current
      ? currentEntry.senses.find((sense) => sense.id === session.current?.senseId) ??
        null
      : null;

  const revealWithClaim = (claim: RecallRating) => {
    setRecallClaim(claim);
    dispatch({ type: 'reveal' });
    setTimeout(() => {
      const handle = findNodeHandle(meaningRef.current);
      if (handle) {
        AccessibilityInfo.setAccessibilityFocus(handle);
      }
    }, 220);
  };

  const rate = async (rating: RecallRating) => {
    if (!session.current || !recallClaim || saving) {
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const nextSession = sessionReducer(session, { type: 'rate', rating });
      await repositories.progress.recordAttempt({
        cardId: session.current.cardId,
        entryId: session.current.entryId,
        lessonId,
        rating,
        recallClaim,
        now: systemClock.now(),
      });
      if (nextSession.phase === 'complete' && !completionSaved.current) {
        await repositories.progress.markFocusedSessionComplete(lessonId);
        completionSaved.current = true;
      }
      AccessibilityInfo.announceForAccessibility('Respuesta guardada');
      dispatch({ type: 'rate', rating });
      setRecallClaim(null);
    } catch (reason: unknown) {
      setSaveError(
        reason instanceof Error
          ? reason.message
          : 'No pudimos guardar tu respuesta.',
      );
    } finally {
      setSaving(false);
    }
  };

  const changeWritingPreference = (next: StudyWritingPreference) => {
    const previous = writingPreference;
    setWritingPreference(next);
    repositories.progress.setStudyWritingPreference(next).catch(() => {
      setWritingPreference(previous);
      setSaveError('No pudimos guardar la preferencia de escritura.');
    });
  };

  if (complete) {
    if (session.ratedAttempts === 0) {
      return (
        <Page>
          <AppText variant="label" style={{ color: theme.colors.primary }}>
            {loaded.lessonLabel}
          </AppText>
          <AppText variant="heading" style={styles.summaryHeading}>
            Todo al día.
          </AppText>
          <AppText style={{ color: theme.colors.onSurfaceVariant }}>
            No hay palabras nuevas o pendientes en esta lección. El sistema las
            traerá de vuelta cuando toque repasarlas.
          </AppText>
          <PrimaryButton style={styles.returnButton} onPress={() => router.back()}>
            Volver a lecciones
          </PrimaryButton>
        </Page>
      );
    }
    return (
      <Page>
        <AppText variant="label" style={{ color: theme.colors.primary }}>
          Sesión terminada
        </AppText>
        <AppText variant="heading" style={styles.summaryHeading}>
          Practicaste {session.practicedCardIds.length}{' '}
          {session.practicedCardIds.length === 1 ? 'palabra' : 'palabras'}.
        </AppText>
        <AppText style={{ color: theme.colors.onSurfaceVariant }}>
          {session.againAttempts === 0
            ? 'Todas quedaron programadas para volver en el momento adecuado.'
            : `${session.againAttempts} ${session.againAttempts === 1 ? 'respuesta volverá' : 'respuestas volverán'} pronto.`}
        </AppText>
        <PrimaryButton style={styles.returnButton} onPress={() => router.back()}>
          Volver a lecciones
        </PrimaryButton>
      </Page>
    );
  }

  if (!currentEntry || !currentSense) {
    return (
      <Page>
        <AppText variant="heading">Esta palabra no está disponible</AppText>
        <NeutralButton onPress={() => router.back()}>Volver</NeutralButton>
      </Page>
    );
  }

  const progress =
    loaded.cards.length === 0
      ? 0
      : Math.min(session.practicedCardIds.length + 1, loaded.cards.length);
  const targetPresentation = (
    <VocabularyTarget
      entry={currentEntry}
      writingPreference={writingPreference}
    />
  );

  return (
    <Page scroll={false} contentContainerStyle={styles.studyPage}>
      <View style={styles.sessionBar}>
        <IconButton
          icon="arrow-left"
          size={22}
          onPress={() => router.back()}
          accessibilityLabel="Terminar o volver"
        />
        <AppText variant="label" style={{ color: theme.colors.onSurfaceVariant }}>
          {loaded.lessonLabel}
        </AppText>
        <AppText style={{ color: theme.colors.onSurfaceVariant }}>
          {progress} de {loaded.cards.length}
        </AppText>
      </View>

      <View style={styles.persistentToggle}>
        <AppText variant="label" style={{ color: theme.colors.onSurfaceVariant }}>
          Escritura principal
        </AppText>
        <StudyWritingToggle
          value={writingPreference}
          onChange={changeWritingPreference}
          disabled={saving}
        />
      </View>

      {session.phase === 'recall' ? (
        <SwipeDecision
          key={`${session.current?.cardId}-prediction`}
          leftLabel="No recuerdo"
          rightLabel="Recuerdo"
          contentContainerStyle={styles.recallCardContent}
          onLeft={() => revealWithClaim('again')}
          onRight={() => revealWithClaim('good')}>
          {targetPresentation}
        </SwipeDecision>
      ) : (
        <SwipeDecision
          key={`${session.current?.cardId}-confirmation`}
          leftLabel={
            recallClaim === 'again' ? 'Siguiente palabra' : 'Recordé mal'
          }
          rightLabel={
            recallClaim === 'again' ? 'Siguiente palabra' : 'Sí recordé'
          }
          singleActionLabel={
            recallClaim === 'again' ? 'Siguiente palabra' : undefined
          }
          disabled={saving}
          scrollable
          onLeft={() =>
            recallClaim
              ? void rate(getRevealedRating(recallClaim, 'left'))
              : undefined
          }
          onRight={() =>
            recallClaim
              ? void rate(getRevealedRating(recallClaim, 'right'))
              : undefined
          }>
          <VocabularyDetails
            entry={currentEntry}
            sense={currentSense}
            writingPreference={writingPreference}
            meaningRef={meaningRef}
          />
        </SwipeDecision>
      )}

      <Snackbar
        visible={Boolean(saveError)}
        onDismiss={() => setSaveError(null)}
        action={
          saveError
            ? {
                label: 'Cerrar',
                onPress: () => setSaveError(null),
              }
            : undefined
        }>
        {saveError}
      </Snackbar>
    </Page>
  );
}

const styles = StyleSheet.create({
  studyPage: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 12,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionBar: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: -10,
  },
  persistentToggle: {
    gap: 8,
    marginTop: 4,
    marginBottom: 12,
  },
  recallCardContent: {
    justifyContent: 'center',
  },
  summaryHeading: {
    marginTop: 8,
    marginBottom: 12,
  },
  returnButton: {
    marginTop: 32,
  },
});
