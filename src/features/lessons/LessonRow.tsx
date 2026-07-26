import { StyleSheet, View } from 'react-native';
import { TouchableRipple, useTheme } from 'react-native-paper';

import type { HomeLesson } from '@/src/features/lessons/useHomeData';
import {
  formatLessonLabel,
  formatLessonMarker,
} from '@/src/core/lessons/presentation';
import { AppText } from '@/src/ui/AppText';

type LessonRowProps = {
  lesson: HomeLesson;
  onPress(): void;
};

export function LessonRow({ lesson, onPress }: LessonRowProps) {
  const theme = useTheme();
  const practiceLabel =
    lesson.focusedSessionCount >= 3
      ? 'Disponible en repaso acumulado'
      : `${lesson.focusedSessionCount} de 3 prácticas enfocadas`;
  const lessonLabel = formatLessonLabel(lesson);

  return (
    <TouchableRipple
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${lessonLabel}, ${lesson.title.es}. ${lesson.wordCount} palabras. ${practiceLabel}`}
      style={[styles.touchable, { borderColor: theme.colors.outline }]}>
      <View style={styles.row}>
        <AppText style={{ color: theme.colors.primary }}>
          {formatLessonMarker(lesson)}
        </AppText>
        <View style={styles.copy}>
          <AppText variant="bodyBold">{lesson.title.es}</AppText>
          <AppText style={{ color: theme.colors.onSurfaceVariant }}>
            {lesson.wordCount} palabras · {practiceLabel}
          </AppText>
        </View>
        <AppText
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{ color: theme.colors.onSurfaceVariant }}>
          ›
        </AppText>
      </View>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  touchable: {
    minHeight: 72,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  row: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
  },
  copy: {
    flex: 1,
  },
});
