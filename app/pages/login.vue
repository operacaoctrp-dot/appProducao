<template>
  <div class="min-h-screen relative">
    <!-- Background com imagem -->
    <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" 
         style="background-image: url('/CTRP_Incinerador.jpg')"></div>
    
    <!-- Overlay escuro para melhor legibilidade -->
    <div class="absolute inset-0 bg-black bg-opacity-50"></div>
    
    <!-- Container principal -->
    <div class="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <!-- Conteúdo principal -->
      <div class="w-full">
      <!-- Título da página -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white drop-shadow-lg mb-2">
          Acesse sua conta
        </h1>
        <p class="text-white/90 max-w-md mx-auto drop-shadow-md">
          Faça login para continuar ou crie uma nova conta
        </p>
      </div>

      <!-- Componente de formulário de login -->
      <LoginForm />

        <!-- Link para voltar -->
        <div class="text-center mt-8">
          <NuxtLink 
            to="/" 
            class="inline-flex items-center text-sm text-white/80 hover:text-white transition-colors drop-shadow-md"
          >
            <ArrowLeftIcon class="h-4 w-4 mr-2" />
            Voltar ao início
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import LoginForm from '~/components/LoginForm.vue'

// Página sem layout e middleware para usuários não logados
definePageMeta({
  layout: false,
  middleware: 'guest'
})

// Meta tags para SEO
useHead({
  title: 'Login - Nuxt App',
  meta: [
    { name: 'description', content: 'Faça login ou crie uma nova conta na aplicação Nuxt' }
  ]
})
</script>

<style scoped>
/* Estilos específicos da página de login */
</style>