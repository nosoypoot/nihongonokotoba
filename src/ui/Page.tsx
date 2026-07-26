import type { PropsWithChildren, ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  type ScrollViewProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';

type PageProps = PropsWithChildren<{
  header?: ReactNode;
  scroll?: boolean;
  contentContainerStyle?: ScrollViewProps['contentContainerStyle'];
}>;

export function Page({
  children,
  header,
  scroll = true,
  contentContainerStyle,
}: PageProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width, 680);
  const horizontalPadding = width < 600 ? 20 : 32;

  const content = (
    <View
      style={[
        styles.content,
        { width: contentWidth, paddingHorizontal: horizontalPadding },
        contentContainerStyle,
      ]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView
      edges={['top', 'right', 'bottom', 'left']}
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      {header}
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          {content}
        </ScrollView>
      ) : (
        <View style={styles.fixedContent}>{content}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  fixedContent: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 32,
  },
});
