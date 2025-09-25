<template>
  <footer class="bg-background-dark text-text-inverse mt-auto">
    <div class="container mx-auto px-4 py-6">
      <div
        class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
      >
        <!-- Brand Section -->
        <div class="flex items-center space-x-2">
          <span class="text-xl">🏥</span>
          <h3 class="text-lg font-bold text-primary-400">
            Sistema de Produção
          </h3>
        </div>

        <!-- Developer Credit (Center) -->
        <div class="text-orange-400 text-sm font-medium">
          <p>Desenvolvido por Kilson Oliveira</p>
        </div>

        <!-- Copyright -->
        <div class="text-secondary-400 text-sm text-center md:text-right">
          <p>
            &copy; {{ currentYear }} Sistema de Produção. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";

// Ano atual para o copyright
const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
/* Estilos específicos do footer */
</style>
