<template>
  <div v-if="user" class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-text-primary mb-2">
        Registro de Produção
      </h1>
      <p class="text-text-secondary">
        Visualização dos dados de produção registrados
      </p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mb-4"></div>
      <p class="text-text-secondary">Carregando dados...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-500 mb-4">
        <svg class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="text-text-secondary">{{ error }}</p>
      <button @click="carregarDados" class="mt-4 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600">
        Tentar Novamente
      </button>
    </div>

    <!-- Empty state -->
    <div v-else-if="!dados.length" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-text-primary mb-2">Nenhum registro encontrado</h3>
      <p class="text-text-secondary mb-6">Não há dados de produção cadastrados ainda.</p>
      <NuxtLink 
        to="/producao" 
        class="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
      >
        <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Registrar Produção
      </NuxtLink>
    </div>

    <!-- Grid de dados -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div 
        v-for="item in dados" 
        :key="item.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        <!-- Imagem -->
        <div class="aspect-square bg-gray-100 relative">
          <img 
            v-if="item.FotoFosso"
            :src="item.FotoFosso" 
            :alt="`Produção ${formatarData(item.DataFoto)}`"
            class="w-full h-full object-cover cursor-pointer"
            @click="abrirModal(item)"
            @error="onImageError"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
            <svg class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <!-- Dados -->
        <div class="p-4">
          <div class="mb-3">
            <h3 class="text-sm font-medium text-gray-500 mb-1">Data</h3>
            <p class="text-lg font-semibold text-text-primary">{{ formatarData(item.DataFoto) }}</p>
          </div>
          
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span class="text-gray-500">RSS:</span>
              <span class="ml-1 font-medium">{{ item.RSS }} kg</span>
            </div>
            <div>
              <span class="text-gray-500">GB:</span>
              <span class="ml-1 font-medium">{{ item.GB }} kg</span>
            </div>
            <div>
              <span class="text-gray-500">RI:</span>
              <span class="ml-1 font-medium">{{ item.RI }} kg</span>
            </div>
            <div>
              <span class="text-gray-500">Total:</span>
              <span class="ml-1 font-bold text-primary-600">{{ item.Total }} kg</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para visualizar imagem ampliada -->
    <div 
      v-if="modalAberto && itemSelecionado" 
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      @click="fecharModal"
    >
      <div class="bg-white rounded-lg max-w-4xl max-h-full overflow-auto" @click.stop>
        <div class="p-4 border-b">
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-bold">Produção - {{ formatarData(itemSelecionado.DataFoto) }}</h3>
            <button 
              @click="fecharModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <div class="grid md:grid-cols-2 gap-6">
            <!-- Imagem -->
            <div v-if="itemSelecionado.FotoFosso">
              <img 
                :src="itemSelecionado.FotoFosso" 
                :alt="`Produção ${formatarData(itemSelecionado.DataFoto)}`"
                class="w-full rounded-lg"
              />
            </div>
            
            <!-- Dados detalhados -->
            <div>
              <h4 class="text-lg font-semibold mb-4">Dados da Produção</h4>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Data:</span>
                  <span class="font-medium">{{ formatarData(itemSelecionado.DataFoto) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">RSS (Resíduo de Serviço de Saúde):</span>
                  <span class="font-medium">{{ itemSelecionado.RSS }} kg</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">GB (Grupo B):</span>
                  <span class="font-medium">{{ itemSelecionado.GB }} kg</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">RI (Resíduo Infectante):</span>
                  <span class="font-medium">{{ itemSelecionado.RI }} kg</span>
                </div>
                <div class="flex justify-between border-t pt-3">
                  <span class="text-gray-600 font-semibold">Total:</span>
                  <span class="font-bold text-lg text-primary-600">{{ itemSelecionado.Total }} kg</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Criado em:</span>
                  <span class="font-medium">{{ formatarDataHora(itemSelecionado.created_at) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Loading enquanto verifica autenticação -->
  <div v-else-if="!initialized" class="container mx-auto px-4 py-16">
    <div class="text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mb-4"></div>
      <p class="text-text-secondary">Verificando autenticação...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue'

// Verificação de autenticação
const { user, signOut, initialized } = useAuth()

// Supabase
const { $supabase: supabase } = useNuxtApp()

// Estados reativos
const dados = ref([])
const loading = ref(false)
const error = ref('')
const modalAberto = ref(false)
const itemSelecionado = ref(null)

// Função para carregar dados do banco
async function carregarDados() {
  if (!supabase) {
    error.value = 'Supabase não disponível'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const { data, error: supabaseError } = await supabase
      .from('producao')
      .select('*')
      .order('created_at', { ascending: false })

    if (supabaseError) {
      console.error('Erro ao carregar dados:', supabaseError)
      error.value = 'Erro ao carregar os dados. Tente novamente.'
      return
    }

    dados.value = data || []
    console.log('Dados carregados:', dados.value)
  } catch (err) {
    console.error('Erro:', err)
    error.value = 'Erro inesperado ao carregar os dados.'
  } finally {
    loading.value = false
  }
}

// Função para formatar data
function formatarData(dataString) {
  if (!dataString) return 'Data não disponível'
  
  try {
    const data = new Date(dataString)
    return data.toLocaleDateString('pt-BR')
  } catch (err) {
    return 'Data inválida'
  }
}

// Função para formatar data e hora
function formatarDataHora(dataString) {
  if (!dataString) return 'Data não disponível'
  
  try {
    const data = new Date(dataString)
    return data.toLocaleString('pt-BR')
  } catch (err) {
    return 'Data inválida'
  }
}

// Função para abrir modal
function abrirModal(item) {
  itemSelecionado.value = item
  modalAberto.value = true
}

// Função para fechar modal
function fecharModal() {
  modalAberto.value = false
  itemSelecionado.value = null
}

// Função para tratar erros de imagem
function onImageError(event) {
  console.error('Erro ao carregar imagem:', event.target.src)
  // Opcional: substituir por imagem de placeholder
  // event.target.src = '/placeholder-image.png'
}

// Função de logout
const handleLogout = async () => {
  await signOut()
}

// Verificação adicional de segurança
watchEffect(() => {
  if (initialized.value && !user.value) {
    navigateTo('/login')
  }
})

// Carregar dados quando a página for montada e o usuário estiver autenticado
watchEffect(() => {
  if (initialized.value && user.value) {
    carregarDados()
  }
})

// Definir o layout e middleware de autenticação obrigatória
definePageMeta({
  layout: 'default',
  middleware: 'auth-required'
})

// Meta tags para SEO
useHead({
  title: 'Registro de Produção - Sistema de Produção',
  meta: [
    { name: 'description', content: 'Visualização dos dados de produção registrados' }
  ]
})
</script>

<style scoped>
/* Estilos específicos da página inicial */
</style>