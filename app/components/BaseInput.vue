<template>
  <div :class="wrapperClasses">
    <!-- Label -->
    <label 
      v-if="label" 
      :for="inputId" 
      :class="labelClasses"
    >
      {{ label }}
      <span v-if="required" class="text-error-500 ml-1">*</span>
    </label>
    
    <!-- Input Container -->
    <div class="relative">
      <!-- Ícone à esquerda -->
      <div v-if="iconLeft" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <component :is="iconLeft" :class="iconClasses" />
      </div>
      
      <!-- Input Field -->
      <input
        :id="inputId"
        :type="actualInputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @keydown="handleKeydown"
      />
      
      <!-- Toggle de senha (se for campo de senha) -->
      <div v-if="type === 'password'" class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <button
          type="button"
          class="text-text-tertiary hover:text-text-secondary transition-colors focus:outline-none"
          @click="togglePasswordVisibility"
        >
          <EyeIcon v-if="isPasswordVisible" :class="iconClasses" />
          <EyeSlashIcon v-else :class="iconClasses" />
        </button>
      </div>
      
      <!-- Ícone à direita (se não for senha e não tiver loading) -->
      <div v-else-if="iconRight && !loading" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <component :is="iconRight" :class="iconClasses" />
      </div>
      
      <!-- Loading Spinner -->
      <div v-else-if="loading" class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <div class="animate-spin h-4 w-4 border-2 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    </div>
    
    <!-- Helper Text / Error Message -->
    <div v-if="helperText || errorMessage" :class="messageClasses">
      <component 
        v-if="hasError && iconError" 
        :is="iconError" 
        class="h-4 w-4 mr-1 flex-shrink-0"
      />
      {{ hasError ? errorMessage : helperText }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref, useId } from 'vue'
import { ExclamationCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

// Props do componente
const props = defineProps({
  // v-model
  modelValue: {
    type: [String, Number],
    default: ''
  },
  
  // Tipo do input
  type: {
    type: String,
    default: 'text',
    validator: (value) => [
      'text', 
      'email', 
      'password', 
      'number', 
      'tel', 
      'url', 
      'search'
    ].includes(value)
  },
  
  // Label do input
  label: {
    type: String,
    default: ''
  },
  
  // Placeholder
  placeholder: {
    type: String,
    default: ''
  },
  
  // Texto de ajuda
  helperText: {
    type: String,
    default: ''
  },
  
  // Mensagem de erro
  errorMessage: {
    type: String,
    default: ''
  },
  
  // Tamanho do input
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  
  // Estado desabilitado
  disabled: {
    type: Boolean,
    default: false
  },
  
  // Estado somente leitura
  readonly: {
    type: Boolean,
    default: false
  },
  
  // Campo obrigatório
  required: {
    type: Boolean,
    default: false
  },
  
  // Estado de carregamento
  loading: {
    type: Boolean,
    default: false
  },
  
  // Largura total
  fullWidth: {
    type: Boolean,
    default: true
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
  
  // Ícone de erro customizado
  iconError: {
    type: [String, Object],
    default: ExclamationCircleIcon
  },
  
  // Autocomplete
  autocomplete: {
    type: String,
    default: 'off'
  }
})

// Emits do componente
const emit = defineEmits([
  'update:modelValue',
  'blur',
  'focus',
  'keydown',
  'input'
])

// Estado interno
const isFocused = ref(false)
const isPasswordVisible = ref(false)

// ID único para o input
const inputId = useId()

// Computed para verificar se tem erro
const hasError = computed(() => Boolean(props.errorMessage))

// Tipo real do input (para alternar entre password e text)
const actualInputType = computed(() => {
  if (props.type === 'password' && isPasswordVisible.value) {
    return 'text'
  }
  return props.type
})

// Classes do wrapper
const wrapperClasses = computed(() => {
  const classes = []
  
  if (props.fullWidth) {
    classes.push('w-full')
  }
  
  return classes.join(' ')
})

// Classes do label
const labelClasses = computed(() => {
  const classes = [
    'block text-sm font-medium mb-2'
  ]
  
  if (hasError.value) {
    classes.push('text-error-700')
  } else {
    classes.push('text-text-primary')
  }
  
  return classes.join(' ')
})

// Classes base do input
const baseClasses = 'block rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1'

// Classes de tamanho
const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-4 py-3 text-base'
}

// Ajustar padding para ícones
const paddingClasses = computed(() => {
  const base = sizeClasses[props.size]
  let classes = base
  
  if (props.iconLeft) {
    classes = classes.replace('px-', 'pl-10 pr-')
  }
  
  // Se for campo de senha, sempre tem o toggle à direita
  if (props.type === 'password' || props.iconRight || props.loading) {
    if (props.iconLeft) {
      classes = classes.replace('pr-', 'pr-10')
    } else {
      classes = classes.replace('px-', 'pl-4 pr-10')
    }
  }
  
  return classes
})

// Classes do input
const inputClasses = computed(() => {
  const classes = [baseClasses, paddingClasses.value]
  
  if (props.fullWidth) {
    classes.push('w-full')
  }
  
  // Estados
  if (hasError.value) {
    classes.push(
      'border-error-300 text-error-900 placeholder-error-400',
      'focus:border-error-500 focus:ring-error-500'
    )
  } else if (isFocused.value) {
    classes.push(
      'border-primary-300 text-text-primary placeholder-text-tertiary',
      'focus:border-primary-500 focus:ring-primary-500'
    )
  } else {
    classes.push(
      'border-border-medium text-text-primary placeholder-text-tertiary',
      'focus:border-primary-500 focus:ring-primary-500'
    )
  }
  
  // Estados especiais
  if (props.disabled) {
    classes.push('bg-background-tertiary cursor-not-allowed opacity-50')
  } else if (props.readonly) {
    classes.push('bg-background-secondary cursor-default')
  } else {
    classes.push('bg-background-primary hover:border-border-dark')
  }
  
  return classes.join(' ')
})

// Classes do ícone
const iconClasses = computed(() => {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-5 w-5'
  }
  
  const classes = [sizeMap[props.size]]
  
  if (hasError.value) {
    classes.push('text-error-400')
  } else {
    classes.push('text-text-tertiary')
  }
  
  return classes.join(' ')
})

// Classes da mensagem
const messageClasses = computed(() => {
  const classes = [
    'mt-2 text-sm flex items-start'
  ]
  
  if (hasError.value) {
    classes.push('text-error-600')
  } else {
    classes.push('text-text-secondary')
  }
  
  return classes.join(' ')
})

// Handlers
const handleInput = (event) => {
  const value = event.target.value
  emit('update:modelValue', value)
  emit('input', event)
}

const handleBlur = (event) => {
  isFocused.value = false
  emit('blur', event)
}

const handleFocus = (event) => {
  isFocused.value = true
  emit('focus', event)
}

const handleKeydown = (event) => {
  emit('keydown', event)
}

// Função para alternar visibilidade da senha
const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}
</script>

<style scoped>
/* Estilos adicionais se necessário */
</style>