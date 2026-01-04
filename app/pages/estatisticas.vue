<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <div class="container mx-auto px-4 py-6 max-w-7xl">
      <!-- Header com animação -->
      <div class="text-center mb-8">
        <h1
          class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2"
        >
          📊 Estatísticas de Produção
        </h1>
        <p class="text-gray-500">Análise completa dos dados de produção</p>
      </div>

      <!-- Filtros de Período -->
      <div
        class="bg-white rounded-2xl shadow-lg p-4 mb-6 border border-gray-100"
      >
        <div class="flex flex-wrap items-center gap-3">
          <span class="text-sm font-medium text-gray-600">Período:</span>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="period in periods"
              :key="period.value"
              @click="selectedPeriod = period.value"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                selectedPeriod === period.value
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-200 scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
              ]"
            >
              {{ period.label }}
            </button>
          </div>

          <!-- Data customizada -->
          <div v-if="selectedPeriod === 'custom'" class="flex gap-2 ml-auto">
            <input
              v-model="customStartDate"
              type="date"
              class="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            />
            <span class="text-gray-400 self-center">até</span>
            <input
              v-model="customEndDate"
              type="date"
              class="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            />
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"
          ></div>
          <p class="text-gray-500">Carregando estatísticas...</p>
        </div>
      </div>

      <!-- Conteúdo Principal -->
      <template v-else>
        <!-- Cards de Métricas Principais -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <!-- Total Geral -->
          <div
            class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-200 transform hover:scale-105 transition-all duration-300"
          >
            <div class="flex items-center justify-between mb-3">
              <span class="text-3xl">📦</span>
              <span class="text-xs bg-white/20 px-2 py-1 rounded-full"
                >Total</span
              >
            </div>
            <p class="text-3xl font-bold mb-1">
              {{ formatNumber(stats.totalGeral) }}
            </p>
            <p class="text-blue-100 text-sm">kg processados</p>
            <div class="mt-2 flex items-center text-xs">
              <span
                :class="
                  stats.tendenciaTotal >= 0 ? 'text-green-200' : 'text-red-200'
                "
              >
                {{ stats.tendenciaTotal >= 0 ? "↑" : "↓" }}
                {{ Math.abs(stats.tendenciaTotal).toFixed(1) }}%
              </span>
              <span class="text-blue-200 ml-1">vs período anterior</span>
            </div>
          </div>

          <!-- RSS -->
          <div
            class="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg shadow-emerald-200 transform hover:scale-105 transition-all duration-300"
          >
            <div class="flex items-center justify-between mb-3">
              <span class="text-3xl">🏥</span>
              <span class="text-xs bg-white/20 px-2 py-1 rounded-full"
                >RSS</span
              >
            </div>
            <p class="text-3xl font-bold mb-1">
              {{ formatNumber(stats.totalRss) }}
            </p>
            <p class="text-emerald-100 text-sm">kg de RSS</p>
            <div class="mt-2">
              <div class="w-full bg-white/20 rounded-full h-2">
                <div
                  class="bg-white rounded-full h-2 transition-all duration-500"
                  :style="{ width: `${stats.percentualRss}%` }"
                ></div>
              </div>
              <span class="text-xs text-emerald-200 mt-1"
                >{{ stats.percentualRss.toFixed(1) }}% do total</span
              >
            </div>
          </div>

          <!-- GB -->
          <div
            class="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-5 text-white shadow-lg shadow-amber-200 transform hover:scale-105 transition-all duration-300"
          >
            <div class="flex items-center justify-between mb-3">
              <span class="text-3xl">🗑️</span>
              <span class="text-xs bg-white/20 px-2 py-1 rounded-full">GB</span>
            </div>
            <p class="text-3xl font-bold mb-1">
              {{ formatNumber(stats.totalGb) }}
            </p>
            <p class="text-amber-100 text-sm">kg de GB</p>
            <div class="mt-2">
              <div class="w-full bg-white/20 rounded-full h-2">
                <div
                  class="bg-white rounded-full h-2 transition-all duration-500"
                  :style="{ width: `${stats.percentualGb}%` }"
                ></div>
              </div>
              <span class="text-xs text-amber-200 mt-1"
                >{{ stats.percentualGb.toFixed(1) }}% do total</span
              >
            </div>
          </div>

          <!-- RI -->
          <div
            class="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-purple-200 transform hover:scale-105 transition-all duration-300"
          >
            <div class="flex items-center justify-between mb-3">
              <span class="text-3xl">🏭</span>
              <span class="text-xs bg-white/20 px-2 py-1 rounded-full">RI</span>
            </div>
            <p class="text-3xl font-bold mb-1">
              {{ formatNumber(stats.totalRi) }}
            </p>
            <p class="text-purple-100 text-sm">kg de RI</p>
            <div class="mt-2">
              <div class="w-full bg-white/20 rounded-full h-2">
                <div
                  class="bg-white rounded-full h-2 transition-all duration-500"
                  :style="{ width: `${stats.percentualRi}%` }"
                ></div>
              </div>
              <span class="text-xs text-purple-200 mt-1"
                >{{ stats.percentualRi.toFixed(1) }}% do total</span
              >
            </div>
          </div>
        </div>

        <!-- Cards Secundários -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
              >
                <span class="text-xl">📅</span>
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-800">
                  {{ stats.totalRegistros }}
                </p>
                <p class="text-xs text-gray-500">Registros</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
              >
                <span class="text-xl">📈</span>
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-800">
                  {{ formatNumber(stats.mediaDiaria) }}
                </p>
                <p class="text-xs text-gray-500">Média/dia (kg)</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center"
              >
                <span class="text-xl">🏆</span>
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-800">
                  {{ formatNumber(stats.maiorDia) }}
                </p>
                <p class="text-xs text-gray-500">Recorde (kg)</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
              >
                <span class="text-xl">📊</span>
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-800">
                  {{ formatNumber(stats.menorDia) }}
                </p>
                <p class="text-xs text-gray-500">Mínimo (kg)</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Seção de Médias de Produção -->
        <div class="grid lg:grid-cols-3 gap-6 mb-6">
          <!-- Média Diária -->
          <div
            class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <h3
              class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"
            >
              <span class="text-2xl">📅</span> Média Diária
            </h3>
            <div class="space-y-4">
              <div
                class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4"
              >
                <p class="text-sm text-emerald-600 font-medium">RSS</p>
                <p class="text-2xl font-bold text-emerald-700">
                  {{ formatNumber(mediasProducao.diaria.rss) }} kg
                </p>
              </div>
              <div
                class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4"
              >
                <p class="text-sm text-amber-600 font-medium">GB</p>
                <p class="text-2xl font-bold text-amber-700">
                  {{ formatNumber(mediasProducao.diaria.gb) }} kg
                </p>
              </div>
              <div
                class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4"
              >
                <p class="text-sm text-purple-600 font-medium">RI</p>
                <p class="text-2xl font-bold text-purple-700">
                  {{ formatNumber(mediasProducao.diaria.ri) }} kg
                </p>
              </div>
              <div
                class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-300"
              >
                <p class="text-sm text-blue-600 font-medium">TOTAL</p>
                <p class="text-2xl font-bold text-blue-700">
                  {{ formatNumber(mediasProducao.diaria.total) }} kg
                </p>
              </div>
            </div>
          </div>

          <!-- Média Mensal -->
          <div
            class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <h3
              class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"
            >
              <span class="text-2xl">📆</span> Média Mensal
            </h3>
            <div class="space-y-4">
              <div
                class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4"
              >
                <p class="text-sm text-emerald-600 font-medium">RSS</p>
                <p class="text-2xl font-bold text-emerald-700">
                  {{ formatNumber(mediasProducao.mensal.rss) }} kg
                </p>
              </div>
              <div
                class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4"
              >
                <p class="text-sm text-amber-600 font-medium">GB</p>
                <p class="text-2xl font-bold text-amber-700">
                  {{ formatNumber(mediasProducao.mensal.gb) }} kg
                </p>
              </div>
              <div
                class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4"
              >
                <p class="text-sm text-purple-600 font-medium">RI</p>
                <p class="text-2xl font-bold text-purple-700">
                  {{ formatNumber(mediasProducao.mensal.ri) }} kg
                </p>
              </div>
              <div
                class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-300"
              >
                <p class="text-sm text-blue-600 font-medium">TOTAL</p>
                <p class="text-2xl font-bold text-blue-700">
                  {{ formatNumber(mediasProducao.mensal.total) }} kg
                </p>
              </div>
            </div>
          </div>

          <!-- Médias por Semana -->
          <div
            class="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <h3
              class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"
            >
              <span class="text-2xl">📅</span> Médias por Semana
            </h3>
            <div class="space-y-3 max-h-96 overflow-y-auto">
              <div
                v-for="(semana, index) in mediasProducao.semanas"
                :key="index"
                class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200"
              >
                <p class="text-sm font-semibold text-blue-900 mb-2">
                  Semana {{ semana.numero }} ({{ semana.dataInicio }} -
                  {{ semana.dataFim }})
                </p>
                <div class="grid grid-cols-3 gap-2 text-xs">
                  <div class="bg-emerald-100 rounded px-2 py-1">
                    <p class="text-emerald-600 font-medium">RSS</p>
                    <p class="text-emerald-700 font-bold">
                      {{ formatNumber(semana.rss) }}
                    </p>
                  </div>
                  <div class="bg-amber-100 rounded px-2 py-1">
                    <p class="text-amber-600 font-medium">GB</p>
                    <p class="text-amber-700 font-bold">
                      {{ formatNumber(semana.gb) }}
                    </p>
                  </div>
                  <div class="bg-purple-100 rounded px-2 py-1">
                    <p class="text-purple-600 font-medium">RI</p>
                    <p class="text-purple-700 font-bold">
                      {{ formatNumber(semana.ri) }}
                    </p>
                  </div>
                </div>
                <div class="mt-2 bg-blue-200 rounded px-2 py-1">
                  <p class="text-blue-600 font-medium text-xs">TOTAL</p>
                  <p class="text-blue-700 font-bold">
                    {{ formatNumber(semana.total) }}
                  </p>
                </div>
              </div>
              <div
                v-if="mediasProducao.semanas.length === 0"
                class="text-center py-4 text-gray-400"
              >
                Nenhuma semana com dados
              </div>
            </div>
          </div>
        </div>

        <!-- Top 5 Dias de Maior Recebimento -->
        <div
          class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6"
        >
          <h3
            class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"
          >
            <span class="text-2xl">🏆</span> Top 5 - Maiores Recebimentos
          </h3>
          <div class="space-y-3">
            <div
              v-for="(item, index) in topProducoes"
              :key="item.id"
              class="flex items-center gap-4 p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100"
            >
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md',
                  index === 0
                    ? 'bg-gradient-to-br from-yellow-400 to-amber-500'
                    : index === 1
                    ? 'bg-gradient-to-br from-gray-300 to-gray-400'
                    : index === 2
                    ? 'bg-gradient-to-br from-amber-600 to-amber-700'
                    : 'bg-gradient-to-br from-blue-400 to-blue-500',
                ]"
              >
                {{ index + 1 }}º
              </div>
              <div class="flex-1">
                <p class="font-semibold text-gray-800">
                  {{ formatDate(item.DataFoto) }}
                </p>
                <p class="text-xs text-gray-500">
                  RSS: {{ item.RSS }}kg | GB: {{ item.GB }}kg | RI:
                  {{ item.RI }}kg
                </p>
              </div>
              <div class="text-right">
                <p class="text-xl font-bold text-blue-600">
                  {{ formatNumber(item.Total) }}
                </p>
                <p class="text-xs text-gray-500">kg total</p>
              </div>
            </div>
            <div
              v-if="topProducoes.length === 0"
              class="text-center py-8 text-gray-400"
            >
              Nenhum registro encontrado
            </div>
          </div>
        </div>

        <!-- Últimos Registros -->
        <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3
            class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"
          >
            <span class="text-2xl">🕐</span> Últimos Registros
          </h3>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-100">
                  <th
                    class="text-left py-3 px-4 text-sm font-semibold text-gray-600"
                  >
                    Data
                  </th>
                  <th
                    class="text-right py-3 px-4 text-sm font-semibold text-gray-600"
                  >
                    RSS
                  </th>
                  <th
                    class="text-right py-3 px-4 text-sm font-semibold text-gray-600"
                  >
                    GB
                  </th>
                  <th
                    class="text-right py-3 px-4 text-sm font-semibold text-gray-600"
                  >
                    RI
                  </th>
                  <th
                    class="text-right py-3 px-4 text-sm font-semibold text-gray-600"
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in ultimosRegistros"
                  :key="item.id"
                  class="border-b border-gray-50 hover:bg-blue-50/50 transition-colors"
                >
                  <td class="py-3 px-4 text-sm text-gray-800">
                    {{ formatDate(item.DataFoto) }}
                  </td>
                  <td
                    class="py-3 px-4 text-sm text-right text-emerald-600 font-medium"
                  >
                    {{ formatNumber(item.RSS) }}
                  </td>
                  <td
                    class="py-3 px-4 text-sm text-right text-amber-600 font-medium"
                  >
                    {{ formatNumber(item.GB) }}
                  </td>
                  <td
                    class="py-3 px-4 text-sm text-right text-purple-600 font-medium"
                  >
                    {{ formatNumber(item.RI) }}
                  </td>
                  <td
                    class="py-3 px-4 text-sm text-right font-bold text-blue-600"
                  >
                    {{ formatNumber(item.Total) }}
                  </td>
                </tr>
                <tr v-if="ultimosRegistros.length === 0">
                  <td colspan="5" class="py-8 text-center text-gray-400">
                    Nenhum registro encontrado
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";

