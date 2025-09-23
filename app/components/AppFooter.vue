<template>
  <footer class="bg-background-dark text-text-inverse mt-auto">
    <div class="container mx-auto px-4 py-12">
      <!-- Main Footer Content -->
      <div class="grid md:grid-cols-4 gap-8 mb-8">
        <!-- Brand Section -->
        <div class="md:col-span-2">
          <div class="flex items-center space-x-2 mb-4">
            <span class="text-2xl">🚀</span>
            <h3 class="text-xl font-bold text-primary-400">Nuxt App</h3>
          </div>
          <p class="text-secondary-400 mb-4 max-w-md">
            Uma aplicação moderna construída com Nuxt 4, Tailwind CSS, 
            Headless UI e Heroicons. Desenvolvida com as melhores práticas 
            e tecnologias atuais.
          </p>
          <div class="flex space-x-4">
            <!-- Social Links -->
            <a 
              href="#" 
              class="text-secondary-400 hover:text-primary-400 transition-colors"
              aria-label="GitHub"
            >
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </a>
            <a 
              href="#" 
              class="text-secondary-400 hover:text-primary-400 transition-colors"
              aria-label="Twitter"
            >
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a 
              href="#" 
              class="text-secondary-400 hover:text-primary-400 transition-colors"
              aria-label="LinkedIn"
            >
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
        
        <!-- Links Úteis -->
        <div>
          <h4 class="text-lg font-semibold mb-4 text-primary-400">Links Úteis</h4>
          <ul class="space-y-2 text-secondary-400">
            <li>
              <NuxtLink 
                to="/producao" 
                class="hover:text-primary-400 transition-colors"
              >
                Produção
              </NuxtLink>
            </li>
            <li>
              <a href="#" class="hover:text-primary-400 transition-colors">
                Documentação
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-primary-400 transition-colors">
                API Reference
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-primary-400 transition-colors">
                Guia de Início
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-primary-400 transition-colors">
                Comunidade
              </a>
            </li>
          </ul>
        </div>
        
        <!-- Contato -->
        <div>
          <h4 class="text-lg font-semibold mb-4 text-primary-400">Contato</h4>
          <ul class="space-y-3 text-secondary-400">
            <li class="flex items-center space-x-2">
              <EnvelopeIcon class="h-4 w-4 text-primary-400 flex-shrink-0" />
              <a 
                href="mailto:contato@nuxtapp.com" 
                class="hover:text-primary-400 transition-colors"
              >
                contato@nuxtapp.com
              </a>
            </li>
            <li class="flex items-center space-x-2">
              <PhoneIcon class="h-4 w-4 text-primary-400 flex-shrink-0" />
              <a 
                href="tel:+5511999999999" 
                class="hover:text-primary-400 transition-colors"
              >
                (11) 99999-9999
              </a>
            </li>
            <li class="flex items-center space-x-2">
              <MapPinIcon class="h-4 w-4 text-primary-400 flex-shrink-0" />
              <span>São Paulo, Brasil</span>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Bottom Section -->
      <div class="border-t border-secondary-700 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <!-- Copyright -->
          <div class="text-secondary-400 text-sm">
            <p>&copy; {{ currentYear }} Nuxt App. Todos os direitos reservados.</p>
          </div>
          
          <!-- Tech Stack -->
          <div class="flex items-center space-x-4 text-sm text-secondary-400">
            <span class="flex items-center space-x-1">
              <span class="text-primary-400">⚡</span>
              <span>Nuxt 4</span>
            </span>
            <span class="flex items-center space-x-1">
              <span class="text-primary-400">🎨</span>
              <span>Tailwind CSS</span>
            </span>
            <span class="flex items-center space-x-1">
              <span class="text-primary-400">🔧</span>
              <span>Headless UI</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon 
} from '@heroicons/vue/24/outline'

// Ano atual para o copyright
const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
/* Estilos específicos do footer */
</style>