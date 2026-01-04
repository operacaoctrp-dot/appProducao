<template>
  <div v-if="user" class="min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-text-primary mb-2">
          Registro de Produção
        </h1>
        <p class="text-text-secondary">
          Visualização dos dados de produção registrados
        </p>
      </div>

      <!-- Resumo do Mês Atual -->
      <div
        class="mb-8 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-6 border border-primary-200"
      >
        <h3 class="text-lg font-semibold text-primary-800 mb-4">
          📊 Resumo de {{ mesesDisponiveis[mesAtualIndex]?.label }}
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg p-4 shadow-sm">
            <p class="text-sm text-gray-500">Total RSS</p>
            <p class="text-xl font-bold text-primary-600">
              {{ resumoMesAtual.totalRSS.toFixed(2) }} kg
            </p>
          </div>
          <div class="bg-white rounded-lg p-4 shadow-sm">
            <p class="text-sm text-gray-500">Total GB</p>
            <p class="text-xl font-bold text-primary-600">
              {{ resumoMesAtual.totalGB.toFixed(2) }} kg
            </p>
          </div>
          <div class="bg-white rounded-lg p-4 shadow-sm">
            <p class="text-sm text-gray-500">Total RI</p>
            <p class="text-xl font-bold text-primary-600">
              {{ resumoMesAtual.totalRI.toFixed(2) }} kg
            </p>
          </div>
          <div class="bg-white rounded-lg p-4 shadow-sm">
            <p class="text-sm text-gray-500">Total Geral</p>
            <p class="text-xl font-bold text-primary-600">
              {{ resumoMesAtual.totalGeral.toFixed(2) }} kg
            </p>
          </div>
        </div>
      </div>

      <!-- Médias por Semana -->
      <div v-if="mediasProducao.semanas.length > 0" class="mb-8">
        <h3
          class="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2"
        >
          <span>📅</span> Médias por Semana
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(semana, index) in mediasProducao.semanas"
            :key="index"
            class="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
          >
            <p class="text-sm font-semibold text-gray-800 mb-3">
              Semana {{ semana.numero }} ({{ semana.dataInicio }} -
              {{ semana.dataFim }})
            </p>
            <div class="space-y-2 text-xs">
              <div class="flex justify-between">
                <span class="text-gray-600">RSS:</span>
                <span class="font-bold text-emerald-600"
                  >{{ formatNumber(semana.rss) }} kg</span
                >
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">GB:</span>
                <span class="font-bold text-amber-600"
                  >{{ formatNumber(semana.gb) }} kg</span
                >
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">RI:</span>
                <span class="font-bold text-purple-600"
                  >{{ formatNumber(semana.ri) }} kg</span
                >
              </div>
              <div class="border-t pt-2 flex justify-between">
                <span class="font-medium text-gray-700">Total:</span>
                <span class="font-bold text-blue-600"
                  >{{ formatNumber(semana.total) }} kg</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="text-center py-12">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mb-4"
        ></div>
        <p class="text-text-secondary">Carregando dados...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-500 mb-4">
          <svg
            class="h-16 w-16 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <p class="text-red-600 font-medium">{{ error }}</p>
        <button
          @click="carregarDados"
          class="mt-4 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600"
        >
          Tentar Novamente
        </button>
      </div>

      <!-- Carrossel por Mês/Ano -->
      <div v-else-if="dados.length > 0">
        <!-- Navegação do Carrossel -->
        <div class="flex items-center justify-between mb-6">
          <!-- Botão Anterior -->
          <button
            @click="mesAnterior"
            :disabled="mesAtualIndex === 0"
            class="p-2 rounded-full bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <!-- Indicador de Mês/Ano Atual -->
          <div class="text-center">
            <h2 class="text-2xl font-bold text-text-primary">
              {{ mesesDisponiveis[mesAtualIndex]?.label }}
            </h2>
            <p class="text-sm text-text-secondary">
              {{ mesesDisponiveis[mesAtualIndex]?.count }} registro(s)
            </p>
          </div>

          <!-- Botão Próximo -->
          <button
            @click="mesProximo"
            :disabled="mesAtualIndex === mesesDisponiveis.length - 1"
            class="p-2 rounded-full bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <!-- Indicadores de navegação (dots) -->
        <div class="flex justify-center gap-2 mb-6">
          <button
            v-for="(mes, index) in mesesDisponiveis"
            :key="mes.key"
            @click="irParaMes(index)"
            :class="[
              'w-3 h-3 rounded-full transition-all',
              index === mesAtualIndex
                ? 'bg-primary-500 scale-125'
                : 'bg-gray-300 hover:bg-gray-400',
            ]"
            :title="mes.label"
          />
        </div>

        <!-- Cards do Mês Atual -->
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300"
        >
          <div
            v-for="item in dadosDoMesAtual"
            :key="item.id"
            class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
          >
            <!-- Imagem -->
            <div class="h-48 bg-gray-100 relative">
              <img
                v-if="item.FotoFosso"
                :src="item.FotoFosso"
                :alt="`Produção ${formatarData(item.DataFoto)}`"
                class="w-full h-full object-cover cursor-pointer"
                @click="abrirModal(item)"
                @error="onImageError"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-gray-400"
              >
                <svg
                  class="h-16 w-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            <!-- Dados -->
            <div class="p-4">
              <div class="mb-3">
                <h3 class="text-sm font-medium text-gray-500 mb-1">Data</h3>
                <p class="text-lg font-semibold text-text-primary">
                  {{ formatarData(item.DataFoto) }}
                </p>
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
                  <span class="ml-1 font-bold text-primary-600"
                    >{{ item.Total }} kg</span
                  >
                </div>
              </div>

              <!-- Botão de Exclusão -->
              <div class="mt-4 pt-3 border-t border-gray-100">
                <button
                  @click.stop="confirmarExclusao(item)"
                  :disabled="excluindo"
                  class="w-full bg-red-50 text-red-600 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-100 hover:border-red-300 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <svg
                    v-if="!excluindo"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <div
                    v-else
                    class="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"
                  ></div>
                  <span v-if="!excluindo">Excluir</span>
                  <span v-else>Excluindo...</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumo do Mês -->
        <div
          class="mt-8 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-6 border border-primary-200"
        >
          <h3 class="text-lg font-semibold text-primary-800 mb-4">
            📊 Resumo de {{ mesesDisponiveis[mesAtualIndex]?.label }}
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white rounded-lg p-4 shadow-sm">
              <p class="text-sm text-gray-500">Total RSS</p>
              <p class="text-xl font-bold text-primary-600">
                {{ resumoMesAtual.totalRSS.toFixed(2) }} kg
              </p>
            </div>
            <div class="bg-white rounded-lg p-4 shadow-sm">
              <p class="text-sm text-gray-500">Total GB</p>
              <p class="text-xl font-bold text-primary-600">
                {{ resumoMesAtual.totalGB.toFixed(2) }} kg
              </p>
            </div>
            <div class="bg-white rounded-lg p-4 shadow-sm">
              <p class="text-sm text-gray-500">Total RI</p>
              <p class="text-xl font-bold text-primary-600">
                {{ resumoMesAtual.totalRI.toFixed(2) }} kg
              </p>
            </div>
            <div class="bg-white rounded-lg p-4 shadow-sm">
              <p class="text-sm text-gray-500">Total Geral</p>
              <p class="text-xl font-bold text-green-600">
                {{ resumoMesAtual.totalGeral.toFixed(2) }} kg
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-12">
        <svg
          class="h-16 w-16 mx-auto mb-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p class="text-gray-500">Nenhum registro encontrado</p>
      </div>

      <!-- Modal para visualizar imagem ampliada -->
      <div
        v-if="modalAberto && itemSelecionado"
        class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        @click="fecharModal"
      >
        <div
          class="bg-white rounded-lg max-w-4xl max-h-full overflow-auto"
          @click.stop
        >
          <div class="p-4 border-b">
            <div class="flex justify-between items-center">
              <h3 class="text-xl font-bold">
                Produção - {{ formatarData(itemSelecionado.DataFoto) }}
              </h3>
              <button
                @click="fecharModal"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="p-6">
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Imagem -->
              <div v-if="itemSelecionado.FotoFosso" class="relative group">
                <img
                  :src="itemSelecionado.FotoFosso"
                  :alt="`Produção ${formatarData(itemSelecionado.DataFoto)}`"
                  class="w-full rounded-lg cursor-pointer hover:opacity-90 transition-all duration-200 hover:scale-[1.02]"
                  @dblclick.stop="
                    abrirImagemTamanhoReal(itemSelecionado.FotoFosso)
                  "
                  @click.stop
                  title="Duplo clique para ver em tamanho real"
                />
                <div
                  class="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  🔍 Duplo clique para ampliar
                </div>
                <button
                  @click.stop="
                    abrirImagemTamanhoReal(itemSelecionado.FotoFosso)
                  "
                  class="absolute top-2 right-2 bg-black bg-opacity-75 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-90"
                  title="Ampliar imagem"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </button>
              </div>

              <!-- Dados detalhados -->
              <div>
                <h4 class="text-lg font-semibold mb-4">Dados da Produção</h4>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Data:</span>
                    <span class="font-medium">{{
                      formatarData(itemSelecionado.DataFoto)
                    }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600"
                      >RSS (Resíduo de Serviço de Saúde):</span
                    >
                    <span class="font-medium"
                      >{{ itemSelecionado.RSS }} kg</span
                    >
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">GB (Grupo B):</span>
                    <span class="font-medium">{{ itemSelecionado.GB }} kg</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">RI (Resíduo Industrial):</span>
                    <span class="font-medium">{{ itemSelecionado.RI }} kg</span>
                  </div>
                  <div class="flex justify-between border-t pt-3">
                    <span class="text-gray-600 font-semibold">Total:</span>
                    <span class="font-bold text-lg text-primary-600"
                      >{{ itemSelecionado.Total }} kg</span
                    >
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Criado em:</span>
                    <span class="font-medium">{{
                      formatarDataHora(itemSelecionado.created_at)
                    }}</span>
                  </div>
                </div>

                <!-- Botões de ação -->
                <div class="mt-6 space-y-3">
                  <button
                    @click="compartilharWhatsApp"
                    :disabled="isSalvando"
                    class="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <span v-if="isSalvando">📸 Preparando...</span>
                    <span v-else>📱 Compartilhar no WhatsApp</span>
                  </button>

                  <button
                    @click="baixarImagem"
                    :disabled="isSalvando"
                    class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    📥 Baixar Screenshot
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de Confirmação de Exclusão -->
      <div
        v-if="modalExclusao.aberto"
        class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        @click="cancelarExclusao"
      >
        <div class="bg-white rounded-lg max-w-sm w-full" @click.stop>
          <div class="p-6 text-center">
            <p class="text-gray-800 mb-6">
              Deseja excluir os dados de
              {{ formatarData(modalExclusao.item?.DataFoto) }}?
            </p>

            <div class="flex gap-3">
              <button
                @click="cancelarExclusao"
                :disabled="excluindo"
                class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                @click="confirmarExclusaoFinal"
                :disabled="excluindo"
                class="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                <div
                  v-if="excluindo"
                  class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
                ></div>
                <span v-if="!excluindo">Excluir</span>
                <span v-else>Excluindo...</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading enquanto verifica autenticação -->
  <div v-else-if="!initialized" class="container mx-auto px-4 py-16">
    <div class="text-center">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mb-4"
      ></div>
      <p class="text-text-secondary">Verificando autenticação...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from "vue";

// Verificação de autenticação
const { user, signOut, initialized } = useAuth();

// Supabase
const { $supabase: supabase } = useNuxtApp();

// Notificações
const { success, error: showError } = useNotification();

// Estados reativos
const dados = ref([]);
const loading = ref(false);
const error = ref("");
const modalAberto = ref(false);
const itemSelecionado = ref(null);
const isSalvando = ref(false);
const excluindo = ref(false);
const modalExclusao = ref({
  aberto: false,
  item: null,
});

// Estado do carrossel
const mesAtualIndex = ref(0);

// Nomes dos meses em português
const nomesMeses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

// Computed para agrupar dados por mês/ano
const dadosAgrupadosPorMes = computed(() => {
  const grupos = {};

  dados.value.forEach((item) => {
    if (!item.DataFoto) return;

    const data = new Date(item.DataFoto);
    const mes = data.getMonth();
    const ano = data.getFullYear();
    const chave = `${ano}-${String(mes).padStart(2, "0")}`;

    if (!grupos[chave]) {
      grupos[chave] = {
        key: chave,
        mes: mes,
        ano: ano,
        label: `${nomesMeses[mes]} ${ano}`,
        items: [],
      };
    }

    grupos[chave].items.push(item);
  });

  // Ordenar por data (mais recente primeiro)
  return Object.values(grupos).sort((a, b) => {
    if (a.ano !== b.ano) return b.ano - a.ano;
    return b.mes - a.mes;
  });
});

// Lista de meses disponíveis para navegação
const mesesDisponiveis = computed(() => {
  return dadosAgrupadosPorMes.value.map((grupo) => ({
    key: grupo.key,
    label: grupo.label,
    count: grupo.items.length,
  }));
});

// Dados do mês atual
const dadosDoMesAtual = computed(() => {
  if (dadosAgrupadosPorMes.value.length === 0) return [];
  return dadosAgrupadosPorMes.value[mesAtualIndex.value]?.items || [];
});

// Resumo do mês atual
const resumoMesAtual = computed(() => {
  const items = dadosDoMesAtual.value;
  return {
    totalRSS: items.reduce((acc, item) => acc + (parseFloat(item.RSS) || 0), 0),
    totalGB: items.reduce((acc, item) => acc + (parseFloat(item.GB) || 0), 0),
    totalRI: items.reduce((acc, item) => acc + (parseFloat(item.RI) || 0), 0),
    totalGeral: items.reduce(
      (acc, item) => acc + (parseFloat(item.Total) || 0),
      0
    ),
  };
});

// Calcular as médias de produção por semana
const mediasProducao = computed(() => {
  const items = dadosDoMesAtual.value;

  if (items.length === 0) {
    return {
      semanas: [],
    };
  }

  // Médias por Semana Específica
  const semanaMap = new Map();

  items.forEach((item) => {
    const date = new Date(item.DataFoto);

    // Calcular o primeiro dia da semana (segunda-feira)
    const dia = date.getDate();
    const mes = date.getMonth();
    const ano = date.getFullYear();

    // Descobrir o dia da semana (0 = domingo, 1 = segunda, etc.)
    const diaSemana = date.getDay();

    // Calcular quantos dias voltar para chegar à segunda-feira
    const diasParaVoltarParaSegunda = diaSemana === 0 ? 6 : diaSemana - 1;

    // Data da segunda-feira (início da semana)
    const dataSegunda = new Date(ano, mes, dia - diasParaVoltarParaSegunda);
    const numSemana = Math.ceil(
      (date.getDate() + new Date(ano, mes, 1).getDay() - 1) / 7
    );

    const chaveSegunda = `${dataSegunda.getFullYear()}-${String(
      dataSegunda.getMonth() + 1
    ).padStart(2, "0")}-${String(dataSegunda.getDate()).padStart(2, "0")}`;

    if (!semanaMap.has(chaveSegunda)) {
      semanaMap.set(chaveSegunda, {
        dataSegunda: dataSegunda,
        numeroSemana: numSemana,
        count: 0,
        rss: 0,
        gb: 0,
        ri: 0,
        total: 0,
      });
    }

    const semana = semanaMap.get(chaveSegunda);
    semana.count++;
    semana.rss += Number(item.RSS || 0);
    semana.gb += Number(item.GB || 0);
    semana.ri += Number(item.RI || 0);
    semana.total += Number(item.Total || 0);
  });

  // Converter para array e formatar
  const semanas = Array.from(semanaMap.values())
    .sort((a, b) => a.dataSegunda - b.dataSegunda)
    .map((semana, index) => {
      const dataSegunda = semana.dataSegunda;
      const dataDomingo = new Date(dataSegunda);
      dataDomingo.setDate(dataDomingo.getDate() + 6);

      const formatarData = (date) => {
        return `${String(date.getDate()).padStart(2, "0")}/${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
      };

      return {
        numero: index + 1,
        dataInicio: formatarData(dataSegunda),
        dataFim: formatarData(dataDomingo),
        rss: semana.rss / semana.count,
        gb: semana.gb / semana.count,
        ri: semana.ri / semana.count,
        total: semana.total / semana.count,
      };
    });

  return {
    semanas: semanas,
  };
});

// Função para formatar números
function formatNumber(value) {
  if (!value || isNaN(value)) return "0.00";
  return parseFloat(value).toFixed(2);
}

// Funções de navegação do carrossel
function mesAnterior() {
  if (mesAtualIndex.value > 0) {
    mesAtualIndex.value--;
  }
}

function mesProximo() {
  if (mesAtualIndex.value < mesesDisponiveis.value.length - 1) {
    mesAtualIndex.value++;
  }
}

function irParaMes(index) {
  mesAtualIndex.value = index;
}

// Função para carregar dados do banco
async function carregarDados() {
  if (!supabase) {
    error.value = "Supabase não disponível";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const { data, error: supabaseError } = await supabase
      .from("producao")
      .select("*")
      .order("created_at", { ascending: false });

    if (supabaseError) {
      console.error("Erro ao carregar dados:", supabaseError);
      error.value = "Erro ao carregar os dados. Tente novamente.";
      return;
    }

    dados.value = data || [];
    console.log("Dados carregados:", dados.value);
  } catch (err) {
    console.error("Erro:", err);
    error.value = "Erro inesperado ao carregar os dados.";
  } finally {
    loading.value = false;
  }
}

// Função para formatar data
function formatarData(dataString) {
  if (!dataString) return "Data não disponível";

  try {
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR");
  } catch (err) {
    return "Data inválida";
  }
}

// Função para formatar data e hora
function formatarDataHora(dataString) {
  if (!dataString) return "Data não disponível";

  try {
    const data = new Date(dataString);
    return data.toLocaleString("pt-BR");
  } catch (err) {
    return "Data inválida";
  }
}

// Função para abrir modal
function abrirModal(item) {
  itemSelecionado.value = item;
  modalAberto.value = true;
}

// Função para fechar modal
function fecharModal() {
  modalAberto.value = false;
  itemSelecionado.value = null;
}

// Função para abrir imagem em tamanho real
function abrirImagemTamanhoReal(urlImagem) {
  console.log("🔍 Duplo clique detectado! URL:", urlImagem);
  if (urlImagem) {
    console.log("📱 Abrindo imagem em nova aba...");
    window.open(urlImagem, "_blank");
  } else {
    console.error("❌ URL da imagem não encontrada");
  }
}

// Função para tratar erros de imagem
function onImageError(event) {
  console.error("Erro ao carregar imagem:", event.target.src);
}

// Função para confirmar exclusão (abre o modal)
function confirmarExclusao(item) {
  modalExclusao.value = {
    aberto: true,
    item: item,
  };
}

// Função para cancelar exclusão
function cancelarExclusao() {
  modalExclusao.value = {
    aberto: false,
    item: null,
  };
}

// Função para confirmar exclusão final
async function confirmarExclusaoFinal() {
  const item = modalExclusao.value.item;

  if (!supabase || !item) {
    showError("Dados inválidos para exclusão");
    return;
  }

  excluindo.value = true;

  try {
    console.log("🗑️ Excluindo item:", item.id);

    // Excluir do banco de dados
    const { error: deleteError } = await supabase
      .from("producao")
      .delete()
      .eq("id", item.id);

    if (deleteError) {
      console.error("Erro ao excluir do banco:", deleteError);
      showError("Erro ao excluir os dados. Tente novamente.");
      return;
    }

    // Remover da lista local
    dados.value = dados.value.filter((d) => d.id !== item.id);

    success(
      `✅ Dados de ${formatarData(item.DataFoto)} excluídos com sucesso!`
    );

    // Se o item excluído estava no modal principal, fechar o modal
    if (itemSelecionado.value && itemSelecionado.value.id === item.id) {
      fecharModal();
    }

    // Fechar modal de confirmação
    cancelarExclusao();
  } catch (err) {
    console.error("Erro inesperado ao excluir:", err);
    showError("Erro inesperado ao excluir os dados.");
  } finally {
    excluindo.value = false;
  }
}

// Função para compartilhar no WhatsApp
async function compartilharWhatsApp() {
  console.log("📱 Iniciando compartilhamento...");

  if (!itemSelecionado.value) {
    showError("Nenhum item selecionado");
    return;
  }

  isSalvando.value = true;

  try {
    // Mensagem ultra simples - só identificação
    const agora = new Date();
    const timestamp = agora.getTime(); // Mantém timestamp para anti-cache na URL
    const mensagemFinal = `Gerado pelo App Produção em ${agora.toLocaleString(
      "pt-BR"
    )}`;

    // Tentar compartilhamento nativo primeiro
    if (navigator.share) {
      try {
        console.log("📱 Tentando compartilhamento nativo...");
        await navigator.share({
          title: "App Produção",
          text: mensagemFinal,
        });
        success("📱 Compartilhado com sucesso!");
        isSalvando.value = false;
        return;
      } catch (shareError) {
        console.log("Compartilhamento nativo falhou, usando WhatsApp direto");
      }
    }

    // Usar a nova mensagem com timestamp único
    const encodedText = encodeURIComponent(mensagemFinal);

    // Detectar dispositivo e abrir WhatsApp com nova mensagem
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      console.log("🚀 MOBILE - Abrindo WhatsApp app com mensagem única");
      // URL única com timestamp para evitar cache
      const uniqueAppUrl = `whatsapp://send?text=${encodedText}&cache=${timestamp}`;
      window.location.href = uniqueAppUrl;

      // Fallback para WhatsApp Web
      setTimeout(() => {
        const uniqueWebUrl = `https://api.whatsapp.com/send?text=${encodedText}&cache=${timestamp}`;
        window.open(uniqueWebUrl, "_blank");
      }, 2000);
    } else {
      console.log("🚀 DESKTOP - Abrindo WhatsApp Web com mensagem única");
      const uniqueWebUrl = `https://web.whatsapp.com/send?text=${encodedText}&cache=${timestamp}`;
      window.open(uniqueWebUrl, "_blank");
    }

    success("🚀 WhatsApp aberto! Nova mensagem enviada (SET/2025).");
    isSalvando.value = false;
  } catch (error) {
    console.error("Erro ao compartilhar:", error);
    showError(`Erro ao preparar compartilhamento: ${error.message}`);
    isSalvando.value = false;
  }
}

// Função para baixar screenshot do modal
async function baixarImagem() {
  console.log("📥 Função baixarImagem iniciada");

  if (!itemSelecionado.value) {
    showError("Nenhum item selecionado");
    return;
  }

  try {
    console.log("📥 Importando html2canvas...");
    const html2canvas = await import("html2canvas");
    console.log("📥 html2canvas importado:", html2canvas);

    // Versão mais simples: capturar todo o modal e depois cortar os botões
    const modalElement = document.querySelector(
      ".fixed.inset-0.bg-black.bg-opacity-75 .bg-white"
    );
    console.log("📥 Modal encontrado:", modalElement);

    if (!modalElement) {
      throw new Error("Modal não encontrado");
    }

    console.log("📥 Iniciando captura do screenshot...");
    const canvas = await html2canvas.default(modalElement, {
      backgroundColor: "#ffffff",
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      ignoreElements: (element) => {
        // Ignorar apenas botões diretamente
        return element.tagName === "BUTTON";
      },
    });

    console.log("📥 Screenshot capturado, criando download...");
    const link = document.createElement("a");
    link.download = `dados_producao_${formatarData(
      itemSelecionado.value.DataFoto
    )}.png`;
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    success("📥 Screenshot baixado com sucesso!");
  } catch (error) {
    console.error("Erro ao baixar screenshot:", error);
    showError(`Erro ao baixar o screenshot: ${error.message}`);
  }
}

// Função de logout
const handleLogout = async () => {
  await signOut();
};

// Verificação adicional de segurança
watchEffect(() => {
  if (initialized.value && !user.value) {
    navigateTo("/login");
  }
});

// Carregar dados quando a página for montada e o usuário estiver autenticado
watchEffect(() => {
  if (initialized.value && user.value) {
    carregarDados();
  }
});

// Definir o layout e middleware de autenticação obrigatória
definePageMeta({
  layout: "default",
  middleware: "auth-required",
});

// Meta tags para SEO
useHead({
  title: "Registro de Produção - Sistema de Produção",
  meta: [
    {
      name: "description",
      content: "Visualização dos dados de produção registrados",
    },
  ],
});
</script>

<style scoped>
/* Estilos específicos da página inicial */
</style>
