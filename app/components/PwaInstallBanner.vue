<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-full opacity-0"
  >
    <div
      v-if="showBanner"
      class="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-lg safe-area-bottom"
    >
      <div class="flex items-center justify-between max-w-lg mx-auto gap-3">
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-md"
          >
            <svg
              class="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
          </div>
          <div>
            <p class="font-semibold text-gray-900 text-sm">
              Instalar App Produção
            </p>
            <p class="text-xs text-gray-500">Acesso rápido na tela inicial</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="dismiss"
            class="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
          >
            Depois
          </button>
          <button
            @click="install"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors"
          >
            Instalar
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const { isInstallable, isInstalled, initPwa, installApp } = usePwa();

const showBanner = ref(false);
const dismissed = ref(false);

onMounted(() => {
  initPwa();

  // Mostrar banner após 3 segundos se for instalável e não foi dispensado
  setTimeout(() => {
    const wasDismissed = localStorage.getItem("pwa-banner-dismissed");
    if (wasDismissed) {
      const dismissedTime = parseInt(wasDismissed);
      // Mostrar novamente após 7 dias
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        dismissed.value = true;
      }
    }

    if (isInstallable.value && !isInstalled.value && !dismissed.value) {
      showBanner.value = true;
    }
  }, 3000);
});

watch(isInstallable, (value) => {
  if (value && !isInstalled.value && !dismissed.value) {
    showBanner.value = true;
  }
});

const install = async () => {
  const success = await installApp();
  if (success) {
    showBanner.value = false;
  }
};

const dismiss = () => {
  showBanner.value = false;
  dismissed.value = true;
  localStorage.setItem("pwa-banner-dismissed", Date.now().toString());
};
</script>

<style scoped>
.safe-area-bottom {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}
</style>
