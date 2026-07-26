import type { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

import { fontsByRole } from '@/src/ui/theme';

type TextProps = Omit<ComponentProps<typeof Text>, 'variant'>;
type AppTextVariant = 'body' | 'bodyBold' | 'label' | 'heading' | 'target' | 'japanese';

type AppTextProps = TextProps & {
  variant?: AppTextVariant;
};

export function AppText({
  variant = 'body',
  style,
  ...props
}: AppTextProps) {
  return <Text {...props} style={[styles[variant], style]} />;
}

const styles = StyleSheet.create({
  body: {
    fontFamily: fontsByRole.body,
    fontSize: 16,
    lineHeight: 23,
  },
  bodyBold: {
    fontFamily: fontsByRole.bodyBold,
    fontSize: 16,
    lineHeight: 23,
  },
  label: {
    fontFamily: fontsByRole.bodyBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  heading: {
    fontFamily: fontsByRole.target,
    fontSize: 30,
    lineHeight: 38,
  },
  target: {
    fontFamily: fontsByRole.target,
    fontSize: 58,
    lineHeight: 72,
  },
  japanese: {
    fontFamily: fontsByRole.japanese,
    fontSize: 18,
    lineHeight: 29,
  },
});
