<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="buttonClasses"
    @click="handleClick"
  >
    <!-- Ícone à esquerda (se fornecido) -->
    <component 
      v-if="iconLeft" 
      :is="iconLeft" 
      :class="iconClasses" 
    />
    
    <!-- Conteúdo do slot -->
    <span v-if="$slots.default" :class="{ 'ml-2': iconLeft, 'mr-2': iconRight }">
      <slot />
    </span>
    
    <!-- Ícone à direita (se fornecido) -->
    <component 
      v-if="iconRight" 
      :is="iconRight" 
      :class="iconClasses" 
    />
    
    <!-- Loading spinner -->
    <div v-if="loading" class="ml-2 animate-spin">
      <div class="h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue'

// Props do componente
const props = defineProps({
  // Variante do botão
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => [
      'primary', 
      'secondary', 
      'success', 
      'warning', 
      'error', 
      'info', 
      'outline', 
      'ghost'
    ].includes(value)
  },
  
  // Tamanho do botão
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  
  // Tipo do botão HTML
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
  },
  
  // Estado desabilitado
  disabled: {
    type: Boolean,
    default: false
  },
  
  // Estado de carregamento
  loading: {
    type: Boolean,
    default: false
  },
  
  // Botão ocupar largura total
  fullWidth: {
    type: Boolean,
    default: false
  },
  
  // Ícone à esquerda
  iconLeft: {
    type: [String, Object],
    default: null
  },
  
  // Ícone à direita
  iconRight: {
    type: [String, Object],
    default: null
  },
  
  // Somente ícone (sem texto)
  iconOnly: {
    type: Boolean,
    default: false
  }
})

// Emits do componente
const emit = defineEmits(['click'])

// Classes base do botão
const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

// Classes de tamanho
const sizeClasses = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg'
}

// Classes de tamanho para botões somente ícone
const iconOnlySizeClasses = {
  xs: 'p-1',
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-3',
  xl: 'p-4'
}

// Classes de variante
const variantClasses = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-text-inverse shadow-soft hover:shadow-orange focus:ring-primary-500',
  secondary: 'bg-secondary-600 hover:bg-secondary-700 text-text-inverse shadow-soft focus:ring-secondary-500',
  success: 'bg-success-600 hover:bg-success-700 text-text-inverse shadow-soft focus:ring-success-500',
  warning: 'bg-warning-600 hover:bg-warning-700 text-text-inverse shadow-soft focus:ring-warning-500',
  error: 'bg-error-600 hover:bg-error-700 text-text-inverse shadow-soft focus:ring-error-500',
  info: 'bg-info-600 hover:bg-info-700 text-text-inverse shadow-soft focus:ring-info-500',
  outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
  ghost: 'text-primary-600 hover:bg-primary-50 focus:ring-primary-500'
}

// Classes computadas do botão
const buttonClasses = computed(() => {
  const classes = [baseClasses]
  
  // Adicionar classe de tamanho
  if (props.iconOnly) {
    classes.push(iconOnlySizeClasses[props.size])
  } else {
    classes.push(sizeClasses[props.size])
  }
  
  // Adicionar classe de variante
  classes.push(variantClasses[props.variant])
  
  // Adicionar classe de largura total
  if (props.fullWidth) {
    classes.push('w-full')
  }
  
  // Adicionar efeito hover para não-disabled
  if (!props.disabled && !props.loading) {
    classes.push('hover:scale-105')
  }
  
  return classes.join(' ')
})

// Classes do ícone
const iconClasses = computed(() => {
  const sizeMap = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-6 w-6'
  }
  
  return sizeMap[props.size]
})

// Handler do click
const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
/* Estilos adicionais se necessário */
</style>