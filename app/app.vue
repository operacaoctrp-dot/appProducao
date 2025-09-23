<template>
  <div>
    <!-- Componente para acessibilidade (anúncios de mudança de rota) -->
    <NuxtRouteAnnouncer />
    
    <!-- Layout será aplicado automaticamente pelas páginas -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// App.vue agora apenas coordena layouts e páginas
// Header e Footer estão nos layouts específicos
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