// Definir layout e middleware
definePageMeta({
  layout: "default",
  middleware: "auth-required",
});

// Meta tags
useHead({
  title: "Estatísticas - AppProdução",
  meta: [
    { name: "description", content: "Estatísticas e análises de produção" },
  ],
});

// Supabase
const supabase = useSupabase();

// Estados
const isLoading = ref(true);
const selectedPeriod = ref("month");
const customStartDate = ref("");
const customEndDate = ref("");
const producaoData = ref([]);

// Períodos disponíveis
const periods = [
  { label: "7 dias", value: "7days" },
  { label: "30 dias", value: "month" },
  { label: "90 dias", value: "3months" },
  { label: "Este ano", value: "year" },
  { label: "Todo período", value: "all" },
  { label: "Personalizado", value: "custom" },
];

// Funções de data
const getDateRange = () => {
  const now = new Date();
  let startDate = new Date();

  switch (selectedPeriod.value) {
    case "7days":
      startDate.setDate(now.getDate() - 7);
      break;
    case "month":
      startDate.setDate(now.getDate() - 30);
      break;
    case "3months":
      startDate.setDate(now.getDate() - 90);
      break;
    case "year":
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    case "all":
      startDate = new Date(2000, 0, 1);
      break;
    case "custom":
      if (customStartDate.value && customEndDate.value) {
        return {
          start: customStartDate.value,
          end: customEndDate.value,
        };
      }
      startDate.setDate(now.getDate() - 30);
      break;
  }

  return {
    start: startDate.toISOString().split("T")[0],
    end: now.toISOString().split("T")[0],
  };
};

