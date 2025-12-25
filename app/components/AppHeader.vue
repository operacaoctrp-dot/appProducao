<template>
  <header
    class="bg-background-primary shadow-soft border-b border-border-light sticky top-0 z-50"
  >
    <nav class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo/Brand -->
        <div class="flex items-center space-x-4">
          <NuxtLink
            to="/"
            class="text-xl font-bold text-primary-500 hover:text-primary-600 transition-colors"
          >
            AppProdução
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-6">
          <NuxtLink
            to="/"
            class="text-text-secondary hover:text-primary-500 transition-colors font-medium"
            active-class="text-primary-500 font-semibold"
          >
            Início
          </NuxtLink>
          <NuxtLink
            to="/producao"
            class="text-text-secondary hover:text-primary-500 transition-colors font-medium"
            active-class="text-primary-500 font-semibold"
          >
            Produção
          </NuxtLink>
          <NuxtLink
            to="/estatisticas"
            class="text-text-secondary hover:text-primary-500 transition-colors font-medium"
            active-class="text-primary-500 font-semibold"
          >
            📊 Estatísticas
          </NuxtLink>
          <NuxtLink
            to="#"
            class="text-text-secondary hover:text-primary-500 transition-colors font-medium"
            active-class="text-primary-500 font-semibold"
          >
            Sobre
          </NuxtLink>
          <NuxtLink
            to="#"
            class="text-text-secondary hover:text-primary-500 transition-colors font-medium"
            active-class="text-primary-500 font-semibold"
          >
            Contato
          </NuxtLink>

          <!-- Separador -->
          <div class="h-6 w-px bg-border-medium"></div>

          <!-- Botões de autenticação -->
          <div v-if="!user" class="flex items-center space-x-3">
            <NuxtLink
              to="/login"
              class="bg-primary-600 hover:bg-primary-700 text-text-inverse px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-soft"
            >
              Entrar
            </NuxtLink>
          </div>

          <!-- Menu do usuário logado -->
          <div v-else class="flex items-center space-x-3">
            <span class="text-text-secondary text-sm">
              Olá, {{ user.email }}
            </span>
            <button
              @click="handleSignOut"
              class="bg-red-600 hover:bg-red-700 text-text-inverse px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-soft"
            >
              Sair
            </button>
          </div>
        </div>

        <!-- Mobile menu button -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-background-tertiary transition-colors"
        >
          <Bars3Icon v-if="!isMobileMenuOpen" class="h-6 w-6" />
          <XMarkIcon v-else class="h-6 w-6" />
        </button>
      </div>

      <!-- Mobile menu -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div
          v-if="isMobileMenuOpen"
          class="md:hidden pb-4 bg-background-tertiary rounded-b-lg"
        >
          <div class="space-y-1 px-2">
            <NuxtLink
              to="/"
              class="block px-3 py-2 text-text-secondary hover:text-primary-500 hover:bg-primary-50 rounded-md transition-colors"
              active-class="text-primary-500 bg-primary-50 font-semibold"
              @click="closeMobileMenu"
            >
              Início
            </NuxtLink>
            <NuxtLink
              to="/producao"
              class="block px-3 py-2 text-text-secondary hover:text-primary-500 hover:bg-primary-50 rounded-md transition-colors"
              active-class="text-primary-500 bg-primary-50 font-semibold"
              @click="closeMobileMenu"
            >
              Produção
            </NuxtLink>
            <NuxtLink
              to="/estatisticas"
              class="block px-3 py-2 text-text-secondary hover:text-primary-500 hover:bg-primary-50 rounded-md transition-colors"
              active-class="text-primary-500 bg-primary-50 font-semibold"
              @click="closeMobileMenu"
            >
              📊 Estatísticas
            </NuxtLink>
            <NuxtLink
              to="#"
              class="block px-3 py-2 text-text-secondary hover:text-primary-500 hover:bg-primary-50 rounded-md transition-colors"
              active-class="text-primary-500 bg-primary-50 font-semibold"
              @click="closeMobileMenu"
            >
              Sobre
            </NuxtLink>
            <NuxtLink
              to="#"
              class="block px-3 py-2 text-text-secondary hover:text-primary-500 hover:bg-primary-50 rounded-md transition-colors"
              active-class="text-primary-500 bg-primary-50 font-semibold"
              @click="closeMobileMenu"
            >
              Contato
            </NuxtLink>

            <!-- Separador -->
            <hr class="border-border-light my-2" />

            <!-- Botões de autenticação mobile -->
            <div v-if="!user">
              <NuxtLink
                to="/login"
                class="block px-3 py-2 bg-primary-600 hover:bg-primary-700 text-text-inverse rounded-md font-medium text-center transition-colors"
                @click="closeMobileMenu"
              >
                Entrar
              </NuxtLink>
            </div>

            <!-- Menu do usuário logado mobile -->
            <div v-else class="space-y-2">
              <div class="px-3 py-2 text-text-secondary text-sm text-center">
                Olá, {{ user.email }}
              </div>
              <button
                @click="handleSignOut"
                class="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-text-inverse rounded-md font-medium text-center transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </nav>
  </header>
</template>

<script setup>
import { ref, watch } from "vue";
import { Bars3Icon, XMarkIcon } from "@heroicons/vue/24/outline";

// Estado do menu mobile
const isMobileMenuOpen = ref(false);

// Obter a rota atual
const route = useRoute();

// Sistema de autenticação
const { user, signOut } = useAuth();

// Handler para logout
const handleSignOut = async () => {
  await signOut();
};

// Funções para controlar o menu mobile
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

// Fechar menu mobile quando mudar de rota
watch(
  () => route.path,
  () => {
    closeMobileMenu();
  }
);

// Fechar menu mobile ao pressionar ESC
const handleKeydown = (event) => {
  if (event.key === "Escape" && isMobileMenuOpen.value) {
    closeMobileMenu();
  }
};

// Adicionar listener para ESC
onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

// Remover listener ao desmontar
onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<style scoped>
/* Estilos específicos do header */
</style>
