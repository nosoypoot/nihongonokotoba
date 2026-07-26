import { useCallback, useMemo, type PropsWithChildren } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { TouchableRipple, useTheme } from 'react-native-paper';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/src/ui/AppText';

type Direction = 'left' | 'right';

type Props = PropsWithChildren<{
  leftLabel: string;
  rightLabel: string;
  disabled?: boolean;
  scrollable?: boolean;
  singleActionLabel?: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
  onLeft(): void;
  onRight(): void;
}>;

const COMMIT_DISTANCE = 76;
const EXIT_DISTANCE = 420;

export function SwipeDecision({
  children,
  leftLabel,
  rightLabel,
  disabled = false,
  scrollable = false,
  singleActionLabel,
  contentContainerStyle,
  onLeft,
  onRight,
}: Props) {
  const theme = useTheme();
  const translationX = useSharedValue(0);

  const completeDecision = useCallback(
    (direction: Direction) => {
      if (direction === 'left') {
        onLeft();
      } else {
        onRight();
      }
    },
    [onLeft, onRight],
  );

  const animateOut = useCallback(
    (direction: Direction) => {
      if (disabled) {
        return;
      }
      translationX.value = withTiming(
        direction === 'left' ? -EXIT_DISTANCE : EXIT_DISTANCE,
        { duration: 190 },
        (finished) => {
          if (finished) {
            translationX.value = 0;
            runOnJS(completeDecision)(direction);
          }
        },
      );
    },
    [completeDecision, disabled, translationX],
  );

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .enabled(!disabled)
        .activeOffsetX([-12, 12])
        .failOffsetY([-20, 20])
        .onUpdate((event) => {
          translationX.value = event.translationX;
        })
        .onEnd((event) => {
          if (event.translationX <= -COMMIT_DISTANCE) {
            translationX.value = withTiming(
              -EXIT_DISTANCE,
              { duration: 190 },
              (finished) => {
                if (finished) {
                  translationX.value = 0;
                  runOnJS(completeDecision)('left');
                }
              },
            );
          } else if (event.translationX >= COMMIT_DISTANCE) {
            translationX.value = withTiming(
              EXIT_DISTANCE,
              { duration: 190 },
              (finished) => {
                if (finished) {
                  translationX.value = 0;
                  runOnJS(completeDecision)('right');
                }
              },
            );
          } else {
            translationX.value = withSpring(0, {
              damping: 18,
              stiffness: 240,
            });
          }
        }),
    [completeDecision, disabled, translationX],
  );

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value },
      {
        rotate: `${interpolate(
          translationX.value,
          [-180, 0, 180],
          [-8, 0, 8],
          Extrapolation.CLAMP,
        )}deg`,
      },
    ],
  }));
  const leftStampStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translationX.value,
      [-COMMIT_DISTANCE, -16, 0],
      [1, 0.12, 0],
      Extrapolation.CLAMP,
    ),
  }));
  const rightStampStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translationX.value,
      [0, 16, COMMIT_DISTANCE],
      [0, 0.12, 1],
      Extrapolation.CLAMP,
    ),
  }));
  const content = scrollable ? (
    <ScrollView
      style={styles.cardScroll}
      contentContainerStyle={[styles.cardContent, contentContainerStyle]}
      nestedScrollEnabled
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.cardContent, contentContainerStyle]}>{children}</View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.stage}>
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.outline,
              },
              cardStyle,
            ]}>
            <Animated.View
              pointerEvents="none"
              style={[
                styles.stamp,
                styles.leftStamp,
                {
                  borderColor: singleActionLabel
                    ? theme.colors.primary
                    : theme.colors.onSurfaceVariant,
                },
                leftStampStyle,
              ]}>
              <AppText
                variant="bodyBold"
                style={
                  singleActionLabel ? { color: theme.colors.primary } : undefined
                }>
                {singleActionLabel ?? leftLabel}
              </AppText>
            </Animated.View>
            <Animated.View
              pointerEvents="none"
              style={[
                styles.stamp,
                styles.rightStamp,
                {
                  borderColor: singleActionLabel
                    ? theme.colors.primary
                    : theme.colors.secondary,
                },
                rightStampStyle,
              ]}>
              <AppText
                variant="bodyBold"
                style={{
                  color: singleActionLabel
                    ? theme.colors.primary
                    : theme.colors.secondary,
                }}>
                {singleActionLabel ?? rightLabel}
              </AppText>
            </Animated.View>
            {content}
          </Animated.View>
        </GestureDetector>
      </View>

      <View style={styles.actions}>
        {singleActionLabel ? (
          <TouchableRipple
            accessibilityRole="button"
            accessibilityLabel={singleActionLabel}
            disabled={disabled}
            onPress={() => animateOut('right')}
            style={[
              styles.actionButton,
              styles.singleAction,
              { borderColor: theme.colors.primary },
            ]}>
            <AppText variant="bodyBold" style={{ color: theme.colors.primary }}>
              {singleActionLabel}
            </AppText>
          </TouchableRipple>
        ) : (
          <>
            <TouchableRipple
              accessibilityRole="button"
              accessibilityLabel={leftLabel}
              disabled={disabled}
              onPress={() => animateOut('left')}
              style={[
                styles.actionButton,
                { borderColor: theme.colors.onSurfaceVariant },
              ]}>
              <AppText variant="bodyBold">{leftLabel}</AppText>
            </TouchableRipple>
            <TouchableRipple
              accessibilityRole="button"
              accessibilityLabel={rightLabel}
              disabled={disabled}
              onPress={() => animateOut('right')}
              style={[
                styles.actionButton,
                { borderColor: theme.colors.secondary },
              ]}>
              <AppText
                variant="bodyBold"
                style={{ color: theme.colors.secondary }}>
                {rightLabel}
              </AppText>
            </TouchableRipple>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 0,
    gap: 12,
  },
  stage: {
    flex: 1,
    minHeight: 0,
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    minHeight: 0,
    padding: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
  },
  cardContent: {
    flexGrow: 1,
    width: '100%',
  },
  cardScroll: {
    flex: 1,
  },
  stamp: {
    position: 'absolute',
    top: 12,
    zIndex: 2,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 5,
    borderWidth: 2,
    borderRadius: 4,
  },
  leftStamp: {
    right: 16,
    transform: [{ rotate: '7deg' }],
  },
  rightStamp: {
    left: 16,
    transform: [{ rotate: '-7deg' }],
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  actionButton: {
    minHeight: 52,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 2,
    borderRadius: 6,
  },
  singleAction: {
    maxWidth: 320,
  },
});
