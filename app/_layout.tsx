import 'react-native-reanimated';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';

import { AppBootstrapProvider } from '@/src/features/bootstrap/AppBootstrapProvider';
import { darkTheme, lightTheme } from '@/src/ui/theme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <AppBootstrapProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="study/[lessonId]" />
            <Stack.Screen name="history" />
            <Stack.Screen name="word/[entryId]" />
          </Stack>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </AppBootstrapProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
