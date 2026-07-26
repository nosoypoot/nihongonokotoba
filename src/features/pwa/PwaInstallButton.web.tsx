import { useEffect, useRef, useState } from 'react';

import { NeutralButton } from '@/src/ui/AppButton';

type InstallPromptEvent = Event & {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

type NavigatorWithStandalone = Navigator & {
  standalone?: boolean;
};

function isInstalled(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    Boolean((navigator as NavigatorWithStandalone).standalone)
  );
}

export function PwaInstallButton() {
  const promptRef = useRef<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    setInstalled(isInstalled());

    const capturePrompt = (event: Event) => {
      event.preventDefault();
      promptRef.current = event as InstallPromptEvent;
    };
    const markInstalled = () => {
      promptRef.current = null;
      setInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', capturePrompt);
    window.addEventListener('appinstalled', markInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', capturePrompt);
      window.removeEventListener('appinstalled', markInstalled);
    };
  }, []);

  if (installed) {
    return null;
  }

  const install = async () => {
    const prompt = promptRef.current;
    if (prompt) {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome === 'accepted') {
        setInstalled(true);
      }
      return;
    }

    window.alert(
      'Para instalarla en iPhone: abre este sitio en Safari, toca Compartir y elige “Agregar a pantalla de inicio”. En Android, abre el menú del navegador y elige “Instalar aplicación”.',
    );
  };

  return (
    <NeutralButton
      icon="download"
      onPress={() => void install()}
      accessibilityHint="Instala la aplicación para abrirla desde tu pantalla de inicio y usarla sin conexión">
      Descargar PWA
    </NeutralButton>
  );
}
