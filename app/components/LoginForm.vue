<template>
  <div class="w-full max-w-md mx-auto">
    <!-- Container do formulário -->
    <div class="bg-background-primary rounded-xl shadow-medium border border-border-light p-8">
      <!-- Header do formulário -->
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-text-primary mb-2">
          Bem-vindo
        </h2>
        <p class="text-text-secondary">
          Entre na sua conta ou crie uma nova
        </p>
      </div>

      <!-- Tabs de navegação -->
      <div class="flex bg-background-secondary rounded-lg p-1 mb-6">
        <button
          :class="[
            'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200',
            activeTab === 'login' 
              ? 'bg-primary-500 text-text-inverse shadow-sm' 
              : 'text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
          ]"
          @click="setActiveTab('login')"
        >
          Entrar
        </button>
        <button
          :class="[
            'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200',
            activeTab === 'register' 
              ? 'bg-primary-500 text-text-inverse shadow-sm' 
              : 'text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
          ]"
          @click="setActiveTab('register')"
        >
          Criar Conta
        </button>
      </div>

      <!-- Conteúdo das abas -->
      <div class="min-h-[320px]">
        <!-- Aba Login -->
        <Transition
          name="tab"
          mode="out-in"
        >
          <div v-if="activeTab === 'login'" key="login" class="space-y-6">
            <form @submit.prevent="handleLogin" class="space-y-4">
              <!-- Email -->
              <BaseInput
                v-model="loginForm.email"
                type="email"
                label="E-mail"
                placeholder="seu@email.com"
                required
                :icon-left="EnvelopeIcon"
              />

              <!-- Senha -->
              <BaseInput
                v-model="loginForm.password"
                type="password"
                label="Senha"
                placeholder="Sua senha"
                required
                :icon-left="LockClosedIcon"
              />

              <!-- Botão de login -->
              <BaseButton
                type="submit"
                variant="primary"
                size="lg"
                full-width
                class="mt-6"
              >
                Entrar
              </BaseButton>
            </form>

            <!-- Link auxiliar -->
            <div class="text-center mt-4">
              <button 
                type="button"
                class="text-sm text-primary-600 hover:text-primary-700 transition-colors"
              >
                Esqueceu sua senha?
              </button>
            </div>
          </div>

          <!-- Aba Criar Conta -->
          <div v-else key="register" class="space-y-6">
            <form @submit.prevent="handleRegister" class="space-y-4">
              <!-- Email -->
              <BaseInput
                v-model="registerForm.email"
                type="email"
                label="E-mail"
                placeholder="seu@email.com"
                required
                :icon-left="EnvelopeIcon"
              />

              <!-- Senha -->
              <BaseInput
                v-model="registerForm.password"
                type="password"
                label="Senha"
                placeholder="Crie uma senha"
                required
                :icon-left="LockClosedIcon"
              />

              <!-- Confirmar Senha -->
              <BaseInput
                v-model="registerForm.confirmPassword"
                type="password"
                label="Confirmar Senha"
                placeholder="Confirme sua senha"
                required
                :icon-left="LockClosedIcon"
                :error-message="passwordMismatchError"
              />

              <!-- Botão de criar conta -->
              <BaseButton
                type="submit"
                variant="primary"
                size="lg"
                full-width
                class="mt-6"
              >
                Criar Conta
              </BaseButton>
            </form>

            <!-- Informação adicional -->
            <div class="text-center mt-4">
              <p class="text-xs text-text-tertiary">
                Ao criar uma conta, você concorda com nossos 
                <button class="text-primary-600 hover:text-primary-700 underline">
                  Termos de Uso
                </button>
              </p>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/vue/24/outline'
import BaseInput from '~/components/BaseInput.vue'
import BaseButton from '~/components/BaseButton.vue'

// Estado das abas
const activeTab = ref('login')

// Formulário de login
const loginForm = ref({
  email: '',
  password: ''
})

// Formulário de registro
const registerForm = ref({
  email: '',
  password: '',
  confirmPassword: ''
})

// Validação de confirmação de senha
const passwordMismatchError = computed(() => {
  if (registerForm.value.confirmPassword && 
      registerForm.value.password !== registerForm.value.confirmPassword) {
    return 'As senhas não coincidem'
  }
  return ''
})

// Função para mudar de aba
const setActiveTab = (tab) => {
  activeTab.value = tab
  // Limpar formulários ao trocar de aba
  loginForm.value = { email: '', password: '' }
  registerForm.value = { email: '', password: '', confirmPassword: '' }
}

// Handlers dos formulários (apenas preventDefault por enquanto)
const handleLogin = (event) => {
  // TODO: Implementar lógica de login
  console.log('Login form submitted:', loginForm.value)
}

const handleRegister = (event) => {
  // Verificar se as senhas coincidem antes de prosseguir
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    return
  }
  
  // TODO: Implementar lógica de registro
  console.log('Register form submitted:', registerForm.value)
}
</script>

<style scoped>
/* Animações das abas */
.tab-enter-active,
.tab-leave-active {
  transition: all 0.3s ease;
}

.tab-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.tab-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>