// Carregar dados
const loadData = async () => {
  isLoading.value = true;

  try {
    const { start, end } = getDateRange();

    // Adicionar tempo ao range para incluir todo o dia
    const startWithTime = `${start}T00:00:00`;
    const endWithTime = `${end}T23:59:59`;

    const { data, error } = await supabase
      .from("producao")
      .select("*")
      .gte("DataFoto", startWithTime)
      .lte("DataFoto", endWithTime)
      .order("DataFoto", { ascending: true });

    if (error) throw error;

    producaoData.value = data || [];
    console.log("Dados carregados:", data);
  } catch (err) {
    console.error("Erro ao carregar dados:", err);
    producaoData.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Computed - Estatísticas
const stats = computed(() => {
  const data = producaoData.value;

  if (data.length === 0) {
    return {
      totalGeral: 0,
      totalRss: 0,
      totalGb: 0,
      totalRi: 0,
      percentualRss: 0,
      percentualGb: 0,
      percentualRi: 0,
      totalRegistros: 0,
      mediaDiaria: 0,
      maiorDia: 0,
      menorDia: 0,
      tendenciaTotal: 0,
    };
  }

  const totalGeral = data.reduce(
    (sum, item) => sum + Number(item.Total || 0),
    0
  );
  const totalRss = data.reduce((sum, item) => sum + Number(item.RSS || 0), 0);
  const totalGb = data.reduce((sum, item) => sum + Number(item.GB || 0), 0);
  const totalRi = data.reduce((sum, item) => sum + Number(item.RI || 0), 0);

  const totais = data.map((item) => Number(item.Total || 0));
  const maiorDia = Math.max(...totais);
  const menorDia = Math.min(...totais);

  // Calcular tendência (comparar primeira metade com segunda metade)
  const meio = Math.floor(data.length / 2);
  const primeiraMetade = data.slice(0, meio);
  const segundaMetade = data.slice(meio);

  const mediaP1 =
    primeiraMetade.length > 0
      ? primeiraMetade.reduce((sum, item) => sum + Number(item.Total || 0), 0) /
        primeiraMetade.length
      : 0;
  const mediaP2 =
    segundaMetade.length > 0
      ? segundaMetade.reduce((sum, item) => sum + Number(item.Total || 0), 0) /
        segundaMetade.length
      : 0;

  const tendenciaTotal =
    mediaP1 > 0 ? ((mediaP2 - mediaP1) / mediaP1) * 100 : 0;

  return {
    totalGeral,
    totalRss,
    totalGb,
    totalRi,
    percentualRss: totalGeral > 0 ? (totalRss / totalGeral) * 100 : 0,
    percentualGb: totalGeral > 0 ? (totalGb / totalGeral) * 100 : 0,
    percentualRi: totalGeral > 0 ? (totalRi / totalGeral) * 100 : 0,
    totalRegistros: data.length,
    mediaDiaria: data.length > 0 ? totalGeral / data.length : 0,
    maiorDia,
    menorDia,
    tendenciaTotal,
  };
});

// Computed - Dados para gráficos
const chartData = computed(() => {
  const data = producaoData.value;

  return {
    labels: data.map((item) => formatDateShort(item.DataFoto)),
    rss: data.map((item) => Number(item.RSS || 0)),
    gb: data.map((item) => Number(item.GB || 0)),
    ri: data.map((item) => Number(item.RI || 0)),
    total: data.map((item) => Number(item.Total || 0)),
  };
});

// Dados do gráfico de linha
const lineChartData = computed(() => ({
  labels: chartData.value.labels,
  datasets: [
    {
      label: "Total",
      data: chartData.value.total,
      borderColor: "#3B82F6",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
}));

// Opções do gráfico de linha
const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      padding: 12,
      titleFont: { size: 14 },
      bodyFont: { size: 13 },
      callbacks: {
        label: (context) => `${context.parsed.y.toLocaleString("pt-BR")} kg`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { maxRotation: 45 },
    },
    y: {
      beginAtZero: true,
      grid: { color: "rgba(0, 0, 0, 0.05)" },
      ticks: {
        callback: (value) => `${value.toLocaleString("pt-BR")} kg`,
      },
    },
  },
};

// Dados do gráfico de barras
const barChartData = computed(() => ({
  labels: chartData.value.labels,
  datasets: [
    {
      label: "RSS",
      data: chartData.value.rss,
      backgroundColor: "rgba(16, 185, 129, 0.8)",
      borderRadius: 4,
    },
    {
      label: "GB",
      data: chartData.value.gb,
      backgroundColor: "rgba(245, 158, 11, 0.8)",
      borderRadius: 4,
    },
    {
      label: "RI",
      data: chartData.value.ri,
      backgroundColor: "rgba(139, 92, 246, 0.8)",
      borderRadius: 4,
    },
  ],
}));

// Opções do gráfico de barras
const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: {
        usePointStyle: true,
        padding: 20,
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      padding: 12,
      callbacks: {
        label: (context) =>
          `${context.dataset.label}: ${context.parsed.y.toLocaleString(
            "pt-BR"
          )} kg`,
      },
    },
  },
  scales: {
    x: {
      stacked: true,
      grid: { display: false },
      ticks: { maxRotation: 45 },
    },
    y: {
      stacked: true,
      beginAtZero: true,
      grid: { color: "rgba(0, 0, 0, 0.05)" },
      ticks: {
        callback: (value) => `${value.toLocaleString("pt-BR")} kg`,
      },
    },
  },
};

