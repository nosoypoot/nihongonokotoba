import { router } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

import { formatLessonLabel } from '@/src/core/lessons/presentation';
import { groupLessonsNewestFirst } from '@/src/core/lessons/ordering';
import { LessonRow } from '@/src/features/lessons/LessonRow';
import { useHomeData } from '@/src/features/lessons/useHomeData';
import { WritingPreferenceControl } from '@/src/features/preferences/WritingPreferenceControl';
import { PwaInstallButton } from '@/src/features/pwa/PwaInstallButton';
import { PrimaryButton } from '@/src/ui/AppButton';
import { AppText } from '@/src/ui/AppText';
import { Page } from '@/src/ui/Page';

function formatToday(): string {
  const value = new Intl.DateTimeFormat('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function HomeScreen() {
  const theme = useTheme();
  const { lessons, dueCount, loading, error, reload } = useHomeData();
  const {
    numbered: numberedLessons,
    special: specialLessons,
  } = groupLessonsNewestFirst(lessons);
  const orderedLessons = [...numberedLessons, ...specialLessons];
  const firstLesson =
    orderedLessons.find((lesson) => lesson.dueCount > 0) ??
    orderedLessons.find((lesson) => lesson.unseenCount > 0) ??
    orderedLessons[0];
  const hasAvailableCards = Boolean(
    firstLesson && (firstLesson.dueCount > 0 || firstLesson.unseenCount > 0),
  );
  const primaryLabel =
    dueCount > 0
      ? `Repasar ${dueCount} ${dueCount === 1 ? 'palabra' : 'palabras'}`
      : firstLesson
        ? hasAvailableCards
          ? firstLesson.kind === 'special'
            ? `Continuar ${firstLesson.title.es}`
            : `Continuar ${formatLessonLabel(firstLesson).toLocaleLowerCase('es-MX')}`
          : 'Todo al día'
        : 'Todo al día';

  const startFirstLesson = () => {
    if (firstLesson) {
      router.push({
        pathname: '/study/[lessonId]',
        params: { lessonId: firstLesson.id },
      });
    }
  };

  return (
    <Page>
      <View style={styles.appBar}>
        <AppText
          variant="heading"
          style={styles.wordmark}
          accessibilityLanguage="ja-JP">
          ことば
        </AppText>
        <Button
          compact
          onPress={() => router.push('/history')}
          accessibilityLabel="Abrir historial de respuestas">
          Historial
        </Button>
      </View>

      <AppText style={{ color: theme.colors.onSurfaceVariant }}>
        {formatToday()}
      </AppText>
      <AppText variant="heading" style={styles.prompt}>
        {dueCount > 0
          ? `${dueCount === 1 ? 'Una palabra necesita' : `${dueCount} palabras necesitan`} volver a tu memoria.`
          : hasAvailableCards
            ? 'Tu siguiente lección está lista cuando tú lo estés.'
            : 'No hay palabras pendientes ahora.'}
      </AppText>

      <WritingPreferenceControl />
      <PwaInstallButton />

      {loading ? (
        <ActivityIndicator
          style={styles.loading}
          accessibilityLabel="Cargando lecciones"
        />
      ) : error ? (
        <View style={styles.error} accessibilityRole="alert">
          <AppText variant="bodyBold">No pudimos leer tus lecciones.</AppText>
          <AppText>{error.message}</AppText>
          <Button onPress={reload}>Reintentar</Button>
        </View>
      ) : (
        <>
          <PrimaryButton
            onPress={startFirstLesson}
            disabled={!firstLesson || !hasAvailableCards}
            accessibilityHint="Inicia una práctica enfocada de aproximadamente cinco minutos">
            {primaryLabel} · 5 min
          </PrimaryButton>

          <LessonSection
            title="Lecciones numeradas"
            lessons={numberedLessons}
          />
          <LessonSection title="Especiales" lessons={specialLessons} />
        </>
      )}
    </Page>
  );
}

type LessonSectionProps = {
  title: string;
  lessons: ReturnType<typeof useHomeData>['lessons'];
};

function LessonSection({ title, lessons }: LessonSectionProps) {
  const theme = useTheme();
  if (lessons.length === 0) {
    return null;
  }

  return (
    <View>
      <View style={styles.sectionHeader}>
        <AppText variant="bodyBold">{title}</AppText>
        <AppText style={{ color: theme.colors.onSurfaceVariant }}>
          {lessons.length}
        </AppText>
      </View>
      {lessons.map((lesson) => (
        <LessonRow
          key={lesson.id}
          lesson={lesson}
          onPress={() =>
            router.push({
              pathname: '/study/[lessonId]',
              params: { lessonId: lesson.id },
            })
          }
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  appBar: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 36,
  },
  wordmark: {
    fontSize: 22,
    lineHeight: 30,
  },
  prompt: {
    marginTop: 6,
    marginBottom: 28,
    maxWidth: 520,
  },
  loading: {
    marginTop: 48,
  },
  error: {
    gap: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 36,
    marginBottom: 10,
  },
});
