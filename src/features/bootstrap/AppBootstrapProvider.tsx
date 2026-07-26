import { AtkinsonHyperlegible_400Regular } from '@expo-google-fonts/atkinson-hyperlegible/400Regular';
import { AtkinsonHyperlegible_700Bold } from '@expo-google-fonts/atkinson-hyperlegible/700Bold';
import { useFonts } from '@expo-google-fonts/atkinson-hyperlegible/useFonts';
import { NotoSansJP_400Regular } from '@expo-google-fonts/noto-sans-jp/400Regular';
import { NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp/700Bold';
import { NotoSerifJP_600SemiBold } from '@expo-google-fonts/noto-serif-jp/600SemiBold';
import * as SplashScreen from 'expo-splash-screen';
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text, useTheme } from 'react-native-paper';

import {
  initializeStorage,
  type AppRepositories,
} from '@/src/data/storage';

void SplashScreen.preventAutoHideAsync();

const RepositoriesContext = createContext<AppRepositories | null>(null);

export function AppBootstrapProvider({ children }: PropsWithChildren) {
  const theme = useTheme();
  const [fontsLoaded, fontError] = useFonts({
    AtkinsonHyperlegible_400Regular,
    AtkinsonHyperlegible_700Bold,
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
    NotoSerifJP_600SemiBold,
  });
  const [repositories, setRepositories] = useState<AppRepositories | null>(null);
  const [storageError, setStorageError] = useState<Error | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    let active = true;
    initializeStorage()
      .then((value) => {
        if (active) {
          setRepositories(value);
          setStorageError(null);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setStorageError(
            error instanceof Error ? error : new Error('No pudimos preparar las lecciones.'),
          );
        }
      });
    return () => {
      active = false;
    };
  }, [retryToken]);

  const ready = (fontsLoaded || Boolean(fontError)) && Boolean(repositories);

  useEffect(() => {
    if (ready || storageError) {
      void SplashScreen.hideAsync();
    }
  }, [ready, storageError]);

  if (storageError) {
    return (
      <View
        style={[styles.center, { backgroundColor: theme.colors.background }]}
        accessibilityRole="alert">
        <Text variant="headlineSmall">No pudimos preparar las lecciones</Text>
        <Text style={styles.errorDetail}>{storageError.message}</Text>
        <Button mode="contained" onPress={() => setRetryToken((value) => value + 1)}>
          Reintentar
        </Button>
      </View>
    );
  }

  if (!ready || !repositories) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator accessibilityLabel="Preparando lecciones" />
      </View>
    );
  }

  return (
    <RepositoriesContext.Provider value={repositories}>
      {children}
    </RepositoriesContext.Provider>
  );
}

export function useRepositories(): AppRepositories {
  const value = useContext(RepositoriesContext);
  if (!value) {
    throw new Error('useRepositories must be used inside AppBootstrapProvider');
  }
  return value;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 24,
  },
  errorDetail: {
    maxWidth: 460,
    textAlign: 'center',
  },
});
