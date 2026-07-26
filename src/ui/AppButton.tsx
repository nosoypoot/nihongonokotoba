import type { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

type PaperButtonProps = ComponentProps<typeof Button>;

export function PrimaryButton(props: PaperButtonProps) {
  return (
    <Button
      {...props}
      mode="contained"
      contentStyle={styles.content}
      labelStyle={styles.label}
      style={[styles.button, props.style]}
    />
  );
}

export function RememberedButton(props: PaperButtonProps) {
  const theme = useTheme();
  return (
    <Button
      {...props}
      mode="contained-tonal"
      buttonColor={theme.colors.secondaryContainer}
      textColor={theme.colors.secondary}
      contentStyle={styles.content}
      labelStyle={styles.label}
      style={[styles.button, props.style]}
    />
  );
}

export function NeutralButton(props: PaperButtonProps) {
  return (
    <Button
      {...props}
      mode="outlined"
      contentStyle={styles.content}
      labelStyle={styles.label}
      style={[styles.button, props.style]}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 6,
  },
  content: {
    minHeight: 52,
  },
  label: {
    fontFamily: 'AtkinsonHyperlegible_700Bold',
    fontSize: 16,
  },
});
