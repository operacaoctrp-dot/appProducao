<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-lg mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-text-primary mb-2">
          Controle de Produção
        </h1>
        <p class="text-text-secondary">Registre os dados de produção diária</p>
      </div>

      <!-- Formulário de Produção -->
      <div
        class="bg-gray-300 rounded-lg shadow-soft p-6 border border-gray-400"
      >
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- RSS Input -->
          <div>
            <BaseInput
              v-model="formData.rss"
              label="RSS (kg)"
              type="number"
              placeholder="Digite o valor de RSS em kg"
              required
              step="0.1"
              min="0"
            />
            <!-- Mensagem de erro para RSS -->
            <div v-if="showValidationErrors && validationErrors.rss" class="mt-1">
              <p class="text-sm text-red-500">RSS (Resíduo de Serviço de Saúde) é obrigatório</p>
            </div>
          </div>

          <!-- GB Input -->
          <BaseInput
            v-model="formData.gb"
            label="GB (kg)"
            type="number"
            placeholder="Digite o valor de GB em kg (opcional)"
            step="0.1"
            min="0"
          />

          <!-- RI Input -->
          <BaseInput
            v-model="formData.ri"
            label="RI (kg)"
            type="number"
            placeholder="Digite o valor de RI em kg (opcional)"
            step="0.1"
            min="0"
          />

          <!-- Total Input (calculado automaticamente) -->
          <BaseInput
            v-model="totalCalculado"
            label="Total (kg)"
            type="number"
            placeholder="Total calculado automaticamente"
            readonly
            :value="totalCalculado"
          />

          <!-- Data Input -->
          <BaseInput
            v-model="formData.data"
            label="Data"
            type="date"
            required
            :error-message="showValidationErrors && validationErrors.data ? 'Data da produção é obrigatória' : ''"
          />

          <!-- Seleção de Imagem -->
          <div class="space-y-3">
            <label class="block text-sm font-medium text-text-primary">
              Foto da Produção *
            </label>

            <!-- Botões de Captura/Seleção -->
            <div class="flex gap-3">
              <BaseButton
                type="button"
                variant="outline"
                size="md"
                @click="triggerFileInput"
                class="flex-1"
              >
                📁 Escolher da Galeria
              </BaseButton>

              <BaseButton
                type="button"
                variant="outline"
                size="md"
                @click="triggerCamera"
                class="flex-1"
              >
                📷 Tirar Foto
              </BaseButton>
            </div>

            <!-- Input de arquivo oculto -->
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              capture="environment"
              class="hidden"
              @change="handleFileSelect"
            />

            <!-- Área de Visualização da Imagem -->
            <div v-if="selectedImage" class="mt-4">
              <div
                class="relative bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-4"
              >
                <img
                  :src="selectedImage.preview"
                  :alt="selectedImage.name"
                  class="max-w-full h-64 object-cover rounded-lg mx-auto"
                />
                <div class="mt-2 text-center">
                  <p class="text-sm text-text-secondary">
                    {{ selectedImage.name }}
                  </p>
                  <p class="text-xs text-text-tertiary">
                    {{ formatFileSize(selectedImage.size) }}
                  </p>
                </div>
                <!-- Botão para remover imagem -->
                <button
                  type="button"
                  @click="removeImage"
                  class="absolute top-2 right-2 bg-error-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-error-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <!-- Área de Drop (quando não há imagem) -->
            <div
              v-else
              :class="[
                'border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer',
                validationErrors.image 
                  ? 'border-red-300 bg-red-50 hover:border-red-400' 
                  : 'border-gray-300 hover:border-primary-400'
              ]"
              @click="triggerFileInput"
              @dragover.prevent
              @dragenter.prevent
              @drop.prevent="handleDrop"
            >
              <div class="text-gray-400 text-4xl mb-2">📸</div>
              <p class="text-sm text-text-secondary">
                Clique aqui ou arraste uma imagem
              </p>
              <p class="text-xs text-text-tertiary mt-1">PNG, JPG até 5MB</p>
            </div>
            
            <!-- Mensagem de erro para imagem -->
            <div v-if="showValidationErrors && validationErrors.image" class="mt-2">
              <p class="text-sm text-red-500">Foto da produção é obrigatória</p>
            </div>
          </div>

          <!-- Botão Enviar -->
          <div class="pt-4">
            <BaseButton
              type="button"
              variant="primary"
              size="lg"
              :loading="isLoading"
              class="w-full"
              @click="handleSubmit"
            >
              Enviar Produção
            </BaseButton>
          </div>
        </form>
      </div>


    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

