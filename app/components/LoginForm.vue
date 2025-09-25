<template>
  <div class="w-full max-w-md mx-auto">
    <!-- Container do formulário -->
    <div class="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200 p-8">
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
              <!-- Erro de login -->
              <div v-if="errors.login" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {{ errors.login }}
              </div>

              <!-- Email -->
              <BaseInput
                v-model="loginForm.email"
                type="email"
                label="E-mail"
                placeholder="seu@email.com"
                required
                :icon-left="EnvelopeIcon"
                :error-message="loginForm.email && !isValidEmail(loginForm.email) ? 'Email inválido' : ''"
              />

              <!-- Senha -->
              <BaseInput
                v-model="loginForm.password"
                type="password"
                label="Senha"
                placeholder="Sua senha (mínimo 6 caracteres)"
                required
                :icon-left="LockClosedIcon"
                :error-message="loginForm.password && !isValidPassword(loginForm.password) ? 'Senha deve ter pelo menos 6 caracteres' : ''"
              />

              <!-- Botão de login -->
              <BaseButton
                type="submit"
                variant="primary"
                size="lg"
                full-width
                class="mt-6"
                :loading="loading"
                :disabled="loading"
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
              <!-- Erro de registro -->
              <div v-if="errors.register" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {{ errors.register }}
              </div>

              <!-- Email -->
              <BaseInput
                v-model="registerForm.email"
                type="email"
                label="E-mail"
                placeholder="seu@email.com"
                required
                :icon-left="EnvelopeIcon"
                :error-message="registerForm.email && !isValidEmail(registerForm.email) ? 'Email inválido' : ''"
              />

              <!-- Senha -->
              <BaseInput
                v-model="registerForm.password"
                type="password"
                label="Senha"
                placeholder="Crie uma senha (mínimo 6 caracteres)"
                required
                :icon-left="LockClosedIcon"
                :error-message="registerForm.password && !isValidPassword(registerForm.password) ? 'Senha deve ter pelo menos 6 caracteres' : ''"
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
                :loading="loading"
                :disabled="loading"
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

// Composables
const { signIn, signUp, loading } = useAuth()
const { success, error } = useToastNotification()

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

// Estado de erros
const errors = ref({
  login: '',
  register: ''
})

// Função para validar email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Função para validar senha
const isValidPassword = (password) => {
  return password.length >= 6
}

// Validação de confirmação de senha
const passwordMismatchError = computed(() => {
  if (registerForm.value.confirmPassword && 
      registerForm.value.password !== registerForm.value.confirmPassword) {
    return 'As senhas não coincidem'
  }
  return ''
})

// Validação do formulário de login
const validateLoginForm = () => {
  errors.value.login = ''
  
  if (!loginForm.value.email.trim()) {
    errors.value.login = 'Email é obrigatório'
    return false
  }
  
  if (!isValidEmail(loginForm.value.email)) {
    errors.value.login = 'Email inválido'
    return false
  }
  
  if (!loginForm.value.password.trim()) {
    errors.value.login = 'Senha é obrigatória'
    return false
  }
  
  if (!isValidPassword(loginForm.value.password)) {
    errors.value.login = 'Senha deve ter pelo menos 6 caracteres'
    return false
  }
  
  return true
}

// Validação do formulário de registro
const validateRegisterForm = () => {
  errors.value.register = ''
  
  if (!registerForm.value.email.trim()) {
    errors.value.register = 'Email é obrigatório'
    return false
  }
  
  if (!isValidEmail(registerForm.value.email)) {
    errors.value.register = 'Email inválido'
    return false
  }
  
  if (!registerForm.value.password.trim()) {
    errors.value.register = 'Senha é obrigatória'
    return false
  }
  
  if (!isValidPassword(registerForm.value.password)) {
    errors.value.register = 'Senha deve ter pelo menos 6 caracteres'
    return false
  }
  
  if (!registerForm.value.confirmPassword.trim()) {
    errors.value.register = 'Confirmação de senha é obrigatória'
    return false
  }
  
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    errors.value.register = 'As senhas não coincidem'
    return false
  }
  
  return true
}

// Função para mudar de aba
const setActiveTab = (tab) => {
  activeTab.value = tab
  // Limpar formulários ao trocar de aba
  loginForm.value = { email: '', password: '' }
  registerForm.value = { email: '', password: '', confirmPassword: '' }
  errors.value = { login: '', register: '' }
}

// Handler do login
const handleLogin = async (event) => {
  // Validar formulário antes de enviar
  if (!validateLoginForm()) {
    return
  }
  
  try {
    const { user, error } = await signIn(loginForm.value.email, loginForm.value.password)
    
    if (error) {
      // Tratar diferentes tipos de erro
      if (error.message?.includes('Invalid login credentials')) {
        errors.value.login = 'Email ou senha incorretos'
      } else if (error.message?.includes('Email not confirmed')) {
        errors.value.login = 'Verifique seu email para confirmar a conta'
      } else if (error.message?.includes('Too many requests')) {
        errors.value.login = 'Muitas tentativas. Tente novamente em alguns minutos'
      } else {
        errors.value.login = error.message || 'Erro ao fazer login'
      }
      return
    }
    
    if (user) {
      success('Login realizado com sucesso!')
      await navigateTo('/')
    }
  } catch (err) {
    errors.value.login = 'Erro interno. Tente novamente.'
    console.error('Erro no login:', err)
  }
}

// Handler do registro
const handleRegister = async (event) => {
  // Validar formulário antes de enviar
  if (!validateRegisterForm()) {
    return
  }
  
  try {
    const { user, error } = await signUp(registerForm.value.email, registerForm.value.password)
    
    if (error) {
      // Tratar diferentes tipos de erro de registro
      if (error.message?.includes('User already registered')) {
        errors.value.register = 'Este email já está cadastrado'
      } else if (error.message?.includes('Password should be at least')) {
        errors.value.register = 'Senha deve ter pelo menos 6 caracteres'
      } else if (error.message?.includes('Invalid email')) {
        errors.value.register = 'Email inválido'
      } else {
        errors.value.register = error.message || 'Erro ao criar conta'
      }
      return
    }
    
    // Sucesso - mostrar notificação
    success('Conta criada com sucesso! Verifique seu email para confirmar.')
    
    // Limpar formulário após sucesso
    registerForm.value = { email: '', password: '', confirmPassword: '' }
  } catch (err) {
    errors.value.register = 'Erro interno. Tente novamente.'
    console.error('Erro no registro:', err)
  }
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