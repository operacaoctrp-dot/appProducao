<template>
  <div class="container mx-auto px-4 py-16">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-text-primary mb-4">
        Bem-vindo à Página Inicial
      </h1>
      <p class="text-xl text-text-secondary max-w-2xl mx-auto">
        Conteúdo será adicionado posteriormente
      </p>
    </div>
  </div>
</template>

<script setup>
// Definir o layout a ser usado
definePageMeta({
  layout: 'default'
})

// Meta tags para SEO
useHead({
  title: 'Página Inicial - Nuxt App',
  meta: [
    { name: 'description', content: 'Página inicial da aplicação Nuxt' }
  ]
})
</script>

<style scoped>
/* Estilos específicos da página inicial */
</style>