// Toast notifications
const { success, error } = useToastNotification();

// Supabase
const supabase = useSupabase();

// Definir o layout e middleware de autenticação obrigatória
definePageMeta({
  layout: "default",
  middleware: "auth-required"
});

// Meta tags para SEO
useHead({
  title: "Produção - AppProdução",
  meta: [
    {
      name: "description",
      content: "Controle de produção - Registre os dados de produção diária",
    },
  ],
});

// Estado do formulário
const formData = ref({
  rss: "",
  gb: "",
  ri: "",
  data: new Date().toISOString().split("T")[0], // Data atual
});

const isLoading = ref(false);

// Estados de validação
const validationErrors = ref({
  rss: false,
  gb: false,
  ri: false,
  data: false,
  image: false
});

const showValidationErrors = ref(false);

// Estado da imagem
const selectedImage = ref(null);
const fileInput = ref(null);



// Calcula o total automaticamente
const totalCalculado = computed(() => {
  const rss = parseFloat(formData.value.rss) || 0;
  const gb = parseFloat(formData.value.gb) || 0;
  const ri = parseFloat(formData.value.ri) || 0;

  const total = rss + gb + ri;
  return total > 0 ? total.toFixed(2) : "";
});

// Função para fazer upload da imagem
async function uploadImage(file, fileName) {
  if (!supabase) {
    throw new Error('Supabase não disponível')
  }

  // Debug: verificar se o usuário está autenticado
  const { data: { user } } = await supabase.auth.getUser()
  console.log('Usuário atual para upload:', user)
  
  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  // Upload da imagem para o bucket Fotos
  const { data, error } = await supabase.storage
    .from('Fotos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Erro no upload:', error)
    console.error('Detalhes do erro:', JSON.stringify(error, null, 2))
    throw error
  }

  // Obter a URL da imagem
  // Primeiro tenta URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('Fotos')
    .getPublicUrl(fileName)

  console.log('URL pública gerada:', publicUrl)

  // Se preferir URL assinada (mais segura), descomente as linhas abaixo:
  /*
  const { data: signedUrl, error: signedError } = await supabase.storage
    .from('Fotos')
    .createSignedUrl(fileName, 60 * 60 * 24 * 365) // válida por 1 ano

  if (signedError) {
    console.error('Erro ao criar URL assinada:', signedError)
    return publicUrl // fallback para URL pública
  }

  console.log('URL assinada gerada:', signedUrl)
  return signedUrl
  */

  return publicUrl
}

// Função para salvar os dados na tabela producao
async function salvarProducao(dadosProducao) {
  if (!supabase) {
    throw new Error('Supabase não disponível')
  }

  // Debug: verificar se o usuário está autenticado
  const { data: { user } } = await supabase.auth.getUser()
  console.log('Usuário atual para salvar dados:', user)
  console.log('Dados a serem salvos:', dadosProducao)
  
  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  const { data, error } = await supabase
    .from('producao')
    .insert([dadosProducao])
    .select()

  if (error) {
    console.error('Erro ao salvar na tabela:', error)
    console.error('Detalhes do erro:', JSON.stringify(error, null, 2))
    throw error
  }

  return data
}

