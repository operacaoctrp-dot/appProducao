// Service Worker para prevenir recarregamentos durante captura de foto
const CACHE_NAME = 'app-producao-v1'

// Instalar service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado')
  self.skipWaiting()
})

// Ativar service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker ativado')
  event.waitUntil(self.clients.claim())
})

// Interceptar navegações para prevenir recarregamentos durante captura de foto
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  
  // Se é uma navegação para a página de produção
  if (event.request.mode === 'navigate' && url.pathname.includes('/producao')) {
    // Verificar se está capturando foto
    event.respondWith(
      (async () => {
        try {
          // Tentar buscar do cache primeiro se estiver capturando foto
          const cache = await caches.open(CACHE_NAME)
          const cachedResponse = await cache.match(event.request)
          
          if (cachedResponse) {
            console.log('Servindo página do cache durante captura de foto')
            return cachedResponse
          }
          
          // Se não tiver no cache, fazer requisição normal
          const response = await fetch(event.request)
          
          // Cachear a resposta para uso futuro
          if (response.status === 200) {
            const responseClone = response.clone()
            cache.put(event.request, responseClone)
          }
          
          return response
        } catch (error) {
          console.error('Erro no service worker:', error)
          return fetch(event.request)
        }
      })()
    )
  }
})

// Escutar mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CAPTURING_PHOTO') {
    console.log('Service Worker: Iniciando captura de foto')
    // Aqui podemos implementar lógica adicional se necessário
  }
  
  if (event.data && event.data.type === 'PHOTO_CAPTURED') {
    console.log('Service Worker: Foto capturada')
    // Aqui podemos implementar lógica adicional se necessário
  }
})