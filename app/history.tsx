import { router } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import {
  Button,
  Icon,
  IconButton,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';

import {
  classifyRecallOutcome,
  formatRecallOutcome,
  type RecallOutcome,
} from '@/src/core/history/recall-outcome';
import { useHistory } from '@/src/features/history/useHistory';
import { AppText } from '@/src/ui/AppText';
import { Page } from '@/src/ui/Page';

function formatAttemptDate(timestamp: number): string {
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(timestamp));
}

function outcomeColor(
  outcome: RecallOutcome,
  rememberedColor: string,
  misrememberedColor: string,
  forgottenColor: string,
): string {
  if (outcome === 'remembered') {
    return rememberedColor;
  }
  if (outcome === 'misremembered') {
    return misrememberedColor;
  }
  return forgottenColor;
}

export default function HistoryScreen() {
  const theme = useTheme();
  const { items, loading, error, reload } = useHistory();

  return (
    <Page>
      <View style={styles.appBar}>
        <IconButton
          icon="arrow-left"
          onPress={() => router.back()}
          accessibilityLabel="Volver a lecciones"
        />
        <AppText variant="heading" style={styles.title}>
          Historial
        </AppText>
        <View style={styles.balance} />
      </View>

      <AppText style={[styles.intro, { color: theme.colors.onSurfaceVariant }]}>
        Cada respuesta queda guardada. Olvidar también es información útil para
        decidir cuándo debe volver una palabra.
      </AppText>

      {loading ? (
        <ActivityIndicator accessibilityLabel="Cargando historial" />
      ) : error ? (
        <View accessibilityRole="alert">
          <AppText variant="bodyBold">No pudimos leer tu historial.</AppText>
          <AppText>{error.message}</AppText>
          <Button onPress={reload}>Reintentar</Button>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.empty}>
          <AppText variant="heading">Aún no hay respuestas.</AppText>
          <AppText style={{ color: theme.colors.onSurfaceVariant }}>
            Empieza una lección para ver aquí qué recordaste y qué necesita volver.
          </AppText>
        </View>
      ) : (
        <View>
          {items.map((item) => {
            const outcome = classifyRecallOutcome(
              item.recallClaim,
              item.rating,
            );
            const outcomeLabel = formatRecallOutcome(outcome);
            const openDetails = () => {
              if (!item.senseId) {
                return;
              }
              router.push({
                pathname: '/word/[entryId]',
                params: {
                  entryId: item.entryId,
                  senseId: item.senseId,
                },
              });
            };
            return (
              <TouchableRipple
                key={item.attemptId}
                accessibilityRole="button"
                accessibilityLabel={`${item.target}, ${item.meaningEs}. ${outcomeLabel}. Abrir ficha de estudio`}
                disabled={!item.senseId}
                onPress={openDetails}>
                <View style={[styles.row, { borderColor: theme.colors.outline }]}>
                  <View style={styles.word}>
                    <AppText variant="japanese" accessibilityLanguage="ja-JP">
                      {item.target}
                    </AppText>
                    <AppText style={{ color: theme.colors.onSurfaceVariant }}>
                      {[item.reading, item.meaningEs].filter(Boolean).join(' · ')}
                    </AppText>
                  </View>
                  <View style={styles.result}>
                    <AppText
                      variant="bodyBold"
                      style={{
                        color: outcomeColor(
                          outcome,
                          theme.colors.secondary,
                          theme.colors.primary,
                          theme.colors.onSurfaceVariant,
                        ),
                      }}>
                      {outcomeLabel}
                    </AppText>
                    {outcome === 'misremembered' ? (
                      <AppText
                        style={[
                          styles.calibration,
                          { color: theme.colors.onSurfaceVariant },
                        ]}>
                        Creías recordarla · No coincidió
                      </AppText>
                    ) : null}
                    <AppText style={{ color: theme.colors.onSurfaceVariant }}>
                      {formatAttemptDate(item.reviewedAt)}
                    </AppText>
                  </View>
                  {item.senseId ? (
                    <Icon
                      source="chevron-right"
                      size={22}
                      color={theme.colors.onSurfaceVariant}
                    />
                  ) : null}
                </View>
              </TouchableRipple>
            );
          })}
        </View>
      )}
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
  intro: {
    marginTop: 24,
    marginBottom: 32,
  },
  empty: {
    gap: 12,
    marginTop: 30,
  },
  row: {
    minHeight: 84,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  word: {
    flex: 1,
  },
  result: {
    maxWidth: 180,
    alignItems: 'flex-end',
  },
  calibration: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'right',
  },
});