// Função para enviar os dados
async function handleSubmit() {
  // Ativar exibição de erros
  showValidationErrors.value = true
  
  // Limpar erros anteriores
  validationErrors.value = {
    rss: false,
    gb: false,
    ri: false,
    data: false,
    image: false
  }

  // Atribuir 0 aos campos opcionais se estiverem vazios
  if (!formData.value.gb || formData.value.gb === '') {
    formData.value.gb = 0
  }
  
  if (!formData.value.ri || formData.value.ri === '') {
    formData.value.ri = 0
  }

  // Validação de campos obrigatórios
  let hasErrors = false
  
  if (!formData.value.rss || formData.value.rss === '' || formData.value.rss <= 0) {
    validationErrors.value.rss = true
    hasErrors = true
  }
  
  if (!formData.value.data) {
    validationErrors.value.data = true
    hasErrors = true
  }
  
  if (!selectedImage.value) {
    validationErrors.value.image = true
    hasErrors = true
  }

  if (hasErrors) {
    error("Por favor, preencha todos os campos obrigatórios e selecione uma foto.")
    return
  }

  isLoading.value = true;

  try {
    let fotoUrl = null

    // Upload da imagem se existir
    if (selectedImage.value) {
      const dataFormatada = formData.value.data.replace(/-/g, '')
      const timestamp = new Date().getTime()
      const extensao = selectedImage.value.file.name.split('.').pop()
      const nomeArquivo = `foto_${dataFormatada}_${timestamp}.${extensao}`
      
      fotoUrl = await uploadImage(selectedImage.value.file, nomeArquivo)
    }

    // Preparar dados para salvar
    const dadosProducao = {
      "RSS": parseFloat(formData.value.rss),
      "GB": parseFloat(formData.value.gb),
      "RI": parseFloat(formData.value.ri),
      "Total": parseFloat(totalCalculado.value),
      "DataFoto": new Date(formData.value.data).toISOString(),
      "FotoFosso": fotoUrl
    }

    console.log("Salvando dados:", dadosProducao)

    // Salvar no Supabase
    const resultado = await salvarProducao(dadosProducao)

    console.log("Dados salvos com sucesso:", resultado)

    // Mostrar toast de sucesso
    success("Dados de produção salvos com sucesso!")

    // Limpar formulário
    resetForm()

    // Redirecionar para index após 2 segundos
    setTimeout(() => {
      navigateTo('/')
    }, 2000)

  } catch (erro) {
    console.error("Erro ao salvar dados:", erro)
    
    // Mostrar mensagem de erro específica
    let mensagemErro = "Erro ao salvar os dados de produção. Tente novamente."
    
    if (erro.message?.includes('upload')) {
      mensagemErro = "Erro ao fazer upload da imagem. Verifique o arquivo e tente novamente."
    } else if (erro.message?.includes('Supabase não disponível')) {
      mensagemErro = "Conexão com o banco de dados indisponível. Tente novamente."
    }
    
    error(mensagemErro)
  } finally {
    isLoading.value = false;
  }
}

// Função para resetar o formulário
function resetForm() {
  formData.value = {
    rss: "",
    gb: "",
    ri: "",
    data: new Date().toISOString().split("T")[0],
  }
  selectedImage.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  
  // Limpar erros de validação
  validationErrors.value = {
    rss: false,
    gb: false,
    ri: false,
    data: false,
    image: false
  }
  
  // Ocultar mensagens de erro
  showValidationErrors.value = false
}

// Funções para manipulação de imagens
function triggerFileInput() {
  if (fileInput.value) {
    fileInput.value.click();
  }
}

function triggerCamera() {
  if (fileInput.value) {
    fileInput.value.setAttribute("capture", "environment");
    fileInput.value.click();
  }
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    processFile(file);
  }
}

function handleDrop(event) {
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) {
    processFile(file);
  }
}

function processFile(file) {
  // Validar tipo e tamanho
  if (!file.type.startsWith("image/")) {
    alert("Por favor, selecione apenas arquivos de imagem.");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    // 5MB
    alert("O arquivo deve ter no máximo 5MB.");
    return;
  }

  // Criar preview
  const reader = new FileReader();
  reader.onload = (e) => {
    selectedImage.value = {
      file: file,
      name: file.name,
      size: file.size,
      preview: e.target.result,
    };
  };
  reader.readAsDataURL(file);
}

function removeImage() {
  selectedImage.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
</script>

<style scoped>
/* Estilos específicos da página de produção */
</style>
