// Composable para gerenciar instalação PWA
export const usePwa = () => {
  const deferredPrompt = ref<any>(null);
  const isInstallable = ref(false);
  const isInstalled = ref(false);

  const checkIfInstalled = () => {
    // Verifica se já está instalado
    if (window.matchMedia("(display-mode: standalone)").matches) {
      isInstalled.value = true;
      return true;
    }
    // Para iOS
    if ((window.navigator as any).standalone === true) {
      isInstalled.value = true;
      return true;
    }
    return false;
  };

  const initPwa = () => {
    if (import.meta.client) {
      checkIfInstalled();

      window.addEventListener("beforeinstallprompt", (e: Event) => {
        e.preventDefault();
        deferredPrompt.value = e;
        isInstallable.value = true;
      });

      window.addEventListener("appinstalled", () => {
        isInstalled.value = true;
        isInstallable.value = false;
        deferredPrompt.value = null;
      });
    }
  };

  const installApp = async () => {
    if (!deferredPrompt.value) {
      return false;
    }

    deferredPrompt.value.prompt();
    const { outcome } = await deferredPrompt.value.userChoice;

    if (outcome === "accepted") {
      isInstalled.value = true;
      isInstallable.value = false;
    }

    deferredPrompt.value = null;
    return outcome === "accepted";
  };

  return {
    deferredPrompt,
    isInstallable,
    isInstalled,
    initPwa,
    installApp,
    checkIfInstalled,
  };
};