// Dados do gráfico de rosca
const doughnutChartData = computed(() => ({
  labels: ["RSS", "GB", "RI"],
  datasets: [
    {
      data: [stats.value.totalRss, stats.value.totalGb, stats.value.totalRi],
      backgroundColor: [
        "rgba(16, 185, 129, 0.9)",
        "rgba(245, 158, 11, 0.9)",
        "rgba(139, 92, 246, 0.9)",
      ],
      borderWidth: 0,
      hoverOffset: 10,
    },
  ],
}));

// Opções do gráfico de rosca
const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "65%",
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        usePointStyle: true,
        padding: 20,
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      padding: 12,
      callbacks: {
        label: (context) => {
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = ((context.parsed / total) * 100).toFixed(1);
          return `${context.label}: ${context.parsed.toLocaleString(
            "pt-BR"
          )} kg (${percentage}%)`;
        },
      },
    },
  },
};

// Top produções
const topProducoes = computed(() => {
  return [...producaoData.value]
    .sort((a, b) => Number(b.Total) - Number(a.Total))
    .slice(0, 5);
});

// Últimos registros
const ultimosRegistros = computed(() => {
  return [...producaoData.value]
    .sort((a, b) => new Date(b.DataFoto) - new Date(a.DataFoto))
    .slice(0, 10);
});

