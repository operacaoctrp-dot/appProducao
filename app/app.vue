<template>
  <div>
    <!-- Componente para acessibilidade (anúncios de mudança de rota) -->
    <NuxtRouteAnnouncer />
    
    <!-- Loading da autenticação inicial - só mostra se estiver carregando -->
    <div v-if="loading && !initialized" class="fixed inset-0 bg-background-primary flex items-center justify-center z-50">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mb-4"></div>
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
const { initialized, loading } = process.client ? useAuth() : { initialized: ref(true), loading: ref(false) }
</script>

<style>
/* Estilos globais */
html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
}

/* Transições suaves */
.router-link-active {
  transition: all 0.3s ease;
}
</style>
