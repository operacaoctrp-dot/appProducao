<template>
  <div class="min-h-screen flex flex-col bg-background-secondary">
    <!-- Header -->
    <AppHeader />
    
    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>
    
    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup>
// Imports explícitos dos componentes
import AppHeader from '~/components/AppHeader.vue'
import AppFooter from '~/components/AppFooter.vue'
</script>

<style scoped>
/* Estilos específicos do layout */
</style>