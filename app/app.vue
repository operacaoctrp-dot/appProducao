<template>
  <div>
    <!-- Componente para acessibilidade (anúncios de mudança de rota) -->
    <NuxtRouteAnnouncer />

    <!-- Banner de instalação PWA -->
    <PwaInstallBanner />

    <!-- Loading da autenticação inicial - só mostra se não foi inicializado ainda -->
    <div
      v-if="!initialized"
      class="fixed inset-0 bg-background-primary flex items-center justify-center z-50"
    >
      <div class="text-center">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mb-4"
        ></div>
        <p class="text-text-secondary">Verificando autenticação...</p>
      </div>
    </div>

    <!-- Layout será aplicado automaticamente pelas páginas -->
    <NuxtLayout v-else>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// Verificar estado da autenticação apenas no cliente
const { initialized } = process.client ? useAuth() : { initialized: ref(true) };

// Prevenir recarregamento na mudança de orientação (apenas no cliente)
if (process.client) {
  onMounted(async () => {
    // O Service Worker agora é gerenciado pelo módulo @vite-pwa/nuxt

    // Flag para rastrear se está capturando foto
    let isCapturingPhoto = false;

    // Interceptar eventos de input file para marcar início de captura
    document.addEventListener("change", (event) => {
      if (
        event.target &&
        event.target.type === "file" &&
        event.target.accept &&
        event.target.accept.includes("image")
      ) {
        console.log("Início da captura de foto detectado");
        isCapturingPhoto = true;

        // Limpar flag após um tempo (caso não tenha outros eventos)
        setTimeout(() => {
          isCapturingPhoto = false;
        }, 10000); // 10 segundos
      }
    });

    // Prevenir completamente recarregamento durante mudanças de orientação
    const preventReload = (event) => {
      console.log("Orientação mudou, prevenindo recarregamento...");
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      return false;
    };

    // Múltiplos listeners para garantir que capture todos os casos
    window.addEventListener("orientationchange", preventReload, {
      passive: false,
      capture: true,
    });
    window.addEventListener("resize", preventReload, {
      passive: false,
      capture: true,
    });
    screen.orientation?.addEventListener("change", preventReload, {
      passive: false,
      capture: true,
    });

    // Listener específico para quando a orientação muda durante captura de foto
    window.addEventListener("orientationchange", () => {
      if (isCapturingPhoto) {
        console.log(
          "Mudança de orientação durante captura de foto - salvando estado..."
        );

        // Salvar estado atual da página no sessionStorage
        const currentFormData = document.querySelector("form");
        if (currentFormData) {
          const formData = new FormData(currentFormData);
          const formState = {};
          for (let [key, value] of formData.entries()) {
            formState[key] = value;
          }
          sessionStorage.setItem("formState", JSON.stringify(formState));
        }
      }

      // Delay para permitir que o layout se ajuste
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
        isCapturingPhoto = false;
      }, 300);
    });

    // Prevenir comportamentos padrão que causam recarregamento
    document.addEventListener("visibilitychange", (event) => {
      if (isCapturingPhoto) {
        console.log(
          "Visibilidade mudou durante captura - prevenindo ações padrão"
        );
        event.preventDefault();
      }
    });

    // Intercept page navigation during photo capture
    window.addEventListener("beforeunload", (event) => {
      if (isCapturingPhoto) {
        console.log(
          "Tentativa de recarregamento prevenida durante captura de foto"
        );
        event.preventDefault();
        event.returnValue = "";
        return "";
      }
    });
  });
}
</script>

<style>
/* Estilos globais */
html {
  scroll-behavior: smooth;
  /* Prevenir zoom em inputs no iOS */
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  line-height: 1.6;
  /* Prevenir bounce scrolling no iOS */
  overscroll-behavior: none;
  /* Melhor renderização em mudanças de orientação */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Melhor comportamento em mudanças de orientação */
* {
  box-sizing: border-box;
}

/* Otimizações para dispositivos móveis */
@media screen and (max-width: 768px) {
  /* Prevenir zoom em inputs no iOS */
  input[type="text"],
  input[type="email"],
  input[type="password"],
  input[type="number"],
  input[type="date"],
  input[type="file"],
  textarea,
  select {
    font-size: 16px !important;
  }

  /* Melhor comportamento de scroll */
  body {
    -webkit-overflow-scrolling: touch;
  }
}

/* Transições suaves para mudanças de layout */
.transition-orientation {
  transition: all 0.3s ease-in-out;
}
</style>