// Médias de Produção
const mediasProducao = computed(() => {
  const data = producaoData.value;

  if (data.length === 0) {
    return {
      diaria: { rss: 0, gb: 0, ri: 0, total: 0 },
      mensal: { rss: 0, gb: 0, ri: 0, total: 0 },
      semanas: [],
    };
  }

  // Média Diária
  const totalRss = data.reduce((sum, item) => sum + Number(item.RSS || 0), 0);
  const totalGb = data.reduce((sum, item) => sum + Number(item.GB || 0), 0);
  const totalRi = data.reduce((sum, item) => sum + Number(item.RI || 0), 0);
  const totalGeral = data.reduce(
    (sum, item) => sum + Number(item.Total || 0),
    0
  );

  const mediaDiaria = {
    rss: totalRss / data.length,
    gb: totalGb / data.length,
    ri: totalRi / data.length,
    total: totalGeral / data.length,
  };

  // Média Mensal
  const meses = new Set();
  data.forEach((item) => {
    const date = new Date(item.DataFoto);
    meses.add(`${date.getFullYear()}-${date.getMonth()}`);
  });

  const mediaMensal = {
    rss: totalRss / meses.size,
    gb: totalGb / meses.size,
    ri: totalRi / meses.size,
    total: totalGeral / meses.size,
  };

  // Médias por Semana Específica
  const semanaMap = new Map();

  data.forEach((item) => {
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
    diaria: mediaDiaria,
    mensal: mediaMensal,
    semanas: semanas,
  };
});

// Funções de formatação
const formatNumber = (value) => {
  return Number(value || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  // Lidar com diferentes formatos de data (timestamp ou apenas data)
  const dateOnly = String(dateStr).split("T")[0];
  const [year, month, day] = dateOnly.split("-");
  return `${day}/${month}/${year}`;
};

const formatDateShort = (dateStr) => {
  if (!dateStr) return "-";
  // Lidar com diferentes formatos de data (timestamp ou apenas data)
  const dateOnly = String(dateStr).split("T")[0];
  const [year, month, day] = dateOnly.split("-");
  return `${day}/${month}`;
};

// Watchers
watch([selectedPeriod, customStartDate, customEndDate], () => {
  loadData();
});

// Inicialização
onMounted(() => {
  loadData();
});
</script>

<style scoped>
/* Animações suaves nos cards */
.transform {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Scrollbar personalizada */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
